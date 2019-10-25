import logger from "../misc/logger";

export enum UserLevels {
  USER,
  ADMIN
}

export const mustBeLoggedIn = user => {
  if (!user) {
    logger.log("info", "[AUTH] Authentication error - not authenticated");
    throw new Error("Not authenticated.");
  }
};

export const mustBeAtleastLevel = (user, minLevel: UserLevels) => {
  if (parseInt(UserLevels[user.type]) < minLevel) {
    logger.log(
      "info",
      "[AUTH] Forbidden error - permission denied to user %s",
      user.id
    );
    throw new Error("Permission denied!");
  }
};
