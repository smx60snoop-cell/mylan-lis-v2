import { UsersService } from "./users.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export const UsersController = {
    async list(req, res) {
        try {
            const users = await UsersService.getAll();
            return sendSuccess(res, "Users fetched", users);
        } catch (err) {
            console.error("❌ Users list error:", err);
            return sendError(res, "Failed to load users", 500);
        }
    },

    async get(req, res) {
        try {
            const { id } = req.params;
            const user = await UsersService.getOne(id);

            if (!user) return sendError(res, "User not found", 404);

            return sendSuccess(res, "User fetched", user);
        } catch (err) {
            return sendError(res, "Failed to load user", 500);
        }
    },

    async updateRole(req, res) {
        try {
            const { id } = req.params;
            const { role } = req.body;

            const updated = await UsersService.updateRole(id, role);

            return sendSuccess(res, "Role updated", updated);
        } catch (err) {
            return sendError(res, "Failed to update role", 500);
        }
    },

    async changePassword(req, res) {
        try {
            const { id } = req.params;
            const { newPassword } = req.body;

            await UsersService.changePassword(id, newPassword);

            return sendSuccess(res, "Password changed");
        } catch (err) {
            return sendError(res, "Failed to change password", 500);
        }
    },

    async remove(req, res) {
        try {
            const { id } = req.params;

            await UsersService.remove(id);

            return sendSuccess(res, "User removed");
        } catch (err) {
            return sendError(res, "Failed to delete user", 500);
        }
    }
};
