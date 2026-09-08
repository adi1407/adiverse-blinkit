import { View, Text, StyleSheet } from "react-native";
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg";
import { MapPin, Store } from "../utils/lucideIcons";
import { colors, radii, spacing } from "../theme/colors";
import { fonts } from "../theme/typography";

const W = 320;
const H = 168;

/** Simple route from store (left) to home (right). */
const ROUTE = "M 36 118 C 90 118, 110 48, 168 52 C 220 56, 250 112, 286 108";

function pointOnRoute(t) {
  const pts = [
    [36, 118],
    [70, 112],
    [100, 78],
    [140, 52],
    [180, 54],
    [220, 72],
    [250, 100],
    [286, 108],
  ];
  const clamped = Math.max(0, Math.min(1, t));
  const scaled = clamped * (pts.length - 1);
  const i = Math.floor(scaled);
  const f = scaled - i;
  const a = pts[i];
  const b = pts[Math.min(pts.length - 1, i + 1)];
  return {
    x: a[0] + (b[0] - a[0]) * f,
    y: a[1] + (b[1] - a[1]) * f,
  };
}

/**
 * Demo delivery map — street wash + route + moving partner pin.
 * Progress comes from order.deliveryProgress (0–1).
 */
export default function DeliveryTrackingMap({
  progress = 0,
  phase = "confirmed",
  storeLabel = "Store",
  destinationLabel = "Home",
}) {
  const marker = pointOnRoute(progress);
  const live = phase === "out_for_delivery";
  const done = phase === "delivered";

  return (
    <View style={styles.wrap}>
      <View style={styles.mapFrame}>
        <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
          <Defs>
            <LinearGradient id="wash" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#E8F5EA" />
              <Stop offset="1" stopColor="#F4F7F5" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width={W} height={H} fill="url(#wash)" rx="14" />
          <Rect x="18" y="18" width="70" height="42" rx="8" fill="#D9E8DC" opacity="0.7" />
          <Rect x="110" y="22" width="88" height="36" rx="8" fill="#D5E4DA" opacity="0.65" />
          <Rect x="220" y="16" width="78" height="48" rx="8" fill="#D9E8DC" opacity="0.7" />
          <Rect x="28" y="128" width="96" height="28" rx="8" fill="#D5E4DA" opacity="0.55" />
          <Rect x="190" y="126" width="100" height="30" rx="8" fill="#D9E8DC" opacity="0.55" />
          <Path
            d="M 0 96 H 320 M 120 0 V 168 M 240 0 V 168"
            stroke="#C9D9CE"
            strokeWidth="10"
            opacity="0.55"
          />
          <Path
            d={ROUTE}
            stroke="#FFFFFF"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
          />
          <Path
            d={ROUTE}
            stroke={done ? colors.accent : "#7BC48A"}
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <Circle cx="36" cy="118" r="7" fill={colors.accent} />
          <Circle cx="286" cy="108" r="7" fill={colors.text} />
          {!done ? (
            <Circle
              cx={marker.x}
              cy={marker.y}
              r={live ? 9 : 7}
              fill={live ? colors.primary : colors.white}
              stroke={colors.accentDark}
              strokeWidth="2.5"
            />
          ) : (
            <Circle
              cx="286"
              cy="108"
              r="10"
              fill={colors.accent}
              stroke="#fff"
              strokeWidth="3"
            />
          )}
        </Svg>

        <View style={[styles.pinLabel, styles.pinStore]}>
          <Store size={11} color={colors.accentDark} strokeWidth={2.4} />
          <Text style={styles.pinText} numberOfLines={1}>
            {storeLabel}
          </Text>
        </View>
        <View style={[styles.pinLabel, styles.pinHome]}>
          <MapPin size={11} color={colors.text} strokeWidth={2.4} />
          <Text style={styles.pinText} numberOfLines={1}>
            {destinationLabel}
          </Text>
        </View>
      </View>
      <Text style={styles.caption}>
        {done
          ? "Delivered at your door"
          : live
            ? "Partner en route"
            : phase === "packing"
              ? "Partner assigned · waiting at store"
              : "Order confirmed · assigning partner"}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.lg,
  },
  mapFrame: {
    borderRadius: radii.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F4F7F5",
    height: H,
  },
  pinLabel: {
    position: "absolute",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.92)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    maxWidth: 148,
  },
  pinStore: {
    left: 10,
    top: 10,
  },
  pinHome: {
    right: 10,
    bottom: 12,
  },
  pinText: {
    fontSize: 10,
    fontFamily: fonts.bold,
    color: colors.text,
    flexShrink: 1,
  },
  caption: {
    marginTop: 8,
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
    textAlign: "center",
  },
});
