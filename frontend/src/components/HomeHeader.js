import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import {
  Bell,
  MapPin,
  ChevronDown,
  UserRound,
} from "../utils/lucideIcons";
import { useAddress } from "../context/AddressContext";
import { useNotifications } from "../context/NotificationContext";
import { colors, spacing, shadows } from "../theme/colors";
import { fonts } from "../theme/typography";

function IconButton({ onPress, children, accessibilityLabel }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.iconBtn,
        pressed && styles.iconBtnPressed,
      ]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </Pressable>
  );
}

export default function HomeHeader({ minutes }) {
  const navigation = useNavigation();
  const { selectedAddress } = useAddress();
  const { unreadCount } = useNotifications();

  const label = selectedAddress?.label || "Home";
  const line = selectedAddress?.line1 || "Add delivery address";

  return (
    <View style={styles.wrap}>
      <View style={styles.topRow}>
        <Pressable
          style={styles.locationBlock}
          onPress={() => navigation.navigate("Addresses")}
          accessibilityRole="button"
          accessibilityLabel="Change delivery address"
        >
          <Text style={styles.etaLabel}>Delivery in</Text>
          <Text style={styles.etaValue}>{minutes} minutes</Text>
          <View style={styles.addressRow}>
            <MapPin size={14} color={colors.text} strokeWidth={2.4} />
            <Text style={styles.addressLabel} numberOfLines={1}>
              {label} · {line}
            </Text>
            <ChevronDown size={14} color={colors.text} strokeWidth={2.4} />
          </View>
        </Pressable>

        <View style={styles.right}>
          <IconButton
            accessibilityLabel="Notifications"
            onPress={() => navigation.navigate("Notifications")}
          >
            <Bell size={18} color={colors.text} strokeWidth={2.2} />
            {unreadCount > 0 ? (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? "99+" : unreadCount}
                </Text>
              </View>
            ) : null}
          </IconButton>

          <IconButton
            accessibilityLabel="Profile"
            onPress={() => navigation.navigate("Account")}
          >
            <UserRound size={18} color={colors.text} strokeWidth={2.2} />
          </IconButton>
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
    paddingBottom: spacing.sm,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  locationBlock: {
    flex: 1,
    minWidth: 0,
  },
  etaLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontFamily: fonts.semiBold,
  },
  etaValue: {
    fontSize: 22,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.6,
    marginTop: -1,
  },
  addressRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  addressLabel: {
    flexShrink: 1,
    fontSize: 13,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.72)",
    alignItems: "center",
    justifyContent: "center",
    ...shadows.soft,
  },
  iconBtnPressed: {
    opacity: 0.75,
    backgroundColor: colors.primarySoft,
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
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
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.extraBold,
  },
});
