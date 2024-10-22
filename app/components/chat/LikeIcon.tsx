import { Ionicons } from "@expo/vector-icons";
import { View } from "react-native";

function LikeIcon({ isSelf }: { isSelf: boolean }) {
  return (
    <View
      style={{
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "flex-start",
        backgroundColor: "rgba(0, 0, 0, 0.1)",
        padding: 4,
        borderRadius: 99,
      }}
    >
      <Ionicons name="heart" size={16} color="red" />
    </View>
  );
}

export { LikeIcon };
