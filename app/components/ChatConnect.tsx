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
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedInput } from "./ThemedInput";
import { PrimaryBackground } from "./PrimaryBackground";
import uuid from "react-native-uuid";

function ChatConnect() {
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
        <ThemedView
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flex: 1,
            gap: 20,
            padding: 20,
          }}
        >
          <ThemedText type="title">Welcome {username}</ThemedText>
          <Image
            source={{ uri: randomAvatarUrl }}
            style={{ width: 100, height: 100, borderRadius: 50 }}
          />
          <ThemedText type="default">
            This is your avatar, you can change it later.
          </ThemedText>
          <TouchableOpacity
            onPress={confirm}
            disabled={loading}
            style={{ width: "80%" }}
          >
            <PrimaryBackground
              style={{
                borderRadius: 8,
                padding: 8,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      >
        <ThemedView
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flex: 1,
            gap: 20,
            width: "100%",
            paddingHorizontal: 20,
          }}
        >
          <ThemedView
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flex: 1,
              gap: 10,
            }}
          >
            <ThemedText type="title">Welcome to</ThemedText>
            <Image
              source={require("../assets/images/logo.png")}
              resizeMode="contain"
            />
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
            <PrimaryBackground
              style={{
                borderRadius: 8,
                padding: 8,
                width: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <ThemedText type="defaultSemiBold" style={{ color: "white" }}>
                Connect
              </ThemedText>
            </PrimaryBackground>
          </TouchableOpacity>
        </ThemedView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
});

export { ChatConnect };
