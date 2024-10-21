import { ReactElement } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";

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

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#333230",
    borderRadius: 99,
    padding: 8,
    maxHeight: 56,
  },
});

export { CameraButton };
