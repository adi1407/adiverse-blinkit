import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing } from "../theme/colors";

export default function HomeHeader({ minutes, addressLabel, address }) {
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

        <Pressable style={styles.cartBtn} accessibilityLabel="Cart">
          <Ionicons name="cart-outline" size={24} color={colors.text} />
        </Pressable>
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
  cartBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.45)",
    alignItems: "center",
    justifyContent: "center",
  },
});
