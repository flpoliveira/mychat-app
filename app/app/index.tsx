import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  FlatList,
  TextInput,
  View,
} from "react-native";
import React, { useRef } from "react";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { clearStorage, UserMessageType, useSocket } from "@/context/socket";
import { ChatConnect } from "@/components/ChatConnect";
import { useMemo, useState } from "react";
import { TapGestureHandler } from "react-native-gesture-handler";
import { DoubleTapLike } from "@/components/DoubleTapLike";
import { Link } from "expo-router";

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");

  const { session, users, socket, updateMessage } = useSocket();

  const otherUsers = useMemo(() => {
    return users.filter((u) => u.userID !== session?.userID);
  }, [users]);

  const [selectedUserID, setSelectedUserID] = useState("");
  const messagesFromSelectedUser = useMemo(() => {
    return (
      otherUsers.find((u) => u.userID === selectedUserID)?.messages || []
    ).sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    );
  }, [selectedUserID, otherUsers]);
  const [message, setMessage] = useState("");

  const sendMessage = () => {
    console.log("Sending message", message, "to", selectedUserID);
    if (socket.current && selectedUserID && session?.username) {
      socket.current.emit("private message", {
        to: selectedUserID,
        content: message,
      });
      setMessage("");
    }
  };

  const likeMessage = (message: UserMessageType) => {
    if (socket.current && session?.username && message.to === session.userID) {
      socket.current.emit("like message", { id: message.id });
      updateMessage({ ...message, liked: !message.liked });
    }
  };

  const doubleTapRef = useRef();

  return (
    <SafeAreaView
      style={{
        backgroundColor,
        flex: 1,
      }}
    >
      {!!session ? (
        <ThemedView style={{ flex: 1 }}>
          {otherUsers.length > 0 && (
            <FlatList
              data={otherUsers}
              keyExtractor={(item) => item.userID}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => setSelectedUserID(item.userID)}
                >
                  <ThemedText>{item.username}</ThemedText>
                </TouchableOpacity>
              )}
            />
          )}
          {messagesFromSelectedUser.length > 0 && (
            <FlatList
              data={messagesFromSelectedUser}
              keyExtractor={(item) => `${item.timestamp}-${item.from}`}
              renderItem={({ item }) => (
                <DoubleTapLike onDoubleTap={() => likeMessage(item)}>
                  <ThemedView>
                    <ThemedText>
                      {item.from}: {item.content}
                    </ThemedText>
                    {item.liked && <ThemedText>❤️</ThemedText>}
                  </ThemedView>
                </DoubleTapLike>
              )}
            />
          )}
          {selectedUserID && (
            <ThemedView>
              <ThemedText>Send a message</ThemedText>
              <TextInput value={message} onChangeText={setMessage} />
              <TouchableOpacity onPress={() => sendMessage()}>
                <ThemedText>Send</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          )}

          <Link href="/camera">
            <ThemedText>Go to Camera</ThemedText>
          </Link>
          <TouchableOpacity onPress={() => clearStorage()}>
            <ThemedText>Disconnect</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      ) : (
        <ChatConnect />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
