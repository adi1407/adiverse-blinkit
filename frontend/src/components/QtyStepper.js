import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { Minus, Plus } from "../utils/lucideIcons";
import { hapticLight } from "../utils/haptics";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

const SIZES = {
  sm: { height: 30, btn: 28, qty: 24, icon: 13, font: 12 },
  md: { height: 34, btn: 32, qty: 28, icon: 14, font: 13 },
  lg: { height: 42, btn: 40, qty: 36, icon: 18, font: 15 },
};

export default function QtyStepper({
  qty,
  onIncrease,
  onDecrease,
  compact,
  size = compact ? "sm" : "md",
  productName = "item",
}) {
  const s = SIZES[size] || SIZES.md;
  const reduceMotion = usePrefersReducedMotion();
  const [displayQty, setDisplayQty] = useState(qty);
  const slide = useRef(new Animated.Value(0)).current;
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (qty === displayQty) return undefined;

    if (reduceMotion) {
      setDisplayQty(qty);
      return undefined;
    }

    const dir = qty > displayQty ? 1 : -1;
    let cancelled = false;

    Animated.parallel([
      Animated.timing(fade, {
        toValue: 0,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(slide, {
        toValue: -6 * dir,
        duration: 70,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (cancelled) return;
      setDisplayQty(qty);
      slide.setValue(6 * dir);
      Animated.parallel([
        Animated.timing(fade, {
          toValue: 1,
          duration: 80,
          useNativeDriver: true,
        }),
        Animated.timing(slide, {
          toValue: 0,
          duration: 80,
          useNativeDriver: true,
        }),
      ]).start();
    });

    return () => {
      cancelled = true;
    };
  }, [qty, displayQty, fade, slide, reduceMotion]);

  return (
    <View
      style={[styles.wrap, { height: s.height }]}
      accessibilityRole="adjustable"
      accessibilityLabel={`${productName} quantity ${displayQty}`}
      accessibilityValue={{ min: 0, now: displayQty }}
    >
      <Pressable
        onPress={() => {
          hapticLight();
          onDecrease?.();
        }}
        style={({ pressed }) => [
          styles.btn,
          { width: s.btn },
          pressed && styles.btnPressed,
        ]}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Decrease ${productName} quantity`}
      >
        <Minus size={s.icon} color={colors.white} strokeWidth={2.8} />
      </Pressable>

      <View style={[styles.qtyWrap, { minWidth: s.qty }]}>
        <Animated.Text
          style={[
            styles.qty,
            {
              fontSize: s.font,
              opacity: fade,
              transform: [{ translateY: slide }],
            },
          ]}
          accessibilityElementsHidden
          importantForAccessibility="no"
        >
          {displayQty}
        </Animated.Text>
      </View>

      <Pressable
        onPress={() => {
          hapticLight();
          onIncrease?.();
        }}
        style={({ pressed }) => [
          styles.btn,
          { width: s.btn },
          pressed && styles.btnPressed,
        ]}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel={`Increase ${productName} quantity`}
      >
        <Plus size={s.icon} color={colors.white} strokeWidth={2.8} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: colors.accent,
    overflow: "hidden",
  },
  btn: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  btnPressed: {
    backgroundColor: colors.accentDark,
  },
  qtyWrap: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  qty: {
    textAlign: "center",
    color: colors.white,
    fontFamily: fonts.extraBold,
  },
});
