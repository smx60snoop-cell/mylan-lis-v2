import { Router } from "express";
import { SchemasController } from "./schemas.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireRole } from "../../middlewares/permissions.middleware.js";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validation.middleware.js";

const router = Router();

router.use(authMiddleware);

// List schemas
router.get("/", requireRole(["admin"]), SchemasController.list);

// Get one
router.get("/:id", requireRole(["admin"]), SchemasController.get);

// Create
router.post(
    "/",
    requireRole(["admin"]),
    [
        body("name").notEmpty().withMessage("Schema name required")
    ],
    validateRequest,
    SchemasController.create
);

// Update
router.put(
    "/:id",
    requireRole(["admin"]),
    [
        body("name").notEmpty()
    ],
    validateRequest,
    SchemasController.update
);

// Delete
router.delete(
    "/:id",
    requireRole(["admin"]),
    SchemasController.remove
);

// Validate schema from header
router.get(
    "/validate/header",
    authMiddleware,
    SchemasController.validateSchema
);

export default router;
