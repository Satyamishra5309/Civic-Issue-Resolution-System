import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // change after deploy

export default socket;