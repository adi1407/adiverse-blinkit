import { Platform } from "react-native";

// Android emulator uses 10.0.2.2 to reach your computer's localhost.
// On a real phone with Expo Go, replace with your PC's LAN IP, e.g. http://192.168.1.5:5000
const ANDROID_EMULATOR_HOST = "10.0.2.2";
const DEFAULT_HOST = Platform.OS === "android" ? ANDROID_EMULATOR_HOST : "localhost";

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL || `http://${DEFAULT_HOST}:5000`;
