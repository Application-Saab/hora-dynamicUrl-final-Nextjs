import { io } from "socket.io-client";
import { BASE_URL } from "./utils/apiconstants";

let socket;

if (typeof window !== "undefined") {
  const userId = new URLSearchParams(window.location.search).get("id") || localStorage.getItem("userID");
  socket = io(BASE_URL, {
    transports: ["websocket", "polling"],
    query: { userId }
  });
}

export default socket;
