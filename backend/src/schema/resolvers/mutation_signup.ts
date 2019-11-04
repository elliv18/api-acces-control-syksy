import logger from "../../misc/logger";
import * as bcrypt from "bcryptjs";
import { prisma } from "../../generated/prisma-client";
import { SALT_ROUNDS, MAX_PW, MIN_PW } from "../../environment";

export default {
  Mutation: {
    signup: async (obj, { input: { email, password, passwordAgain } }) => {
      // email exist?
      if ((await prisma.user({ email: email })) !== null) {
        logger.log("warn", "[M SIGNUP] Email already exist! %s", email);
        throw new Error("Email already exist!");
      }

      if (password != passwordAgain) {
        logger.log("warn", "[M SIGNUP] Password don't match!");
        throw new Error("Password don't match!");
      }

      // password legality checks
      if (!password.replace(/\s/g, "").length || password === null) {
        logger.log("warn", "[M SIGNUP] Password is null");
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
    }
  }
};
