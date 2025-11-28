import { getIO } from "./socket.js";

// ================================
// 🔔 NOTIFICATIONS
// ================================
export const emitNotification = (payload) => {
    const io = getIO();
    io.emit("notification", payload);
};

// ================================
// 🔒 PARCEL LOCKING
// ================================
export const emitParcelLock = (parcelId, userId) => {
    const io = getIO();
    io.emit("parcel_lock_update", {
        parcel_id: parcelId,
        locked_by: userId
    });
};

export const emitParcelUnlock = (parcelId) => {
    const io = getIO();
    io.emit("parcel_lock_update", {
        parcel_id: parcelId,
        locked_by: null
    });
};

// ================================
// 🗺 PARCEL UPDATE (GEOMETRY/DETAILS)
// ================================
export const emitParcelUpdated = (parcelId) => {
    const io = getIO();
    io.emit("parcel_update", {
        parcel_id: parcelId
    });
};

// ================================
// 📄 APPLICATION STATUS
// ================================
export const emitApplicationUpdate = (id, status) => {
    const io = getIO();
    io.emit("application_update", {
        application_id: id,
        status
    });
};

// ================================
// 🏠 LISTINGS
// ================================
export const emitListingCreated = (data) => {
    const io = getIO();
    io.emit("listing_created", data);
};

export const emitListingUpdated = (data) => {
    const io = getIO();
    io.emit("listing_updated", data);
};

// ================================
// 📁 DOCUMENTS
// ================================
export const emitParcelDocumentUpdate = (parcelId) => {
    const io = getIO();
    io.emit("parcel_document_update", { parcel_id: parcelId });
};
