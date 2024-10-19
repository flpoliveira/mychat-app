import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<{
  socket: Socket | null;
  session: { id: string; username: string } | null;
  handleChangeSession: (value: { id: string; username: string }) => void;
} | null>(null);

const socketEndpoint = "http://localhost:3000";

const storeSession = async (value: { id: string; username: string }) => {
  try {
    await AsyncStorage.setItem("my-key", JSON.stringify(value));
  } catch (e) {
    // saving error
  }
};

const getSession = async () => {
  try {
    const value = await AsyncStorage.getItem("my-key");
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    // error reading value
  }
};

const SocketProvider = ({ children }: { children: React.ReactElement }) => {
  const [connection, setConnection] = useState(false);

  const [session, setSession] = useState<{
    id: string;
    username: string;
  } | null>(null);

  useEffect(() => {
    getSession().then((value) => {
      if (value) {
        setSession(value);
      }
    });
  }, []);

  const handleChangeSession = useCallback(
    async (value: { id: string; username: string }) => {
      setSession(value);
      await storeSession(value);
    },
    []
  );

  const socket = useRef<Socket | null>(null);

  useEffect(() => {
    socket.current = io(socketEndpoint, {
      transports: ["websocket"],
    });

    socket.current.io.on("open", () => setConnection(true));
    socket.current.io.on("close", () => setConnection(false));

    return () => {
      socket.current?.disconnect();
      socket.current?.removeAllListeners();
    };
  }, []);

  return (
    <SocketContext.Provider
      value={{ socket: socket.current, session, handleChangeSession }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContext, SocketProvider };
