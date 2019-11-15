import {
  mustBeLoggedIn,
  mustBeAtleastLevel,
  UserLevels
} from "../../misc/auth";
import { prisma } from "../../generated/prisma-client";
import logger from "../../misc/logger";
import fetch from "node-fetch";
import { DEBUG, TYK_GW_SECRET } from "../../environment";

export default {
  Mutation: {
    deleteUser: async (obj, { input }, { currentUser }) => {
      if (!DEBUG) {
        mustBeLoggedIn(currentUser);
        mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

        logger.log(
          "info",
          "[M DELETE USERS] Admin %s - Delete users",
          currentUser.id
        );
        input.user_ids.map(x => {
          logger.log(
            "info",
            "[M DELETE USER] Admin %s - Deleting user %s",
            currentUser.id,
            x
          );
        });
      }

      var user = [];

      for (var i = 0; i < input.user_ids.length; i++) {
        const userTemp = await prisma.user({ id: input.user_ids[i] });

        const baseUrl = "http://gateway:8080/tyk/";
        const keysPath = "keys/";

        const headers = {
          "Content-Type": "application/json",
          "x-tyk-authorization": TYK_GW_SECRET
        };

        const url = baseUrl + keysPath + userTemp.api_hash + "?hashed=true";

        await fetch(url, { method: "DELETE", headers: headers });

        const u = await prisma.deleteUser({ id: input.user_ids[i] });

        user.push(u);
      }

      return { user };
    }
  }
};
