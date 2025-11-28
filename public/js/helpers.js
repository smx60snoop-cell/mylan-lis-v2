// =============================
// GENERAL FRONTEND HELPERS
// =============================

function disableParcelEditing() {
    const editBtn = document.getElementById("editParcelBtn");
    if (editBtn) editBtn.disabled = true;

    const saveBtn = document.getElementById("saveParcelBtn");
    if (saveBtn) saveBtn.disabled = true;

    const warning = document.getElementById("parcelEditWarning");
    if (warning) {
        warning.style.display = "block";
        warning.innerText = "⚠ This parcel is being edited by another user.";
    }
}

function enableParcelEditing() {
    const editBtn = document.getElementById("editParcelBtn");
    if (editBtn) editBtn.disabled = false;

    const saveBtn = document.getElementById("saveParcelBtn");
    if (saveBtn) saveBtn.disabled = false;

    const warning = document.getElementById("parcelEditWarning");
    if (warning) {
        warning.style.display = "none";
    }
}

function loadParcelDetails(parcelId) {
    console.log("Reloading parcel details:", parcelId);
    // Should be implemented in parcels.js
}

function refreshListingsTable() {
    console.log("Refreshing listings...");
    // Implemented in listings.js
}

function refreshParcelDocuments() {
    console.log("Refreshing parcel documents...");
    // Implemented in documents.js
}
