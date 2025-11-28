import { NotificationsService } from "./notifications.service.js";
import { sendSuccess, sendError } from "../../utils/response.js";

export const NotificationsController = {

    async list(req, res) {
        try {
            const userId = req.user.id;
            const notifications = await NotificationsService.list(userId);

            return sendSuccess(res, "Notifications loaded", notifications);
        } catch (err) {
            console.error("❌ List notifications error:", err);
            return sendError(res, "Failed to load notifications", 500);
        }
    },

    async create(req, res) {
        try {
            const { userId, type, title, message } = req.body;

            const n = await NotificationsService.create(
                userId,
                type,
                title,
                message
            );

            return sendSuccess(res, "Notification created", n);
        } catch (err) {
            return sendError(res, "Failed to create", 500);
        }
    },

    async broadcast(req, res) {
        try {
            const { type, title, message } = req.body;

            await NotificationsService.broadcast(type, title, message);

            return sendSuccess(res, "Broadcast sent");
        } catch (err) {
            return sendError(res, "Failed to broadcast", 500);
        }
    },

    async markAsRead(req, res) {
        try {
            const userId = req.user.id;

            await NotificationsService.markAsRead(req.params.id, userId);

            return sendSuccess(res, "Marked as read");
        } catch (err) {
            return sendError(res, "Failed to mark as read", 500);
        }
    }
};
