import { apiPost } from "./api.js";

// Login handler
export async function login(username, password) {
    const res = await apiPost("/auth/login", { username, password });

    if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("user", JSON.stringify(res.user));
    }

    return res;
}

// Register handler
export async function register(data) {
    return await apiPost("/auth/register", data);
}

// Logout
export function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login.html";
}

// Get logged-in user
export function currentUser() {
    const u = localStorage.getItem("user");
    return u ? JSON.parse(u) : null;
}
