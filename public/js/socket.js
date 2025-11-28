// ===========================================
//  SOCKET.IO FRONTEND REALTIME CONNECTOR
// ===========================================

let socket = null;
let socketConnected = false;

async function initSocket() {
    const token = localStorage.getItem("token");

    if (!token) {
        console.warn("⚠ No token found — socket not initialized");
        return;
    }

    socket = io("/", {
        auth: { token },
        transports: ["websocket"]
    });

    socket.on("connect", () => {
        socketConnected = true;
        console.log("⚡ Connected to realtime server");
        updateRealtimeStatus(true);
    });

    socket.on("disconnect", () => {
        socketConnected = false;
        console.log("⚡ Disconnected from realtime server");
        updateRealtimeStatus(false);
    });

    // ============================
    // NOTIFICATIONS
    // ============================
    socket.on("notification", (data) => {
        pushNotificationToUI(data);
        incrementNotificationBadge();
    });

    // ============================
    // PARCEL LOCKING
    // ============================
    socket.on("parcel_lock_update", (data) => {
        if (window.handleParcelLockUpdate) {
            window.handleParcelLockUpdate(data);
        }
    });

    // ============================
    // PARCEL UPDATE (GEOMETRY / ATTRIBUTES)
    // ============================
    socket.on("parcel_update", (data) => {
        if (window.handleParcelUpdate) {
            window.handleParcelUpdate(data);
        }
    });

    // ============================
    // APPLICATION STATUS
    // ============================
    socket.on("application_update", (data) => {
        if (window.handleApplicationUpdate) {
            window.handleApplicationUpdate(data);
        }
    });

    // ============================
    // LISTINGS
    // ============================
    socket.on("listing_created", (data) => {
        if (window.handleListingCreated) {
            window.handleListingCreated(data);
        }
    });

    socket.on("listing_updated", (data) => {
        if (window.handleListingUpdated) {
            window.handleListingUpdated(data);
        }
    });

    // ============================
    // DOCUMENTS
    // ============================
    socket.on("parcel_document_update", (data) => {
        if (window.handleParcelDocumentUpdate) {
            window.handleParcelDocumentUpdate(data);
        }
    });
}

window.addEventListener("DOMContentLoaded", initSocket);
