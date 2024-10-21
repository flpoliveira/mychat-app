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
import { PrimaryBackground } from "../PrimaryBackground";
import { Ionicons } from "@expo/vector-icons";
import { CameraButton } from "./CameraButton";

function ImagePreview({
  image,
  onClose,
  onConfirm,
  caption,
  onChangeCaption,
}: {
  image: {
    uri: string;
    base64: string;
  };
  onClose: () => void;
  onConfirm: () => void;
  caption: string;
  onChangeCaption: (caption: string) => void;
}) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ position: "relative", flex: 1 }}>
        <Image
          source={{ uri: image.uri }}
          style={{
            position: "absolute",
            flex: 1,
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
          }}
          resizeMode="contain"
        />
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: "transparent" }}
          behavior={Platform.OS === "ios" ? "padding" : undefined} // Adjust for different platforms
          keyboardVerticalOffset={Platform.OS === "ios" ? 40 : 0}
        >
          <View
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              height: "100%",
            }}
          >
            <View style={styles.cameraPreviewHeader}>
              <CameraButton onPress={() => onClose()}>
                <Ionicons name="close" size={24} color="white" />
              </CameraButton>
            </View>
            <View style={styles.cameraPreviewFooter}>
              <View style={styles.captionContainer}>
                <TextInput
                  placeholder="Add a caption..."
                  placeholderTextColor="white"
                  value={caption}
                  onChangeText={onChangeCaption}
                  style={{
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    flex: 1,
                    fontSize: 14,
                    padding: 12,
                    borderRadius: 8,
                  }}
                />
              </View>
              <View
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={styles.cameraPreviewDestination}>
                  <Text style={{ color: "white", fontSize: 14 }}>John Doe</Text>
                </View>
                <TouchableOpacity onPress={() => onConfirm()}>
                  <PrimaryBackground style={styles.button}>
                    <Ionicons name="send" size={24} color="white" />
                  </PrimaryBackground>
                </TouchableOpacity>
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
    flex: 1,
    justifyContent: "center",
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 32,
    alignItems: "center",
  },
  button: {
    backgroundColor: "#333230",
    borderRadius: 99,
    padding: 8,
    maxHeight: 56,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  takePictureButton: {
    backgroundColor: "white",
    borderRadius: 99,
    padding: 2,
  },
  takePictureCircle: {
    backgroundColor: "white",
    borderRadius: 99,
    minHeight: 64,
    minWidth: 64,
    borderColor: "black",
    borderWidth: 2,
  },
  cameraPreviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 32,
    // position: "absolute",
    top: 0,
    left: 0,
  },
  cameraPreviewFooter: {
    flexDirection: "column",
    justifyContent: "center",
    gap: 8,
    padding: 32,
    // position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
  },
  captionContainer: {
    display: "flex",
    flexDirection: "row",
    gap: 8,
  },
  cameraPreviewDestination: {
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 8,
    borderRadius: 8,
  },
});

export { ImagePreview };
