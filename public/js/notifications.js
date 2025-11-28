// ==================================
//  NOTIFICATION UI HANDLERS
// ==================================

function pushNotificationToUI({ title, message, type }) {
    const box = document.getElementById("notificationBox");
    if (!box) return;

    const item = document.createElement("div");
    item.className = "notification-item";

    item.innerHTML = `
        <div class="notif-title">${title}</div>
        <div class="notif-message">${message}</div>
    `;

    box.prepend(item);
}

function incrementNotificationBadge() {
    const badge = document.getElementById("notificationBadge");
    if (!badge) return;

    const count = parseInt(badge.innerText || "0") + 1;
    badge.innerText = count;
}

function updateRealtimeStatus(connected) {
    const el = document.getElementById("realtimeStatus");
    if (!el) return;

    if (connected) {
        el.innerText = "Online";
        el.classList.add("connected");
        el.classList.remove("disconnected");
    } else {
        el.innerText = "Offline";
        el.classList.add("disconnected");
        el.classList.remove("connected");
    }
}
