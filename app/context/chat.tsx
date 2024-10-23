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
import { SessionType, UserMessageType, UserType } from "./chat.interface";
import getSession from "@/helpers/getSession";
import storeSession from "@/helpers/storeSession";
import { buildMessagesPerDay } from "@/helpers/buildMessagesPerDay";

const SocketContext = createContext<{
  socket: MutableRefObject<Socket | null>;
  session: SessionType | null;
  handleChangeSession: (value: SessionType) => void;
  connect: (username: string, userID?: string) => void;
  allUsers: Array<UserType>;
  updateStoreMessage: (message: Partial<UserMessageType>) => void;
} | null>(null);

const ChatContext = createContext<{
  messages: Array<
    {
      type?: "date";
    } & UserMessageType
  >;
  sendMessage: (message: { content: string; imgUrl?: string }) => void;
  likeMessage: (message: UserMessageType) => void;
  selectedUser: UserType | null;
  setSelectedUserID: (id: string) => void;
  users: Array<UserType>;
  findMessage: (id?: string) => UserMessageType | undefined;
} | null>(null);

const socketEndpoint = "http://192.168.0.4:3000";

const SocketProvider = ({ children }: { children: React.ReactElement }) => {
  const [connection, setConnection] = useState(false);

  const [session, setSession] = useState<SessionType | null>(null);
  const [allUsers, setAllUsers] = useState<Array<UserType>>([]);
  const [selectedUserID, setSelectedUserID] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);

  const selectedUser = useMemo(() => {
    if (!selectedUserID) {
      return null;
    }

    return allUsers.find((u) => u.userID === selectedUserID) || null;
  }, [selectedUserID, allUsers]);

  const otherUsers = useMemo(() => {
    return allUsers.filter((u) => u.userID !== session?.userID);
  }, [allUsers]);

  const messages = useMemo(() => {
    if (!selectedUser) {
      return [];
    }

    return buildMessagesPerDay(selectedUser.messages || []);
  }, [selectedUser]);

  const findMessage = useCallback(
    (id?: string) => {
      if (!id) {
        return;
      }

      return allUsers
        .map((u) => u.messages || [])
        .flat()
        .find((m) => m.id === id);
    },
    [allUsers]
  );

  const addStoreMessage = useCallback((message: UserMessageType) => {
    setAllUsers((prev) => {
      const newUsers = prev.map((user) => {
        if (user.userID === message.from || user.userID === message.to) {
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

  const updateStoreMessage = useCallback(
    (message: Partial<UserMessageType>) => {
      setAllUsers((prev) => {
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
    },
    []
  );

  const handleChangeSession = useCallback(async (value: SessionType) => {
    setSession(value);
    await storeSession(value);
  }, []);

  const connect = useCallback((username: string, userID?: string) => {
    if (socketRef.current && username) {
      socketRef.current.auth = { username, userID };
      socketRef.current.connect();
    } else {
      console.log("Socket not available");
    }
  }, []);

  const sendMessage = useCallback(
    (message: { content: string; imgUrl?: string }) => {
      const to = selectedUserID;
      if (socketRef.current && to && session?.username) {
        socketRef.current.emit("private message", {
          to,
          content: message.content,
          imgUrl: message.imgUrl,
        });
      }
    },
    [selectedUserID, session]
  );

  const likeMessage = (message: UserMessageType) => {
    if (
      socketRef.current &&
      session?.username &&
      message.to === session.userID
    ) {
      socketRef.current.emit("like message", { id: message.id });
      updateStoreMessage({ ...message, liked: !message.liked });
    }
  };

  /**
   * Retrieve session from storage
   */
  useEffect(() => {
    getSession().then((value) => {
      if (value) {
        setSession(value);
      }
    });
  }, []);

  /**
   * Handle connection stored session
   */
  useEffect(() => {
    if (!connection && !!session && session.username && session.userID) {
      connect(session.username, session.userID);
      setConnection(true);
    }
  }, [connection, connect, session]);

  /**
   * Handle socket events
   */
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

    socket.on("users", (allUsers) => {
      setAllUsers(allUsers);
    });

    socket.on("private message", (message: UserMessageType) => {
      console.log("Received message", message);
      addStoreMessage(message);
    });

    socket.on("like message", (message: UserMessageType) => {
      console.log("Received like message", message);
      updateStoreMessage(message);
    });

    socketRef.current = socket;

    return () => {
      socket?.disconnect();
      socket?.removeAllListeners();
    };
  }, [handleChangeSession, addStoreMessage, updateStoreMessage]);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef,
        session,
        handleChangeSession,
        connect,
        allUsers,
        updateStoreMessage,
      }}
    >
      <ChatContext.Provider
        value={{
          messages,
          sendMessage,
          likeMessage,
          selectedUser,
          setSelectedUserID,
          users: otherUsers,
          findMessage,
        }}
      >
        {children}
      </ChatContext.Provider>
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

const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a SocketProvider");
  }
  return context;
};

export { SocketContext, SocketProvider, useSocket, useChat };
