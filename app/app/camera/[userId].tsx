import { Ionicons } from "@expo/vector-icons";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import { ReactElement, useRef, useState } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useSocket } from "@/context/socket";
import { ImagePreview } from "@/components/camera/ImagePreview";
import { CameraButton } from "@/components/camera/CameraButton";
import { TakePictureButton } from "@/components/camera/TakePictureButton";

function CameraScreen() {
  const router = useRouter();
  const [caption, setCaption] = useState("");
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [flash, setFlash] = useState<"on" | "off">("off");
  const cameraRef = useRef<CameraView>(null);

  const { userId } = useLocalSearchParams();
  const { sendMessage } = useSocket();

  const [image, setImage] = useState<{
    uri: string;
    base64: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const takePicture = async () => {
    if (cameraRef.current && !loading) {
      setLoading(true);
      try {
        const picture = await cameraRef.current.takePictureAsync({
          base64: true,
          quality: 0.5,
          skipProcessing: false,
        });

        if (!picture || !picture.uri || !picture.base64) {
          setLoading(false);
          return;
        }

        setImage({
          uri: picture.uri,
          base64: picture.base64,
        });
      } catch (error) {
        console.error("Failed to take picture", error);
      }
      setLoading(false);
    }
  };

  const onConfirm = async () => {
    if (!image?.base64 || !userId) {
      return;
    }

    try {
      const response = await fetch("http://192.168.0.4:3001/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: "hahahaha.jpg",
          base64: `data:image/jpeg;base64,${image.base64}`,
        }),
      });

      const data = await response.json();

      const imgUrl = data.url as string;
      sendMessage({
        to: userId as string,
        content: caption || "",
        imgUrl,
      });

      router.back();
    } catch (ex) {}
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
        <ImagePreview
          image={image}
          onClose={() => setImage(null)}
          caption={caption}
          onChangeCaption={(e) => setCaption(e)}
          onConfirm={onConfirm}
        />
      ) : (
        <View style={styles.container}>
          <CameraView
            style={styles.camera}
            facing={facing}
            flash={flash}
            ref={cameraRef}
          >
            <View style={styles.buttonContainer}>
              <CameraButton
                onPress={() => {
                  router.back();
                }}
              >
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