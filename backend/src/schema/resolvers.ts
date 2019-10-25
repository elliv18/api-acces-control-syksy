import * as bcrypt from "bcryptjs";
import * as _ from "lodash";
import { sign } from "jsonwebtoken";
//import { mustBeLoggedIn, mustBeAtleastLevel, UserLevels } from "../misc/auth";
import { prisma } from "../generated/prisma-client";
import {
  JWT_SECRET,
  JWT_TIME,
  SALT_ROUNDS,
  MAX_PW,
  MIN_PW,
  ROOT_ADMIN_EMAIL
} from "../environment";
import logger from "../misc/logger";

export default {
  /*************** RELATIONS *******************/
  /*User: {
    async apiKeysId(user) {
      return await prisma.user({ id: user.id }).apiKeysId();
    }
  },
  UserApiKeys: {
    async userId(userApiKeys) {
      return await prisma.userApiKeys({ id: userApiKeys.id }).userId();
    }
  },
  /*************** QUERY ***********************/
  /*************** MUTATIONS *******************/
  Mutation: {
    currentUser: async (obj, args, { currentUser }) => {
      //mustBeLoggedIn(currentUser);

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
    }
    //signup: async (obj, { input: { email, password } }) => {}
  }
};
