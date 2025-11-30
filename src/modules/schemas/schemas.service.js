import { db } from "../../config/db.js";

export const SchemasService = {
    async list() {
        const r = await db.query(`
            SELECT id, schema_name, description
            FROM schemas
            ORDER BY id DESC
        `);
        return r.rows;
    },

    async get(id) {
        const r = await db.query(`
            SELECT id, schema_name, description
            FROM schemas
            WHERE id = $1
        `, [id]);
        return r.rows[0] || null;
    },

    async create(schemaName, description) {
        const r = await db.query(`
            INSERT INTO schemas (schema_name, description)
            VALUES ($1, $2)
            RETURNING *
        `, [schemaName, description]);
        return r.rows[0];
    },

    async update(id, description) {
        const r = await db.query(`
            UPDATE schemas
            SET description = $1
            WHERE id = $2
            RETURNING *
        `, [description, id]);
        return r.rows[0];
    },

    async remove(id) {
        await db.query(`DELETE FROM schemas WHERE id = $1`, [id]);
        return true;
    }
};
