import fs from "fs";
import path from "path";
import { db } from "../../config/db.js";
import { ensureDir, deleteFile } from "../../utils/file.js";
import { emitParcelDocumentUpdate } from "../../realtime/events.js";

export const DocumentsService = {

    // ============================
    // LIST DOCUMENTS FOR A PARCEL
    // ============================
    async list(parcelId) {
        const q = `
            SELECT id, parcel_id, filename, filepath, uploaded_at
            FROM parcel_documents
            WHERE parcel_id = $1
            ORDER BY uploaded_at DESC
        `;

        const r = await db.query(q, [parcelId]);
        return r.rows;
    },

    // ============================
    // UPLOAD DOCUMENT
    // ============================
    async upload(parcelId, file) {
        const uploadDir = `uploads/parcels/${parcelId}`;
        ensureDir(uploadDir);

        const newPath = path.join(uploadDir, file.originalname);
        fs.renameSync(file.path, newPath);

        const q = `
            INSERT INTO parcel_documents (parcel_id, filename, filepath)
            VALUES ($1, $2, $3)
            RETURNING id
        `;

        const r = await db.query(q, [parcelId, file.originalname, newPath]);

        emitParcelDocumentUpdate(parcelId);
        return r.rows[0];
    },

    // ============================
    // DELETE DOCUMENT
    // ============================
    async remove(id) {
        const q = `
            SELECT parcel_id, filepath
            FROM parcel_documents
            WHERE id = $1
        `;

        const r = await db.query(q, [id]);
        if (r.rowCount === 0) return false;

        const { parcel_id, filepath } = r.rows[0];

        deleteFile(filepath);

        await db.query("DELETE FROM parcel_documents WHERE id = $1", [id]);

        emitParcelDocumentUpdate(parcel_id);

        return true;
    }
};
