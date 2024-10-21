import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

type SessionType = {
  username: string;
  userID: string;
};

type UserMessageType = {
  id?: string;
  timestamp: string;
  content: string;
  from: string;
  to: string;
  liked?: boolean;
};

type UserType = {
  userID: string;
  username: string;
  connected: boolean;
  last_connected?: string;
  img_url?: string;
  messages?: Array<UserMessageType>;
};

const SocketContext = createContext<{
  socket: MutableRefObject<Socket | null>;
  session: SessionType | null;
  handleChangeSession: (value: SessionType) => void;
  connect: (username: string, userID?: string) => void;
  users: Array<UserType>;
  updateMessage: (message: Partial<UserMessageType>) => void;
  sendMessage: (message: {
    to: string;
    content: string;
    imgUrl?: string;
  }) => void;
} | null>(null);

const socketEndpoint = "http://192.168.0.4:3000";

const storeSession = async (value: SessionType) => {
  try {
    await AsyncStorage.setItem("session", JSON.stringify(value));
  } catch (e) {
    // saving error
  }
};

const getSession = async () => {
  try {
    const value = await AsyncStorage.getItem("session");
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    // error reading value
  }
};

const clearStorage = async () => {
  try {
    await AsyncStorage.removeItem("session");
  } catch (e) {
    // error reading value
  }
};

const SocketProvider = ({ children }: { children: React.ReactElement }) => {
  const [connection, setConnection] = useState(false);

  const [session, setSession] = useState<SessionType | null>(null);
  const [users, setUsers] = useState<Array<UserType>>([]);

  const addMessage = useCallback((message: UserMessageType) => {
    setUsers((prev) => {
      const newUsers = prev.map((user) => {
        if (user.userID === message.from || user.userID === message.to) {
          console.log("Im here!");
          return {
            ...user,
            hasNewMessage: true,
            messages: [...(user.messages || []), message],
          };
        }
        return user;
      });
      return newUsers;
    });
  }, []);

  const updateMessage = useCallback((message: Partial<UserMessageType>) => {
    setUsers((prev) => {
      const newUsers = prev.map((user) => {
        if (user.userID === message.from || user.userID === message.to) {
          return {
            ...user,
            messages: user.messages?.map((msg) => {
              if (msg.id === message.id) {
                return { ...msg, ...message };
              }
              return msg;
            }),
          };
        }
        return user;
      });
      return newUsers;
    });
  }, []);

  useEffect(() => {
    getSession().then((value) => {
      if (value) {
        setSession(value);
      }
    });
  }, []);

  const handleChangeSession = useCallback(async (value: SessionType) => {
    console.log("Setting session", value);
    setSession(value);
    await storeSession(value);
  }, []);

  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io(socketEndpoint, {
      transports: ["websocket"],
      autoConnect: false,
    });

    socket.onAny((event, ...args) => {
      console.log("On Any");
      console.log(event, args);
    });

    socket.on("session", ({ userID, username }) => {
      console.log("Received session", { userID, username });
      if (userID && username) {
        socket.auth = { userID, username };
        handleChangeSession({ userID, username });
      }
    });

    socket.on("users", (users) => {
      setUsers(users);
    });

    socket.on("private message", (message: UserMessageType) => {
      console.log("Received message", message);
      addMessage(message);
    });

    socket.on("like message", (message: UserMessageType) => {
      console.log("Received like message", message);
      updateMessage(message);
    });

    socketRef.current = socket;

    return () => {
      socket?.disconnect();
      socket?.removeAllListeners();
    };
  }, [handleChangeSession, addMessage, updateMessage]);

  const sendMessage = useCallback(
    (message: { to: string; content: string; imgUrl?: string }) => {
      console.log(
        "Sending message...",
        !!socketRef.current,
        message.to,
        session?.username
      );
      if (socketRef.current && message?.to && session?.username) {
        socketRef.current.emit("private message", {
          to: message.to,
          content: message.content,
          imgUrl: message.imgUrl,
        });
      }
    },
    []
  );

  const connect = useCallback((username: string, userID?: string) => {
    if (socketRef.current && username) {
      socketRef.current.auth = { username, userID };
      socketRef.current.connect();
    } else {
      console.log("Socket not available");
    }
  }, []);

  /**
   * Handle connection stored session
   */
  useEffect(() => {
    if (!connection && !!session && session.username && session.userID) {
      connect(session.username, session.userID);
    }
  }, [connection, connect, session]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef,
        session,
        handleChangeSession,
        connect,
        users,
        updateMessage,
        sendMessage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export {
  SocketContext,
  SocketProvider,
  useSocket,
  clearStorage,
  UserMessageType,
};
