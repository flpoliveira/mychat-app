import { StyleProp, TextInput, TextInputProps, TextStyle } from "react-native";
import { ThemedInput } from "./ThemedInput";

function AutoExpandableTextInput(
  props: {
    value: string;
    style: StyleProp<TextStyle>;
    type?: "default" | "title" | "defaultSemiBold" | "subtitle";
    lightColor?: string;
    darkColor?: string;
  } & TextInputProps
) {
  return (
    <ThemedInput
      {...props}
      style={[props.style, { maxHeight: 80 }]}
      multiline
    />
  );
}

export { AutoExpandableTextInput };
