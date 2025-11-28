import { Server } from "socket.io";
import { ENV } from "../config/env.js";

let io = null;

export const initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: ENV.SOCKET_CORS_ORIGIN || "*",
            methods: ["GET", "POST"]
        },
        transports: ["websocket"]
    });

    console.log("⚡ Socket.IO initialized");

    io.on("connection", (socket) => {
        console.log("🟢 User connected:", socket.id);

        socket.on("disconnect", () => {
            console.log("🔴 User disconnected:", socket.id);
        });
    });

    return io;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized yet.");
    }
    return io;
};
