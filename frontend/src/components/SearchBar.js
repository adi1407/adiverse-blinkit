import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { Search, Mic, Volume2 } from "../utils/lucideIcons";
import { colors, spacing, radii, shadows } from "../theme/colors";
import { fonts } from "../theme/typography";

const HINTS = [
  'Search "milk"',
  'Search "bread"',
  'Search "chips"',
  'Search "rice"',
  'Search "shampoo"',
];

export default function SearchBar({ onPress, onMicPress }) {
  const [hintIndex, setHintIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const id = setInterval(() => {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.timing(slide, {
          toValue: -8,
          duration: 180,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setHintIndex((i) => (i + 1) % HINTS.length);
        slide.setValue(8);
        Animated.parallel([
          Animated.timing(fade, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }),
          Animated.timing(slide, {
            toValue: 0,
            duration: 220,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 2400);
    return () => clearInterval(id);
  }, [fade, slide]);

  const hint = HINTS[hintIndex];

  return (
    <View style={styles.wrap}>
      <Pressable
        style={[styles.bar, shadows.soft]}
        onPress={onPress}
        accessibilityRole="search"
        accessibilityLabel="Open search"
      >
        <Search size={20} color={colors.textSecondary} strokeWidth={2.2} />
        <Animated.Text
          style={[
            styles.placeholder,
            { opacity: fade, transform: [{ translateY: slide }] },
          ]}
          numberOfLines={1}
        >
          {hint}
        </Animated.Text>
        <Pressable
          hitSlop={8}
          onPress={(e) => {
            e?.stopPropagation?.();
            onPress?.();
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
            (onMicPress || onPress)?.();
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
    height: 52,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  placeholder: {
    flex: 1,
    fontSize: 15,
    color: colors.textMuted,
    fontFamily: fonts.medium,
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
