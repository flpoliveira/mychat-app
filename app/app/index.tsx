import { StyleSheet, TouchableOpacity, View } from "react-native";
import React, { useMemo, useState } from "react";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { SafeAreaView } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useChat, useSocket } from "@/context/chat";
import { SessionConnect } from "@/components/SessionConnect";
import clearSession from "@/helpers/clearSession";
import { SearchInput } from "@/components/chat/ListSearch";
import { Logo } from "@/components/Logo";
import { List } from "@/components/chat/List";

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, "background");

  const { session } = useSocket();
  const { users } = useChat();

  const [search, setSearch] = useState("");

  const sortedUsers = useMemo(() => {
    return users.sort((a, b) => {
      if (a.connected && !b.connected) {
        return -1;
      }

      if (!a.connected && b.connected) {
        return 1;
      }

      if (a.lastMessage && !b.lastMessage) {
        return -1;
      }

      if (!a.lastMessage && b.lastMessage) {
        return 1;
      }

      return 0;
    });
  }, [users]);

  const usersFiltered = useMemo(() => {
    if (!search) {
      return sortedUsers;
    }

    return sortedUsers.filter((user) =>
      user.username.toLowerCase().includes(search.toLowerCase())
    );
  }, [sortedUsers, search]);

  return (
    <SafeAreaView
      style={{
        backgroundColor,
        flex: 1,
        padding: 16,
      }}
    >
      {!!session ? (
        <ThemedView style={{ flex: 1 }}>
          <Logo style={{ width: 100, height: 50 }} />
          <SearchInput onSearch={(e) => setSearch(e)} />
          {usersFiltered.length > 0 ? (
            <List users={usersFiltered} sessionUserID={session?.userID} />
          ) : (
            <View style={styles.emptyList}>
              <ThemedText>No users found</ThemedText>
            </View>
          )}
        </ThemedView>
      ) : (
        <SessionConnect />
      )}
      {/* <TouchableOpacity
        onPress={() => {
          clearSession();
        }}
      >
        <ThemedText>Clear session</ThemedText>
      </TouchableOpacity> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  emptyList: {
    flex: 1,
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
