import { useEffect, useRef } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Platform,
  Animated,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ArrowRight, ShoppingBag } from "../utils/lucideIcons";
import { useCart } from "../context/CartContext";
import { colors, spacing } from "../theme/colors";
import { TAB_BAR_BASE_HEIGHT } from "./BlinkitTabBar";
import ProductImage from "./ProductImage";
import FreeDeliveryBanner from "./FreeDeliveryBanner";
import { getDeliveryProgress } from "../utils/delivery";

export default function FloatingCartBar() {
  const { totalItems, totalPrice, items } = useCart();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const visible = totalItems > 0;

  const anim = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const prevCount = useRef(totalItems);

  useEffect(() => {
    Animated.spring(anim, {
      toValue: visible ? 1 : 0,
      friction: 7,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, [visible, anim]);

  useEffect(() => {
    if (totalItems > prevCount.current) {
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1.06,
          duration: 120,
          useNativeDriver: true,
        }),
        Animated.spring(pulse, {
          toValue: 1,
          friction: 4,
          useNativeDriver: true,
        }),
      ]).start();
    }
    prevCount.current = totalItems;
  }, [totalItems, pulse]);

  if (!visible) return null;

  const preview = items.slice(0, 3);
  const { unlocked } = getDeliveryProgress(totalPrice);
  const bottom =
    TAB_BAR_BASE_HEIGHT +
    Math.max(insets.bottom, Platform.OS === "android" ? 10 : 6) +
    10;

  return (
    <Animated.View
      pointerEvents="box-none"
      style={[
        styles.wrap,
        {
          bottom,
          opacity: anim,
          transform: [
            {
              translateY: anim.interpolate({
                inputRange: [0, 1],
                outputRange: [24, 0],
              }),
            },
            { scale: pulse },
          ],
        },
      ]}
    >
      <Pressable onPress={() => navigation.navigate("Cart")}>
        <View style={styles.bar}>
          <View style={styles.left}>
            <View style={styles.thumbRow}>
              {preview.map((item, i) => (
                <View
                  key={item.id}
                  style={[
                    styles.thumbChip,
                    { zIndex: 3 - i, marginLeft: i === 0 ? 0 : -10 },
                  ]}
                >
                  <ProductImage
                    uri={item.image}
                    style={styles.thumbImage}
                    iconSize={14}
                  />
                </View>
              ))}
              {items.length > 3 ? (
                <View style={[styles.thumbChip, styles.moreChip, { marginLeft: -10 }]}>
                  <Text style={styles.moreText}>+{items.length - 3}</Text>
                </View>
              ) : null}
            </View>
            <View style={styles.meta}>
              <Text style={styles.count}>
                {totalItems} item{totalItems === 1 ? "" : "s"} · in cart
              </Text>
              <Text style={styles.price}>₹{totalPrice}</Text>
            </View>
          </View>

          <View style={styles.cta}>
            <ShoppingBag size={16} color={colors.white} strokeWidth={2.3} />
            <Text style={styles.ctaText}>View cart</Text>
            <View style={styles.ctaIcon}>
              <ArrowRight size={14} color={colors.accent} strokeWidth={2.6} />
            </View>
          </View>
        </View>

        {!unlocked ? (
          <View style={styles.progressSlot}>
            <FreeDeliveryBanner itemTotal={totalPrice} compact />
          </View>
        ) : null}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    zIndex: 30,
  },
  bar: {
    minHeight: 58,
    borderRadius: 16,
    backgroundColor: "#0A7A1C",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
    ...Platform.select({
      ios: {
        shadowColor: "#0C831F",
        shadowOpacity: 0.35,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
      },
      android: { elevation: 10 },
    }),
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    flex: 1,
  },
  thumbRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  thumbChip: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.white,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#0A7A1C",
    alignItems: "center",
    justifyContent: "center",
  },
  moreChip: {
    backgroundColor: colors.primary,
    borderColor: "#0A7A1C",
  },
  moreText: {
    fontSize: 10,
    fontWeight: "900",
    color: colors.text,
  },
  thumbImage: {
    width: "100%",
    height: "100%",
  },
  meta: {
    flexShrink: 1,
  },
  count: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 12,
    fontWeight: "600",
  },
  price: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "800",
    marginTop: 1,
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingLeft: spacing.sm,
  },
  ctaText: {
    color: colors.white,
    fontSize: 14,
    fontWeight: "800",
  },
  ctaIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  progressSlot: {
    marginTop: 8,
  },
});
