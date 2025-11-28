import { db } from "../../config/db.js";

export const SearchService = {

    // ============================================
    // MAIN SEARCH — parcels, applications, listings
    // ============================================
    async globalSearch(query, schemaName) {
        const q = `%${query.toLowerCase()}%`;

        const results = {
            parcels: [],
            applications: [],
            listings: []
        };

        // ---------------------------------------------------
        // PARCELS
        // ---------------------------------------------------
        const parcels = await db.query(
            `
            SELECT id, parcel_no, owner, size, land_use
            FROM parcels
            WHERE schema_name = $1
              AND (
                    LOWER(parcel_no) LIKE $2 OR
                    LOWER(owner) LIKE $2 OR
                    LOWER(land_use) LIKE $2
                  )
            LIMIT 50
            `,
            [schemaName, q]
        );
        results.parcels = parcels.rows;

        // ---------------------------------------------------
        // APPLICATIONS
        // ---------------------------------------------------
        const apps = await db.query(
            `
            SELECT id, applicant_name, phone, email, parcel_id, status
            FROM applications
            WHERE schema_name = $1
              AND (
                    LOWER(applicant_name) LIKE $2 OR
                    LOWER(phone) LIKE $2 OR
                    LOWER(email) LIKE $2
                  )
            LIMIT 50
            `,
            [schemaName, q]
        );
        results.applications = apps.rows;

        // ---------------------------------------------------
        // LISTINGS
        // ---------------------------------------------------
        const listings = await db.query(
            `
            SELECT id, title, description, price, parcel_id
            FROM listings
            WHERE schema_name = $1
              AND (
                    LOWER(title) LIKE $2 OR
                    LOWER(description) LIKE $2
                  )
            LIMIT 50
            `,
            [schemaName, q]
        );
        results.listings = listings.rows;

        return results;
    },

    // ============================================
    // AUTOCOMPLETE (parcel_no, owner)
    // ============================================
    async autocomplete(query, schemaName) {
        const q = `%${query.toLowerCase()}%`;

        const result = await db.query(
            `
            SELECT parcel_no AS label
            FROM parcels
            WHERE schema_name = $1
              AND LOWER(parcel_no) LIKE $2
            LIMIT 10
            `,
            [schemaName, q]
        );

        return result.rows.map(r => r.label);
    }
};
