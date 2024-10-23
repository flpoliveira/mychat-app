import { useSocket } from "@/context/chat";
import { ThemedText } from "./ThemedText";
import { ThemedView } from "./ThemedView";
import { useMemo, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedInput } from "./ThemedInput";
import { PrimaryBackground } from "./PrimaryBackground";
import uuid from "react-native-uuid";
import { PlaceholderImage } from "./PlaceholderImage";
import { Logo } from "./Logo";

function SessionConnect() {
  const { socket, connect } = useSocket();

  const backgroundColor = useThemeColor({}, "background");

  const randomAvatarUrl = useMemo(() => {
    const randomId = uuid.v4();
    return `https://api.multiavatar.com/${randomId}.png`;
  }, []);

  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);

  const confirm = () => {
    if (step === 0) {
      if (!username) {
        Alert.alert("Error", "Please enter a username");
        return;
      }
      setStep(1);
    } else if (step === 1) {
      setLoading(true);
      if (socket?.current && username) {
        connect(username, randomAvatarUrl);
      } else {
        setLoading(false);
        Alert.alert("Error", "Error while connecting to chat");
      }
    }
  };

  if (loading) {
    return (
      <ThemedView style={styles.container}>
        <ActivityIndicator size="large" color="#F158FF" />
      </ThemedView>
    );
  }

  if (step === 1) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <ThemedView style={styles.avatarContainer}>
          <ThemedText type="title">Welcome {username}</ThemedText>
          <PlaceholderImage
            source={{ uri: randomAvatarUrl }}
            width={100}
            height={100}
            style={{ borderRadius: 50 }}
          />
          <ThemedText type="default">This is your avatar.</ThemedText>
          <TouchableOpacity
            onPress={confirm}
            disabled={loading}
            style={{ width: "80%" }}
          >
            <PrimaryBackground style={styles.button}>
              <ThemedText type="defaultSemiBold" style={{ color: "white" }}>
                Let's chat
              </ThemedText>
            </PrimaryBackground>
          </TouchableOpacity>
        </ThemedView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
        >
          <ThemedView style={styles.usernameContainer}>
            <ThemedView style={styles.logoContainer}>
              <Logo style={{ width: 200, height: 100 }} />
            </ThemedView>
            <ThemedInput
              placeholder="Enter your username"
              value={username}
              onChangeText={setUsername}
              style={{ width: "80%" }}
            />
            <TouchableOpacity
              onPress={confirm}
              disabled={loading}
              style={{ width: "80%" }}
            >
              <PrimaryBackground style={styles.button}>
                <ThemedText type="defaultSemiBold" style={{ color: "white" }}>
                  Connect
                </ThemedText>
              </PrimaryBackground>
            </TouchableOpacity>
          </ThemedView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  avatarContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
    gap: 20,
    padding: 20,
  },
  button: {
    borderRadius: 8,
    padding: 8,
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  usernameContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flex: 1,
    gap: 20,
    width: "100%",
    paddingHorizontal: 20,
  },
  logoContainer: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
});

export { SessionConnect };
