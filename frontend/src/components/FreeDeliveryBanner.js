import { View, Text, StyleSheet } from "react-native";
import { Bike, Sparkles } from "../utils/lucideIcons";
import { colors, spacing, radii } from "../theme/colors";
import { getDeliveryProgress } from "../utils/delivery";

/**
 * Blinkit-style strip: how close the cart is to free delivery.
 * forceUnlocked = true when a free-delivery coupon wiped the fee.
 */
export default function FreeDeliveryBanner({
  itemTotal,
  forceUnlocked = false,
  compact = false,
}) {
  const { remaining, progress, unlocked, minOrder } = getDeliveryProgress(
    itemTotal
  );
  const done = unlocked || forceUnlocked;
  const pct = done ? 1 : progress;

  return (
    <View style={[styles.card, compact && styles.cardCompact]}>
      <View style={styles.top}>
        <View style={[styles.iconWell, done && styles.iconWellDone]}>
          {done ? (
            <Sparkles size={16} color={colors.accent} strokeWidth={2.2} />
          ) : (
            <Bike size={16} color={colors.accent} strokeWidth={2.2} />
          )}
        </View>
        <View style={styles.copy}>
          <Text style={[styles.title, compact && styles.titleCompact]}>
            {done
              ? "Yay! Free delivery unlocked"
              : `Add ₹${remaining} for free delivery`}
          </Text>
          {!compact ? (
            <Text style={styles.subtitle}>
              {done
                ? forceUnlocked && !unlocked
                  ? "Coupon waived the delivery fee"
                  : `Orders ₹${minOrder}+ get FREE delivery`
                : `Shop ₹${minOrder}+ · save ₹25 on delivery`}
            </Text>
          ) : null}
        </View>
      </View>

      <View style={[styles.track, compact && styles.trackCompact]}>
        <View
          style={[
            styles.fill,
            compact && styles.fillCompact,
            { width: `${Math.round(pct * 100)}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.accentSoft,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: "#C8E6C9",
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  cardCompact: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 0,
    backgroundColor: "rgba(255,255,255,0.12)",
    borderColor: "rgba(255,255,255,0.18)",
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  // keep margin for compact too — track sits under title
  iconWell: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  iconWellDone: {
    backgroundColor: colors.white,
  },
  copy: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
  },
  titleCompact: {
    color: colors.white,
    fontSize: 12,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    fontWeight: "600",
    color: colors.textSecondary,
  },
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: "rgba(12, 131, 31, 0.15)",
    overflow: "hidden",
  },
  trackCompact: {
    backgroundColor: "rgba(255,255,255,0.22)",
    marginBottom: 0,
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
  fillCompact: {
    backgroundColor: colors.primary,
  },
});
