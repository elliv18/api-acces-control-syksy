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
