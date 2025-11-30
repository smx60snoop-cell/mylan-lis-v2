import db from "../../config/db.js";

export const SchemasService = {
    async getAll() {
        const q = `
            SELECT id, schema_name, description, created_at
            FROM schemas
            ORDER BY schema_name ASC
        `;
        const result = await db.query(q);
        return result.rows;
    },

    async getOne(id) {
        const q = `
            SELECT id, schema_name, description
            FROM schemas
            WHERE id = $1
        `;
        const res = await db.query(q, [id]);
        return res.rows[0];
    },

    async getByName(schemaName) {
        const q = `
            SELECT id, schema_name, description
            FROM schemas
            WHERE schema_name = $1
        `;
        const res = await db.query(q, [schemaName]);
        return res.rows[0];
    },

    async create(name, description = "") {
        const q = `
            INSERT INTO schemas (schema_name, description)
            VALUES ($1, $2)
            RETURNING id, schema_name, description
        `;
        const res = await db.query(q, [name, description]);
        return res.rows[0];
    },

    async update(id, name, description) {
        const q = `
            UPDATE schemas
            SET schema_name = $1, description = $2
            WHERE id = $3
            RETURNING id, schema_name, description
        `;

        const res = await db.query(q, [name, description, id]);
        return res.rows[0];
    },

    async remove(id) {
        // Prevent deletion if referenced in other tables
        const check = await db.query(
            `SELECT * FROM parcels WHERE schema_id = $1 LIMIT 1`,
            [id]
        );

        if (check.rowCount > 0) {
            throw new Error("Cannot delete schema — parcels still reference it.");
        }

        await db.query(`DELETE FROM schemas WHERE id = $1`, [id]);
        return true;
    }
};
