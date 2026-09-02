import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radii, shadows } from "../theme/colors";

const HINTS = ['Search "milk"', 'Search "bread"', 'Search "chips"', 'Search "rice"'];

export default function SearchBar() {
  const [hintIndex, setHintIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setHintIndex((i) => (i + 1) % HINTS.length);
    }, 2200);
    return () => clearInterval(id);
  }, []);

  return (
    <View style={styles.wrap}>
      <Pressable style={[styles.bar, shadows.soft]}>
        <Ionicons name="search" size={20} color={colors.textSecondary} />
        <Text style={styles.placeholder}>{HINTS[hintIndex]}</Text>
        <View style={styles.actions}>
          <Pressable style={styles.iconHit}>
            <Ionicons name="mic-outline" size={20} color={colors.text} />
          </Pressable>
          <View style={styles.divider} />
          <Pressable style={styles.iconHit}>
            <Ionicons name="options-outline" size={18} color={colors.text} />
          </Pressable>
        </View>
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
  actions: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconHit: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  divider: {
    width: 1,
    height: 18,
    backgroundColor: colors.borderStrong,
    marginHorizontal: 4,
  },
});
