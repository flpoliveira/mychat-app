import { useState } from "react";
import { StyleProp, TextInput, TextInputProps, TextStyle } from "react-native";

function AutoExpandableTextInput(
  props: {
    value: string;
    style: StyleProp<TextStyle>;
  } & TextInputProps
) {
  return (
    <TextInput {...props} style={[props.style, { maxHeight: 80 }]} multiline />
  );
}

export { AutoExpandableTextInput };
