import { ThemedText } from "@/components/ThemedText";
import { useSocket } from "@/context/socket";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
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

  const { sendMessage: socketSendMessage } = useSocket();
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    console.log("Sending message", message, "to", userId);
    if (userId) {
      socketSendMessage({
        to: userId as string,
        content: message,
      });
      setMessage("");
    }
  };

  return (
    <SafeAreaView>
      <Stack.Screen
        options={{
          title: `Chat with user ${userId}`,
          headerBackTitleVisible: false,
        }}
      />
      <View>
        <TextInput value={message} onChangeText={(e) => setMessage(e)} />
        <TouchableOpacity onPress={() => sendMessage()}>
          <ThemedText>Send</ThemedText>
        </TouchableOpacity>
        <Link href={`/camera/${userId}`}>
          <ThemedText>Go to camera</ThemedText>
        </Link>
      </View>
    </SafeAreaView>
  );
}
