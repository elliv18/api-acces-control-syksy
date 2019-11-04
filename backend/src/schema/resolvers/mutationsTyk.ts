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
    createNewApiKey: async (obj, { input }, { currentUser }) => {
      if (!DEBUG) {
        mustBeLoggedIn(currentUser);
        mustBeAtleastLevel(currentUser, UserLevels.ADMIN);

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

      var access_rights = {};

      /*  Example input: array of APIs that each can have multiple endpoints each with multiple methods
      
             access: [
              {
                id: "1", name: "api 1", urls:                                     // API 1
                [
                  {
                  url: "/todos(/.*)?", methods: ["GET", "PUT", "DELETE"]          // API 1 url 1
                  },
                  {
                  url: "/users(/.*)?", methods: ["GET", "POST"]                   // API 1 url 2
                    }
                ]
              }, 
              {
                id: "2", name: "api 2", urls:                                     // API 2
                {
                  url: "url 2", methods: ["GET", "PUT"]                           // API 2 url 1
                }
              }
            ]
      
      
      
            */

      input.access.map(api => {
        var apiTemp = {
          api_id: api.id,
          api_name: api.name,
          allowed_urls: []
        };
        api.urls.map(url => {
          var urlTemp = {
            // Temporary helper to parse single url with all its methods

            url: url.url,
            methods: []
          };
          url.methods.map(method => {
            urlTemp.methods.push(method);
          });
          apiTemp.allowed_urls.push(urlTemp);
        });
        access_rights[api.id] = apiTemp;
      });

      // jsonstring only for debugging
      const jsonString = JSON.stringify(access_rights);
      console.log("access_rights passed to gateway", jsonString);

      const body = {
        access_rights: access_rights
      };

      console.log(body);

      const res = await fetch(tykURL, {
        method: "POST",
        body: JSON.stringify(body),
        headers: headers
      });

      const data = await res.json(); // data is object
      console.log(data);
      // TODO key and hash save prisma?

      return { key: data.key, keyHash: data.key_hash };
    },

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
    },
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

      const url = baseUrl + keysPath + userTemp.apiKey + "?hashed=true";

      await fetch(url, { method: "DELETE", headers: headers });

      const user = await prisma.deleteUser({ id: id });

      return user;
    }
  }
};
