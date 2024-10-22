import { useThemeColor } from "@/hooks/useThemeColor";
import { TextInput, TextInputProps, StyleSheet } from "react-native";

function ThemedInput(
  props: {
    type?: "default" | "title" | "defaultSemiBold" | "subtitle";
    lightColor?: string;
    darkColor?: string;
  } & TextInputProps
) {
  const { type = "default", lightColor, darkColor } = props;
  const backgroundColor = useThemeColor(
    { light: lightColor, dark: darkColor },
    "inputBackground"
  );
  const color = useThemeColor({}, "text");
  const placeholderTextColor = useThemeColor({}, "placeholder");

  return (
    <TextInput
      {...props}
      placeholderTextColor={placeholderTextColor}
      style={[
        { backgroundColor, color },
        type === "default" ? styles.default : undefined,
        type === "title" ? styles.title : undefined,
        type === "defaultSemiBold" ? styles.defaultSemiBold : undefined,
        type === "subtitle" ? styles.subtitle : undefined,
        props.style,
      ]}
    />
  );
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
});

export { ThemedInput };
