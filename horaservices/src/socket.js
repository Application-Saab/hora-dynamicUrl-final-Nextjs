import { io } from "socket.io-client";
import { BASE_URL } from "./utils/apiconstants";

let socket;
export const connectSocket = (userId) => {
  if (!userId) return;

  socket = io(BASE_URL, {
    transports: ["websocket", "polling"],
    secure: true,
    query: { userId },
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
  });

  socket.on("connect_error", (err) => {
    console.error("Socket error:", err.message);
  });

  return socket;
};

if (typeof window !== "undefined") {
  const userId =
    new URLSearchParams(window.location.search).get("id") ||
    localStorage.getItem("userID");
  if (userId) {
    connectSocket(userId);
  }
}

export default socket;
