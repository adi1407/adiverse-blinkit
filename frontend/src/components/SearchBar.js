import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable, Alert } from "react-native";
import { Search, Mic, Volume2 } from "../utils/lucideIcons";
import { colors, spacing, radii, shadows } from "../theme/colors";

const HINTS = [
  'Search "milk"',
  'Search "bread"',
  'Search "chips"',
  'Search "rice"',
  'Search "shampoo"',
];

export default function SearchBar({ onPress }) {
  const [hintIndex, setHintIndex] = useState(0);
  const hint = HINTS[hintIndex];

  useEffect(() => {
    const id = setInterval(() => {
      setHintIndex((i) => (i + 1) % HINTS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  function onMic() {
    Alert.alert(
      "Voice search",
      "Voice typing isn’t available in Expo Go yet. Opening search — try speaking your query aloud while you type!",
      [{ text: "Open search", onPress }]
    );
  }

  function onSpeaker() {
    Alert.alert("Try saying", hint.replace(/^Search\s*/i, "").replace(/"/g, ""));
  }

  return (
    <View style={styles.wrap}>
      <Pressable
        style={[styles.bar, shadows.soft]}
        onPress={onPress}
        accessibilityRole="search"
        accessibilityLabel="Open search"
      >
        <Search size={20} color={colors.textSecondary} strokeWidth={2.2} />
        <Text style={styles.placeholder}>{hint}</Text>
        <Pressable
          hitSlop={8}
          onPress={(e) => {
            e?.stopPropagation?.();
            onSpeaker();
          }}
          style={styles.sideBtn}
          accessibilityLabel="Hear search hint"
        >
          <Volume2 size={18} color={colors.textSecondary} strokeWidth={2.2} />
        </Pressable>
        <View style={styles.divider} />
        <Pressable
          hitSlop={8}
          onPress={(e) => {
            e?.stopPropagation?.();
            onMic();
          }}
          style={styles.sideBtn}
          accessibilityLabel="Voice search"
        >
          <Mic size={18} color={colors.accent} strokeWidth={2.3} />
        </Pressable>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    height: 48,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  placeholder: {
    flex: 1,
    fontSize: 15,
    color: colors.textMuted,
    fontWeight: "500",
  },
  sideBtn: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  divider: {
    width: 1,
    height: 22,
    backgroundColor: colors.borderStrong,
  },
});
