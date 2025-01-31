import { io } from "socket.io-client";

let socket;

export const getSocket = () => {
  if (!socket) {
    socket = io("ws://10.0.2.2:5000", {  // Use '10.0.2.2' for Android Emulator, 'localhost' for iOS
      transports: ["websocket"],
      reconnection: true, // Enables auto-reconnect
      reconnectionAttempts: 10, // Retry connection 10 times
      reconnectionDelay: 3000, // Wait 3s before reconnecting
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("WebSocket connection error:", err);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from WebSocket server");
    });
  }
  return socket;
};

export default getSocket;
