// ==============================================
//  PARCELS MODULE (FRONTEND)
//  Handles:
//   ✔ Loading parcel details
//   ✔ Locking / unlocking
//   ✔ Updating attributes
//   ✔ Updating geometry
//   ✔ Live updates via Socket.IO
// ==============================================

let currentParcelId = null;
let currentSchemaName = null;
let currentPlotGid = null;

// DOM refs
const parcelInfoBox = document.getElementById("parcelInfoBox");
const parcelEditForm = document.getElementById("parcelEditForm");
const parcelDocumentList = document.getElementById("parcelDocuments");
const parcelLockIndicator = document.getElementById("parcelLockIndicator");

// =============================
// LOAD PARCEL DETAILS
// =============================
async function loadParcelDetails(parcelId) {
    currentParcelId = parcelId;

    try {
        const token = localStorage.getItem("token");

        const res = await fetch(`/api/parcels/${parcelId}`, {
            headers: { "Authorization": `Bearer ${token}` }
        });

        const json = await res.json();
        if (!json.success) throw new Error(json.message);

        const parcel = json.data.parcel || json.data;
        const plot = json.data.plot;

        currentSchemaName = parcel.schema_name;
        currentPlotGid = parcel.gid_in_schema;

        renderParcelDetails(parcel, plot);
        refreshParcelDocuments();

        console.log("Parcel loaded:", parcelId);

    } catch (err) {
        console.error("Error loading parcel:", err);
        alert("Error loading parcel: " + err.message);
    }
}

// =============================
// RENDER PARCEL DETAILS
// =============================
function renderParcelDetails(parcel, plot) {
    if (!parcelInfoBox) return;

    parcelInfoBox.innerHTML = `
        <h3>Parcel #${parcel.id}</h3>
        <p><b>Schema:</b> ${parcel.schema_name}</p>
        <p><b>Plot Number:</b> ${plot.pltNum}</p>
        <p><b>Family Name:</b> ${plot.famName}</p>
        <p><b>Section:</b> ${plot.secName}</p>
        <p><b>Road:</b> ${plot.rdName}</p>
        <p><b>Land Use:</b> ${plot.lndUse}</p>
        <p><b>Owner:</b> ${plot.owner}</p>

        <div id="parcelEditWarning" style="display:none; color:red; font-weight:bold;"></div>

        <button id="editParcelBtn" onclick="editParcel()">Edit Parcel</button>
        <button id="saveParcelBtn" onclick="saveParcel()" disabled>Save Changes</button>
    `;
}

// =============================
// EDIT PARCEL
// =============================
function editParcel() {
    const form = parcelEditForm;
    if (!form) { alert("Parcel form not found."); return; }

    form.style.display = "block";
    document.getElementById("saveParcelBtn").disabled = false;
}

// =============================
// SAVE PARCEL ATTRIBUTE CHANGES
// =============================
async function saveParcel() {
    const token = localStorage.getItem("token");

    const updates = {
        pltNum: document.getElementById("pltNum").value,
        famName: document.getElementById("famName").value,
        secName: document.getElementById("secName").value,
        rdName: document.getElementById("rdName").value,
        lndUse: document.getElementById("lndUse").value,
        owner: document.getElementById("owner").value
    };

    try {
        const res = await fetch(`/api/parcels/${currentParcelId}/attributes`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updates)
        });

        const json = await res.json();
        if (!json.success) throw new Error(json.message);

        alert("Parcel updated successfully.");
        loadParcelDetails(currentParcelId);

    } catch (err) {
        alert("Update failed: " + err.message);
    }
}

// =============================
// PARCEL LOCKING
// =============================
async function lockParcel() {
    const token = localStorage.getItem("token");

    try {
        const res = await fetch(`/api/parcels/${currentParcelId}/lock`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });

        const json = await res.json();
        if (!json.success) return alert(json.message);

        parcelLockIndicator.innerText = "Locked by you";

    } catch (err) {
        console.error(err);
        alert("Lock failed.");
    }
}

async function unlockParcel() {
    const token = localStorage.getItem("token");

    try {
        await fetch(`/api/parcels/${currentParcelId}/unlock`, {
            method: "POST",
            headers: { "Authorization": `Bearer ${token}` }
        });

        parcelLockIndicator.innerText = "Unlocked";

    } catch (err) {
        alert("Unlock failed.");
    }
}

// =============================
// SOCKET.IO REALTIME HANDLERS
// =============================
window.handleParcelLockUpdate = function (data) {
    if (!currentParcelId) return;
    if (data.parcel_id !== currentParcelId) return;

    const myId = localStorage.getItem("userId");

    if (data.locked_by && data.locked_by !== myId) {
        disableParcelEditing();
        parcelLockIndicator.innerText = "Locked by another user";
    }

    if (!data.locked_by) {
        enableParcelEditing();
        parcelLockIndicator.innerText = "Unlocked";
    }
};

window.handleParcelUpdate = function (data) {
    if (data.parcel_id !== currentParcelId) return;

    alert("🔄 Parcel updated by another user. Reloading...");
    loadParcelDetails(currentParcelId);
};

// =============================
// DOCUMENT MANAGEMENT
// =============================
async function refreshParcelDocuments() {
    const token = localStorage.getItem("token");

    const res = await fetch(`/api/documents/parcel/${currentParcelId}/list`, {
        headers: { "Authorization": `Bearer ${token}` }
    });

    const json = await res.json();
    if (!parcelDocumentList) return;

    parcelDocumentList.innerHTML = json.data
        .map(doc => `
            <div class="doc-item">
                <a href="${doc.url}" target="_blank">${doc.name}</a>
            </div>
        `)
        .join("");
}

window.handleParcelDocumentUpdate = function (data) {
    if (data.parcel_id === currentParcelId) {
        refreshParcelDocuments();
    }
};
