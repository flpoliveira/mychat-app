import { ChatHeader } from "@/components/chat/ChatHeader";
import { ChatInput } from "@/components/chat/ChatInput";
import { ThemedText } from "@/components/ThemedText";
import { useChat, useSocket } from "@/context/chat";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Touchable,
  TouchableOpacity,
} from "react-native";

export default function UserChat() {
  const { userId } = useLocalSearchParams();

  const { sendMessage, setSelectedUserID, selectedUser, messages } = useChat();

  const [message, setMessage] = useState("");

  const handleSendMessage = () => {
    console.log("Sending message", message, "to", userId);
    if (userId) {
      sendMessage({
        content: message,
      });
      setMessage("");
    }
  };

  useEffect(() => {
    setSelectedUserID(userId as string);
  }, [setSelectedUserID]);

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          title: `${selectedUser?.username || "Chat"}`,
          headerBackTitleVisible: false,
          headerTitle: () => <ChatHeader user={selectedUser} />,
        }}
      />
      <View>
        <ChatInput
          value={message}
          onChange={(e) => setMessage(e)}
          userId={userId as string}
          onSend={handleSendMessage}
        />
      </View>
    </SafeAreaView>
  );
}
