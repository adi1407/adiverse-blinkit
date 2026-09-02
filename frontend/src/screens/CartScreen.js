import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  FlatList,
  Pressable,
  Alert,
} from "react-native";
import { ShoppingCart, Trash2, ShieldCheck, Bike } from "../utils/lucideIcons";
import ScreenHeader from "../components/ScreenHeader";
import QtyStepper from "../components/QtyStepper";
import ProductImage from "../components/ProductImage";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { colors, spacing, radii, shadows } from "../theme/colors";

function CartRow({ item }) {
  const { increaseQty, decreaseQty, removeItem } = useCart();

  return (
    <View style={[styles.row, shadows.soft]}>
      <ProductImage uri={item.image} style={styles.thumb} iconSize={22} />

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={2}>
          {item.name}
        </Text>
        <Text style={styles.unit}>{item.unit}</Text>
        <Text style={styles.price}>₹{item.price * item.qty}</Text>
      </View>

      <View style={styles.actions}>
        <QtyStepper
          qty={item.qty}
          onIncrease={() => increaseQty(item.id)}
          onDecrease={() => decreaseQty(item.id)}
        />
        <Pressable onPress={() => removeItem(item.id)} hitSlop={8} style={styles.trash}>
          <Trash2 size={14} color={colors.danger} strokeWidth={2.2} />
        </Pressable>
      </View>
    </View>
  );
}

export default function CartScreen({ navigation }) {
  const { items, totalItems, totalPrice, clearCart } = useCart();
  const { isLoggedIn, user } = useAuth();
  const isEmpty = items.length === 0;
  const deliveryFee = totalPrice >= 199 ? 0 : 25;
  const grandTotal = totalPrice + deliveryFee;

  function onProceed() {
    if (!isLoggedIn) {
      Alert.alert("Login required", "Please login to place your order.", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Login",
          onPress: () => navigation.navigate("Login", { returnTo: "Cart" }),
        },
      ]);
      return;
    }

    Alert.alert(
      "Order placed!",
      `Thanks ${user.name}! Demo order for ₹${grandTotal} is confirmed.`,
      [{ text: "OK", onPress: clearCart }]
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        showBack
        title="Cart"
        subtitle={
          isEmpty
            ? "Your bag is waiting to be filled"
            : `${totalItems} item${totalItems === 1 ? "" : "s"} · almost yours`
        }
      />
      <View style={styles.curve} />

      {isEmpty ? (
        <View style={styles.body}>
          <View style={[styles.emptyBox, shadows.soft]}>
            <View style={styles.emptyIcon}>
              <ShoppingCart size={34} color={colors.accent} strokeWidth={1.8} />
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptyText}>
              Add groceries from Home. Your items and bill will show up here.
            </Text>
          </View>
        </View>
      ) : (
        <View style={styles.filled}>
          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => <CartRow item={item} />}
            ListFooterComponent={
              <View style={[styles.bill, shadows.soft]}>
                <Text style={styles.billTitle}>Bill details</Text>
                <View style={styles.billRow}>
                  <Text style={styles.billLabel}>Item total</Text>
                  <Text style={styles.billValue}>₹{totalPrice}</Text>
                </View>
                <View style={styles.billRow}>
                  <View style={styles.billLabelRow}>
                    <Bike size={14} color={colors.textSecondary} />
                    <Text style={styles.billLabel}>Delivery partner fee</Text>
                  </View>
                  <Text
                    style={[
                      styles.billValue,
                      deliveryFee === 0 && styles.free,
                    ]}
                  >
                    {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                  </Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.billRow}>
                  <Text style={styles.grandLabel}>Grand total</Text>
                  <Text style={styles.grandValue}>₹{grandTotal}</Text>
                </View>
                <View style={styles.secure}>
                  <ShieldCheck size={14} color={colors.accent} />
                  <Text style={styles.secureText}>
                    {deliveryFee === 0
                      ? "Free delivery unlocked"
                      : "Add ₹" + (199 - totalPrice) + " more for free delivery"}
                  </Text>
                </View>
              </View>
            }
          />

          <View style={styles.footer}>
            <Pressable style={styles.clearBtn} onPress={clearCart}>
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
            <Pressable style={styles.checkoutBtn} onPress={onProceed}>
              <View>
                <Text style={styles.checkoutPrice}>₹{grandTotal}</Text>
                <Text style={styles.checkoutSub}>TOTAL</Text>
              </View>
              <Text style={styles.checkoutText}>
                {isLoggedIn ? "Proceed →" : "Login to proceed →"}
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  curve: {
    height: 14,
    backgroundColor: colors.background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  body: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
  },
  emptyBox: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    padding: spacing.xxl,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    marginTop: spacing.md,
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
  },
  emptyText: {
    marginTop: spacing.sm,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
  filled: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: spacing.lg,
    paddingBottom: 24,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  thumb: {
    width: 60,
    height: 60,
    borderRadius: radii.sm,
    overflow: "hidden",
  },
  info: {
    flex: 1,
    marginHorizontal: spacing.md,
  },
  name: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  unit: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
  },
  price: {
    marginTop: 4,
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  actions: {
    alignItems: "flex-end",
    gap: spacing.sm,
  },
  trash: {
    padding: 4,
  },
  bill: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginTop: spacing.sm,
  },
  billTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
    marginBottom: spacing.md,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.sm,
  },
  billLabelRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  billLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  billValue: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
  },
  free: {
    color: colors.accent,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  grandLabel: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  grandValue: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
  },
  secure: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.accentSoft,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  secureText: {
    flex: 1,
    fontSize: 12,
    color: colors.accentDark,
    fontWeight: "700",
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.white,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm,
  },
  clearBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  clearText: {
    color: colors.textSecondary,
    fontWeight: "700",
  },
  checkoutBtn: {
    flex: 1,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkoutPrice: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 16,
  },
  checkoutSub: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 10,
    fontWeight: "700",
  },
  checkoutText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 15,
  },
});
