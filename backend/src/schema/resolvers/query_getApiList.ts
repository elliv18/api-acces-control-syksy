// rework this file

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

      const url = "http://gateway:8080/tyk/apis";

      const headers = {
        "Content-Type": "application/json",
        "x-tyk-authorization": TYK_GW_SECRET
      };

      const res = await fetch(url, { method: "GET", headers: headers });

      const data = await res.json();

      console.log(data);

      var apiList = [];

      data.forEach(element => {
        var api = {
          id: element.api_id,
          name: element.name,
          path: element.proxy.listen_path,
          tags: element.tags
        };

        apiList.push(api);
      });

      return apiList;
    }
  }
};
