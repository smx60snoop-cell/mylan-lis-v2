import { Router } from "express";
import { NotificationsController } from "./notifications.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/permissions.middleware.js";

const router = Router();

router.use(authMiddleware);

// User inbox
router.get("/", NotificationsController.list);

// Mark as read
router.put("/:id/read", NotificationsController.markAsRead);

// Admin: create individual notification
router.post("/", requireRole(["admin"]), NotificationsController.create);

// Admin: broadcast to all users
router.post("/broadcast", requireRole(["admin"]), NotificationsController.broadcast);

export default router;
