import { Router } from "express";
import multer from "multer";
import { ListingsController } from "./listings.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";
import { requireSchemaAccess } from "../../middlewares/permissions.middleware.js";

const upload = multer({ dest: "uploads/tmp/" });

const router = Router();

router.use(authMiddleware);
router.use(requireSchemaAccess());

// List
router.get("/", ListingsController.list);

// Get one
router.get("/:id", ListingsController.get);

// Create new listing
router.post(
    "/",
    upload.single("image"),
    ListingsController.create
);

// Update listing
router.put(
    "/:id",
    upload.single("image"),
    ListingsController.update
);

// Delete listing
router.delete("/:id", ListingsController.remove);

export default router;
