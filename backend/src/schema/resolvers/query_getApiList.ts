import { mustBeLoggedIn } from "../../misc/auth";
import { prisma } from "../../generated/prisma-client";
import logger from "../../misc/logger";
import { DEBUG } from "../../environment";

export default {
  Query: {
    getApiList: async (obj, args, { currentUser }) => {
      if (!DEBUG) {
        mustBeLoggedIn(currentUser);

        logger.log(
          "info",
          "[Q ALLUSERS] User %s - list all apis",
          currentUser.id
        );
      }

      return await prisma.apis();
    }
  }
};
