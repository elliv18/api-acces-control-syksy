import { prisma } from "../../generated/prisma-client";

export default {
  User: {
    async apis(user) {
      return await prisma.user({ id: user.id }).apis();
    }
  },
  Api: {
    async urls(api) {
      return await prisma.api({ id: api.id }).urls();
    },
    async users(user) {
      return await prisma.api({ id: user.id }).users();
    }
  },
  Url: {
    async api(api) {
      return await prisma.url({ id: api.id }).api();
    }
  }
};
