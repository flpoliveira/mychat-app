import {
  findSession,
  saveSession,
  findMessagesForUser,
  findAllSessions,
  saveMessage,
} from "./db.js";
import { v4 as uuidv4 } from "uuid";
import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:8080",
  },
});

const randomId = () => uuidv4();

io.use(async (socket, next) => {
  const userID = socket.handshake.auth.userID;
  if (userID) {
    const session = await findSession(userID);
    if (session) {
      socket.userID = session.userID;
      socket.username = session.username;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.userID = randomId();
  socket.username = username;
  next();
});

io.on("connection", async (socket) => {
  if (!socket.userID) {
    return;
  }
  // persist session
  saveSession({
    userID: socket.userID,
    username: socket.username,
    connected: true,
    last_connected: new Date().toISOString(),
  });

  console.log("user connected", socket.userID, socket.username);
  // emit session details
  socket.emit("session", {
    userID: socket.userID,
    username: socket.username,
  });

  // join the "userID" room
  socket.join(socket.userID);

  // fetch existing users
  const users = [];
  const messagesPerUser = new Map();
  (await findMessagesForUser(socket.userID)).forEach((message) => {
    const { from, to } = message;
    const otherUser = socket.userID === from ? to : from;
    if (messagesPerUser.has(otherUser)) {
      messagesPerUser.get(otherUser).push(message);
    } else {
      messagesPerUser.set(otherUser, [message]);
    }
  });
  (await findAllSessions()).forEach((session) => {
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected,
      messages: messagesPerUser.get(session.userID) || [],
    });
  });
  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    connected: true,
    messages: [],
  });

  // forward the private message to the right recipient (and to other tabs of the sender)
  socket.on("private message", ({ content, to }) => {
    const message = {
      content,
      from: socket.userID,
      to,
    };
    socket.to(to).to(socket.userID).emit("private message", message);
    saveMessage(message);
  });

  // notify users upon disconnection
  socket.on("disconnect", async () => {
    const matchingSockets = await io.in(socket.userID).allSockets();
    const isDisconnected = matchingSockets.size === 0;
    if (isDisconnected) {
      // notify other users
      socket.broadcast.emit("user disconnected", socket.userID);
      console.log("user disconnected", socket.userID);
      // update the connection status of the session
      saveSession({
        userID: socket.userID,
        username: socket.username,
        connected: false,
        last_connected: new Date().toISOString(),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
