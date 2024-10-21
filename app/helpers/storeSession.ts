import AsyncStorage from "@react-native-async-storage/async-storage";

const storeSession = async (value: SessionType) => {
  try {
    await AsyncStorage.setItem("session", JSON.stringify(value));
  } catch (e) {
    // saving error
  }
};

export default storeSession;
