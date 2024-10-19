import { useSocket } from "@/context/socket";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useMemo, useState } from "react";
import { TextInput, TouchableOpacity } from "react-native";

function ChatConnect() {
  const { socket, session, connect } = useSocket();

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const confirm = () => {
    setLoading(true);
    if (socket?.current && username) {
      console.log("Connecting with username", username);
      connect(username);
    } else {
      setLoading(false);
      console.log("Socket not available");
    }
  };

  console.log("Session: ", session);

  return (
    <ThemedView>
      <ThemedText>You dont see to have connected to the chat</ThemedText>
      <TextInput value={username} onChangeText={setUsername} />
      <TouchableOpacity onPress={confirm} disabled={loading}>
        <ThemedText>Connect</ThemedText>
      </TouchableOpacity>
      {loading && <ThemedText>Loading...</ThemedText>}
    </ThemedView>
  );
}

export { ChatConnect };
