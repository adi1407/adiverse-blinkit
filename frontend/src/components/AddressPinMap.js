import { View, Text, StyleSheet, Pressable } from "react-native";
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from "react-native-svg";
import { MapPin } from "../utils/lucideIcons";
import { AREA_PRESETS } from "../utils/serviceability";
import { colors, radii, spacing } from "../theme/colors";
import { fonts } from "../theme/typography";

const W = 320;
const H = 180;

/**
 * Fake city map with tappable area pins.
 * Selecting a hotspot sets lat/lng/pincode for the address form.
 */
export default function AddressPinMap({
  selectedAreaId,
  onSelectArea,
  serviceable = true,
}) {
  const selected =
    AREA_PRESETS.find((a) => a.id === selectedAreaId) || AREA_PRESETS[0];

  return (
    <View style={styles.wrap}>
      <View style={[styles.frame, !serviceable && styles.frameBad]}>
        <Svg width="100%" height={H} viewBox={`0 0 ${W} ${H}`}>
          <Defs>
            <LinearGradient id="city" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#EAF6EC" />
              <Stop offset="1" stopColor="#F3F6F4" />
            </LinearGradient>
          </Defs>
          <Rect x="0" y="0" width={W} height={H} fill="url(#city)" rx="14" />
          <Path
            d="M 0 70 H 320 M 0 120 H 320 M 80 0 V 180 M 160 0 V 180 M 240 0 V 180"
            stroke="#C9D9CE"
            strokeWidth="9"
            opacity="0.5"
          />
          <Rect x="20" y="20" width="50" height="32" rx="6" fill="#D5E4DA" opacity="0.7" />
          <Rect x="200" y="28" width="70" height="40" rx="6" fill="#D9E8DC" opacity="0.65" />
          <Rect x="40" y="130" width="90" height="28" rx="6" fill="#D5E4DA" opacity="0.55" />
          <Rect x="210" y="128" width="80" height="34" rx="6" fill="#D9E8DC" opacity="0.55" />

          {AREA_PRESETS.map((area) => {
            const cx = area.mapX * W;
            const cy = area.mapY * H;
            const on = area.id === selected.id;
            return (
              <Circle
                key={area.id}
                cx={cx}
                cy={cy}
                r={on ? 9 : 6}
                fill={on ? colors.accent : colors.white}
                stroke={on ? colors.accentDark : "#7A7A7A"}
                strokeWidth={on ? 2.5 : 1.5}
              />
            );
          })}
        </Svg>

        {/* Hit targets over the SVG pins */}
        {AREA_PRESETS.map((area) => (
          <Pressable
            key={`hit-${area.id}`}
            onPress={() => onSelectArea?.(area)}
            style={[
              styles.hit,
              {
                left: `${area.mapX * 100}%`,
                top: `${area.mapY * 100}%`,
              },
            ]}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`Select ${area.label}`}
          />
        ))}

        <View style={styles.pinBadge}>
          <MapPin size={12} color={colors.accentDark} strokeWidth={2.4} />
          <Text style={styles.pinBadgeText} numberOfLines={1}>
            {selected.label}
          </Text>
        </View>
      </View>

      <View style={styles.chips}>
        {AREA_PRESETS.map((area) => {
          const on = area.id === selected.id;
          return (
            <Pressable
              key={area.id}
              style={[styles.chip, on && styles.chipOn]}
              onPress={() => onSelectArea?.(area)}
            >
              <Text style={[styles.chipText, on && styles.chipTextOn]}>
                {area.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: spacing.md,
  },
  frame: {
    height: H,
    borderRadius: radii.lg,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: "#F3F6F4",
  },
  frameBad: {
    borderColor: "#F0B4B0",
    opacity: 0.92,
  },
  hit: {
    position: "absolute",
    width: 36,
    height: 36,
    marginLeft: -18,
    marginTop: -18,
    borderRadius: 18,
  },
  pinBadge: {
    position: "absolute",
    left: 10,
    top: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.94)",
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    maxWidth: 160,
  },
  pinBadgeText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: spacing.sm,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipOn: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
  },
  chipTextOn: {
    color: colors.accentDark,
  },
});
