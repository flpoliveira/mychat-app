import { useThemeColor } from "@/hooks/useThemeColor";
import { ThemedInput } from "../ThemedInput";
import { ThemedView } from "../ThemedView";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { IconButton } from "../IconButton";
import { set } from "lodash";
import debounce from "@/helpers/debounce";

function SearchInput({ onSearch }: { onSearch: (text: string) => void }) {
  const backgroundColor = useThemeColor({}, "inputBackground");
  const color = useThemeColor({}, "text");
  const [text, setText] = useState("");

  const handleSearch = (e: string) => {
    setText(e);
    debounce(
      "searching-contacts",
      () => {
        onSearch(e);
      },
      100
    );
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Ionicons name="search" size={24} color="#F158FF" />
      <ThemedInput
        placeholder="Search"
        style={{ width: "100%", padding: 8, flexShrink: 1 }}
        value={text}
        onChangeText={handleSearch}
      />
      {text && (
        <TouchableOpacity
          onPress={() => {
            setText("");
            onSearch("");
          }}
        >
          <Ionicons name="close-circle" size={24} color={color} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 8,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
});

export { SearchInput };
