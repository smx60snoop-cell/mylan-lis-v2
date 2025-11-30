import fs from "fs";
import path from "path";
import db from "../../config/db.js";
import { ensureDir } from "../../utils/file.js";
import { 
    emitListingCreated,
    emitListingUpdated
} from "../../realtime/events.js";

export const ListingsService = {

    // ========================================
    // LIST ALL LISTINGS IN A SCHEMA
    // ========================================
    async list(schemaName) {
        const q = `
            SELECT id, title, description, price, status,
                   parcel_id, image_path, schema_name, created_at
            FROM listings
            WHERE schema_name = $1
            ORDER BY created_at DESC
        `;
        const r = await db.query(q, [schemaName]);
        return r.rows;
    },

    // ========================================
    // GET ONE LISTING
    // ========================================
    async get(id) {
        const q = `
            SELECT id, title, description, price, status,
                   parcel_id, image_path, schema_name, created_at
            FROM listings
            WHERE id = $1
        `;
        const r = await db.query(q, [id]);
        return r.rows[0];
    },

    // ========================================
    // CREATE LISTING
    // ========================================
    async create(data, schemaName, imageFile = null) {
        let imagePath = null;

        if (imageFile) {
            const uploadDir = `uploads/listings/`;
            ensureDir(uploadDir);

            imagePath = path.join(uploadDir, imageFile.originalname);
            fs.renameSync(imageFile.path, imagePath);
        }

        const { title, description, price, parcel_id } = data;

        const q = `
            INSERT INTO listings
                (title, description, price, parcel_id, schema_name, image_path)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id, title, description, price, parcel_id
        `;

        const r = await db.query(q, [
            title,
            description,
            price,
            parcel_id,
            schemaName,
            imagePath
        ]);

        emitListingCreated(r.rows[0]);

        return r.rows[0];
    },

    // ========================================
    // UPDATE LISTING
    // ========================================
    async update(id, data, imageFile = null) {
        let imagePath = null;

        if (imageFile) {
            const uploadDir = `uploads/listings/`;
            ensureDir(uploadDir);

            imagePath = path.join(uploadDir, imageFile.originalname);
            fs.renameSync(imageFile.path, imagePath);
        }

        const { title, description, price, status } = data;

        const q = `
            UPDATE listings
            SET title = COALESCE($1, title),
                description = COALESCE($2, description),
                price = COALESCE($3, price),
                status = COALESCE($4, status),
                image_path = COALESCE($5, image_path)
            WHERE id = $6
        `;

        await db.query(q, [
            title,
            description,
            price,
            status,
            imagePath,
            id
        ]);

        emitListingUpdated({ id });

        return true;
    },

    // ========================================
    // DELETE LISTING
    // ========================================
    async remove(id) {
        await db.query("DELETE FROM listings WHERE id = $1", [id]);
        emitListingUpdated({ id, deleted: true });
        return true;
    }
};
