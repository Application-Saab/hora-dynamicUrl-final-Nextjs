import { io } from "socket.io-client";

let socket;

if (typeof window !== "undefined") {
  socket = io("http://localhost:5000", {
    transports: ["websocket"],
    query: {
      userId: "68849ffc1651b3b2e77f00c3"
    }
  });
}

export default socket;