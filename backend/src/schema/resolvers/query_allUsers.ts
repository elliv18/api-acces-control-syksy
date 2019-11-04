import {
  mustBeLoggedIn,
  mustBeAtleastLevel,
  UserLevels
} from "../../misc/auth";
import { prisma } from "../../generated/prisma-client";
import logger from "../../misc/logger";
import { DEBUG } from "../../environment";

export default {
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
    }
  }
};
