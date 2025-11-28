import { Router } from "express";
import { UsersController } from "./users.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/permissions.middleware.js";

const router = Router();

router.use(authMiddleware);

// Admin-only routes
router.get("/", requireRole(["admin"]), UsersController.list);
router.get("/:id", requireRole(["admin"]), UsersController.get);
router.put("/:id/role", requireRole(["admin"]), UsersController.updateRole);
router.put("/:id/password", requireRole(["admin"]), UsersController.changePassword);
router.delete("/:id", requireRole(["admin"]), UsersController.remove);

export default router;
