import { Router } from "express";
import { AuthController } from "./auth.controller.js";
import { validateRequest } from "../../middlewares/validation.middleware.js";
import { body } from "express-validator";

const router = Router();

router.post(
    "/register",
    [
        body("username").notEmpty(),
        body("password").isLength({ min: 4 })
    ],
    validateRequest,
    AuthController.register
);

router.post(
    "/login",
    [
        body("username").notEmpty(),
        body("password").notEmpty()
    ],
    validateRequest,
    AuthController.login
);

export default router;
