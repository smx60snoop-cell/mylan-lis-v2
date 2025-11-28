import { Router } from "express";
import { SearchController } from "./search.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireSchemaAccess } from "../../middlewares/permissions.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(requireSchemaAccess());

// Global Search
router.get("/", SearchController.global);

// Autocomplete (parcel_no)
router.get("/autocomplete", SearchController.autocomplete);

export default router;
