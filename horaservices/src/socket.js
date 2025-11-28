// socket.js (client)
import { io } from "socket.io-client";

let socket;

if (typeof window !== "undefined") {
  const userId = new URLSearchParams(window.location.search).get("id") || localStorage.getItem("userID");
  socket = io("http://localhost:5000", {
    transports: ["websocket", "polling"],
    query: { userId }
  });
}

export default socket;
