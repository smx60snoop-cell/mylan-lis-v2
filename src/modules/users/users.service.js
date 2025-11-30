import { db } from "../../config/db.js";
import { hashPassword } from "../../utils/crypto.js";

export const UsersService = {
    async list() {
        const r = await db.query(`
            SELECT id, username, role
            FROM app_users
            ORDER BY id DESC
        `);
        return r.rows;
    },

    async get(id) {
        const r = await db.query(`
            SELECT id, username, role
            FROM app_users
            WHERE id = $1
        `, [id]);
        return r.rows[0] || null;
    },

    async updateRole(id, role) {
        const r = await db.query(`
            UPDATE app_users
            SET role = $1
            WHERE id = $2
            RETURNING id, username, role
        `, [role, id]);
        return r.rows[0];
    },

    async changePassword(id, newPass) {
        const hashed = await hashPassword(newPass);
        await db.query(`
            UPDATE app_users
            SET password = $1
            WHERE id = $2
        `, [hashed, id]);
        return true;
    },

    async remove(id) {
        await db.query(`DELETE FROM app_users WHERE id = $1`, [id]);
        return true;
    }
};
