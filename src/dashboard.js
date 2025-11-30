import express from "express";
import db from "../config/db.js";

const router = express.Router();

/**
 * Fetch dashboard statistics
 */
router.get("/", async (req, res) => {
    try {
        // 1. Total parcels
        const [parcels] = await db.query("SELECT COUNT(*) AS total FROM parcels");

        // 2. Total listings
        const [listings] = await db.query("SELECT COUNT(*) AS total FROM listings");

        // 3. Pending applications
        const [applications] = await db.query(
            "SELECT COUNT(*) AS total FROM applications WHERE status = 'pending'"
        );

        // 4. Total payments
        const [payments] = await db.query(
            "SELECT COALESCE(SUM(amount),0) AS total FROM payments"
        );

        // 5. Parcels uploaded weekly (last 7 weeks)
        const [weekly] = await db.query(`
            SELECT 
                WEEK(created_at) AS week,
                COUNT(*) AS uploads
            FROM parcels
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 7 WEEK)
            GROUP BY WEEK(created_at)
            ORDER BY week ASC;
        `);

        const labels = weekly.map(w => "Week " + w.week);
        const data = weekly.map(w => w.uploads);

        return res.json({
            status: "ok",
            totalParcels: parcels[0].total,
            totalListings: listings[0].total,
            pendingApplications: applications[0].total,
            totalPayments: payments[0].total,
            weekLabels: labels,
            weekData: data
        });

    } catch (err) {
        console.error("Dashboard API Error:", err);
        return res.status(500).json({ error: "Dashboard error" });
    }
});

export default router;
