import { Router } from "express";
import { ParcelsController } from "./parcels.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireSchemaAccess } from "../../middlewares/permissions.middleware.js";
import { body } from "express-validator";
import { validateRequest } from "../../middlewares/validation.middleware.js";

const router = Router();

router.use(authMiddleware);
router.use(requireSchemaAccess());

// List parcels
router.get("/", ParcelsController.list);

// Get parcel
router.get("/:id", ParcelsController.get);

// Create parcel
router.post(
    "/",
    [
        body("parcel_no").notEmpty(),
        body("geometry").notEmpty()
    ],
    validateRequest,
    ParcelsController.create
);

// Update attributes
router.put("/:id", ParcelsController.update);

// Update geometry
router.put("/:id/geometry", ParcelsController.updateGeometry);

// Lock / Unlock
router.post("/:id/lock", ParcelsController.lock);
router.post("/:id/unlock", ParcelsController.unlock);

// Delete
router.delete("/:id", ParcelsController.remove);

export default router;
