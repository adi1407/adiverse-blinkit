import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { useCart } from "../context/CartContext";
import QtyStepper from "./QtyStepper";
import { hapticLight } from "../utils/haptics";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/**
 * ADD ↔ − qty + control over existing CartContext.
 * Cart updates happen first; motion is secondary and never blocks.
 */
export default function AddToCartControl({
  product,
  size = "sm",
  disabled = false,
}) {
  const { getQty, addItem, increaseQty, decreaseQty } = useCart();
  const qty = getQty(product.id);
  const reduceMotion = usePrefersReducedMotion();
  const prevHasQty = useRef(qty > 0);
  const pressScale = useRef(new Animated.Value(1)).current;
  const name = String(product?.name || "item");

  useEffect(() => {
    const hasQty = qty > 0;
    if (hasQty === prevHasQty.current) return;
    prevHasQty.current = hasQty;
    if (reduceMotion) return;
    LayoutAnimation.configureNext({
      duration: 160,
      create: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
      update: { type: LayoutAnimation.Types.easeInEaseOut },
      delete: {
        type: LayoutAnimation.Types.easeInEaseOut,
        property: LayoutAnimation.Properties.opacity,
      },
    });
  }, [qty, reduceMotion]);

  function bumpPress() {
    if (reduceMotion) return;
    Animated.sequence([
      Animated.timing(pressScale, {
        toValue: 0.94,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.spring(pressScale, {
        toValue: 1,
        friction: 5,
        tension: 220,
        useNativeDriver: true,
      }),
    ]).start();
  }

  if (disabled) {
    return (
      <View
        style={styles.oos}
        accessibilityRole="text"
        accessibilityLabel={`${name} is out of stock`}
      >
        <Text style={styles.oosText}>Out of stock</Text>
      </View>
    );
  }

  if (qty > 0) {
    return (
      <Animated.View style={{ transform: [{ scale: pressScale }] }}>
        <QtyStepper
          qty={qty}
          size={size}
          productName={name}
          onIncrease={() => {
            hapticLight();
            increaseQty(product.id);
            bumpPress();
          }}
          onDecrease={() => {
            hapticLight();
            decreaseQty(product.id);
            bumpPress();
          }}
        />
      </Animated.View>
    );
  }

  return (
    <Animated.View style={{ transform: [{ scale: pressScale }] }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Add ${name} to cart`}
        hitSlop={6}
        style={({ pressed }) => [
          styles.addBtn,
          pressed && styles.addBtnPressed,
        ]}
        onPress={(e) => {
          e?.stopPropagation?.();
          hapticLight();
          addItem(product); // immediate cart update
          bumpPress();
        }}
      >
        {({ pressed }) => (
          <Text style={[styles.addText, pressed && styles.addTextPressed]}>
            ADD
          </Text>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  addBtn: {
    borderWidth: 1.4,
    borderColor: colors.accent,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.white,
    minWidth: 54,
    minHeight: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnPressed: {
    backgroundColor: colors.accent,
  },
  addText: {
    color: colors.accent,
    fontFamily: fonts.extraBold,
    fontSize: 12,
    letterSpacing: 0.5,
  },
  addTextPressed: {
    color: colors.white,
  },
  oos: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
    backgroundColor: "#F0F0F0",
    minHeight: 30,
    justifyContent: "center",
  },
  oosText: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: colors.textMuted,
  },
});
