import Constants from "expo-constants";

export const SOCKET_ENDPOINT =
  Constants?.expoConfig?.extra?.socketUrl ?? "http://localhost:3000";
