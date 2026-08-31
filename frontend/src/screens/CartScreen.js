import { SafeAreaView, View, Text, StyleSheet, StatusBar, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ScreenHeader from "../components/ScreenHeader";
import { colors, spacing, radii } from "../theme/colors";

export default function CartScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader title="Cart" subtitle="Items you add will show here" />
      <View style={styles.body}>
        <View style={styles.emptyBox}>
          <Ionicons name="cart-outline" size={56} color={colors.textMuted} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Add products from Home. Cart logic comes in a later chunk.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
  },
  emptyBox: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: radii.lg,
    padding: spacing.xxl,
  },
  emptyTitle: {
    marginTop: spacing.md,
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
  },
  emptyText: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});
