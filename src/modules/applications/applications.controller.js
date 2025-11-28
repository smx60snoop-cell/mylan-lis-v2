import { ApplicationsService } from "./applications.service.js";
import { sendSuccess, sendError, sendNotFound } from "../../utils/response.js";

export const ApplicationsController = {

    async list(req, res) {
        try {
            const schemaName = req.headers["x-land-schema"];
            const apps = await ApplicationsService.list(schemaName);

            return sendSuccess(res, "Applications loaded", apps);
        } catch (err) {
            console.error("❌ List apps error:", err);
            return sendError(res, "Failed to load applications", 500);
        }
    },

    async get(req, res) {
        try {
            const app = await ApplicationsService.get(req.params.id);

            if (!app) return sendNotFound(res, "Application not found");

            return sendSuccess(res, "Application loaded", app);
        } catch (err) {
            return sendError(res, "Failed to get application", 500);
        }
    },

    async create(req, res) {
        try {
            const schemaName = req.headers["x-land-schema"];
            const newApp = await ApplicationsService.create(req.body, schemaName);

            return sendSuccess(res, "Application submitted", newApp);
        } catch (err) {
            console.error("❌ Create app error:", err);
            return sendError(res, "Failed to submit application", 500);
        }
    },

    async approve(req, res) {
        try {
            await ApplicationsService.approve(req.params.id);
            return sendSuccess(res, "Application approved");
        } catch (err) {
            return sendError(res, "Approval failed", 500);
        }
    },

    async reject(req, res) {
        try {
            await ApplicationsService.reject(req.params.id);
            return sendSuccess(res, "Application rejected");
        } catch (err) {
            return sendError(res, "Rejection failed", 500);
        }
    },

    async processing(req, res) {
        try {
            await ApplicationsService.startProcessing(req.params.id);
            return sendSuccess(res, "Application moved to processing");
        } catch (err) {
            return sendError(res, "Failed to update processing state", 500);
        }
    },

    async remove(req, res) {
        try {
            await ApplicationsService.remove(req.params.id);
            return sendSuccess(res, "Application deleted");
        } catch (err) {
            return sendError(res, "Failed to delete application", 500);
        }
    }
};
