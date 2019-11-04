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
    deleteApiKey: async (obj, { input: { keyHash } }, { currentUser }) => {
      if (!DEBUG) {
        mustBeLoggedIn(currentUser);
        mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

        logger.log(
          "info",
          "[M DELETEAPIKEY] User %s - deleting API key - %s ",
          currentUser.id,
          keyHash
        );
      }
      if (DEBUG) {
        console.log("info", "[M DELETEAPIKEY] deleting API key - %s ", keyHash);
      }

      const baseUrl = "http://gateway:8080/tyk/";
      const keysPath = "keys/";

      const headers = {
        "Content-Type": "application/json",
        "x-tyk-authorization": TYK_GW_SECRET
      };

      const url = baseUrl + keysPath + keyHash + "?hashed=true";
      const res = await fetch(url, { method: "DELETE", headers: headers });

      const data = await res.json();
      if (DEBUG) {
        console.log(
          "info",
          "[M DELETEAPIKEY] deleting API key - %s, url: %s",
          keyHash,
          url
        );
      }
      return { key: data.key };
    }
  }
};
