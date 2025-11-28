import http from "http";
import { createApp } from "./app.js";
import { ENV } from "./config/env.js";
import { initSocket } from "./realtime/socket.js";

export const startServer = () => {
    const app = createApp();
    const server = http.createServer(app);

    // Start Socket.IO
    initSocket(server);

    server.listen(ENV.PORT, () => {
        console.log(`🚀 Server running on port ${ENV.PORT}`);
    });
};
