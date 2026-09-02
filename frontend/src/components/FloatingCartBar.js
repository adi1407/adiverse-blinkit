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
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { colors, spacing } from "../theme/colors";
import { TAB_BAR_BASE_HEIGHT } from "./BlinkitTabBar";

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
          toValue: 1.05,
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
      <Pressable
        style={styles.bar}
        onPress={() => navigation.navigate("Cart")}
      >
        <View style={styles.left}>
          <View style={styles.emojiRow}>
            {preview.map((item, i) => (
              <View
                key={item.id}
                style={[styles.emojiChip, { zIndex: 3 - i, marginLeft: i === 0 ? 0 : -10 }]}
              >
                <Text style={styles.emoji}>{item.emoji}</Text>
              </View>
            ))}
          </View>
          <View style={styles.meta}>
            <Text style={styles.count}>
              {totalItems} item{totalItems === 1 ? "" : "s"} added
            </Text>
            <Text style={styles.price}>₹{totalPrice}</Text>
          </View>
        </View>

        <View style={styles.cta}>
          <Text style={styles.ctaText}>View Cart</Text>
          <View style={styles.ctaIcon}>
            <Ionicons name="arrow-forward" size={14} color={colors.accent} />
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
  emojiRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  emojiChip: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#0A7A1C",
  },
  emoji: {
    fontSize: 16,
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
    gap: 8,
    paddingLeft: spacing.sm,
  },
  ctaText: {
    color: colors.white,
    fontSize: 15,
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
});
