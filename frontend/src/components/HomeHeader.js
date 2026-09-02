import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useCart } from "../context/CartContext";
import { colors, spacing } from "../theme/colors";

export default function HomeHeader({ minutes, addressLabel, address }) {
  const navigation = useNavigation();
  const { totalItems } = useCart();

  return (
    <View style={styles.wrap}>
      <View style={styles.row}>
        <View style={styles.left}>
          <Text style={styles.eta}>
            Delivery in <Text style={styles.etaBold}>{minutes} minutes</Text>
          </Text>
          <Pressable style={styles.addressRow}>
            <Ionicons name="location-sharp" size={16} color={colors.text} />
            <Text style={styles.addressLabel} numberOfLines={1}>
              {addressLabel} — {address}
            </Text>
            <Ionicons name="chevron-down" size={16} color={colors.text} />
          </Pressable>
        </View>

        <View style={styles.right}>
          <Pressable
            style={styles.iconBtn}
            onPress={() => navigation.navigate("Account")}
            accessibilityLabel="Account"
          >
            <Ionicons name="person-circle-outline" size={28} color={colors.text} />
          </Pressable>

          <Pressable
            style={styles.iconBtn}
            onPress={() => navigation.navigate("Cart")}
            accessibilityLabel="Cart"
          >
            <Ionicons name="cart-outline" size={24} color={colors.text} />
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  left: {
    flex: 1,
    paddingRight: spacing.md,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  eta: {
    fontSize: 13,
    color: colors.text,
    marginBottom: 2,
  },
  etaBold: {
    fontWeight: "800",
    fontSize: 15,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addressLabel: {
    flexShrink: 1,
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: "800",
  },
});
