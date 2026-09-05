import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import { Search, Mic } from "../utils/lucideIcons";
import { colors, spacing } from "../theme/colors";
import { fonts } from "../theme/typography";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

const HINTS = [
  'Search "milk"',
  'Search "bread"',
  'Search "chips"',
  'Search "rice"',
  'Search "curd"',
  'Search "banana"',
];

export default function SearchBar({
  onPress,
  onMicPress,
  compact = false,
  transparent = false,
  glass = false,
}) {
  const [hintIndex, setHintIndex] = useState(0);
  const [focusedVisual, setFocusedVisual] = useState(false);
  const fade = useRef(new Animated.Value(1)).current;
  const slide = useRef(new Animated.Value(0)).current;
  const reduceMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (reduceMotion) return undefined;
    const id = setInterval(() => {
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 0,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.timing(slide, {
          toValue: -6,
          duration: 160,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setHintIndex((i) => (i + 1) % HINTS.length);
        slide.setValue(8);
        Animated.parallel([
          Animated.timing(fade, {
            toValue: 1,
            duration: 200,
            useNativeDriver: true,
          }),
          Animated.timing(slide, {
            toValue: 0,
            duration: 200,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 2600);
    return () => clearInterval(id);
  }, [fade, slide, reduceMotion]);

  return (
    <View
      style={[
        styles.wrap,
        transparent && styles.wrapTransparent,
        compact && styles.wrapCompact,
      ]}
    >
      <Pressable
        style={({ pressed }) => [
          styles.bar,
          glass && styles.barGlass,
          compact && styles.barCompact,
          (pressed || focusedVisual) && styles.barFocus,
        ]}
        onPress={onPress}
        onPressIn={() => setFocusedVisual(true)}
        onPressOut={() => setFocusedVisual(false)}
        accessibilityRole="search"
        accessibilityLabel="Search products"
        accessibilityHint="Opens search"
      >
        <Search
          size={compact ? 16 : 18}
          color="#2F2F2F"
          strokeWidth={2.4}
        />
        <Animated.Text
          style={[
            styles.placeholder,
            { opacity: fade, transform: [{ translateY: slide }] },
          ]}
          numberOfLines={1}
        >
          {HINTS[hintIndex]}
        </Animated.Text>
        <View style={styles.divider} />
        <Pressable
          hitSlop={10}
          onPress={(e) => {
            e?.stopPropagation?.();
            (onMicPress || onPress)?.();
          }}
          style={({ pressed }) => [
            styles.micBtn,
            pressed && styles.micBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Voice search"
        >
          <Mic size={compact ? 16 : 18} color={colors.accent} strokeWidth={2.4} />
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
  wrapTransparent: {
    backgroundColor: "transparent",
  },
  wrapCompact: {
    paddingBottom: 10,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: 14,
    paddingLeft: 14,
    paddingRight: 4,
    height: 48,
    gap: 10,
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.06)",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  barGlass: {
    backgroundColor: "rgba(255,255,255,0.72)",
    borderColor: "rgba(255,255,255,0.85)",
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  barCompact: {
    height: 44,
    borderRadius: 12,
  },
  barFocus: {
    borderColor: colors.accent,
    shadowOpacity: 0.1,
    shadowRadius: 10,
    transform: [{ scale: 1.01 }],
  },
  placeholder: {
    flex: 1,
    fontSize: 14,
    color: "#7A7A7A",
    fontFamily: fonts.medium,
    letterSpacing: -0.1,
  },
  divider: {
    width: StyleSheet.hairlineWidth,
    height: 22,
    backgroundColor: "#D4D4D4",
  },
  micBtn: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 21,
  },
  micBtnPressed: {
    backgroundColor: colors.accentSoft,
  },
});
