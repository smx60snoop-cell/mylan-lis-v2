// ===================================================
// SEARCH MODULE (FRONTEND)
// ===================================================
// Handles:
//  ✔ Live search
//  ✔ Auto-suggestions
//  ✔ Realtime refresh when parcels/listings updates
// ===================================================

let searchTimeout = null;

async function performSearch() {
    const query = document.getElementById("searchInput").value.trim();
    const token = localStorage.getItem("token");

    if (!query) {
        document.getElementById("searchResults").innerHTML = "";
        return;
    }

    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const json = await res.json();

    if (!json.success) return;

    renderSearchResults(json.data);
}

function renderSearchResults(results) {
    const box = document.getElementById("searchResults");

    if (!results.length) {
        box.innerHTML = "<p>No results found.</p>";
        return;
    }

    box.innerHTML = results.map(r => `
        <div class="search-item" onclick="openSearchResult('${r.type}', ${r.id})">
            <div class="search-title">${r.label}</div>
            <div class="search-type">${r.type}</div>
        </div>
    `).join("");
}

function openSearchResult(type, id) {
    if (type === "parcel") {
        window.location.href = `/viewParcel.html?id=${id}`;
    }
    if (type === "listing") {
        window.location.href = `/listing.html?id=${id}`;
    }
    if (type === "application") {
        window.location.href = `/application.html?id=${id}`;
    }
}

document.getElementById("searchInput").addEventListener("input", () => {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(performSearch, 300);
});

// ===================================================
// REALTIME INTEGRATION
// ===================================================

// Refresh search results automatically
function refreshSearchIfOpen() {
    const query = document.getElementById("searchInput").value.trim();
    if (query.length > 0) {
        performSearch();
    }
}

window.handleParcelUpdate = refreshSearchIfOpen;
window.handleListingCreated = refreshSearchIfOpen;
window.handleListingUpdated = refreshSearchIfOpen;
