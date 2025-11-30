// src/config/db.js
import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

// Create the pool
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

// Pool event logging
pool.on("connect", () => {
    console.log("🔌 PostgreSQL connected");
});

pool.on("error", (err) => {
    console.error("❌ PostgreSQL error:", err);
});

// Make it compatible with ALL imports
export const db = pool;     // <--- REQUIRED BY services
export default pool;        // <--- Optional default export
