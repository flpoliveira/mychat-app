import { UserMessageType } from "@/context/chat.interface";
import { View, StyleSheet, Image, Text } from "react-native";
import { CameraButton } from "../camera/CameraButton";
import { Ionicons } from "@expo/vector-icons";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

function ImageFocus({
  imgUrl,
  onClose,
  from,
  timestamp,
  caption,
}: {
  imgUrl?: string;
  from?: string;
  timestamp?: string;
  onClose: () => void;
  caption?: string;
}) {
  if (!imgUrl) {
    return null;
  }

  return (
    <View style={{ position: "relative", flex: 1 }}>
      <Image
        source={{ uri: imgUrl }}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.container}>
        <View style={styles.footer}>
          {caption && (
            <View style={styles.captionContainer}>
              <Text style={styles.captionText}>{caption}</Text>
            </View>
          )}
          <View style={styles.buttonContainer}>
            <View style={styles.destination}>
              <Text style={styles.destinationText}>
                Sent by {from} at {new Date(timestamp || "").toDateString()}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    height: "100%",
  },
  image: {
    position: "absolute",
    flex: 1,
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  captionContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
  },
  captionText: {
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    fontSize: 14,
    padding: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  button: {
    backgroundColor: "#333230",
    borderRadius: 99,
    padding: 8,
    maxHeight: 56,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 32,
    top: 0,
    left: 0,
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
  destination: {
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 8,
  },
  destinationText: {
    color: "white",
    fontSize: 14,
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    alignItems: "center",
  },
});

export { ImageFocus };
