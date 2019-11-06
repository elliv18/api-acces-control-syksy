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
    deleteUser: async (obj, { input: { id } }, { currentUser }) => {
      if (!DEBUG) {
        mustBeLoggedIn(currentUser);
        mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

        logger.log(
          "info",
          "[M DELETE USER] User %s - Delete user - %s ",
          currentUser.id,
          id
        );
      }

      const userTemp = await prisma.user({ id: id });

      const baseUrl = "http://gateway:8080/tyk/";
      const keysPath = "keys/";

      const headers = {
        "Content-Type": "application/json",
        "x-tyk-authorization": TYK_GW_SECRET
      };

      const url = baseUrl + keysPath + userTemp.api_hash + "?hashed=true";

      await fetch(url, { method: "DELETE", headers: headers });

      const user = await prisma.deleteUser({ id: id });

      return user;
    }
  }
};
