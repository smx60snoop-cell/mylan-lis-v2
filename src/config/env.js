import dotenv from "dotenv";

dotenv.config();

export const ENV = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || "development",

    DB: {
        HOST: process.env.DB_HOST,
        PORT: process.env.DB_PORT,
        USER: process.env.DB_USER,
        PASS: process.env.DB_PASSWORD,
        NAME: process.env.DB_NAME,
    },

    JWT_SECRET: process.env.JWT_SECRET || "default_secret",

    UPLOAD_DIR: process.env.UPLOAD_DIR || "uploads",
    MAX_UPLOAD_SIZE: process.env.MAX_UPLOAD_SIZE || "25mb",

    SOCKET_CORS_ORIGIN: process.env.SOCKET_CORS_ORIGIN || "*",
};
