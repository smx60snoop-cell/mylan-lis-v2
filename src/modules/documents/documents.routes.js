import { Router } from "express";
import multer from "multer";
import { DocumentsController } from "./documents.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const upload = multer({ dest: "uploads/tmp/" });

const router = Router();

router.use(authMiddleware);

// List documents for parcel
router.get("/:parcelId", DocumentsController.list);

// Upload document
router.post(
    "/upload/:parcelId",
    upload.single("file"),
    DocumentsController.upload
);

// Delete document
router.delete("/:id", DocumentsController.remove);

export default router;
