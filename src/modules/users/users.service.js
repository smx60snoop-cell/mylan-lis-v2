import { db } from "../../config/db.js";
import { hashPassword } from "../../utils/crypto.js";

export const UsersService = {
    async getAll() {
        const q = "SELECT id, username, role FROM app_users ORDER BY id ASC";
        const result = await db.query(q);
        return result.rows;
    },

    async getOne(id) {
        const q = "SELECT id, username, role FROM app_users WHERE id = $1";
        const r = await db.query(q, [id]);
        return r.rows[0];
    },

    async updateRole(id, role) {
        const q = `
            UPDATE app_users 
            SET role = $1 
            WHERE id = $2
            RETURNING id, username, role
        `;
        const r = await db.query(q, [role, id]);
        return r.rows[0];
    },

    async changePassword(id, newPassword) {
        const hashed = await hashPassword(newPassword);

        const q = `
            UPDATE app_users
            SET password = $1
            WHERE id = $2
        `;
        await db.query(q, [hashed, id]);

        return true;
    },

    async remove(id) {
        await db.query("DELETE FROM app_users WHERE id = $1", [id]);
        return true;
    }
};
