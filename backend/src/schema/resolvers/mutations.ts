import { sign } from "jsonwebtoken";
import logger from "../../misc/logger";
import * as bcrypt from "bcryptjs";
import {
  mustBeLoggedIn,
  mustBeAtleastLevel,
  UserLevels
} from "../../misc/auth";
import { prisma } from "../../generated/prisma-client";
import {
  JWT_SECRET,
  JWT_TIME,
  SALT_ROUNDS,
  MAX_PW,
  MIN_PW,
  DEBUG
} from "../../environment";

export default {
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
