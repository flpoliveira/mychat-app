import { ReactElement } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { PrimaryBackground } from "./PrimaryBackground";

function IconButton({
  children,
  onPress,
}: {
  children: ReactElement;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={() => onPress()}>
      <PrimaryBackground style={styles.button}>{children}</PrimaryBackground>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 99,
    padding: 8,
    maxHeight: 56,
  },
});

export { IconButton };
