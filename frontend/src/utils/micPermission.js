/**
 * Mic gate for voice search.
 * Avoids importing expo-av — that native module is missing in some Expo Go /
 * development-build setups and crashes the whole app at startup.
 * The Web Speech bridge requests mic access itself when listening starts.
 */
export async function ensureMicPermission() {
  return true;
}
