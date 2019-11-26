import * as dotenv from "dotenv";
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || "T6Y3JRYmL6";
export const JWT_TIME = process.env.JWT_TIME || "1d";

export const ROOT_ADMIN_EMAIL = process.env.ROOT_ADMIN_EMAIL || "1";
export const ROOT_ADMIN_PASS = process.env.ROOT_ADMIN_PASS || "1";

export const DEVELOPMENT = "development";
export const PRODUCTION = "production";

export const BACKEND_HOST = process.env.BACKEND_HOST || "http://localhost";
export const BACKEND_PORT = process.env.BACKEND_PORT || 3050;

export const FRONTEND_HOST = process.env.FRONTEND_HOST || "http://localhost";
export const FRONTEND_PORT = process.env.FRONTEND_PORT || 3000;

export const TYK_HOST = process.env.TYK_HOST;
export const TYK_PORT = process.env.PORT;

export const NODE_ENV = process.env.NODE_ENV || DEVELOPMENT;

export const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS) || 10;

export const MAX_PW = 18;
export const MIN_PW = parseInt(process.env.MIN_PW) || 3;

export const DEBUG = parseInt(process.env.DEBUG) || 0;

export const TYK_GW_SECRET = process.env.TYK_GW_SECRET || "holomoloo";

export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

export const GOOGLE_SECRET = process.env.GOOGLE_SECRET;

export const APIKEY_EXPIRY_NU_TIME = parseInt(
  process.env.APIKEY_EXPIRY_NU_TIME
);

export const APIKEY_EXPIRY_GU_TIME = parseInt(
  process.env.APIKEY_EXPIRY_GU_TIME
);
