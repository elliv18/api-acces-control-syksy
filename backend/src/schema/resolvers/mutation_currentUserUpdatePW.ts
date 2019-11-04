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
    }
  }
};
