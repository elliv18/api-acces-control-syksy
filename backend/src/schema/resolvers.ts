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
          currentUser.id,
          name
        );
      }

      const tykURL = "http://gateway:8080/tyk/keys/create";

      const headers = {
        "Content-Type": "application/json",
        "x-tyk-authorization": TYK_GW_SECRET
      };

      input.access.map(x => {
        console.log(x);
        console.log(x.urls);

        x.urls.map(y => {
          console.log(y);

          y.methods.map(z => {
            console.log(z);
          });
        });
      });

      /*const body = {
        access_rights: {
          [id]: {
            api_id: id,
            name: name,
            allowed_urls: {
              url: url,
              methods: methods
            }
          }
        }
      };

      console.log(body);*/

      //const res = await fetch(url, { method: "POST", body: JSON.stringify(body), headers: headers });

      //const data = await res.json();  // data is object

      // TODO key and hash save prisma?

      //return { key: id };
    }
  }
};
