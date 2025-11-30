import { Router } from "express";

// Module Routes
import authRoutes from "./modules/auth/auth.routes.js";
import userRoutes from "./modules/users/users.routes.js";
import schemaRoutes from "./modules/schemas/schemas.routes.js";
import parcelRoutes from "./modules/parcels/parcels.routes.js";
import applicationRoutes from "./modules/applications/applications.routes.js";
import documentRoutes from "./modules/documents/documents.routes.js";
import listingRoutes from "./modules/listings/listings.routes.js";
import notificationRoutes from "./modules/notifications/notifications.routes.js";
import searchRoutes from "./modules/search/search.routes.js";
import reportRoutes from "./modules/reports/reports.routes.js";

// 🔥 FIX — Import dashboard route module
import dashboardRoutes from "./modules/dashboard/dashboard.routes.js";

const router = Router();

// API route mounting
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/schemas", schemaRoutes);
router.use("/parcels", parcelRoutes);
router.use("/applications", applicationRoutes);
router.use("/documents", documentRoutes);
router.use("/listings", listingRoutes);
router.use("/notifications", notificationRoutes);
router.use("/search", searchRoutes);
router.use("/reports", reportRoutes);
router.use("/dashboard", dashboardRoutes);

export default router;
