import { Ionicons } from "@expo/vector-icons";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { ReactElement, useRef, useState } from "react";
import {
  Button,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

function CameraButton({
  children,
  onPress,
}: {
  children: ReactElement;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      {children}
    </TouchableOpacity>
  );
}

function TakePictureButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.takePictureButton} onPress={onPress}>
      <View style={styles.takePictureCircle} />
    </TouchableOpacity>
  );
}

function ImagePreview({ uri, onClose }: { uri: string; onClose: () => void }) {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ position: "relative", flex: 1 }}>
        <Image
          source={{ uri }}
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
                <TouchableOpacity onPress={() => null}>
                  <LinearGradient
                    // Corresponding to your CSS linear gradient
                    colors={["#696EFF", "#ee76f9", "#F158FF"]}
                    start={{ x: 0.5, y: 0.0 }} // Adjusts the starting point for the gradient
                    end={{ x: 0.0, y: 1 }} // Adjusts the ending point for the gradient
                    style={styles.button}
                  >
                    <Ionicons name="send" size={24} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </TouchableWithoutFeedback>
  );
}

function CameraScreen() {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<"on" | "off">("off");
  const cameraRef = useRef<CameraView>(null);

  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const takePicture = async () => {
    if (cameraRef.current && !loading) {
      setLoading(true);
      try {
        const picture = await cameraRef.current.takePictureAsync();
        setImage(picture?.uri || null);
      } catch (error) {
        console.error("Failed to take picture", error);
      }
      setLoading(false);
    }
  };

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
      {image ? (
        <ImagePreview uri={image} onClose={() => setImage(null)} />
      ) : (
        <View style={styles.container}>
          <CameraView
            style={styles.camera}
            facing={facing}
            flash={flash}
            ref={cameraRef}
          >
            <View style={styles.buttonContainer}>
              <CameraButton onPress={() => null}>
                <Ionicons name="close" size={24} color="white" />
              </CameraButton>
              <CameraButton
                onPress={() =>
                  setFlash((prev) => (prev === "on" ? "off" : "on"))
                }
              >
                {flash === "on" ? (
                  <Ionicons name="flash" size={24} color="#FDB837" />
                ) : (
                  <Ionicons name="flash-off" size={24} color="white" />
                )}
              </CameraButton>
            </View>
            <View style={styles.buttonContainer}>
              <CameraButton onPress={() => null}>
                <Ionicons name="image" size={24} color="white" />
              </CameraButton>
              <TakePictureButton onPress={() => takePicture()} />
              <CameraButton onPress={toggleCameraFacing}>
                <Ionicons name="camera-reverse" size={24} color="white" />
              </CameraButton>
            </View>
          </CameraView>
        </View>
      )}
    </SafeAreaView>
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

export default CameraScreen;
