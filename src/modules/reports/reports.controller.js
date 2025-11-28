import { ReportsService } from "./reports.service.js";
import { sendSuccess, sendError, sendNotFound } from "../../utils/response.js";

export const ReportsController = {

    async parcel(req, res) {
        try {
            const file = await ReportsService.parcelReport(req.params.id);

            if (!file) return sendNotFound(res, "Parcel not found");

            return sendSuccess(res, "Report generated", { file });
        } catch (err) {
            console.error("❌ Parcel report error:", err);
            return sendError(res, "Failed to generate report", 500);
        }
    },

    async application(req, res) {
        try {
            const file = await ReportsService.applicationReport(req.params.id);

            if (!file) return sendNotFound(res, "Application not found");

            return sendSuccess(res, "Report generated", { file });
        } catch (err) {
            return sendError(res, "Failed to generate report", 500);
        }
    },

    async listing(req, res) {
        try {
            const file = await ReportsService.listingReport(req.params.id);

            if (!file) return sendNotFound(res, "Listing not found");

            return sendSuccess(res, "Report generated", { file });
        } catch (err) {
            return sendError(res, "Failed to generate report", 500);
        }
    }
};
