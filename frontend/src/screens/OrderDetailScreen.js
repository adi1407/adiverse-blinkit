import { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import {
  ChevronLeft,
  CircleCheck,
  Package,
  PackageCheck,
  Truck,
  MapPin,
  RefreshCw,
} from "../utils/lucideIcons";
import ProductImage from "../components/ProductImage";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { cancelOrder, fetchOrderById } from "../api/ordersApi";
import { useAuth } from "../context/AuthContext";
import { statusLabel } from "../utils/orderStatus";
import { colors, spacing, radii, shadows } from "../theme/colors";

const STEP_ICON = {
  confirmed: CircleCheck,
  packing: Package,
  out_for_delivery: Truck,
  delivered: PackageCheck,
};

function formatWhen(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function OrderDetailScreen({ navigation, route }) {
  const { orderId } = route.params;
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchOrderById(orderId);
      setOrder(data);
    } catch (err) {
      setError(err.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  }, [orderId]);

  useEffect(() => {
    load();
  }, [load]);

  // Poll while order is still moving
  useEffect(() => {
    if (!order || order.status === "delivered" || order.status === "cancelled") {
      return undefined;
    }
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, [order?.status, load]);

  function onCancel() {
    Alert.alert(
      "Cancel order?",
      "You can only cancel while the order is still confirmed (before packing).",
      [
        { text: "Keep order", style: "cancel" },
        {
          text: "Cancel order",
          style: "destructive",
          onPress: async () => {
            if (!user?.phone || cancelling) return;
            setCancelling(true);
            try {
              const data = await cancelOrder({
                orderId,
                phone: user.phone,
              });
              setOrder(data);
              Alert.alert("Cancelled", "Your order was cancelled successfully.");
            } catch (err) {
              Alert.alert("Could not cancel", err.message || "Try again");
              load();
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  }

  const cancelled = order?.status === "cancelled";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ChevronLeft size={24} color={colors.text} strokeWidth={2.4} />
        </Pressable>
        <Text style={styles.headerTitle}>Track order</Text>
        <Pressable onPress={load} style={styles.iconBtn}>
          <RefreshCw size={18} color={colors.text} strokeWidth={2.2} />
        </Pressable>
      </View>
      <View style={styles.curve} />

      {loading && !order ? (
        <LoadingState message="Loading order..." />
      ) : error && !order ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={[styles.hero, cancelled && styles.heroCancelled, shadows.soft]}>
            <Text style={[styles.heroStatus, cancelled && styles.heroStatusCancelled]}>
              {statusLabel(order.status)}
            </Text>
            <Text style={styles.heroId}>{order.id}</Text>
            <Text style={styles.heroWhen}>Placed {formatWhen(order.createdAt)}</Text>
            {cancelled && order.cancelledAt ? (
              <Text style={styles.heroHint}>
                Cancelled {formatWhen(order.cancelledAt)}
              </Text>
            ) : null}
            {!cancelled && order.status !== "delivered" ? (
              <Text style={styles.heroHint}>
                Demo tracker: packing ~20s · on the way ~50s · delivered ~90s
              </Text>
            ) : null}
          </View>

          {order.canCancel ? (
            <Pressable
              style={[styles.cancelBtn, cancelling && { opacity: 0.7 }]}
              onPress={onCancel}
              disabled={cancelling}
            >
              <Text style={styles.cancelText}>
                {cancelling ? "Cancelling…" : "Cancel order"}
              </Text>
            </Pressable>
          ) : null}

          {!cancelled ? (
            <>
              <Text style={styles.section}>Live timeline</Text>
              <View style={[styles.timelineCard, shadows.soft]}>
                {(order.timeline || []).map((step, index, arr) => {
                  const Icon = STEP_ICON[step.key] || Package;
                  const last = index === arr.length - 1;
                  return (
                    <View key={step.key} style={styles.stepRow}>
                      <View style={styles.rail}>
                        <View
                          style={[
                            styles.dot,
                            step.done && styles.dotDone,
                            step.active && styles.dotActive,
                          ]}
                        >
                          <Icon
                            size={14}
                            color={step.done ? colors.white : colors.textMuted}
                            strokeWidth={2.2}
                          />
                        </View>
                        {!last ? (
                          <View style={[styles.line, step.done && styles.lineDone]} />
                        ) : null}
                      </View>
                      <View style={styles.stepCopy}>
                        <Text
                          style={[
                            styles.stepTitle,
                            step.active && styles.stepTitleActive,
                          ]}
                        >
                          {step.title}
                        </Text>
                        <Text style={styles.stepHint}>{step.hint}</Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </>
          ) : (
            <View style={[styles.cancelledNote, shadows.soft]}>
              <Text style={styles.cancelledNoteTitle}>Order stopped</Text>
              <Text style={styles.cancelledNoteText}>
                No packing or delivery will happen for this order. Place a new
                one anytime from Cart.
              </Text>
            </View>
          )}

          {order.address ? (
            <>
              <Text style={styles.section}>Delivering to</Text>
              <View style={[styles.addressCard, shadows.soft]}>
                <MapPin size={16} color={colors.accent} strokeWidth={2.2} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.addressLabel}>{order.address.label}</Text>
                  <Text style={styles.addressLine}>
                    {order.address.line1}
                    {order.address.line2 ? `, ${order.address.line2}` : ""}
                  </Text>
                </View>
              </View>
            </>
          ) : null}

          <Text style={styles.section}>Items</Text>
          <View style={[styles.itemsCard, shadows.soft]}>
            {order.items.map((item) => (
              <View key={item.id} style={styles.itemRow}>
                <ProductImage uri={item.image} style={styles.thumb} iconSize={16} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.itemMeta}>
                    {item.unit} · x{item.qty}
                  </Text>
                </View>
                <Text style={styles.itemPrice}>₹{item.lineTotal}</Text>
              </View>
            ))}
            <View style={styles.billDivider} />
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Item total</Text>
              <Text style={styles.billValue}>₹{order.itemTotal}</Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Delivery</Text>
              <Text style={styles.billValue}>
                {order.deliveryFee === 0 ? "FREE" : `₹${order.deliveryFee}`}
              </Text>
            </View>
            <View style={styles.billRow}>
              <Text style={styles.grandLabel}>Grand total</Text>
              <Text style={styles.grandValue}>₹{order.grandTotal}</Text>
            </View>
          </View>
        </ScrollView>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
  },
  curve: {
    height: 14,
    backgroundColor: colors.background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  body: {
    backgroundColor: colors.background,
    padding: spacing.lg,
    paddingBottom: 40,
  },
  hero: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  heroStatus: {
    fontSize: 22,
    fontWeight: "900",
    color: colors.accentDark,
  },
  heroCancelled: {
    borderColor: "#F8C9CD",
    backgroundColor: "#FFF8F8",
  },
  heroStatusCancelled: {
    color: colors.danger,
  },
  heroId: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  heroWhen: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
  },
  heroHint: {
    marginTop: spacing.sm,
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "500",
    lineHeight: 16,
  },
  cancelBtn: {
    borderWidth: 1.5,
    borderColor: colors.danger,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: spacing.lg,
    backgroundColor: "#FFF5F5",
  },
  cancelText: {
    color: colors.danger,
    fontWeight: "900",
    fontSize: 14,
  },
  cancelledNote: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  cancelledNoteTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 4,
  },
  cancelledNoteText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    fontWeight: "500",
  },
  section: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  timelineCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  stepRow: {
    flexDirection: "row",
    minHeight: 56,
  },
  rail: {
    width: 28,
    alignItems: "center",
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  dotDone: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },
  dotActive: {
    backgroundColor: colors.accentDark,
    borderColor: colors.accentDark,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: colors.border,
    marginVertical: 2,
  },
  lineDone: {
    backgroundColor: colors.accent,
  },
  stepCopy: {
    flex: 1,
    paddingLeft: spacing.md,
    paddingBottom: spacing.md,
  },
  stepTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.textSecondary,
  },
  stepTitleActive: {
    color: colors.text,
  },
  stepHint: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "500",
  },
  addressCard: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "flex-start",
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    marginBottom: spacing.lg,
  },
  addressLabel: {
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
  itemsCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  itemName: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  itemMeta: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
  },
  itemPrice: {
    fontSize: 13,
    fontWeight: "900",
    color: colors.text,
  },
  billDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: spacing.sm,
  },
  billRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
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
  grandLabel: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  grandValue: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
  },
});
