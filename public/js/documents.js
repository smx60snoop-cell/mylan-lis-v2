// ====================================================
// DOCUMENTS MODULE (FRONTEND)
// ====================================================
// Handles:
//  ✔ Listing parcel documents
//  ✔ Uploading new documents
//  ✔ Auto-refreshing document list on realtime events

let documentUploadParcelId = null;

// ====================================================
// LOAD DOCUMENTS FOR PARCEL
// ====================================================
async function loadParcelDocuments(parcelId) {
    documentUploadParcelId = parcelId;

    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`/api/documents/parcel/${parcelId}/list`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const json = await res.json();
        const box = document.getElementById("documentList");

        if (!box) return;

        box.innerHTML = json.data.map(doc => `
            <div class="doc-item">
                <a href="${doc.url}" target="_blank">${doc.name}</a>
                <span class="doc-date">${new Date(doc.created_at).toLocaleString()}</span>
            </div>
        `).join("");

    } catch (err) {
        console.error("Failed to load documents:", err);
    }
}

// ====================================================
// DOCUMENT UPLOAD
// ====================================================
async function uploadDocument(input) {
    if (!input.files.length) return;

    const file = input.files[0];
    const token = localStorage.getItem("token");

    const formData = new FormData();
    formData.append("file", file);

    try {
        const res = await fetch(`/api/documents/parcel/${documentUploadParcelId}/upload`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` },
            body: formData
        });

        const json = await res.json();
        if (!json.success) {
            alert("Upload failed: " + json.message);
            return;
        }

        alert("Document uploaded successfully.");
        loadParcelDocuments(documentUploadParcelId);

    } catch (err) {
        alert("Upload failed: " + err.message);
    }
}

// ====================================================
// REALTIME SYNC
// ====================================================
window.handleParcelDocumentUpdate = function (data) {
    if (!documentUploadParcelId) return;
    if (data.parcel_id !== documentUploadParcelId) return;

    console.log("Realtime: parcel documents updated");

    loadParcelDocuments(documentUploadParcelId);
};
