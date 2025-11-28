import { db } from "../../config/db.js";
import { geoJSONToWKT } from "../../utils/geometry.js";
import {
    emitParcelUpdated,
    emitParcelLock,
    emitParcelUnlock
} from "../../realtime/events.js";

export const ParcelsService = {

    // ============================
    // LIST PARCELS IN A SCHEMA
    // ============================
    async list(schemaName) {
        const q = `
            SELECT id, parcel_no, owner, size, land_use, 
                   ST_AsGeoJSON(geom) AS geometry,
                   locked_by
            FROM parcels
            WHERE schema_name = $1
            ORDER BY parcel_no ASC
        `;
        const r = await db.query(q, [schemaName]);
        return r.rows;
    },

    // ============================
    // GET ONE PARCEL
    // ============================
    async get(parcelId) {
        const q = `
            SELECT id, parcel_no, owner, size, land_use,
                   ST_AsGeoJSON(geom) AS geometry,
                   locked_by,
                   schema_name
            FROM parcels
            WHERE id = $1
        `;
        const r = await db.query(q, [parcelId]);
        return r.rows[0];
    },

    // ============================
    // CREATE PARCEL
    // ============================
    async create(data, schemaName) {
        const {
            parcel_no, owner, size, land_use, geometry
        } = data;

        const wkt = geoJSONToWKT(JSON.parse(geometry));

        const q = `
            INSERT INTO parcels
            (parcel_no, owner, size, land_use, geom, schema_name)
            VALUES ($1, $2, $3, $4, ST_GeomFromText($5, 4326), $6)
            RETURNING id
        `;

        const r = await db.query(q, [
            parcel_no,
            owner,
            size,
            land_use,
            wkt,
            schemaName
        ]);

        emitParcelUpdated(r.rows[0].id);
        return r.rows[0];
    },

    // ============================
    // UPDATE PARCEL ATTRIBUTES
    // ============================
    async update(parcelId, data) {
        const {
            owner, size, land_use
        } = data;

        const q = `
            UPDATE parcels
            SET owner = $1,
                size = $2,
                land_use = $3
            WHERE id = $4
        `;

        await db.query(q, [owner, size, land_use, parcelId]);

        emitParcelUpdated(parcelId);
        return true;
    },

    // ============================
    // UPDATE GEOMETRY
    // ============================
    async updateGeometry(parcelId, geometry) {
        const wkt = geoJSONToWKT(JSON.parse(geometry));

        const q = `
            UPDATE parcels
            SET geom = ST_GeomFromText($1, 4326)
            WHERE id = $2
        `;

        await db.query(q, [wkt, parcelId]);

        emitParcelUpdated(parcelId);
        return true;
    },

    // ============================
    // DELETE PARCEL
    // ============================
    async remove(parcelId) {
        await db.query("DELETE FROM parcels WHERE id = $1", [parcelId]);
        emitParcelUpdated(parcelId);
        return true;
    },

    // ============================
    // LOCKING SYSTEM
    // ============================
    async lock(parcelId, userId) {
        const q = `
            UPDATE parcels
            SET locked_by = $1
            WHERE id = $2
            RETURNING id
        `;
        await db.query(q, [userId, parcelId]);
        emitParcelLock(parcelId, userId);
        return true;
    },

    async unlock(parcelId) {
        const q = `
            UPDATE parcels
            SET locked_by = NULL
            WHERE id = $1
        `;
        await db.query(q, [parcelId]);
        emitParcelUnlock(parcelId);
        return true;
    }
};
