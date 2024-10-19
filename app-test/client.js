import { io } from "socket.io-client";

const URL = "http://localhost:3000";
const socket = io(URL, { autoConnect: false });

const username = process.env.USER_NAME;

if (!username) {
  throw new Error("missing USER_NAME");
}

socket.onAny((event, ...args) => {
  console.log(event, args);
});

socket.auth = { username };
socket.connect();

socket.on("connect_error", (err) => {
  if (err.message === "invalid username") {
    console.log("invalid username, disconnecting...");
  }
});
