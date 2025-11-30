import db from "../../config/db.js";

import { 
    emitApplicationUpdate, 
    emitNotification 
} from "../../realtime/events.js";

export const ApplicationsService = {

    // ============================================
    // LIST APPLICATIONS BY SCHEMA NAME
    // ============================================
    async list(schemaName) {
        const q = `
            SELECT id, applicant_name, phone, email,
                   parcel_id, status, schema_name,
                   created_at
            FROM applications
            WHERE schema_name = $1
            ORDER BY created_at DESC
        `;
        const r = await db.query(q, [schemaName]);
        return r.rows;
    },

    // ============================================
    // GET ONE APPLICATION
    // ============================================
    async get(id) {
        const r = await db.query(`
            SELECT id, applicant_name, phone, email,
                   parcel_id, status, schema_name,
                   created_at
            FROM applications
            WHERE id = $1
        `, [id]);

        return r.rows[0];
    },

    // ============================================
    // CREATE NEW APPLICATION
    // ============================================
    async create(data, schemaName) {
        const { applicant_name, phone, email, parcel_id } = data;

        const q = `
            INSERT INTO applications 
                (applicant_name, phone, email, parcel_id, schema_name)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id
        `;

        const r = await db.query(q, [
            applicant_name,
            phone,
            email,
            parcel_id,
            schemaName
        ]);

        const appId = r.rows[0].id;

        emitNotification({
            user_id: null,
            type: "application",
            title: "New Application Submitted",
            message: `Application #${appId} created`
        });

        return r.rows[0];
    },

    // ============================================
    // UPDATE STATUS
    // ============================================
    async updateStatus(id, status) {
        const q = `
            UPDATE applications
            SET status = $1
            WHERE id = $2
            RETURNING id
        `;

        await db.query(q, [status, id]);

        emitApplicationUpdate(id, status);

        return true;
    },

    async approve(id) {
        return this.updateStatus(id, "approved");
    },

    async reject(id) {
        return this.updateStatus(id, "rejected");
    },

    async startProcessing(id) {
        return this.updateStatus(id, "processing");
    },

    // ============================================
    // DELETE APPLICATION
    // ============================================
    async remove(id) {
        await db.query(`
            DELETE FROM applications WHERE id = $1
        `, [id]);

        emitApplicationUpdate(id, "deleted");

        return true;
    }
};
