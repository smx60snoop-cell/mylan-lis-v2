import { Router } from "express";
import { ReportsController } from "./reports.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireSchemaAccess } from "../../middlewares/permissions.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(requireSchemaAccess());

router.get("/parcel/:id", ReportsController.parcel);
router.get("/application/:id", ReportsController.application);
router.get("/listing/:id", ReportsController.listing);

export default router;
