import { Router } from "express";

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

const router = Router();

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

// ============================
// DASHBOARD SUMMARY ROUTE
// ============================
router.get("/dashboard", async (req, res) => {
    try {
        res.json({
            status: "ok",
            system: "MyLAN LIS Backend",
            timestamp: new Date().toISOString(),

            // add more metrics when ready:
            totals: {
                parcels: 0,
                listings: 0,
                applications: 0,
                users: 0
            }
        });
    } catch (error) {
        console.error("Dashboard API error:", error);
        res.status(500).json({ status: "error" });
    }
});


export default router;
