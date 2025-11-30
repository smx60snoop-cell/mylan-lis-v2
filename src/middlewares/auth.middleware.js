import jwt from "jsonwebtoken";
import { ENV } from "../config/env.js";
import db from "../../config/db.js";

export const authMiddleware = async (req, res, next) => {
    try {
        const header = req.headers.authorization;

        if (!header) {
            return res.status(401).json({ error: "Missing authorization header" });
        }

        const token = header.split(" ")[1];
        if (!token) return res.status(401).json({ error: "Invalid token format" });

        const decoded = jwt.verify(token, ENV.JWT_SECRET);
        req.user = decoded;

        // Fetch user record (ensures user still exists)
        const result = await db.query(
            "SELECT id, username, role FROM app_users WHERE id = $1",
            [decoded.id]
        );

        if (result.rowCount === 0) {
            return res.status(401).json({ error: "User no longer exists" });
        }

        req.user.role = result.rows[0].role;
        req.user.username = result.rows[0].username;

        next();
    } catch (err) {
        console.error("❌ Auth error:", err);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};
