import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Bell,
  MapPin,
  ChevronDown,
  UserRound,
  ShoppingBag,
} from "../utils/lucideIcons";
import { useAddress } from "../context/AddressContext";
import { useNotifications } from "../context/NotificationContext";
import { useCart } from "../context/CartContext";
import { colors, spacing } from "../theme/colors";
import { fonts } from "../theme/typography";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

function IconButton({ onPress, children, accessibilityLabel, glass }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.iconBtn,
        glass && styles.iconBtnGlass,
        pressed && styles.iconBtnPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      hitSlop={6}
    >
      {children}
    </Pressable>
  );
}

export default function HomeHeader({ minutes, compact = false }) {
  const navigation = useNavigation();
  const { selectedAddress } = useAddress();
  const { unreadCount } = useNotifications();
  const { totalItems } = useCart();
  const reduceMotion = usePrefersReducedMotion();
  const cartPulse = useRef(new Animated.Value(1)).current;
  const prevItems = useRef(totalItems);

  const label = selectedAddress?.label || "Home";
  const line = selectedAddress?.line1 || "Add delivery address";

  useEffect(() => {
    if (totalItems === prevItems.current) return;
    const grew = totalItems > prevItems.current;
    prevItems.current = totalItems;
    if (!grew || reduceMotion) return;

    Animated.sequence([
      Animated.timing(cartPulse, {
        toValue: 1.18,
        duration: 110,
        useNativeDriver: true,
      }),
      Animated.spring(cartPulse, {
        toValue: 1,
        friction: 4,
        tension: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [totalItems, cartPulse, reduceMotion]);

  return (
    <View
      style={[styles.wrap, compact && styles.wrapCompact]}
      accessibilityRole="summary"
    >
      <View style={styles.topRow}>
        <Pressable
          style={({ pressed }) => [
            styles.locationBlock,
            pressed && styles.locationPressed,
          ]}
          onPress={() => navigation.navigate("Addresses")}
          accessibilityRole="button"
          accessibilityLabel={`Deliver to ${label}. ${line}. Double tap to change address`}
          accessibilityHint="Opens address list"
        >
          <Text style={styles.deliverTo}>Deliver to</Text>
          <Text
            style={[styles.etaValue, compact && styles.etaValueCompact]}
            numberOfLines={1}
          >
            {minutes} mins
          </Text>
          <View style={styles.addressRow}>
            <MapPin
              size={compact ? 12 : 13}
              color={colors.text}
              strokeWidth={2.5}
              fill={colors.text}
            />
            <Text style={styles.addressLabel} numberOfLines={1}>
              <Text style={styles.addressStrong}>{label}</Text>
              {line ? ` · ${line}` : ""}
            </Text>
            <ChevronDown size={14} color={colors.text} strokeWidth={2.5} />
          </View>
        </Pressable>

        <View style={styles.right}>
          <IconButton
            glass={compact}
            accessibilityLabel={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications"
            }
            onPress={() => navigation.navigate("Notifications")}
          >
            <Bell size={17} color={colors.text} strokeWidth={2.2} />
            {unreadCount > 0 ? (
              <View style={styles.badge} importantForAccessibility="no">
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            ) : null}
          </IconButton>

          <IconButton
            glass={compact}
            accessibilityLabel={
              totalItems > 0 ? `Cart, ${totalItems} items` : "Cart"
            }
            onPress={() => navigation.navigate("Cart")}
          >
            <ShoppingBag size={17} color={colors.text} strokeWidth={2.2} />
            {totalItems > 0 ? (
              <Animated.View
                style={[styles.cartBadge, { transform: [{ scale: cartPulse }] }]}
                importantForAccessibility="no"
              >
                <Text style={styles.badgeText}>
                  {totalItems > 99 ? "99+" : totalItems}
                </Text>
              </Animated.View>
            ) : null}
          </IconButton>

          <IconButton
            glass={compact}
            accessibilityLabel="Account"
            onPress={() => navigation.navigate("Account")}
          >
            <UserRound size={17} color={colors.text} strokeWidth={2.2} />
          </IconButton>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: "transparent",
    paddingHorizontal: spacing.lg,
    paddingTop: 6,
    paddingBottom: 4,
  },
  wrapCompact: {
    paddingTop: 4,
    paddingBottom: 2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  locationBlock: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
    paddingRight: 4,
    borderRadius: 10,
  },
  locationPressed: {
    opacity: 0.72,
  },
  deliverTo: {
    fontSize: 11,
    color: "rgba(31,31,31,0.58)",
    fontFamily: fonts.semiBold,
    letterSpacing: 0.15,
  },
  etaValue: {
    fontSize: 24,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.8,
    lineHeight: 28,
    marginTop: 1,
  },
  etaValueCompact: {
    fontSize: 20,
    lineHeight: 24,
  },
  addressRow: {
    marginTop: 3,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingVertical: 2,
  },
  addressLabel: {
    flexShrink: 1,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
  },
  addressStrong: {
    fontFamily: fonts.extraBold,
    color: colors.text,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingTop: 2,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(0,0,0,0.06)",
  },
  iconBtnGlass: {
    backgroundColor: "rgba(255,255,255,0.55)",
    borderColor: "rgba(255,255,255,0.75)",
  },
  iconBtnPressed: {
    opacity: 0.75,
    transform: [{ scale: 0.95 }],
    backgroundColor: colors.white,
  },
  badge: {
    position: "absolute",
    top: -3,
    right: -3,
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
  cartBadge: {
    position: "absolute",
    top: -3,
    right: -3,
    minWidth: 17,
    height: 17,
    borderRadius: 9,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.extraBold,
  },
});
