import {
  findSession,
  saveSession,
  findMessage,
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
    lastActive: new Date().toISOString(),
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
      lastActive: session.lastActive,
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
  socket.on("private message", ({ content, to, imgUrl }) => {
    console.log("private message", { content, from: socket.userID, to });
    const message = {
      id: randomId(),
      timestamp: new Date().toISOString(),
      content,
      from: socket.userID,
      liked: false,
      to,
      imgUrl,
    };
    socket.to(to).to(socket.userID).emit("private message", message);
    // send also for the receiver update the id
    socket.emit("private message", message);
    saveMessage(message);
  });

  socket.on("like message", async ({ id }) => {
    console.log("like message", { id, from: socket.userID });
    const message = await findMessage(id);
    if (message.to === socket.userID) {
      message.liked = !message.liked;
      socket.to(message.from).emit("like message", message);
      saveMessage(message);
    }
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
        lastActive: new Date().toISOString(),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () =>
  console.log(`server listening at http://localhost:${PORT}`)
);
