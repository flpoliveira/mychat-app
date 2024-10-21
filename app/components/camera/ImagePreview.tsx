import { LinearGradient } from "expo-linear-gradient";
import {
  Button,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CameraButton } from "./CameraButton";
import { IconButton } from "../IconButton";

function ImagePreview({
  image,
  onClose,
  onConfirm,
  caption,
  onChangeCaption,
  destination,
}: {
  image: {
    uri: string;
    base64: string;
  };
  onClose: () => void;
  onConfirm: () => void;
  caption: string;
  onChangeCaption: (caption: string) => void;
  destination: string;
}) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ position: "relative", flex: 1 }}>
        <Image
          source={{ uri: image.uri }}
          style={styles.image}
          resizeMode="contain"
        />
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: "transparent" }}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <View style={styles.container}>
            <View style={styles.header}>
              <CameraButton onPress={() => onClose()}>
                <Ionicons name="close" size={24} color="white" />
              </CameraButton>
            </View>
            <View style={styles.footer}>
              <View style={styles.captionContainer}>
                <TextInput
                  placeholder="Add a caption..."
                  placeholderTextColor="white"
                  value={caption}
                  onChangeText={onChangeCaption}
                  style={styles.captionInput}
                />
              </View>
              <View style={styles.buttonContainer}>
                <View style={styles.destination}>
                  <Text style={styles.destinationText}>{destination}</Text>
                </View>
                <IconButton onPress={() => onConfirm()}>
                  <Ionicons name="send" size={24} color="white" />
                </IconButton>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
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
  captionInput: {
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    flex: 1,
    fontSize: 14,
    padding: 12,
    borderRadius: 8,
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

export { ImagePreview };
