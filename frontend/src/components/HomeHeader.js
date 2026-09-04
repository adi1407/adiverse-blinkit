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
import { colors, spacing } from "../theme/colors";
import { fonts } from "../theme/typography";

function IconButton({ onPress, children, accessibilityLabel }) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.iconBtn,
        pressed && { opacity: 0.7, transform: [{ scale: 0.96 }] },
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
            <MapPin size={13} color={colors.text} strokeWidth={2.6} fill={colors.text} />
            <Text style={styles.addressLabel} numberOfLines={1}>
              {label} - {line}
            </Text>
            <ChevronDown size={14} color={colors.text} strokeWidth={2.6} />
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
    paddingTop: 6,
    paddingBottom: 4,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: spacing.md,
  },
  locationBlock: {
    flex: 1,
    minWidth: 0,
    paddingTop: 2,
  },
  etaLabel: {
    fontSize: 11,
    color: "rgba(31,31,31,0.65)",
    fontFamily: fonts.semiBold,
    letterSpacing: 0.1,
  },
  etaValue: {
    fontSize: 26,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.9,
    lineHeight: 30,
    marginTop: 1,
  },
  addressRow: {
    marginTop: 2,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
  },
  addressLabel: {
    flexShrink: 1,
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  right: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingTop: 4,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
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
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.extraBold,
  },
});
