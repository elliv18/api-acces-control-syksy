import logger from "../misc/logger";
import fetch from "node-fetch";
import { TYK_GW_SECRET } from "../environment";
import { prisma } from "../generated/prisma-client";

export default async () => {
  if (
    (await prisma
      .apisConnection()
      .aggregate()
      .count()) < 1
  ) {
    const url = "http://gateway:8080/tyk/apis/";

    const header = {
      "Content-Type": "application/json",
      "x-tyk-authorization": TYK_GW_SECRET
    };

    const apiList = await fetch(url, { method: "GET", headers: header });
    const apiListData = await apiList.json();

    console.log("cleaning tyk apis");

    for (var i = 0; i < apiListData.length; i++) {
      const delete_url = url + apiListData[i].api_id;

      const temp = await fetch(delete_url, {
        method: "DELETE",
        headers: header
      });

      console.log(temp);
    }
  }
};
