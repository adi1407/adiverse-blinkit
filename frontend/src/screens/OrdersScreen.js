import { useCallback, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Pressable,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { Package, ChevronRight, Star } from "../utils/lucideIcons";
import ScreenHeader from "../components/ScreenHeader";
import ProductImage from "../components/ProductImage";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { useAuth } from "../context/AuthContext";
import { fetchOrders } from "../api/ordersApi";
import { statusLabel } from "../utils/orderStatus";
import { colors, spacing, radii, shadows } from "../theme/colors";

function formatWhen(iso) {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

function OrderCard({ order, onPress }) {
  const preview = order.items.slice(0, 3);
  const extra = order.items.length - preview.length;

  return (
    <Pressable style={[styles.card, shadows.soft]} onPress={onPress}>
      <View style={styles.cardTop}>
        <View>
          <Text style={styles.orderId}>{order.id}</Text>
          <Text style={styles.when}>{formatWhen(order.createdAt)}</Text>
        </View>
        <View
          style={[
            styles.statusPill,
            order.status === "cancelled" && styles.statusPillCancelled,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              order.status === "cancelled" && styles.statusTextCancelled,
            ]}
          >
            {statusLabel(order.status)}
          </Text>
        </View>
      </View>

      <View style={styles.thumbs}>
        {preview.map((item) => (
          <ProductImage
            key={`${order.id}-${item.id}`}
            uri={item.image}
            style={styles.thumb}
            iconSize={16}
          />
        ))}
        {extra > 0 ? (
          <View style={styles.moreChip}>
            <Text style={styles.moreText}>+{extra}</Text>
          </View>
        ) : null}
      </View>

      <View style={styles.cardBottom}>
        <Text style={styles.itemCount}>
          {order.items.reduce((n, i) => n + i.qty, 0)} items
          {order.address?.label ? ` · ${order.address.label}` : ""}
          {order.payment?.label ? ` · ${order.payment.label}` : ""}
        </Text>
        <View style={styles.trackRow}>
          <Text style={styles.total}>₹{order.grandTotal}</Text>
          <ChevronRight size={16} color={colors.accent} />
        </View>
      </View>
      {order.address?.line1 ? (
        <Text style={styles.shipTo} numberOfLines={1}>
          {order.address.line1}
        </Text>
      ) : null}
      {order.rating?.stars ? (
        <View style={styles.ratingRow}>
          {[1, 2, 3, 4, 5].map((n) => (
            <Star
              key={n}
              size={12}
              color={n <= order.rating.stars ? colors.primaryDark : colors.borderStrong}
              fill={n <= order.rating.stars ? colors.primary : "transparent"}
              strokeWidth={2}
            />
          ))}
        </View>
      ) : order.status === "delivered" ? (
        <Text style={styles.rateCta}>Tap to rate this order</Text>
      ) : null}
    </Pressable>
  );
}

export default function OrdersScreen({ navigation }) {
  const { user, isLoggedIn } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (!isLoggedIn) {
        setOrders([]);
        setLoading(false);
        setRefreshing(false);
        setError("");
        return;
      }

      if (silent) setRefreshing(true);
      else setLoading(true);
      setError("");
      try {
        const data = await fetchOrders(user.phone);
        setOrders(data.orders || []);
      } catch (err) {
        setError(err.message || "Failed to load orders");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [isLoggedIn, user?.phone]
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader showBack title="Your orders" subtitle="Tap an order to track" />
      <View style={styles.curve} />

      {!isLoggedIn ? (
        <View style={styles.centerBody}>
          <View style={[styles.emptyBox, shadows.soft]}>
            <Package size={32} color={colors.accent} strokeWidth={1.8} />
            <Text style={styles.emptyTitle}>Login to see orders</Text>
            <Text style={styles.emptyText}>
              Orders are saved against your phone number on the server.
            </Text>
            <Pressable
              style={styles.loginBtn}
              onPress={() => navigation.navigate("Login", { returnTo: "Orders" })}
            >
              <Text style={styles.loginText}>Login</Text>
              <ChevronRight size={16} color={colors.white} />
            </Pressable>
          </View>
        </View>
      ) : loading && orders.length === 0 ? (
        <LoadingState message="Loading orders..." />
      ) : error && orders.length === 0 ? (
        <ErrorState message={error} onRetry={() => load()} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load({ silent: true })}
              tintColor={colors.accent}
              colors={[colors.accent]}
              progressBackgroundColor={colors.white}
            />
          }
          ListEmptyComponent={
            <View style={styles.emptyBox}>
              <Package size={32} color={colors.accent} strokeWidth={1.8} />
              <Text style={styles.emptyTitle}>No orders yet</Text>
              <Text style={styles.emptyText}>
                Place an order from Cart — it will show up here.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <OrderCard
              order={item}
              onPress={() =>
                navigation.navigate("OrderDetail", { orderId: item.id })
              }
            />
          )}
        />
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
  list: {
    flexGrow: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    paddingBottom: 40,
  },
  centerBody: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    justifyContent: "center",
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: spacing.md,
  },
  orderId: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
  },
  when: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
  },
  statusPill: {
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPillCancelled: {
    backgroundColor: "#FFE8EA",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.accentDark,
    textTransform: "capitalize",
  },
  statusTextCancelled: {
    color: colors.danger,
  },
  thumbs: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: spacing.md,
  },
  thumb: {
    width: 44,
    height: 44,
    borderRadius: 8,
    overflow: "hidden",
    backgroundColor: colors.surface,
  },
  moreChip: {
    width: 44,
    height: 44,
    borderRadius: 8,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  moreText: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.textSecondary,
  },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  itemCount: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  total: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
  },
  trackRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  shipTo: {
    marginTop: 8,
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
  },
  ratingRow: {
    marginTop: 8,
    flexDirection: "row",
    gap: 3,
  },
  rateCta: {
    marginTop: 8,
    fontSize: 11,
    fontWeight: "800",
    color: colors.accent,
  },
  emptyBox: {
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xxl,
  },
  emptyTitle: {
    marginTop: spacing.md,
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
  },
  emptyText: {
    marginTop: spacing.sm,
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 19,
  },
  loginBtn: {
    marginTop: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  loginText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 14,
  },
});
