import {
  mustBeLoggedIn,
  mustBeAtleastLevel,
  UserLevels
} from "../../misc/auth";
import { prisma } from "../../generated/prisma-client";
import logger from "../../misc/logger";
import fetch from "node-fetch";
import { DEBUG, TYK_GW_SECRET } from "../../environment";
import uuid from "uuid";

export default {
  Mutation: {
    createNewAPI: async (obj, { input }, { currentUser }) => {
      if (!DEBUG) {
        mustBeLoggedIn(currentUser);
        mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

        logger.log(
          "info",
          "[Q ALLUSERS] User %s - Create new api key %s",
          currentUser.id
        );
      }

      // Api that name already exist?
      if ((await prisma.api({ api_name: input.name })) !== null) {
        logger.log(
          "warn",
          "[M CREATE NEW API] Api name already exist!",
          input.name
        );
        throw new Error("Api name already exist!");
      }

      const api_id_uuid = uuid.v4();

      const tykURL = "http://gateway:8080/tyk/apis/";

      const headers = {
        "Content-Type": "application/json",
        "x-tyk-authorization": TYK_GW_SECRET
      };

      const body = {
        name: input.name,
        api_id: api_id_uuid,
        auth: {
          auth_header_name: "Authorization"
        },
        definition: {
          location: "header",
          key: "x-api-version"
        },
        version_data: {
          not_versioned: true,
          versions: {
            Default: {
              name: "Default",
              use_extended_paths: true
            }
          }
        },
        proxy: {
          listen_path: input.url_path,
          target_url: input.url_target,
          strip_listen_path: true
        },
        active: true
      };

      const res = await fetch(tykURL, {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers
      });

      const data = await res.json(); // data is object

      // add data to prisma tables

      const urlsTemp = [];

      input.urls.map(x => {
        var temp = {
          url: x.url,
          methods: x.methods
        };

        urlsTemp.push(temp);
      });

      await prisma.createApi({
        api_id: api_id_uuid,
        api_name: input.name,
        api_root_url: input.url_path,
        urls: {
          create: urlsTemp
        }
      });

      // Hot reload tyk
      const tyk_reload_header = {
        "x-tyk-authorization": TYK_GW_SECRET
      };

      const tyk_reload_url = "http://gateway:8080/tyk/reload";

      await fetch(tyk_reload_url, {
        method: "GET",
        headers: tyk_reload_header
      });

      return { key: data.key };
    }
  }
};
