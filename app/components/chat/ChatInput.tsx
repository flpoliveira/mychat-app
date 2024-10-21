import { TextInput } from "react-native-gesture-handler";
import { ThemedView } from "../ThemedView";
import { IconButton } from "../IconButton";
import { Link, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, StyleSheet } from "react-native";
import { AutoExpandableTextInput } from "../AutoExpandableTextInput";

function ChatInput({
  value,
  onChange,
  userId,
  onSend,
}: {
  value: string;
  onChange: (value: string) => void;
  userId: string;
  onSend: () => void;
}) {
  const router = useRouter();
  const showCamera = value === "";

  return (
    <ThemedView
      style={{
        display: "flex",
        flexDirection: "row",
        padding: 8,
        backgroundColor: "blue",
        gap: 8,
      }}
    >
      <AutoExpandableTextInput
        value={value}
        onChangeText={onChange}
        style={{
          color: "white",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          fontSize: 14,
          padding: 12,
          borderRadius: 8,
          flexGrow: 1,
          flexShrink: 1,
        }}
      />
      {showCamera ? (
        <TouchableOpacity
          onPress={() => {
            router.push(`/camera/${userId}`);
          }}
          style={styles.button}
        >
          <Ionicons name="camera" size={24} color="white" />
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
});

export { ChatInput };
