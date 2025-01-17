import { GraphQLServer } from "graphql-yoga";
import * as jwt from "jsonwebtoken";
import {
  JWT_SECRET,
  BACKEND_PORT,
  BACKEND_HOST,
  NODE_ENV,
  PRODUCTION
} from "./environment";
import { typeDefs, resolvers } from "./schema";
import createRootAdmin from "./misc/rootAdmin";
import logger from "./misc/logger";
import cleanup_tyk from "./misc/cleanup_tyk";

// Creating root admin if db is empty...
createRootAdmin();

// reset tyk apis
cleanup_tyk();

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: async ctx => {
    const auth = ctx.request.get("Authorization");
    let currentUser = null;
    if (auth != null) {
      logger.log("info", "[JWT] Got JWT = %s", auth);
      try {
        currentUser = await jwt.verify(auth.replace("Bearer ", ""), JWT_SECRET);
        logger.log(
          "info",
          "[JWT] JWT validate is ok to user = %s",
          currentUser.id
        );
      } catch (e) {
        logger.log("warn", "[JWT] JWT token is invalid");
      }
    }
    return { currentUser };
  }
});

// Server settings - cors allow all
const options = {
  port: BACKEND_PORT,
  playground: NODE_ENV === PRODUCTION ? "false" : "/",
  cors: {
    creditials: false,
    origin: "*"
  }
};

server.start(options, () =>
  logger.log("info", `🚀 Server ready at ${BACKEND_HOST}:${BACKEND_PORT}`)
);
