import { apiGet, apiPost } from "./api.js";

// Fetch all users
export async function loadUsers() {
    return await apiGet("/admin/users");
}

// Approve verification
export async function approveVerification(id) {
    return await apiPost(`/admin/verification/${id}/approve`);
}

// Reject verification
export async function rejectVerification(id, reason) {
    return await apiPost(`/admin/verification/${id}/reject`, { reason });
}

// Get notifications
export async function getNotifications() {
    return await apiGet("/notifications");
}
