import db from "../../config/db.js";
import { emitNotification } from "../../realtime/events.js";

export const NotificationsService = {

    // ============================================
    // FETCH NOTIFICATIONS FOR USER
    // ============================================
    async list(userId) {
        const q = `
            SELECT id, type, title, message, is_read, created_at
            FROM notifications
            WHERE user_id = $1
            ORDER BY created_at DESC
        `;

        const r = await db.query(q, [userId]);
        return r.rows;
    },

    // ============================================
    // CREATE NOTIFICATION (ADMIN / SYSTEM)
    // ============================================
    async create(userId, type, title, message) {
        const q = `
            INSERT INTO notifications (user_id, type, title, message)
            VALUES ($1, $2, $3, $4)
            RETURNING id
        `;

        const r = await db.query(q, [userId, type, title, message]);

        // Real-time event
        emitNotification({
            user_id: userId,
            type,
            title,
            message
        });

        return r.rows[0];
    },

    // ============================================
    // BROADCAST TO ALL USERS
    // ============================================
    async broadcast(type, title, message) {
        // Insert for everyone
        const q = `
            INSERT INTO notifications (user_id, type, title, message)
            SELECT id, $1, $2, $3 FROM app_users
        `;

        await db.query(q, [type, title, message]);

        // Emit realtime broadcast
        emitNotification({
            user_id: null,
            type,
            title,
            message
        });

        return true;
    },

    // ============================================
    // MARK AS READ
    // ============================================
    async markAsRead(id, userId) {
        const q = `
            UPDATE notifications
            SET is_read = TRUE
            WHERE id = $1 AND user_id = $2
        `;

        await db.query(q, [id, userId]);
        return true;
    }
};
