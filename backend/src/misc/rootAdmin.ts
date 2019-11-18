import { prisma } from "../generated/prisma-client";
import * as bcrypt from "bcryptjs";
import { ROOT_ADMIN_EMAIL, ROOT_ADMIN_PASS, SALT_ROUNDS } from "../environment";
import logger from "./logger";

export default async () => {
  // is db empty?
  if (
    (await prisma
      .usersConnection()
      .aggregate()
      .count()) < 1 ||
    (await prisma.user({ email: ROOT_ADMIN_EMAIL })) === null
  ) {
    await prisma.createUser({
      userType: "ADMIN",
      google_account: false,
      email: ROOT_ADMIN_EMAIL,
      password: await bcrypt.hash(ROOT_ADMIN_PASS, SALT_ROUNDS)
    });

    logger.log("info", "[USER CREATE] Root admin have been created");
  }
};
