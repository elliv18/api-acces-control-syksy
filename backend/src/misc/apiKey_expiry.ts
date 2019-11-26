import { prisma } from "../generated/prisma-client";
import logger from "./logger";
import { TYK_GW_SECRET } from "../environment";

export default async user => {
  if (parseInt(user.api_expiry) < Date.now()) {
    // delete apikey from tyk (backup way if tyk dont done it)
    const baseUrl = "http://gateway:8080/tyk/";
    const keysPath = "keys/";

    const headers = {
      "Content-Type": "application/json",
      "x-tyk-authorization": TYK_GW_SECRET
    };

    const url = baseUrl + keysPath + user.api_hash + "?hashed=true";

    await fetch(url, { method: "DELETE", headers: headers });

    // delete apikey to user (postress)
    await prisma.updateUser({
      data: {
        api_key: null,
        api_hash: null,
        api_expiry: null
      },
      where: {
        id: user.id
      }
    });
  }
};
