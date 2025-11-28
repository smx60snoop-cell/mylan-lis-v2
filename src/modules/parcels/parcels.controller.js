import { ParcelsService } from "./parcels.service.js";
import { sendSuccess, sendError, sendNotFound } from "../../utils/response.js";

export const ParcelsController = {

    async list(req, res) {
        try {
            const schemaName = req.headers["x-land-schema"];

            const parcels = await ParcelsService.list(schemaName);
            return sendSuccess(res, "Parcels loaded", parcels);
        } catch (err) {
            console.error("❌ List parcels:", err);
            return sendError(res, "Failed to load parcels", 500);
        }
    },

    async get(req, res) {
        try {
            const parcel = await ParcelsService.get(req.params.id);

            if (!parcel) return sendNotFound(res, "Parcel not found");

            return sendSuccess(res, "Parcel loaded", parcel);
        } catch (err) {
            return sendError(res, "Failed to load parcel", 500);
        }
    },

    async create(req, res) {
        try {
            const schemaName = req.headers["x-land-schema"];

            const newParcel = await ParcelsService.create(req.body, schemaName);

            return sendSuccess(res, "Parcel created", newParcel);
        } catch (err) {
            console.error("❌ Create parcel:", err);
            return sendError(res, "Failed to create parcel", 500);
        }
    },

    async update(req, res) {
        try {
            await ParcelsService.update(req.params.id, req.body);
            return sendSuccess(res, "Parcel updated");
        } catch (err) {
            return sendError(res, "Failed to update parcel", 500);
        }
    },

    async updateGeometry(req, res) {
        try {
            await ParcelsService.updateGeometry(req.params.id, req.body.geometry);
            return sendSuccess(res, "Geometry updated");
        } catch (err) {
            return sendError(res, "Failed to update geometry", 500);
        }
    },

    async remove(req, res) {
        try {
            await ParcelsService.remove(req.params.id);
            return sendSuccess(res, "Parcel deleted");
        } catch (err) {
            return sendError(res, "Failed to delete parcel", 500);
        }
    },

    async lock(req, res) {
        try {
            await ParcelsService.lock(req.params.id, req.user.id);
            return sendSuccess(res, "Parcel locked");
        } catch (err) {
            return sendError(res, "Failed to lock parcel", 500);
        }
    },

    async unlock(req, res) {
        try {
            await ParcelsService.unlock(req.params.id);
            return sendSuccess(res, "Parcel unlocked");
        } catch (err) {
            return sendError(res, "Failed to unlock parcel", 500);
        }
    }
};
