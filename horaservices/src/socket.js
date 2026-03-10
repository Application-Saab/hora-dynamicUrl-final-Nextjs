import { io } from "socket.io-client";
import { BASE_URL } from "./utils/apiconstants";

let socket = null;

export const connectSocket = (userId) => {
  if (!userId || socket?.connected) return socket;

  if (socket) return socket;

  socket = io(BASE_URL, {
    transports: ["websocket", "polling"],
    secure: true,
    query: { userId },
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    window.dispatchEvent(new Event("socket:connected"));
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);
  });

  return socket;
};

// Initial connect on app load
if (typeof window !== "undefined") {
  const userId = localStorage.getItem("userID");
  if (userId && !socket) {
    connectSocket(userId);
  }
}

export default socket;