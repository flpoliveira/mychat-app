import { Image, ImageStyle, StyleProp } from "react-native";

function Logo({ style }: { style?: StyleProp<ImageStyle> }) {
  return (
    <Image
      source={require("../assets/images/logo.png")}
      resizeMode="contain"
      style={[style]}
    />
  );
}

export { Logo };
