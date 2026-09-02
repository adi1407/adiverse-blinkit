import { Platform } from "react-native";
import Constants from "expo-constants";

// Expo Go on a real phone cannot use localhost.
// We reuse the same PC IP that Expo is already using (e.g. 192.168.1.26).
function getDevServerHost() {
  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoGo?.debuggerHost ||
    Constants.manifest?.debuggerHost ||
    "";

  if (hostUri) {
    return hostUri.split(":")[0];
  }

  // Emulator fallbacks
  if (Platform.OS === "android") return "10.0.2.2";
  return "localhost";
}

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || `http://${getDevServerHost()}:5000`;
