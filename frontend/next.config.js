require('dotenv').config();

const nextConfig = {
    publicRuntimeConfig: {
        BACKEND_HOST: process.env.BACKEND_HOST,
        BACKEND_PORT: process.env.BACKEND_PORT,
        TYK_HOST: process.env.TYK_HOST,
        TYK_PORT: process.env.TYK_PORT,
        PUBLIC_URL: process.env.PUBLIC_URL,
        PUBLIC_API_URL: process.env.PUBLIC_API_URL,
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID

    }
};

module.exports = nextConfig;
