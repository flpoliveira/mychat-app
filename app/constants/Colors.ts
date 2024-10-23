/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = "#0a7ea4";
const tintColorDark = "#fff";

export const Colors = {
  light: {
    text: "#11181C",
    secondaryText: "#687076",
    background: "#fff",
    tint: tintColorLight,
    icon: "#687076",
    tabIconDefault: "#687076",
    tabIconSelected: tintColorLight,
    inputBackground: "#F2F2F9",
    placeholder: "#687076",
    messageBackground: "#F5F5FA",
    selfMessageBackground: "#E9F2FF",
    labelBackground: "#E9F2FF",
    border: "rgba(0, 0, 0, 0.1)",
  },
  dark: {
    text: "#ECEDEE",
    secondaryText: "#9BA1A6",
    messageBackground: "#151718",
    selfMessageBackground: "#1C1C1C",
    inputBackground: "#1C1C1C",
    background: "#0A0A05",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
    placeholder: "#9BA1A6",
    labelBackground: "#160D00",
    border: "rgba(255, 255, 255, 0.1)",
  },
};
