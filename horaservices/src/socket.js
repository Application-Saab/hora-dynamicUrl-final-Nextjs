import { io } from "socket.io-client";
import { BASE_URL } from "./utils/apiconstants";
import { safeGetItem } from "./utils/safeStorage";

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

  // socket.on("connect_error", (err) => {
  //   console.error("Socket connection error:", err.message);
  // });

  socket.on("connect_error", (err) => {
    console.error("Socket connection error:", err.message);

    reportError(
      err,
      {},
      {
        type: "frontend",
        component: "SocketIO",
        endpoint: "socket.connect",
        payload: { message: err.message, description: err.description },
      },
    );
  });

  socket.on("disconnect", (reason) => {
    if (reason === "io server disconnect" || reason === "transport close") {
      reportError(
        new Error(`Socket disconnected: ${reason}`),
        {},
        {
          type: "frontend",
          component: "SocketIO",
          payload: { reason },
        },
      );
    }
  });

  return socket;
};

// Initial connect on app load
if (typeof window !== "undefined") {
  const userId = safeGetItem("userID");
  if (userId && !socket) {
    connectSocket(userId);
  }
}

export default socket;
