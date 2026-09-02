import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { colors, spacing, shadows } from "../theme/colors";

export default function HomeHeader({ minutes, addressLabel, address }) {
  const navigation = useNavigation();
  const { totalItems } = useCart();

  return (
    <View style={styles.wrap}>
      <View style={styles.brandRow}>
        <View style={styles.brandChip}>
          <Text style={styles.brandText}>blinkit</Text>
        </View>
        <View style={styles.right}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => navigation.navigate("Account")}
          >
            <Ionicons name="person" size={18} color={colors.text} />
          </Pressable>
          <Pressable
            style={styles.iconBtn}
            onPress={() => navigation.navigate("Cart")}
          >
            <Ionicons name="cart" size={18} color={colors.text} />
            {totalItems > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {totalItems > 99 ? "99+" : totalItems}
                </Text>
              </View>
            ) : null}
          </Pressable>
        </View>
      </View>

      <Text style={styles.etaLabel}>Delivery in</Text>
      <Text style={styles.etaValue}>{minutes} minutes</Text>

      <Pressable style={styles.addressRow}>
        <Ionicons name="location-sharp" size={15} color={colors.text} />
        <Text style={styles.addressLabel} numberOfLines={1}>
          {addressLabel} · {address}
        </Text>
        <Ionicons name="chevron-down" size={15} color={colors.text} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  brandChip: {
    backgroundColor: colors.text,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  brandText: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 14,
    letterSpacing: -0.3,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.55)",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: "800",
  },
  etaLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  etaValue: {
    fontSize: 28,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: -0.8,
    marginTop: -2,
  },
  addressRow: {
    marginTop: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addressLabel: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
});
