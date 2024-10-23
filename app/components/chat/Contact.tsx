import { UserType } from "@/context/chat.interface";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { PlaceholderImage } from "../PlaceholderImage";
import { useThemeColor } from "@/hooks/useThemeColor";
import { StyleSheet } from "react-native";
import { first } from "lodash";

function Contact({ user }: { user: UserType }) {
  const color = useThemeColor({}, "secondaryText");
  const lastMessage = user?.lastMessage;
  const status = user?.connected ? "online" : "offline";

  const messageContent = lastMessage?.content
    ? `${lastMessage.content}`
    : lastMessage?.imgUrl
    ? "Sent you a picture"
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
      <ThemedView style={styles.rightContainer}>
        <ThemedView style={styles.firstRow}>
          <ThemedText type="defaultSemiBold">{user.username}</ThemedText>

          <ThemedText type="default" style={{ color }}>
            {status}
          </ThemedText>
        </ThemedView>

        <ThemedText numberOfLines={1} style={{ color, minHeight: 24 }}>
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
    borderColor: "rgba(0,0,0,0.1)",
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
