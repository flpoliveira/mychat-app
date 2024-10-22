import { ChatHeader } from "@/components/chat/ChatHeader";
import { ThemedText } from "@/components/ThemedText";
import { useChat } from "@/context/chat";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView, StyleSheet, Image, View, Text } from "react-native";

export default function FocusedImage() {
  const { messageId } = useLocalSearchParams();
  const { selectedUser, findMessage } = useChat();
  const backgroundColor = useThemeColor({}, "background");

  const message = findMessage(messageId as string);
  const from =
    message?.from === selectedUser?.userID ? selectedUser?.username : "You";
  const imgUrl = message?.imgUrl || "";
  const caption = message?.content;
  const timestamp = message?.timestamp;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <Stack.Screen
        options={{
          title: "Image",
          headerBackTitleVisible: false,
          headerStyle: {
            backgroundColor,
          },
          // header: () => <ChatHeader user={selectedUser} />,
        }}
      />

      <Image source={{ uri: imgUrl }} style={styles.image} resizeMode="fill" />
      <View style={styles.container}>
        <View style={styles.footer}>
          {caption && <Text style={styles.captionText}>{caption}</Text>}

          <View style={styles.legendContainer}>
            <ThemedText style={styles.legendText}>
              Sent by {from} at {new Date(timestamp || "").toDateString()}
            </ThemedText>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  image: {
    position: "absolute",
    flex: 1,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: "100%",
  },
  footer: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 8,
    padding: 32,
    bottom: 0,
    left: 0,
    width: "100%",
  },
  captionText: {
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    fontSize: 14,
    padding: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  legendContainer: {
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 8,
  },
  legendText: {
    color: "white",
  },
});
