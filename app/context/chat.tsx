import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";
import {
  SessionType,
  UserMessageType,
  UserType,
  SocketContextType,
  ChatContextType,
} from "./chat.interface";
import getSession from "@/helpers/getSession";
import storeSession from "@/helpers/storeSession";
import { buildMessagesWithDays } from "../helpers/buildMessagesWithDays";
import { SOCKET_ENDPOINT } from "./chat.config";

const SocketContext = createContext<SocketContextType | null>(null);

const ChatContext = createContext<ChatContextType | null>(null);

const SocketProvider = ({ children }: { children: React.ReactElement }) => {
  const [connection, setConnection] = useState(false);

  const [session, setSession] = useState<SessionType | null>(null);
  const [allUsers, setAllUsers] = useState<Array<UserType>>([]);
  const [selectedUserID, setSelectedUserID] = useState<string | null>(null);

  const [loadingPrivateMessages, setLoadingPrivateMessages] = useState(false);

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

  const [messages, setMessages] = useState<UserMessageType[]>([]);
  const messagesWithDays = useMemo(
    () => buildMessagesWithDays(messages),
    [messages, loadingPrivateMessages]
  );

  const findMessage = useCallback(
    (id?: string) => {
      if (!id) {
        return;
      }

      return messages.find((m) => m.id === id);
    },
    [messages]
  );

  const addStoreMessage = useCallback((message: UserMessageType) => {
    setAllUsers((prev) => {
      return prev.map((u) => {
        if (u.userID === message.from || u.userID === message.to) {
          return {
            ...u,
            lastMessage: message,
          };
        }
        return u;
      });
    });
    setMessages((prev) => [...prev, message]);
  }, []);

  const updateStoreMessage = useCallback(
    (message: Partial<UserMessageType>) => {
      setMessages((prev) => {
        const newMessages = prev.map((msg) => {
          if (msg.id === message.id) {
            return { ...msg, ...message };
          }
          return msg;
        });
        return newMessages;
      });
    },
    []
  );

  const handleChangeSession = useCallback(async (value: SessionType) => {
    setSession(value);
    await storeSession(value);
  }, []);

  const connect = useCallback(
    (username: string, randomAvatarUrl?: string | null, userID?: string) => {
      if (socketRef.current && username) {
        socketRef.current.auth = { username, userID, imgUrl: randomAvatarUrl };
        socketRef.current.connect();
      } else {
        console.log("Socket not available");
      }
    },
    []
  );

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

  const connectPrivateChat = useCallback(
    (to: string) => {
      if (socketRef.current && session?.username) {
        socketRef.current.emit("private chat", { to });
        setLoadingPrivateMessages(true);
      }
    },
    [session?.username]
  );

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
      connect(session.username, null, session.userID);
      setConnection(true);
    }
  }, [connection, connect, session]);

  /**
   * Handle socket events
   */
  useEffect(() => {
    const socket = io(SOCKET_ENDPOINT, {
      transports: ["websocket"],
      autoConnect: false,
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

    socket.on("user connected", ({ userID, username, imgUrl }) => {
      setAllUsers((prev) => {
        if (prev.find((u) => u.userID === userID)) {
          return prev;
        }

        return [
          ...prev,
          {
            userID,
            username,
            connected: true,
            imgUrl,
          },
        ];
      });
    });

    socket.on("user disconnected", (userID) => {
      setAllUsers((prev) => {
        return prev.map((u) => {
          if (u.userID === userID) {
            return { ...u, connected: false };
          }
          return u;
        });
      });
    });

    socket.on("private message", (message: UserMessageType) => {
      console.log("Received message", message);
      addStoreMessage(message);
    });

    socket.on("like message", (message: UserMessageType) => {
      console.log("Received like message", message);
      updateStoreMessage(message);
    });

    socket.on("messages", (messages?: UserMessageType[]) => {
      console.log("Received messages", messages);
      setMessages(messages || []);
      setLoadingPrivateMessages(false);
    });

    socketRef.current = socket;

    return () => {
      socket?.disconnect();
      socket?.removeAllListeners();
    };
  }, [handleChangeSession, addStoreMessage, updateStoreMessage]);

  console.log("messagesWithDays", messagesWithDays);

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
          messagesWithDays,
          connectPrivateChat,
          sendMessage,
          likeMessage,
          selectedUser,
          setSelectedUserID,
          users: otherUsers,
          findMessage,
          loadingPrivateMessages,
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
