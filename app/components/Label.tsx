import { useThemeColor } from "@/hooks/useThemeColor";
import { ReactNode } from "react";
import { View } from "react-native";

function Label({ children }: { children: ReactNode }) {
  const backgroundColor = useThemeColor({}, "labelBackground");
  return (
    <View
      style={{
        backgroundColor,
        padding: 4,
        borderRadius: 4,
        alignSelf: "center",
      }}
    >
      {children}
    </View>
  );
}

export { Label };
