import pkg from "pg";
import { ENV } from "./env.js";

const { Pool } = pkg;

export const db = new Pool({
    host: ENV.DB.HOST,
    port: ENV.DB.PORT,
    user: ENV.DB.USER,
    password: ENV.DB.PASS,
    database: ENV.DB.NAME,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000
});

db.connect()
    .then(() => console.log("🔌 PostgreSQL connected"))
    .catch(err => console.error("❌ DB connection error:", err));

export default db;
