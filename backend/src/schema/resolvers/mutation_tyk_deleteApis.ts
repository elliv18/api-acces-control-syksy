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
    deleteApis: async (obj, { input }, { currentUser }) => {
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

      const baseUrl = "http://gateway:8080/tyk/";
      const keysPath = "apis/";

      const headers = {
        "Content-Type": "application/json",
        "x-tyk-authorization": TYK_GW_SECRET
      };

      var deleted_apis = [];

      for (var i = 0; i < input.api_ids.length; i++) {
        const url = baseUrl + keysPath + input.api_ids[i];

        const x = await fetch(url, { method: "DELETE", headers: headers });

        deleted_apis.push(await prisma.deleteApi({ api_id: input.api_ids[i] }));
      }

      return { deleted_apis };
    }
  }
};
