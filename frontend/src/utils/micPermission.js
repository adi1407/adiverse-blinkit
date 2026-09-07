import { Audio } from "expo-av";

/**
 * Ask for mic access before starting voice search.
 * Works in Expo Go; returns false if the user denies.
 */
export async function ensureMicPermission() {
  try {
    const current = await Audio.getPermissionsAsync();
    if (current.granted) return true;
    const next = await Audio.requestPermissionsAsync();
    return Boolean(next.granted);
  } catch {
    return false;
  }
}
