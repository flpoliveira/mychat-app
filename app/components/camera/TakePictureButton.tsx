import { TouchableOpacity, View, StyleSheet } from "react-native";

function TakePictureButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.button} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 99,
    padding: 2,
  },
  button: {
    backgroundColor: "white",
    borderRadius: 99,
    minHeight: 64,
    minWidth: 64,
    borderColor: "black",
    borderWidth: 2,
  },
});

export { TakePictureButton };
