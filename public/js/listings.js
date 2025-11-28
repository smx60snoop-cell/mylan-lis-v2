// =========================================
//  LISTINGS MODULE (FRONTEND)
// =========================================

async function loadListings(schemaName) {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/listings/schema/${schemaName}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const json = await res.json();
    const table = document.getElementById("listingsTable");

    if (!table) return;

    table.innerHTML = json.data.map(ls => `
        <tr>
            <td>${ls.id}</td>
            <td>${ls.title}</td>
            <td>${ls.price}</td>
            <td>${ls.listing_type}</td>
            <td>${ls.status}</td>
        </tr>
    `).join("");
}

// ============================
// REALTIME HANDLERS
// ============================
window.handleListingCreated = function (data) {
    console.log("Listing created:", data);
    loadListings(data.schema_name);
};

window.handleListingUpdated = function (data) {
    console.log("Listing updated:", data);
    loadListings("*"); // load all if you support multi-schema
};
