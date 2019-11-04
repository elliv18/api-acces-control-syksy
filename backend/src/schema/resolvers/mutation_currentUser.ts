import { prisma } from "../../generated/prisma-client";
import logger from "../../misc/logger";
import { mustBeLoggedIn } from "../../misc/auth";

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
    }
  }
};
