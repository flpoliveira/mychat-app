import { Image, StyleSheet, Platform, TouchableOpacity } from "react-native";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { clearStorage, useSocket } from "@/context/socket";
import { ChatConnect } from "@/components/ChatConnect";

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");

  const { session } = useSocket();

  return (
    <SafeAreaView
      style={{
        backgroundColor,
        flex: 1,
      }}
    >
      {!!session ? (
        <TouchableOpacity onPress={() => clearStorage()}>
          <ThemedText>Disconnect</ThemedText>
        </TouchableOpacity>
      ) : (
        <ChatConnect />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
});
