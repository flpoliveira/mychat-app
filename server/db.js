import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import { v4 as uuidv4 } from "uuid";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// db.json file path
export const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "db.json");

// Configure lowdb to write data to JSON file
const adapter = new JSONFile(file);
const defaultData = { messages: [], sessions: [] };
const db = new Low(adapter, defaultData);

export const getCollection = async (collection) => {
  await db.read();
  return db.data[collection];
};

export const addItemToCollection = async (item, collection) => {
  const id = uuidv4();
  const newItem = { ...item, id };
  db.data[collection].push(newItem);
  await db.write();
  return newItem;
};

export const getAllMessages = async (from, to) => {
  await db.read();
  return db.data.messages.filter(
    (message) => message.from === from && message.to === to
  );
};

export const findSession = async (userID) => {
  await db.read();
  return db.data.sessions.find((session) => session.userID === userID);
};

export const saveSession = async (session) => {
  if (!session.userID) {
    throw new Error("userID is required");
  }

  await db.read();

  if (!db.data.sessions.find((s) => s.userID === session.userID)) {
    db.data.sessions.push(session);
  } else {
    db.data.sessions = db.data.sessions.map((s) => {
      if (s.userID === session.userID) {
        s = session;
      }
      return s;
    });
  }
  await db.write();
};

export const findLastMessageForUser = async (userA, userB) => {
  await db.read();
  return db.data.messages
    .filter(
      (message) =>
        (message.from === userA && message.to === userB) ||
        (message.to === userA && message.from === userB)
    )
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];
};

export const findMessagesForUser = async (userA, userB) => {
  await db.read();
  return db.data.messages.filter(
    (message) =>
      (message.from === userA && message.to === userB) ||
      (message.to === userA && message.from === userB)
  );
};

export const findMessage = async (id) => {
  await db.read();
  return db.data.messages.find((message) => message.id === id);
};

export const findAllSessions = async () => {
  await db.read();
  return db.data.sessions;
};

export const saveMessage = async (message) => {
  await db.read();

  if (!message.from || !message.to) {
    throw new Error("from, to, and content are required");
  }

  if (db.data.messages.find((m) => m.id === message.id)) {
    db.data.messages = db.data.messages.map((m) => {
      if (m.id === message.id) {
        m = message;
      }
      return m;
    });
  } else {
    db.data.messages.push(message);
  }
  await db.write();
};
