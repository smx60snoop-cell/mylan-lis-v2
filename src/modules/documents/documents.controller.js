import { DocumentsService } from "./documents.service.js";
import { sendSuccess, sendError, sendNotFound } from "../../utils/response.js";

export const DocumentsController = {

    async list(req, res) {
        try {
            const docs = await DocumentsService.list(req.params.parcelId);
            return sendSuccess(res, "Documents loaded", docs);
        } catch (err) {
            console.error("❌ List documents error:", err);
            return sendError(res, "Failed to load documents", 500);
        }
    },

    async upload(req, res) {
        try {
            if (!req.file) {
                return sendError(res, "No file uploaded");
            }

            const doc = await DocumentsService.upload(
                req.params.parcelId,
                req.file
            );

            return sendSuccess(res, "Document uploaded", doc);
        } catch (err) {
            console.error("❌ Upload error:", err);
            return sendError(res, "Upload failed", 500);
        }
    },

    async remove(req, res) {
        try {
            const success = await DocumentsService.remove(req.params.id);

            if (!success) return sendNotFound(res, "Document not found");

            return sendSuccess(res, "Document deleted");
        } catch (err) {
            return sendError(res, "Failed to delete document", 500);
        }
    }
};
