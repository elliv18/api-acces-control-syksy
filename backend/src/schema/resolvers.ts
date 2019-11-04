import * as bcrypt from "bcryptjs";
import * as _ from "lodash";
import { sign } from "jsonwebtoken";
import { mustBeLoggedIn, mustBeAtleastLevel, UserLevels } from "../misc/auth";
import { prisma } from "../generated/prisma-client";
import {
  JWT_SECRET,
  JWT_TIME,
  SALT_ROUNDS,
  MAX_PW,
  MIN_PW,
  ROOT_ADMIN_EMAIL,
  DEBUG,
  TYK_GW_SECRET
} from "../environment";
import logger from "../misc/logger";
import fetch from "node-fetch";
import { access } from "fs";

export default {
  /************* RELATIONS *****************/
  User: {
    async apis(user) {
      return await prisma.user({ id: user.id }).apis();
    }
  },
  Api: {
    async urls(api) {
      return await prisma.api({ id: api.id }).urls();
    },
    async users(user) {
      return await prisma.api({ id: user.id }).users();
    }
  },
  Url: {
    async api(api) {
      return await prisma.url({ id: api.id }).api();
    }
  },
  /*************** QUERY ***********************/
  Query: {
    allUsers: async (obj, args, { currentUser }) => {
      if (!DEBUG) {
        mustBeLoggedIn(currentUser);
        mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

        logger.log(
          "info",
          "[Q ALLUSERS] User %s - list all users",
          currentUser.id
        );
      }

      return await prisma.users();
    },
    getApiList: async (obj, args, { currentUser }) => {
      if (!DEBUG) {
        mustBeLoggedIn(currentUser);

        logger.log(
          "info",
          "[Q ALLUSERS] User %s - list all apis",
          currentUser.id
        );
      }

      const url = "http://gateway:8080/tyk/apis";

      const headers = {
        "Content-Type": "application/json",
        "x-tyk-authorization": TYK_GW_SECRET
      };

      const res = await fetch(url, { method: "GET", headers: headers });

      const data = await res.json();

      var apiList = [];

      data.forEach(element => {
        var api = {
          id: element.api_id,
          name: element.name,
          path: element.proxy.listen_path,
          tags: element.tags
        };

        apiList.push(api);
      });

      return apiList;
    }
  },
  /*************** MUTATIONS *******************/
  Mutation: {
    currentUser: async (obj, args, { currentUser }) => {
      mustBeLoggedIn(currentUser);

      logger.log(
        "info",
        "[M CURRENTUSER] Current user %s information ask",
        currentUser.id
      );
      return await prisma.user({ id: currentUser.id });
    },
    // CURRENTUSER PASSWORD UPDATE
    currentUserUpdatePW: async (
      obj,
      { input: { password, passwordAgain, oldPassword } },
      { currentUser }
    ) => {
      mustBeLoggedIn(currentUser);

      // if pass is null...
      if (oldPassword === null || passwordAgain === null || password === null) {
        logger.log(
          "warn",
          "[M CURRENTUSER UPDATE PW] Old password or password or password again is null from user %s",
          currentUser.id
        );
        throw new Error("Password can not be null!");
      }

      // is oldpassword same as db one?
      const cU = await prisma.user({ id: currentUser.id });
      if (!(await bcrypt.compare(oldPassword, cU.password))) {
        logger.log(
          "warn",
          "[M CURRENTUSER UPDATE PW] Old password is invalid from user %s",
          currentUser.id
        );
        throw new Error("Old password not match!");
      }

      // is new password write right?
      if (password !== passwordAgain) {
        logger.log(
          "warn",
          "[M CURRENTUSER UPDATE PW] Password and password again not match from user %s",
          currentUser.id
        );
        throw new Error("Password and password again not match!");
      }

      // password is only whitespaces
      if (!password.replace(/\s/g, "").length) {
        logger.log(
          "warn",
          "[M CURRENTUSER UPDATE PW] Password is spaces only from user %s",
          currentUser.id
        );
        throw new Error("Password can not be empty!");
      }
      // bcryptjs max input lenght is 18
      if (password.length > MAX_PW) {
        logger.log(
          "warn",
          "[M CURRENTUSER UPDATE PW] Password is too long from user %s",
          currentUser.id
        );
        throw new Error("Password too long!");
      }
      // password min lenght
      if (password.length < MIN_PW) {
        logger.log(
          "warn",
          "[M CURRENTUSER UPDATE PW] Password is too short from user %s",
          currentUser.id
        );
        throw new Error("Password too short!");
      }

      const user = await prisma.updateUser({
        data: {
          password: await bcrypt.hash(password, SALT_ROUNDS)
        },
        where: {
          id: currentUser.id
        }
      });

      return { user };
    },
    // LOGIN
    login: async (obj, { input: { email, password } }) => {
      const user = await prisma.user({ email: email });

      if (!user) {
        logger.log("warn", "[M LOGIN] Email %s not found", email);
        throw new Error("Email not found!");
      }

      const pwValid = await bcrypt.compare(password, user.password);

      if (!pwValid) {
        logger.log("warn", "[M LOGIN] Password is invalid from user %s", email);
        throw new Error("Password is invalid!");
      }

      const jwt = sign({ id: user.id, type: user.userType }, JWT_SECRET, {
        expiresIn: JWT_TIME
      });

      logger.log(
        "info",
        "[M LOGIN] Login succesful! Logged user is: %s",
        email
      );
      return { jwt };
    },
    signup: async (obj, { input: { email, password, passwordAgain } }) => {
      const check = await prisma.user({ email: email });

      if (check) {
        logger.log("warn", "[M SIGNUP] Email %s found", email);
        throw new Error("Email found!");
      }

      if (password != passwordAgain) {
        logger.log("warn", "[M SIGNUP] Password don't match!");
        throw new Error("Password don't match!");
      }

      // password legality checks
      if (!password.replace(/\s/g, "").length || password === null) {
        logger.log("warn", "[M CREATE NEW USER] Password is null");
        throw new Error("Password can not be null or empty!");
      }

      // bcryptjs max input lenght is 18
      if (password.length > MAX_PW) {
        logger.log("warn", "[M SIGNUP] Password is too long!");
        throw new Error("Password too long!");
      }

      // password min lenght
      if (password.length < MIN_PW) {
        logger.log("warn", "[M SIGNUP] Password is too short!");
        throw new Error("Password too short!");
      }

      const user = prisma.createUser({
        userType: "USER",
        email: email,
        password: await bcrypt.hash(password, SALT_ROUNDS)
      });

      return { user };
    },
    createNewApiKey: async (obj, { input }, { currentUser }) => {
      if (!DEBUG) {
        mustBeLoggedIn(currentUser);
        mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

        logger.log(
          "info",
          "[Q ALLUSERS] User %s - Create new api key %s",
          currentUser.id
        );
      }

      const tykURL = "http://gateway:8080/tyk/keys/create";

      const headers = {
        "Content-Type": "application/json",
        "x-tyk-authorization": TYK_GW_SECRET
      };

      var access_rights = {};

      /*  Example input: array of APIs that each can have multiple endpoints each with multiple methods

       access: [
        {
          id: "1", name: "api 1", urls:                                     // API 1
          [
            {
            url: "/todos(/.*)?", methods: ["GET", "PUT", "DELETE"]          // API 1 url 1
            },
            {
            url: "/users(/.*)?", methods: ["GET", "POST"]                   // API 1 url 2
          	}
          ]
        }, 
        {
          id: "2", name: "api 2", urls:                                     // API 2
          {
            url: "url 2", methods: ["GET", "PUT"]                           // API 2 url 1
          }
        }
      ]



      */

      input.access.map(api => {
        var apiTemp = {
          api_id: api.id,
          api_name: api.name,
          allowed_urls: []
        };
        api.urls.map(url => {
          var urlTemp = {
            // Temporary helper to parse single url with all its methods

            url: url.url,
            methods: []
          };
          url.methods.map(method => {
            urlTemp.methods.push(method);
          });
          apiTemp.allowed_urls.push(urlTemp);
        });
        access_rights[api.id] = apiTemp;
      });

      // jsonstring only for debugging
      const jsonString = JSON.stringify(access_rights);
      console.log("access_rights passed to gateway", jsonString);

      const body = {
        access_rights: access_rights
      };

      console.log(body);

      const res = await fetch(tykURL, {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers
      });

      const data = await res.json(); // data is object
      console.log(data);
      // TODO key and hash save prisma?

      return { key: data.key, keyHash: data.key_hash };
    },

    deleteApiKey: async (obj, { input: { keyHash } }, { currentUser }) => {
      if (!DEBUG) {
        mustBeLoggedIn(currentUser);
        mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

        logger.log(
          "info",
          "[M DELETEAPIKEY] User %s - deleting API key - %s ",
          currentUser.id,
          keyHash
        );
      }
      if (DEBUG) {
        console.log("info", "[M DELETEAPIKEY] deleting API key - %s ", keyHash);
      }

      const baseUrl = "http://gateway:8080/tyk/";
      const keysPath = "keys/";

      const headers = {
        "Content-Type": "application/json",
        "x-tyk-authorization": TYK_GW_SECRET
      };

      const url = baseUrl + keysPath + keyHash + "?hashed=true";
      const res = await fetch(url, { method: "DELETE", headers: headers });

      const data = await res.json();
      if (DEBUG) {
        console.log(
          "info",
          "[M DELETEAPIKEY] deleting API key - %s, url: %s",
          keyHash,
          url
        );
      }
      return { key: data.key };
    },

    createNewUser: async (
      obj,
      { input: { userType, email, password } },
      { currentUser }
    ) => {
      if (!DEBUG) {
        mustBeLoggedIn(currentUser);
        mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

        logger.log(
          "info",
          "[M CREATE NEW USER] User %s - Create new user - %s ",
          currentUser.id,
          email
        );
      }

      // email exist?
      if (!prisma.user({ email: email })) {
        logger.log("warn", "[M CREATE NEW USER] Email exist! %s", email);
        throw new Error("Email exist!");
      }

      // password legality checks
      if (!password.replace(/\s/g, "").length || password === null) {
        logger.log(
          "warn",
          "[M CREATE NEW USER] Password is null from user %s",
          currentUser.id
        );
        throw new Error("Password can not be null or empty!");
      }
      // bcryptjs max input lenght is 18
      if (password.length > MAX_PW) {
        logger.log(
          "warn",
          "[M CREATE NEW USER] Password is too long from user %s",
          currentUser.id
        );
        throw new Error("Password too long!");
      }
      // password min lenght
      if (password.length < MIN_PW) {
        logger.log(
          "warn",
          "[M CREATE NEW USER] Password is too short from user %s",
          currentUser.id
        );
        throw new Error("Password too short!");
      }

      const user = await prisma.createUser({
        userType: userType,
        email: email,
        password: await bcrypt.hash(password, SALT_ROUNDS)
      });

      return { user };
    },
    deleteUser: async (obj, { input: { id } }, { currentUser }) => {
      if (!DEBUG) {
        mustBeLoggedIn(currentUser);
        mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

        logger.log(
          "info",
          "[M DELETE USER] User %s - Delete user - %s ",
          currentUser.id,
          id
        );
      }

      const userTemp = await prisma.user({ id: id });

      const baseUrl = "http://gateway:8080/tyk/";
      const keysPath = "keys/";

      const headers = {
        "Content-Type": "application/json",
        "x-tyk-authorization": TYK_GW_SECRET
      };

      const url = baseUrl + keysPath + userTemp.apiKey + "?hashed=true";

      await fetch(url, { method: "DELETE", headers: headers });

      const user = await prisma.deleteUser({ id: id });

      return user;
    },
    // USER PASSWORD RESET
    userPWReset: async (
      obj,
      { input: { id, password, passwordAgain } },
      { currentUser }
    ) => {
      if (!DEBUG) {
        mustBeLoggedIn(currentUser);
        mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

        logger.log(
          "info",
          "[M USERUPDATEPW] User %s password have been updated by %s",
          id,
          currentUser.id
        );
      }

      // password legality checks
      if (
        !password.replace(/\s/g, "").length ||
        password === null ||
        !passwordAgain.replace(/\s/g, "").length ||
        passwordAgain === null
      ) {
        logger.log("warn", "[M USERUPWRESET] Password is null");
        throw new Error("Password can not be null or empty!");
      }
      // bcryptjs max input lenght is 18
      if (password.length > MAX_PW) {
        logger.log("warn", "[M USERUPWRESET] Password is too long");
        throw new Error("Password too long!");
      }
      // password min lenght
      if (password.length < MIN_PW) {
        logger.log("warn", "[M USERUPWRESET] Password is too short");
        throw new Error("Password too short!");
      }
      if (password !== passwordAgain) {
        logger.log("warn", "[M USERUPWRESET] Password don't match");
        throw new Error("Password don't match!");
      }

      const user = await prisma.updateUser({
        data: {
          password: await bcrypt.hash(password, SALT_ROUNDS)
        },
        where: {
          id: id
        }
      });

      return { user };
    }
  }
};
