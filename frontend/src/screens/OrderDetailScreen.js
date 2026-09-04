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
  Star,
  Share2,
} from "../utils/lucideIcons";
import ProductImage from "../components/ProductImage";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { cancelOrder, fetchOrderById, rateOrder } from "../api/ordersApi";
import { useAuth } from "../context/AuthContext";
import { statusLabel } from "../utils/orderStatus";
import { shareOrder } from "../utils/share";
import { colors, spacing, radii, shadows } from "../theme/colors";
import { fonts } from "../theme/typography";

const STEP_ICON = {
  confirmed: CircleCheck,
  packing: Package,
  out_for_delivery: Truck,
  delivered: PackageCheck,
};

const REVIEW_CHIPS = ["On time", "Fresh items", "Good packing", "Polite partner"];

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

/** Prefer explicit ETA fields; otherwise a soft fallback. */
function orderEtaLabel(order) {
  if (!order || order.status === "delivered" || order.status === "cancelled") {
    return null;
  }

  const raw =
    order.deliveryMinutes ??
    order.etaMinutes ??
    order.eta?.minutes ??
    order.estimatedMinutes;

  const mins = Number(raw);
  if (Number.isFinite(mins) && mins > 0) {
    const rounded = Math.max(1, Math.round(mins));
    return `Arriving in ${rounded} min`;
  }

  return "Arriving soon";
}

function StarsRow({ value, onChange, size = 28, interactive = true }) {
  return (
    <View style={styles.starsRow}>
      {[1, 2, 3, 4, 5].map((n) => {
        const on = n <= value;
        const Comp = interactive ? Pressable : View;
        return (
          <Comp
            key={n}
            onPress={interactive ? () => onChange?.(n) : undefined}
            hitSlop={6}
            style={styles.starHit}
          >
            <Star
              size={size}
              color={on ? colors.primaryDark : colors.borderStrong}
              fill={on ? colors.primary : "transparent"}
              strokeWidth={2}
            />
          </Comp>
        );
      })}
    </View>
  );
}

