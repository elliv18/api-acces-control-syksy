import logger from "../../misc/logger";
import * as bcrypt from "bcryptjs";
import {
  mustBeLoggedIn,
  mustBeAtleastLevel,
  UserLevels
} from "../../misc/auth";
import { prisma } from "../../generated/prisma-client";
import { SALT_ROUNDS, MAX_PW, MIN_PW, DEBUG } from "../../environment";

export default {
  Mutation: {
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

      console.log(await prisma.user({ email: email }));

      // email exist?
      if ((await prisma.user({ email: email })) !== null) {
        logger.log(
          "warn",
          "[M CREATE NEW USER] Email already exist! %s",
          email
        );
        throw new Error("Email already exist!");
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
    }
  }
};
