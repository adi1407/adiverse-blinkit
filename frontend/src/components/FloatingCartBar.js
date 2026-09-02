import { View, Text, Pressable, StyleSheet, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { colors, spacing, radii } from "../theme/colors";
import { TAB_BAR_BASE_HEIGHT } from "./BlinkitTabBar";

export default function FloatingCartBar() {
  const { totalItems, totalPrice, items } = useCart();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  if (totalItems <= 0) return null;

  const preview = items.slice(0, 3);
  const bottom =
    TAB_BAR_BASE_HEIGHT + Math.max(insets.bottom, Platform.OS === "android" ? 8 : 4) + 8;

  return (
    <Pressable
      style={[styles.bar, { bottom }]}
      onPress={() => navigation.navigate("Cart")}
    >
      <View style={styles.left}>
        <View style={styles.emojiRow}>
          {preview.map((item) => (
            <View key={item.id} style={styles.emojiChip}>
              <Text style={styles.emoji}>{item.emoji}</Text>
            </View>
          ))}
        </View>
        <View>
          <Text style={styles.count}>
            {totalItems} item{totalItems === 1 ? "" : "s"}
          </Text>
          <Text style={styles.price}>₹{totalPrice}</Text>
        </View>
      </View>

      <View style={styles.cta}>
        <Text style={styles.ctaText}>View Cart</Text>
        <Ionicons name="chevron-forward" size={18} color={colors.white} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: "absolute",
    left: spacing.md,
    right: spacing.md,
    minHeight: 56,
    borderRadius: radii.lg,
    backgroundColor: colors.accent,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    zIndex: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        shadowOffset: { width: 0, height: 4 },
      },
      android: { elevation: 8 },
    }),
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    flex: 1,
  },
  emojiRow: {
    flexDirection: "row",
  },
  emojiChip: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginRight: -8,
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  emoji: {
    fontSize: 16,
  },
  count: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 12,
    fontWeight: "600",
  },
  price: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
  },
  cta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingLeft: spacing.sm,
  },
  ctaText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "800",
  },
});
