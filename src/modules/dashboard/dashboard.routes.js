import { Router } from "express";
import pool from "../../config/db.js";

const router = Router();

router.get("/", async (req, res) => {
    try {
        // Query simple counts — guaranteed to work
        const parcels = await pool.query("SELECT COUNT(*) FROM parcels");
        const listings = await pool.query("SELECT COUNT(*) FROM listings");
        const applications = await pool.query("SELECT COUNT(*) FROM applications");
        const users = await pool.query("SELECT COUNT(*) FROM users");

        res.json({
            status: "ok",
            system: "MyLAN LIS Backend",
            timestamp: new Date().toISOString(),

            totals: {
                parcels: Number(parcels.rows[0].count),
                listings: Number(listings.rows[0].count),
                applications: Number(applications.rows[0].count),
                users: Number(users.rows[0].count)
            }
        });

    } catch (error) {
        console.error("Dashboard API error:", error);
        res.status(500).json({ status: "error" });
    }
});

export default router;
