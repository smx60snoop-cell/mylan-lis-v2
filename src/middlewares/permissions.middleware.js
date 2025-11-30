import db from "../../config/db.js";

export const requireRole = (allowedRoles = []) => {
    return async (req, res, next) => {
        try {
            if (!req.user || !req.user.role) {
                return res.status(403).json({ error: "User role missing" });
            }

            if (!allowedRoles.includes(req.user.role)) {
                return res.status(403).json({ error: "Access denied" });
            }

            next();
        } catch (err) {
            console.error("❌ Permissions error:", err);
            return res.status(403).json({ error: "Forbidden" });
        }
    };
};

// For schema-based permissions (multi-land-area)
export const requireSchemaAccess = () => {
    return async (req, res, next) => {
        try {
            const schemaName = req.headers["x-land-schema"];

            if (!schemaName) {
                return res.status(400).json({ error: "Missing land schema header" });
            }

            // Validate schema exists in the DB
            const result = await db.query(
                "SELECT id FROM schemas WHERE schema_name = $1",
                [schemaName]
            );

            if (result.rowCount === 0) {
                return res.status(404).json({ error: "Schema not found" });
            }

            req.schema = schemaName;
            next();
        } catch (err) {
            console.error("❌ Schema access error:", err);
            return res.status(403).json({ error: "Schema access denied" });
        }
    };
};
