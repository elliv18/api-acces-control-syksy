import { sign } from "jsonwebtoken";
import logger from "../../misc/logger";
import { prisma } from "../../generated/prisma-client";
import { JWT_SECRET, JWT_TIME, GOOGLE_CLIENT_ID } from "../../environment";
import { OAuth2Client } from "google-auth-library";

export default {
  Mutation: {
    loginGoogle: async (obj, { input }) => {
      const client = new OAuth2Client(GOOGLE_CLIENT_ID);

      let ticket;

      try {
        ticket = await client.verifyIdToken({
          idToken: input.token,
          audience: GOOGLE_CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
        });
      } catch (err) {
        throw new Error("Invalid token signature!");
      }

      // parse data
      const data = ticket.getPayload();

      let userTemp;

      if ((await prisma.google({ google_id: data.sub })) === null) {
        userTemp = await prisma.createUser({
          userType: "USER",
          google_account: true,
          email: data.email,
          google: {
            create: {
              google_id: data.sub
            }
          }
        });
      } else {
        userTemp = await prisma.google({ google_id: data.sub }).user();
      }

      const jwt = sign(
        { id: userTemp.id, type: userTemp.userType },
        JWT_SECRET,
        {
          expiresIn: JWT_TIME
        }
      );

      logger.log(
        "info",
        "[M LOGIN] Login succesful! Logged user is: %s",
        userTemp.email
      );

      return { jwt };
    }
  }
};
