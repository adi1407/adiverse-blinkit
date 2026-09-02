import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Search } from "../utils/lucideIcons";
import { colors, spacing, radii, shadows } from "../theme/colors";

const HINTS = ['Search "milk"', 'Search "bread"', 'Search "chips"', 'Search "rice"'];

export default function SearchBar({ onPress }) {
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHintIndex((i) => (i + 1) % HINTS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.wrap}>
      <Pressable
        style={[styles.bar, shadows.soft]}
        onPress={onPress}
        accessibilityRole="search"
        accessibilityLabel="Open search"
      >
        <Search size={20} color={colors.textSecondary} strokeWidth={2.2} />
        <Text style={styles.placeholder}>{HINTS[hintIndex]}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.lg,
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
});
