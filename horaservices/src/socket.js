// import { io } from "socket.io-client";
// import { BASE_URL } from "./utils/apiconstants";

// let socket;
// export const connectSocket = (userId) => {
//   if (!userId) return;

//   socket = io(BASE_URL, {
//     transports: ["websocket", "polling"],
//     secure: true,
//     query: { userId },
//   });

//   socket.on("connect", () => {
//     console.log("Socket connected:", socket.id);
//   });

//   socket.on("connect_error", (err) => {
//     console.error("Socket error:", err.message);
//   });

//   return socket;
// };

// if (typeof window !== "undefined") {
//   const userId =
//     new URLSearchParams(window.location.search).get("id") ||
//     localStorage.getItem("userID");
//   if (userId) {
//     connectSocket(userId);
//   }
// }

// export default socket;


// src/socket.js

import { io } from "socket.io-client";
import { BASE_URL } from "./utils/apiconstants";

let socket = null;

export const connectSocket = (userId) => {
  if (!userId || socket?.connected) return socket;

  // Agar already connecting ya connected hai, wahi return kar
  if (socket) return socket;

  socket = io(BASE_URL, {
    transports: ["websocket", "polling"],
    secure: true,
    query: { userId },
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("Socket connected:", socket.id);
    // Critical: Connection success pe custom event fire kar
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