export default function OrderDetailScreen({ navigation, route }) {
  const { orderId } = route.params;
  const { user } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [ratingStars, setRatingStars] = useState(0);
  const [reviewChips, setReviewChips] = useState([]);
  const [submittingRate, setSubmittingRate] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchOrderById(orderId);
      setOrder(data);
      if (data.rating?.stars) setRatingStars(data.rating.stars);
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

  function toggleChip(chip) {
    setReviewChips((prev) =>
      prev.includes(chip) ? prev.filter((c) => c !== chip) : [...prev, chip]
    );
  }

  async function onShare() {
    if (!order) return;
    try {
      await shareOrder(order);
    } catch (err) {
      // User dismisses sheet → often no error; real failures only
      if (err?.message && !/dismiss|cancel/i.test(String(err.message))) {
        Alert.alert("Could not share", err.message);
      }
    }
  }

  async function onSubmitRating() {
    if (!user?.phone || submittingRate) return;
    if (ratingStars < 1) {
      Alert.alert("Pick stars", "Tap 1–5 stars before submitting.");
      return;
    }

    setSubmittingRate(true);
    try {
      const data = await rateOrder({
        orderId,
        phone: user.phone,
        stars: ratingStars,
        review: reviewChips.join(" · "),
      });
      setOrder(data);
      Alert.alert("Thanks!", "Your rating was saved.");
    } catch (err) {
      Alert.alert("Could not rate", err.message || "Try again");
    } finally {
      setSubmittingRate(false);
    }
  }

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
  const delivered = order?.status === "delivered";
  const alreadyRated = Boolean(order?.rating?.stars);
  const etaLabel = order ? orderEtaLabel(order) : null;

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ChevronLeft size={24} color={colors.text} strokeWidth={2.4} />
        </Pressable>
        <Text style={styles.headerTitle}>Track order</Text>
        <View style={styles.headerActions}>
          <Pressable
            onPress={onShare}
            style={styles.iconBtn}
            disabled={!order}
            hitSlop={6}
          >
            <Share2
              size={18}
              color={order ? colors.text : colors.textMuted}
              strokeWidth={2.2}
            />
          </Pressable>
          <Pressable onPress={load} style={styles.iconBtn}>
            <RefreshCw size={18} color={colors.text} strokeWidth={2.2} />
          </Pressable>
        </View>
      </View>
      <View style={styles.curve} />

      {loading && !order ? (
        <LoadingState message="Loading order..." />
      ) : error && !order ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <View style={[styles.hero, cancelled && styles.heroCancelled, shadows.soft]}>
            <Text style={styles.heroEyebrow}>
              {cancelled ? "Order status" : "Live status"}
            </Text>
            <Text style={[styles.heroStatus, cancelled && styles.heroStatusCancelled]}>
              {statusLabel(order.status)}
            </Text>
            {etaLabel ? <Text style={styles.heroEta}>{etaLabel}</Text> : null}
            <Text style={styles.heroId}>{order.id}</Text>
            <Text style={styles.heroWhen}>Placed {formatWhen(order.createdAt)}</Text>
            {cancelled && order.cancelledAt ? (
              <Text style={styles.heroHint}>
                Cancelled {formatWhen(order.cancelledAt)}
              </Text>
            ) : null}
          </View>

          <Pressable style={[styles.shareBtn, shadows.soft]} onPress={onShare}>
            <Share2 size={16} color={colors.accent} strokeWidth={2.3} />
            <Text style={styles.shareBtnText}>Share order summary</Text>
          </Pressable>

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

          {delivered ? (
            <View style={[styles.rateCard, shadows.soft]}>
              <Text style={styles.rateTitle}>
                {alreadyRated ? "Your rating" : "Rate this order"}
              </Text>
              <Text style={styles.rateHint}>
                {alreadyRated
                  ? "Thanks for the feedback"
                  : "How was delivery & product quality?"}
              </Text>
              <StarsRow
                value={alreadyRated ? order.rating.stars : ratingStars}
                onChange={setRatingStars}
                interactive={!alreadyRated}
              />
              {!alreadyRated ? (
                <>
                  <View style={styles.chipWrap}>
                    {REVIEW_CHIPS.map((chip) => {
                      const on = reviewChips.includes(chip);
                      return (
                        <Pressable
                          key={chip}
                          style={[styles.chip, on && styles.chipOn]}
                          onPress={() => toggleChip(chip)}
                        >
                          <Text style={[styles.chipText, on && styles.chipTextOn]}>
                            {chip}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                  <Pressable
                    style={[
                      styles.rateBtn,
                      (submittingRate || ratingStars < 1) && { opacity: 0.6 },
                    ]}
                    onPress={onSubmitRating}
                    disabled={submittingRate || ratingStars < 1}
                  >
                    <Text style={styles.rateBtnText}>
                      {submittingRate ? "Saving…" : "Submit rating"}
                    </Text>
                  </Pressable>
                </>
              ) : order.rating.review ? (
                <Text style={styles.reviewText}>{order.rating.review}</Text>
              ) : null}
            </View>
          ) : null}

          {!cancelled ? (
            <>
              <Text style={styles.section}>Order status</Text>
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
            {order.couponDiscount > 0 ? (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>
                  Coupon ({order.coupon?.code || "promo"})
                </Text>
                <Text style={[styles.billValue, { color: colors.accent }]}>
                  −₹{order.couponDiscount}
                </Text>
              </View>
            ) : null}
            <View style={styles.billRow}>
              <Text style={styles.billLabel}>Payment</Text>
              <Text style={styles.billValue}>
                {order.payment?.label || "Cash on delivery"}
                {order.paymentStatus === "paid" ? " · Paid" : " · Pay on delivery"}
              </Text>
            </View>
            {order.tipAmount > 0 ? (
              <View style={styles.billRow}>
                <Text style={styles.billLabel}>Delivery tip</Text>
                <Text style={styles.billValue}>₹{order.tipAmount}</Text>
              </View>
            ) : null}
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
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.2,
  },
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
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
    backgroundColor: colors.primarySoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    padding: spacing.lg,
    marginBottom: spacing.lg,
  },
  heroEyebrow: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.textMuted,
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  heroStatus: {
    fontSize: 22,
    fontFamily: fonts.extraBold,
    color: colors.accentDark,
    letterSpacing: -0.5,
  },
  heroCancelled: {
    borderColor: "#F8C9CD",
    backgroundColor: "#FFF8F8",
  },
  heroStatusCancelled: {
    color: colors.danger,
  },
  heroEta: {
    marginTop: 6,
    fontSize: 18,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.4,
  },
  heroId: {
    marginTop: spacing.sm,
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.textSecondary,
  },
  heroWhen: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.semiBold,
  },
  heroHint: {
    marginTop: spacing.sm,
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: fonts.medium,
    lineHeight: 16,
  },
  shareBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    marginBottom: spacing.md,
  },
  shareBtnText: {
    fontSize: 14,
    fontFamily: fonts.extraBold,
    color: colors.accent,
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
    fontFamily: fonts.extraBold,
    fontSize: 14,
  },
  rateCard: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.lg,
    alignItems: "center",
  },
  rateTitle: {
    fontSize: 16,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.2,
  },
  rateHint: {
    marginTop: 4,
    marginBottom: spacing.md,
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.semiBold,
    textAlign: "center",
  },
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  starHit: {
    padding: 2,
  },
  chipWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
    marginTop: spacing.md,
  },
  chip: {
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: colors.surface,
  },
  chipOn: {
    borderColor: colors.accent,
    backgroundColor: colors.accentSoft,
  },
  chipText: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.textSecondary,
  },
  chipTextOn: {
    color: colors.accentDark,
  },
  rateBtn: {
    marginTop: spacing.lg,
    alignSelf: "stretch",
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 12,
    alignItems: "center",
  },
  rateBtnText: {
    color: colors.white,
    fontFamily: fonts.extraBold,
    fontSize: 14,
  },
  reviewText: {
    marginTop: spacing.md,
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
    textAlign: "center",
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
    fontFamily: fonts.extraBold,
    color: colors.text,
    marginBottom: 4,
  },
  cancelledNoteText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 19,
    fontFamily: fonts.medium,
  },
  section: {
    fontSize: 14,
    fontFamily: fonts.extraBold,
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: -0.15,
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
    fontFamily: fonts.extraBold,
    color: colors.textSecondary,
  },
  stepTitleActive: {
    color: colors.text,
  },
  stepHint: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.medium,
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
    fontFamily: fonts.extraBold,
    color: colors.text,
  },
  addressLine: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
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
    fontFamily: fonts.bold,
    color: colors.text,
  },
  itemMeta: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textMuted,
    fontFamily: fonts.semiBold,
  },
  itemPrice: {
    fontSize: 13,
    fontFamily: fonts.extraBold,
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
    fontFamily: fonts.semiBold,
  },
  billValue: {
    fontSize: 13,
    fontFamily: fonts.extraBold,
    color: colors.text,
  },
  grandLabel: {
    fontSize: 14,
    fontFamily: fonts.extraBold,
    color: colors.text,
  },
  grandValue: {
    fontSize: 15,
    fontFamily: fonts.extraBold,
    color: colors.text,
  },
});
