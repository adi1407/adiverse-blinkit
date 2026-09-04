import { useEffect, useRef, useState } from "react";
import { View, StyleSheet, Pressable, Animated } from "react-native";
import { Search, Mic } from "../utils/lucideIcons";
import { colors, spacing, radii } from "../theme/colors";
import { fonts } from "../theme/typography";

const HINTS = [
  'Search "milk"',
  'Search "bread"',
  'Search "chips"',
  'Search "rice"',
  'Search "curd"',
  'Search "banana"',
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
  }, [fade, slide]);

  return (
    <View style={styles.wrap}>
      <Pressable
        style={styles.bar}
        onPress={onPress}
        accessibilityRole="search"
        accessibilityLabel="Open search"
      >
        <Search size={18} color="#363636" strokeWidth={2.4} />
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
          style={styles.micBtn}
          accessibilityLabel="Voice search"
        >
          <Mic size={18} color={colors.accent} strokeWidth={2.4} />
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
    borderRadius: 12,
    paddingLeft: 14,
    paddingRight: 4,
    height: 50,
    gap: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  placeholder: {
    flex: 1,
    fontSize: 14,
    color: "#868686",
    fontFamily: fonts.medium,
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
  },
});
