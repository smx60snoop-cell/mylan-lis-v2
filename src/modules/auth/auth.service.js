import jwt from "jsonwebtoken";
import { db } from "../../config/db.js";
import { ENV } from "../../config/env.js";
import { hashPassword, comparePassword } from "../../utils/crypto.js";

export const AuthService = {
    async register(username, password, role = "user") {
        const hashed = await hashPassword(password);

        const sql = `
            INSERT INTO app_users (username, password, role)
            VALUES ($1, $2, $3)
            RETURNING id, username, role
        `;

        const result = await db.query(sql, [username, hashed, role]);
        return result.rows[0];
    },

    async login(username, password) {
        const sql = `
            SELECT id, username, password, role
            FROM app_users
            WHERE username = $1
        `;

        const result = await db.query(sql, [username]);
        if (result.rowCount === 0) return null;

        const user = result.rows[0];
        const ok = await comparePassword(password, user.password);
        if (!ok) return null;

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            ENV.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return { token, user };
    }
};
