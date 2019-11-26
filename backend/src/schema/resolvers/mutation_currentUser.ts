import { prisma } from "../../generated/prisma-client";
import logger from "../../misc/logger";
import { mustBeLoggedIn } from "../../misc/auth";
import apikey_expiry from "../../misc/apiKey_expiry";

export default {
  Mutation: {
    currentUser: async (obj, args, { currentUser }) => {
      mustBeLoggedIn(currentUser);

      logger.log(
        "info",
        "[M CURRENTUSER] Current user %s information ask",
        currentUser.id
      );

      const user = await prisma.user({ id: currentUser.id });

      // Api key expiry check
      apikey_expiry(user);

      return user;
    }
  }
};
