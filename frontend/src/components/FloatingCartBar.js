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
import { colors, spacing, shadows } from "../theme/colors";
import { fonts } from "../theme/typography";
import { TAB_BAR_BASE_HEIGHT } from "./BlinkitTabBar";
import ProductImage from "./ProductImage";
import { getDeliveryProgress, FREE_DELIVERY_MIN } from "../utils/delivery";

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
  const { unlocked, remaining } = getDeliveryProgress(totalPrice);
  const progress = Math.min(1, totalPrice / FREE_DELIVERY_MIN);
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
        <View style={[styles.surface, shadows.float]}>
          {!unlocked ? (
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              <Text style={styles.progressText}>
                Add ₹{remaining} more for free delivery
              </Text>
            </View>
          ) : null}

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
                  <View
                    style={[styles.thumbChip, styles.moreChip, { marginLeft: -10 }]}
                  >
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
        </View>
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
  surface: {
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: colors.accentDark,
  },
  progressTrack: {
    height: 20,
    backgroundColor: "rgba(255,255,255,0.14)",
    justifyContent: "center",
    overflow: "hidden",
  },
  progressFill: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.primary,
    opacity: 0.9,
  },
  progressText: {
    textAlign: "center",
    fontSize: 10,
    fontFamily: fonts.bold,
    color: colors.white,
    zIndex: 1,
  },
  bar: {
    minHeight: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: colors.accent,
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
    borderColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  moreChip: {
    backgroundColor: colors.primary,
  },
  moreText: {
    fontSize: 10,
    fontFamily: fonts.extraBold,
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
    fontFamily: fonts.semiBold,
  },
  price: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.extraBold,
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
    fontFamily: fonts.extraBold,
  },
  ctaIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
});
