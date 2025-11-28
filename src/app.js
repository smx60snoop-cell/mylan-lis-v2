import express from "express";
import cors from "cors";
import helmet from "helmet";
import router from "./router.js";
import { ensureDir } from "./utils/file.js";

export const createApp = () => {
    const app = express();

    // Basic security
    app.use(helmet());

    // JSON support
    app.use(express.json({ limit: "20mb" }));
    app.use(express.urlencoded({ extended: true }));

    // CORS
    app.use(cors({ origin: "*" }));

    // Ensure upload paths exist
    ensureDir("uploads/tmp");
    ensureDir("uploads/parcels");
    ensureDir("uploads/listings");
    ensureDir("uploads/reports");

    // Main API
    app.use("/api", router);

    // Health check
    app.get("/", (req, res) => {
        res.json({ status: "LIS backend running" });
    });

    return app;
};
