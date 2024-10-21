import {
  Image,
  StyleSheet,
  Platform,
  TouchableOpacity,
  FlatList,
  TextInput,
  View,
} from "react-native";
import React, { useRef } from "react";

import { HelloWave } from "@/components/HelloWave";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useChat, useSocket } from "@/context/chat";
import { ChatConnect } from "@/components/ChatConnect";
import { useMemo, useState } from "react";
import { TapGestureHandler } from "react-native-gesture-handler";
import { DoubleTapLike } from "@/components/DoubleTapLike";
import { Link } from "expo-router";
import clearSession from "@/helpers/clearSession";

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");

  const { session } = useSocket();
  const { users } = useChat();

  return (
    <SafeAreaView
      style={{
        backgroundColor,
        flex: 1,
      }}
    >
      {!!session ? (
        <ThemedView style={{ flex: 1 }}>
          {users.length > 0 && (
            <FlatList
              data={users}
              keyExtractor={(item) => item.userID}
              renderItem={({ item }) => (
                <Link href={`/chat/${item.userID}`}>
                  <ThemedText>{item.username}</ThemedText>
                </Link>
              )}
            />
          )}

          <TouchableOpacity onPress={() => clearSession()}>
            <ThemedText>Disconnect</ThemedText>
          </TouchableOpacity>
        </ThemedView>
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
