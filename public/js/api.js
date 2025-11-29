const API_BASE = "/api";

// Generic GET request
export async function apiGet(path) {
    const token = localStorage.getItem("token");
    const res = await fetch(`${API_BASE}${path}`, {
        headers: {
            "Authorization": token ? `Bearer ${token}` : ""
        }
    });
    return res.json();
}

// Generic POST request
export async function apiPost(path, data = {}) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${API_BASE}${path}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token ? `Bearer ${token}` : ""
        },
        body: JSON.stringify(data)
    });

    return res.json();
}
