import { useEffect, useMemo, useState } from "react";
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
  ScrollView,
} from "react-native";
import {
  ShoppingCart,
  Trash2,
  ShieldCheck,
  Bike,
  MapPin,
  Percent,
  X,
} from "../utils/lucideIcons";
import ScreenHeader from "../components/ScreenHeader";
import QtyStepper from "../components/QtyStepper";
import ProductImage from "../components/ProductImage";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useAddress } from "../context/AddressContext";
import { placeOrder } from "../api/ordersApi";
import { COUPONS, evaluateCoupon } from "../data/coupons";
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
  const { selectedAddress } = useAddress();
  const isEmpty = items.length === 0;
  const [placing, setPlacing] = useState(false);
  const [couponCode, setCouponCode] = useState(null);

  const baseDeliveryFee = totalPrice >= 199 ? 0 : 25;

  const couponResult = useMemo(() => {
    if (!couponCode) {
      return {
        ok: true,
        coupon: null,
        discount: 0,
        deliveryFee: baseDeliveryFee,
      };
    }
    return evaluateCoupon(couponCode, totalPrice, baseDeliveryFee);
  }, [couponCode, totalPrice, baseDeliveryFee]);

  // Drop coupon if cart emptied or code no longer qualifies after qty change
  useEffect(() => {
    if (isEmpty && couponCode) setCouponCode(null);
  }, [isEmpty, couponCode]);

  useEffect(() => {
    if (couponCode && !couponResult.ok) setCouponCode(null);
  }, [couponCode, couponResult.ok]);

  const applied = couponCode && couponResult.ok ? couponResult : null;
  const deliveryFee = applied ? applied.deliveryFee : baseDeliveryFee;
  const couponDiscount = applied ? applied.discount : 0;
  const itemOff =
    applied?.coupon?.type === "free_delivery" ? 0 : couponDiscount;
  const grandTotal = Math.max(0, totalPrice - itemOff + deliveryFee);

  function onSelectCoupon(code) {
    if (couponCode === code) {
      setCouponCode(null);
      return;
    }

    const result = evaluateCoupon(code, totalPrice, baseDeliveryFee);
    if (!result.ok) {
      Alert.alert("Coupon locked", result.message || "Not applicable yet");
      return;
    }
    setCouponCode(code);
  }

  async function onProceed() {
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

    if (!selectedAddress) {
      Alert.alert("Add address", "Pick a delivery address first.", [
        {
          text: "Add address",
          onPress: () => navigation.navigate("Addresses"),
        },
      ]);
      return;
    }

    if (placing) return;
    setPlacing(true);

    try {
      const order = await placeOrder({
        name: user.name,
        phone: user.phone,
        address: {
          label: selectedAddress.label,
          line1: selectedAddress.line1,
          line2: selectedAddress.line2 || "",
        },
        couponCode: applied?.coupon?.code || undefined,
        items: items.map((item) => ({
          id: item.id,
          name: item.name,
          unit: item.unit,
          price: item.price,
          qty: item.qty,
          image: item.image,
        })),
      });

      clearCart();
      setCouponCode(null);
      Alert.alert(
        "Order placed!",
        `Delivering to ${selectedAddress.label}. Order ${order.id} for ₹${order.grandTotal}.`,
        [
          {
            text: "Track order",
            onPress: () =>
              navigation.replace("OrderDetail", { orderId: order.id }),
          },
          { text: "View orders", onPress: () => navigation.replace("Orders") },
          { text: "OK" },
        ]
      );
    } catch (err) {
      Alert.alert("Checkout failed", err.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
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
              <View>
                <Pressable
                  style={[styles.addressCard, shadows.soft]}
                  onPress={() => navigation.navigate("Addresses")}
                >
                  <View style={styles.addressIcon}>
                    <MapPin size={16} color={colors.accent} strokeWidth={2.2} />
                  </View>
                  <View style={styles.addressCopy}>
                    <Text style={styles.addressTitle}>
                      Deliver to {selectedAddress?.label || "address"}
                    </Text>
                    <Text style={styles.addressLine} numberOfLines={2}>
                      {selectedAddress
                        ? `${selectedAddress.line1}${
                            selectedAddress.line2
                              ? `, ${selectedAddress.line2}`
                              : ""
                          }`
                        : "Add a delivery address"}
                    </Text>
                  </View>
                  <Text style={styles.changeText}>Change</Text>
                </Pressable>

                <View style={[styles.couponCard, shadows.soft]}>
                  <View style={styles.couponHeader}>
                    <View style={styles.couponTitleRow}>
                      <Percent size={16} color={colors.accent} strokeWidth={2.3} />
                      <Text style={styles.couponTitle}>Apply coupon</Text>
                    </View>
                    {applied ? (
                      <Pressable
                        onPress={() => setCouponCode(null)}
                        hitSlop={8}
                        style={styles.removeCoupon}
                      >
                        <X size={14} color={colors.textMuted} strokeWidth={2.4} />
                        <Text style={styles.removeCouponText}>Remove</Text>
                      </Pressable>
                    ) : null}
                  </View>

                  {applied ? (
                    <View style={styles.appliedBanner}>
                      <Text style={styles.appliedCode}>{applied.coupon.code}</Text>
                      <Text style={styles.appliedSave}>
                        You save ₹{couponDiscount}
                      </Text>
                    </View>
                  ) : null}

                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.couponChips}
                  >
                    {COUPONS.map((coupon) => {
                      const preview = evaluateCoupon(
                        coupon.code,
                        totalPrice,
                        baseDeliveryFee
                      );
                      const selected = couponCode === coupon.code;
                      const locked = !preview.ok;

                      return (
                        <Pressable
                          key={coupon.code}
                          onPress={() => onSelectCoupon(coupon.code)}
                          style={[
                            styles.couponChip,
                            selected && styles.couponChipOn,
                            locked && styles.couponChipLocked,
                          ]}
                        >
                          <Text
                            style={[
                              styles.couponCode,
                              selected && styles.couponCodeOn,
                            ]}
                          >
                            {coupon.code}
                          </Text>
                          <Text
                            style={[
                              styles.couponHint,
                              selected && styles.couponHintOn,
                            ]}
                            numberOfLines={2}
                          >
                            {locked ? preview.message : coupon.description}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </ScrollView>
                </View>

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
                  {couponDiscount > 0 ? (
                    <View style={styles.billRow}>
                      <Text style={styles.billLabel}>
                        Coupon ({applied.coupon.code})
                      </Text>
                      <Text style={[styles.billValue, styles.free]}>
                        −₹{couponDiscount}
                      </Text>
                    </View>
                  ) : null}
                  <View style={styles.divider} />
                  <View style={styles.billRow}>
                    <Text style={styles.grandLabel}>Grand total</Text>
                    <Text style={styles.grandValue}>₹{grandTotal}</Text>
                  </View>
                  <View style={styles.secure}>
                    <ShieldCheck size={14} color={colors.accent} />
                    <Text style={styles.secureText}>
                      {couponDiscount > 0
                        ? `Coupon saved you ₹${couponDiscount}`
                        : deliveryFee === 0
                          ? "Free delivery unlocked"
                          : "Add ₹" +
                            (199 - totalPrice) +
                            " more for free delivery"}
                    </Text>
                  </View>
                </View>
              </View>
            }
          />

          <View style={styles.footer}>
            <Pressable
              style={styles.clearBtn}
              onPress={() => {
                clearCart();
                setCouponCode(null);
              }}
            >
              <Text style={styles.clearText}>Clear</Text>
            </Pressable>
            <Pressable
              style={[styles.checkoutBtn, placing && styles.checkoutDisabled]}
              onPress={onProceed}
              disabled={placing}
            >
              <View>
                <Text style={styles.checkoutPrice}>₹{grandTotal}</Text>
                <Text style={styles.checkoutSub}>TOTAL</Text>
              </View>
              <Text style={styles.checkoutText}>
                {placing
                  ? "Placing…"
                  : isLoggedIn
                    ? "Proceed →"
                    : "Login to proceed →"}
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
  addressCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
    gap: spacing.md,
  },
  addressIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  addressCopy: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.text,
  },
  addressLine: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: "500",
  },
  changeText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.accent,
  },
  couponCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  couponHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },
  couponTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  couponTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
  removeCoupon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  removeCouponText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textMuted,
  },
  appliedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: colors.accentSoft,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.md,
  },
  appliedCode: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.accentDark,
    letterSpacing: 0.3,
  },
  appliedSave: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.accent,
  },
  couponChips: {
    gap: spacing.sm,
    paddingRight: spacing.sm,
  },
  couponChip: {
    width: 148,
    borderWidth: 1.2,
    borderColor: colors.borderStrong,
    borderStyle: "dashed",
    borderRadius: radii.md,
    padding: spacing.md,
    backgroundColor: colors.surface,
  },
  couponChipOn: {
    borderColor: colors.accent,
    borderStyle: "solid",
    backgroundColor: colors.accentSoft,
  },
  couponChipLocked: {
    opacity: 0.72,
  },
  couponCode: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: 0.4,
  },
  couponCodeOn: {
    color: colors.accentDark,
  },
  couponHint: {
    marginTop: 6,
    fontSize: 11,
    lineHeight: 15,
    color: colors.textMuted,
    fontWeight: "600",
  },
  couponHintOn: {
    color: colors.accentDark,
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
  checkoutDisabled: {
    opacity: 0.7,
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
