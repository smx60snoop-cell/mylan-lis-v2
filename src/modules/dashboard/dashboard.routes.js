import express from "express";
import db from "../../config/db.js";

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        // Example: Replace queries with your actual DB tables
        const [parcels] = await db.query("SELECT COUNT(*) AS total FROM parcels");
        const [listings] = await db.query("SELECT COUNT(*) AS total FROM listings");
        const [applications] = await db.query(
            "SELECT COUNT(*) AS total FROM applications WHERE status = 'pending'"
        );
        const [users] = await db.query("SELECT COUNT(*) AS total FROM users");

        return res.json({
            status: "ok",
            system: "MyLAN LIS Backend",
            timestamp: new Date().toISOString(),
            totals: {
                parcels: parcels[0].total,
                listings: listings[0].total,
                applications: applications[0].total,
                users: users[0].total
            }
        });
    } catch (error) {
        console.error("Dashboard API error:", error);
        return res.status(500).json({ status: "error" });
    }
});

export default router;
