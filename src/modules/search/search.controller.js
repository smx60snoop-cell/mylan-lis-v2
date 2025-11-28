import { SearchService } from "./search.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export const SearchController = {

    // GLOBAL SEARCH
    async global(req, res) {
        try {
            const { q } = req.query;

            if (!q || q.length < 2) {
                return sendError(res, "Search query too short", 400);
            }

            const schemaName = req.headers["x-land-schema"];

            const results = await SearchService.globalSearch(q, schemaName);

            return sendSuccess(res, "Search results", results);

        } catch (err) {
            console.error("❌ Global search error:", err);
            return sendError(res, "Search failed", 500);
        }
    },

    // AUTOCOMPLETE (parcel numbers)
    async autocomplete(req, res) {
        try {
            const { q } = req.query;

            if (!q) {
                return sendSuccess(res, "No results", []);
            }

            const schemaName = req.headers["x-land-schema"];

            const results = await SearchService.autocomplete(q, schemaName);

            return sendSuccess(res, "Autocomplete results", results);

        } catch (err) {
            console.error("❌ Autocomplete error:", err);
            return sendError(res, "Autocomplete failed", 500);
        }
    }
};
