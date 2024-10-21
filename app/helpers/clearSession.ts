import AsyncStorage from "@react-native-async-storage/async-storage";

const clearSession = async () => {
  try {
    await AsyncStorage.removeItem("session");
  } catch (e) {
    // error reading value
  }
};

export default clearSession;
