import { AuthService } from "./auth.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export const AuthController = {
    async register(req, res) {
        try {
            const { username, password, role } = req.body;

            const user = await AuthService.register(username, password, role);

            return sendSuccess(res, "User registered", user);
        } catch (err) {
            console.error("❌ Register error:", err);
            return sendError(res, "Registration failed", 500, err);
        }
    },

    async login(req, res) {
        try {
            const { username, password } = req.body;

            const result = await AuthService.login(username, password);

            if (!result) {
                return sendError(res, "Invalid username or password", 401);
            }

            return sendSuccess(res, "Login successful", result);
        } catch (err) {
            console.error("❌ Login error:", err);
            return sendError(res, "Login failed", 500, err);
        }
    }
};
