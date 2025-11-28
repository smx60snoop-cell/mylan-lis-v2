// =========================================
//  APPLICATIONS MODULE (FRONTEND)
// =========================================

async function loadApplications(schemaName) {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/applications/schema/${schemaName}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const json = await res.json();
    const list = document.getElementById("applicationsList");

    if (!list) return;

    list.innerHTML = json.data.map(app => `
        <tr id="app-row-${app.id}">
            <td>${app.id}</td>
            <td>${app.applicant_name}</td>
            <td>${app.application_type}</td>
            <td class="status">${app.status}</td>
            <td>${app.parcel_id || "-"}</td>
        </tr>
    `).join("");
}

// ==============================
// REALTIME STATUS UPDATE
// ==============================
window.handleApplicationUpdate = function (data) {
    const { application_id, status } = data;

    const row = document.querySelector(`#app-row-${application_id}`);
    if (!row) return;

    row.querySelector(".status").innerText = status;
    row.style.background = "#fff3cd"; // highlight

    pushNotificationToUI({
        title: "Application Update",
        message: `Application #${application_id} is now ${status}.`
    });
};
