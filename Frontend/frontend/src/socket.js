import { io } from "socket.io-client";

const socket = io("http://localhost:5000", {
  transports: ["websocket"],     // 🔥 force stable connection
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;/*import.meta.env.VITE_SOCKET_URL*/