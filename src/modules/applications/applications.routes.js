import { Router } from "express";
import { ApplicationsController } from "./applications.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireSchemaAccess } from "../../middlewares/permissions.middleware.js";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validation.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(requireSchemaAccess());

// List
router.get("/", ApplicationsController.list);

// Get one
router.get("/:id", ApplicationsController.get);

// Create new application
router.post(
    "/",
    [
        body("applicant_name").notEmpty(),
        body("phone").notEmpty(),
        body("email").isEmail(),
        body("parcel_id").notEmpty()
    ],
    validateRequest,
    ApplicationsController.create
);

// Approval flow
router.post("/:id/approve", ApplicationsController.approve);
router.post("/:id/reject", ApplicationsController.reject);
router.post("/:id/processing", ApplicationsController.processing);

// Delete
router.delete("/:id", ApplicationsController.remove);

export default router;
