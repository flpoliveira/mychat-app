import AsyncStorage from "@react-native-async-storage/async-storage";

const getSession = async () => {
  try {
    const value = await AsyncStorage.getItem("session");
    if (value !== null) {
      return JSON.parse(value);
    }
  } catch (e) {
    // error reading value
  }
};

export default getSession;
