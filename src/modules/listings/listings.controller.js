import { ListingsService } from "./listings.service.js";
import { sendSuccess, sendError, sendNotFound } from "../../utils/response.js";

export const ListingsController = {

    async list(req, res) {
        try {
            const schemaName = req.headers["x-land-schema"];
            const listings = await ListingsService.list(schemaName);

            return sendSuccess(res, "Listings loaded", listings);
        } catch (err) {
            console.error("❌ List listings error:", err);
            return sendError(res, "Failed to load listings", 500);
        }
    },

    async get(req, res) {
        try {
            const listing = await ListingsService.get(req.params.id);

            if (!listing) return sendNotFound(res, "Listing not found");

            return sendSuccess(res, "Listing loaded", listing);
        } catch (err) {
            return sendError(res, "Failed to get listing", 500);
        }
    },

    async create(req, res) {
        try {
            const schemaName = req.headers["x-land-schema"];
            const imageFile = req.file || null;

            const newListing = await ListingsService.create(
                req.body,
                schemaName,
                imageFile
            );

            return sendSuccess(res, "Listing created", newListing);
        } catch (err) {
            console.error("❌ Create listing error:", err);
            return sendError(res, "Failed to create listing", 500);
        }
    },

    async update(req, res) {
        try {
            const imageFile = req.file || null;

            await ListingsService.update(
                req.params.id,
                req.body,
                imageFile
            );

            return sendSuccess(res, "Listing updated");
        } catch (err) {
            return sendError(res, "Failed to update listing", 500);
        }
    },

    async remove(req, res) {
        try {
            await ListingsService.remove(req.params.id);
            return sendSuccess(res, "Listing deleted");
        } catch (err) {
            return sendError(res, "Failed to delete listing", 500);
        }
    }
};
