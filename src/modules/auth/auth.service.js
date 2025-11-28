import jwt from "jsonwebtoken";
import { db } from "../../config/db.js";
import { ENV } from "../../config/env.js";
import { hashPassword, comparePassword } from "../../utils/crypto.js";

export const AuthService = {
    async register(username, password, role = "user") {
        const hashed = await hashPassword(password);

        const q = `
            INSERT INTO app_users (username, password, role)
            VALUES ($1, $2, $3)
            RETURNING id, username, role
        `;

        const result = await db.query(q, [username, hashed, role]);

        return result.rows[0];
    },

    async login(username, password) {
        const q = `
            SELECT id, username, password, role
            FROM app_users
            WHERE username = $1
        `;

        const result = await db.query(q, [username]);

        if (result.rowCount === 0) return null;

        const user = result.rows[0];
        const match = await comparePassword(password, user.password);

        if (!match) return null;

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            ENV.JWT_SECRET,
            { expiresIn: "7d" }
        );

        return { token, user: { id: user.id, username: user.username, role: user.role } };
    }
};
