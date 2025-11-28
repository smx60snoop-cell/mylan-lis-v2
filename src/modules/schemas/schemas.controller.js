import { SchemasService } from "./schemas.service.js";
import { sendSuccess, sendError, sendNotFound } from "../../utils/response.js";

export const SchemasController = {
    async list(req, res) {
        try {
            const schemas = await SchemasService.getAll();
            return sendSuccess(res, "Schemas loaded", schemas);
        } catch (err) {
            console.error("❌ List schemas error:", err);
            return sendError(res, "Failed to load schemas", 500);
        }
    },

    async get(req, res) {
        try {
            const { id } = req.params;
            const schema = await SchemasService.getOne(id);

            if (!schema) return sendNotFound(res, "Schema not found");

            return sendSuccess(res, "Schema found", schema);
        } catch (err) {
            return sendError(res, "Failed to get schema", 500);
        }
    },

    async create(req, res) {
        try {
            const { name, description } = req.body;

            const existing = await SchemasService.getByName(name);
            if (existing) {
                return sendError(res, "Schema name already exists", 400);
            }

            const newSchema = await SchemasService.create(name, description);

            return sendSuccess(res, "Schema created", newSchema);
        } catch (err) {
            console.error("❌ Create schema error:", err);
            return sendError(res, "Failed to create schema", 500);
        }
    },

    async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description } = req.body;

            const updated = await SchemasService.update(id, name, description);

            return sendSuccess(res, "Schema updated", updated);
        } catch (err) {
            return sendError(res, "Failed to update schema", 500);
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;

            await SchemasService.remove(id);

            return sendSuccess(res, "Schema deleted");
        } catch (err) {
            return sendError(res, err.message || "Failed to delete schema", 400);
        }
    },

    async validateSchema(req, res) {
        try {
            const schemaName = req.headers["x-land-schema"];
            if (!schemaName) {
                return sendError(res, "Missing schema header", 400);
            }

            const schema = await SchemasService.getByName(schemaName);

            if (!schema) {
                return sendNotFound(res, "Invalid schema");
            }

            return sendSuccess(res, "Schema valid", schema);
        } catch (err) {
            return sendError(res, "Schema validation failed", 500);
        }
    }
};
