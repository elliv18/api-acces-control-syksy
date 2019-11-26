import {
  mustBeLoggedIn,
  mustBeAtleastLevel,
  UserLevels
} from "../../misc/auth";
import { prisma } from "../../generated/prisma-client";
import logger from "../../misc/logger";
import { DEBUG } from "../../environment";
import apikey_expiry from "../../misc/apiKey_expiry";

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

      const users = await prisma.users();

      users.map(user => {
        apikey_expiry(user);
      });

      return users;
    }
  }
};
