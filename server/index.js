import {
  findSession,
  saveSession,
  findMessage,
  findMessagesForUser,
  findAllSessions,
  saveMessage,
  findLastMessageForUser,
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
      socket.imgUrl = session.imgUrl;
      return next();
    }
  }
  const username = socket.handshake.auth.username;
  if (!username) {
    return next(new Error("invalid username"));
  }
  socket.userID = randomId();
  socket.username = username;
  socket.imgUrl = socket.handshake.auth.imgUrl;
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
    imgUrl: socket.imgUrl,
    connected: true,
    lastActive: new Date().toISOString(),
  });

  console.log("user connected", socket.userID, socket.username);
  // emit session details
  socket.emit("session", {
    userID: socket.userID,
    username: socket.username,
    imgUrl: socket.imgUrl,
  });

  // join the "userID" room
  socket.join(socket.userID);

  // fetch existing users
  const users = [];
  const allSessions = await findAllSessions();
  for (const session of allSessions) {
    const lastMessage = await findLastMessageForUser(session.userID);
    users.push({
      userID: session.userID,
      username: session.username,
      connected: session.connected,
      lastActive: session.lastActive,
      imgUrl: session.imgUrl,
      lastMessage,
    });
  }
  console.log("users", users);
  socket.emit("users", users);

  // notify existing users
  socket.broadcast.emit("user connected", {
    userID: socket.userID,
    username: socket.username,
    imgUrl: socket.imgUrl,
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

  socket.on("private chat", async ({ to }) => {
    console.log("chat connected", { from: socket.userID, to });
    const messages = await findMessagesForUser(to);
    socket.emit("messages", messages);
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
        imgUrl: socket.imgUrl,
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
