import { ThemedView } from "../ThemedView";
import { IconButton } from "../IconButton";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet } from "react-native";
import { AutoExpandableTextInput } from "../AutoExpandableTextInput";
import { useThemeColor } from "@/hooks/useThemeColor";

function ChatInput({
  value,
  onChange,
  userID,
  onSend,
}: {
  value: string;
  onChange: (value: string) => void;
  userID: string;
  onSend: () => void;
}) {
  const router = useRouter();
  const showCamera = value === "";

  const color = useThemeColor({}, "text");

  return (
    <ThemedView style={styles.container}>
      <AutoExpandableTextInput
        value={value}
        onChangeText={onChange}
        style={styles.input}
        placeholder="Type a message..."
      />
      {showCamera ? (
        <TouchableOpacity
          onPress={() => {
            router.push(`/camera/${userID}`);
          }}
          style={styles.button}
        >
          <Ionicons name="camera" size={24} color={color} />
        </TouchableOpacity>
      ) : (
        <IconButton onPress={onSend}>
          <Ionicons name="send" size={24} color="white" />
        </IconButton>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 99,
    padding: 8,
    maxHeight: 56,
  },
  input: {
    fontSize: 14,
    padding: 12,
    borderRadius: 8,
    flexGrow: 1,
    flexShrink: 1,
  },
  container: {
    display: "flex",
    flexDirection: "row",
    padding: 8,
    gap: 8,
  },
});

export { ChatInput };
