import { useCallback } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import {
  Bell,
  Package,
  Bike,
  CircleCheck,
  Cross,
  ChevronRight,
} from "../utils/lucideIcons";
import ScreenHeader from "../components/ScreenHeader";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationContext";
import { colors, spacing, radii, shadows } from "../theme/colors";

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

function StatusIcon({ status }) {
  const props = { size: 18, color: colors.accent, strokeWidth: 2.2 };
  if (status === "out_for_delivery") return <Bike {...props} />;
  if (status === "delivered") return <CircleCheck {...props} />;
  if (status === "cancelled")
    return <Cross {...props} color={colors.danger} />;
  return <Package {...props} />;
}

function NotifRow({ item, onPress }) {
  return (
    <Pressable
      style={[styles.row, shadows.soft, !item.read && styles.rowUnread]}
      onPress={onPress}
    >
      <View style={[styles.iconWell, item.status === "cancelled" && styles.iconWellDanger]}>
        <StatusIcon status={item.status} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.bodyText} numberOfLines={2}>
          {item.body}
        </Text>
        <Text style={styles.when}>{formatWhen(item.createdAt)}</Text>
      </View>
      {!item.read ? <View style={styles.dot} /> : null}
      <ChevronRight size={16} color={colors.textMuted} />
    </Pressable>
  );
}

export default function NotificationsScreen({ navigation }) {
  const { isLoggedIn } = useAuth();
  const {
    items,
    unreadCount,
    syncOrders,
    markRead,
    markAllRead,
    clearAll,
  } = useNotifications();

  useFocusEffect(
    useCallback(() => {
      if (isLoggedIn) syncOrders();
    }, [isLoggedIn, syncOrders])
  );

  function onOpen(item) {
    markRead(item.id);
    navigation.navigate("OrderDetail", { orderId: item.orderId });
  }

  function onClear() {
    if (!items.length) return;
    Alert.alert("Clear all notifications?", "This can’t be undone.", [
      { text: "Cancel", style: "cancel" },
      { text: "Clear", style: "destructive", onPress: clearAll },
    ]);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        showBack
        title="Notifications"
        subtitle={
          unreadCount
            ? `${unreadCount} unread`
            : items.length
              ? "You’re all caught up"
              : "Order updates show up here"
        }
      />
      <View style={styles.curve} />

      {!isLoggedIn ? (
        <View style={styles.center}>
          <View style={[styles.empty, shadows.soft]}>
            <Bell size={32} color={colors.accent} strokeWidth={1.8} />
            <Text style={styles.emptyTitle}>Login for alerts</Text>
            <Text style={styles.emptyText}>
              We’ll notify you when packing starts, the rider leaves, and when
              your order is delivered.
            </Text>
            <Pressable
              style={styles.primaryBtn}
              onPress={() =>
                navigation.navigate("Login", { returnTo: "Notifications" })
              }
            >
              <Text style={styles.primaryText}>Login</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <View style={styles.body}>
          {items.length > 0 ? (
            <View style={styles.toolbar}>
              <Pressable onPress={markAllRead} disabled={!unreadCount}>
                <Text
                  style={[
                    styles.toolText,
                    !unreadCount && styles.toolTextDisabled,
                  ]}
                >
                  Mark all read
                </Text>
              </Pressable>
              <Pressable onPress={onClear}>
                <Text style={[styles.toolText, styles.toolDanger]}>Clear</Text>
              </Pressable>
            </View>
          ) : null}

          <FlatList
            data={items}
            keyExtractor={(item) => item.id}
            contentContainerStyle={
              items.length ? styles.list : styles.listEmpty
            }
            renderItem={({ item }) => (
              <NotifRow item={item} onPress={() => onOpen(item)} />
            )}
            ListEmptyComponent={
              <View style={[styles.empty, shadows.soft]}>
                <Bell size={32} color={colors.accent} strokeWidth={1.8} />
                <Text style={styles.emptyTitle}>No notifications yet</Text>
                <Text style={styles.emptyText}>
                  Place an order and watch status updates land here as the demo
                  timeline advances.
                </Text>
              </View>
            }
          />
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
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: "center",
    padding: spacing.lg,
  },
  toolbar: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  toolText: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.accent,
  },
  toolTextDisabled: {
    color: colors.textMuted,
  },
  toolDanger: {
    color: colors.danger,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    gap: spacing.sm,
  },
  listEmpty: {
    flexGrow: 1,
    justifyContent: "center",
    padding: spacing.lg,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
  },
  rowUnread: {
    borderColor: "#C8E6C9",
    backgroundColor: "#F7FBF7",
  },
  iconWell: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWellDanger: {
    backgroundColor: "#FFF5F5",
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: "800",
    color: colors.text,
  },
  bodyText: {
    marginTop: 2,
    fontSize: 12,
    fontWeight: "600",
    color: colors.textSecondary,
    lineHeight: 17,
  },
  when: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
  },
  empty: {
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.xl,
    alignItems: "center",
  },
  emptyTitle: {
    marginTop: spacing.md,
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
  },
  emptyText: {
    marginTop: 6,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    color: colors.textSecondary,
    fontWeight: "500",
  },
  primaryBtn: {
    marginTop: spacing.lg,
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingHorizontal: 22,
    paddingVertical: 12,
  },
  primaryText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 14,
  },
});
