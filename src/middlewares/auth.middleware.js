// src/middlewares/auth.middleware.js
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import { ENV } from "../config/env.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header || !header.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Missing token" });
        }

        const token = header.split(" ")[1];
        const decoded = jwt.verify(token, ENV.JWT_SECRET);

        // Fetch user from DB
        const result = await db.query(
            `SELECT id, username, role FROM app_users WHERE id = $1`,
            [decoded.id]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ error: "Invalid user" });
        }

        req.user = result.rows[0];
        next();
    } catch (err) {
        console.error("❌ Auth error:", err);
        return res.status(401).json({ error: "Unauthorized" });
    }
};
