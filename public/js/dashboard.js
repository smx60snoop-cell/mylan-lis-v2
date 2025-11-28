// =========================================
//  ADMIN DASHBOARD MODULE (FRONTEND)
// =========================================

async function loadDashboard() {
    const token = localStorage.getItem("token");

    const res = await fetch("/api/admin/dashboard", {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const json = await res.json();
    const box = document.getElementById("dashboardContent");

    if (!json.success) {
        box.innerHTML = "<p>Error loading dashboard.</p>";
        return;
    }

    const d = json.data;

    box.innerHTML = `
        <div class="stat-grid">
            <div class="stat-card">Parcels: <b>${d.parcels}</b></div>
            <div class="stat-card">Applications: <b>${d.applications}</b></div>
            <div class="stat-card">Listings: <b>${d.listings}</b></div>
            <div class="stat-card">Users: <b>${d.users}</b></div>
        </div>
    `;
}

// Auto-refresh dashboard on live events
window.handleParcelUpdate = loadDashboard;
window.handleListingCreated = loadDashboard;
window.handleListingUpdated = loadDashboard;
window.handleApplicationUpdate = loadDashboard;

// Refresh every 20 seconds also
setInterval(loadDashboard, 20000);

document.addEventListener("DOMContentLoaded", loadDashboard);
