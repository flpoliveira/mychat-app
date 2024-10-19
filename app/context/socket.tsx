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

const SocketContext = createContext<{
  socket: MutableRefObject<Socket | null>;
  session: SessionType | null;
  handleChangeSession: (value: SessionType) => void;
  connect: (username: string, userID?: string) => void;
} | null>(null);

const socketEndpoint = "http://localhost:3000";

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

    socketRef.current = socket;

    return () => {
      socket?.disconnect();
      socket?.removeAllListeners();
    };
  }, [handleChangeSession]);

  const connect = useCallback((username: string, userID?: string) => {
    if (socketRef.current && username) {
      socketRef.current.auth = { username, userID };
      socketRef.current.connect();
    } else {
      console.log("Socket not available");
    }
  }, []);

  useEffect(() => {
    if (!connection && !!session && session.username && session.userID) {
      connect(session.username, session.userID);
    }
  }, [connection, connect, session]);

  return (
    <SocketContext.Provider
      value={{ socket: socketRef, session, handleChangeSession, connect }}
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

export { SocketContext, SocketProvider, useSocket, clearStorage };
