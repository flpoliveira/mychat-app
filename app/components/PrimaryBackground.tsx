import { LinearGradient } from "expo-linear-gradient";
import { ReactElement } from "react";
import { StyleProp, ViewStyle } from "react-native";

function PrimaryBackground({
  children,
  style,
}: {
  children: ReactElement;
  style: StyleProp<ViewStyle>;
}) {
  return (
    <LinearGradient
      colors={["#696EFF", "#ee76f9", "#F158FF"]}
      start={{ x: 0.5, y: 0.0 }}
      end={{ x: 0.0, y: 1 }}
      style={style}
    >
      {children}
    </LinearGradient>
  );
}

export { PrimaryBackground };
