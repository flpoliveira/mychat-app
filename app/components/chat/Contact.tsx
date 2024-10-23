import { UserType } from "@/context/chat.interface";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { PlaceholderImage } from "../PlaceholderImage";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Dimensions, StyleSheet } from "react-native";

function Contact({ user, isFromMe }: { user: UserType; isFromMe: boolean }) {
  const color = useThemeColor({}, "secondaryText");
  const borderColor = useThemeColor({}, "border");
  const lastMessage = user?.lastMessage;
  const status = user?.connected ? "online" : "offline";

  const messageContent = lastMessage?.content
    ? `${lastMessage.content}`
    : lastMessage?.imgUrl
    ? isFromMe
      ? "You sent a picture"
      : "Sent you a picture"
    : "No messages";

  return (
    <ThemedView style={styles.container}>
      <ThemedView>
        <PlaceholderImage
          source={{ uri: user.imgUrl }}
          width={50}
          height={50}
          style={{ borderRadius: 50 }}
        />
      </ThemedView>
      <ThemedView
        style={[
          styles.rightContainer,
          {
            borderBottomColor: borderColor,
          },
        ]}
      >
        <ThemedView style={styles.firstRow}>
          <ThemedText type="defaultSemiBold">{user.username}</ThemedText>

          <ThemedText type="default" style={{ color }}>
            {status}
          </ThemedText>
        </ThemedView>

        <ThemedText
          numberOfLines={1}
          style={{
            color,
            minHeight: 24,
            maxWidth: "80%",
            width: Dimensions.get("window").width - 100,
          }}
        >
          {messageContent}
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  rightContainer: {
    borderBottomWidth: 1,
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    gap: 4,
    paddingVertical: 8,
  },
  firstRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export { Contact };
