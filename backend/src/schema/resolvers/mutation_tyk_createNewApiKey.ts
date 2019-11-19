import { mustBeLoggedIn } from "../../misc/auth";
import { prisma } from "../../generated/prisma-client";
import logger from "../../misc/logger";
import fetch from "node-fetch";
import { DEBUG, TYK_GW_SECRET } from "../../environment";

export default {
  Mutation: {
    createNewApiKey: async (obj, { input }, { currentUser }) => {
      if (!DEBUG) {
        mustBeLoggedIn(currentUser);

        logger.log(
          "info",
          "[Q ALLUSERS] User %s - Create new api key %s",
          currentUser.id
        );
      }

      const tykURL = "http://gateway:8080/tyk/keys/create";

      const headers = {
        "Content-Type": "application/json",
        "x-tyk-authorization": TYK_GW_SECRET
      };

      // get apis data and make body field

      var access_rights = {};

      // linked apis id array to make right relations
      var relations_api_ids = [];

      // Map not work, it needs nested await... aka. await hell...
      for (var i = 0; i < input.api_keys.length; i++) {
        const api_data = await prisma.api({ api_id: input.api_keys[i] });
        const urls_data = await prisma
          .api({ api_id: input.api_keys[i] })
          .urls();

        var temp = {
          api_id: api_data.api_id,
          api_name: api_data.api_name,
          allowed_urls: []
        };

        urls_data.map(x => {
          var temp2 = {
            url: x.url,
            methods: JSON.parse(x.methods) // needs to be array!
          };

          temp.allowed_urls.push(temp2);
        });

        access_rights[input.api_keys[i]] = temp;

        relations_api_ids.push(api_data.id);
      }

      const body = {
        access_rights: access_rights
      };

      const res = await fetch(tykURL, {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers
      });

      const data = await res.json(); // data is object

      // adding hash to current user table line
      await prisma.updateUser({
        data: {
          api_hash: data.key_hash,
          api_key: data.key
        },
        where: {
          id: currentUser.id
        }
      });

      // deleting old relations
      const userTemp = await prisma.user({ id: currentUser.id }).apis();
      var oldApiIds = []; // temp
      userTemp.map(x => {
        oldApiIds.push({ id: x.id });
      });
      await prisma.updateUser({
        data: {
          apis: {
            disconnect: oldApiIds
          }
        },
        where: {
          id: currentUser.id
        }
      });

      // adding relations
      var newApiIds = []; // temp
      input.api_keys.map(x => {
        newApiIds.push({ api_id: x });
      });
      const user = await prisma.updateUser({
        data: {
          apis: {
            connect: newApiIds
          }
        },
        where: {
          id: currentUser.id
        }
      });

      return { user };
    }
  }
};
