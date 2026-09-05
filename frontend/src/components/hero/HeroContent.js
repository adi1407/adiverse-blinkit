import { View, Text, StyleSheet, Pressable, Animated } from "react-native";
import { Zap } from "../../utils/lucideIcons";
import { colors, spacing } from "../../theme/colors";
import { fonts } from "../../theme/typography";

export default function HeroContent({
  theme,
  onPrimary,
  onSecondary,
  entrance,
  showSecondary = true,
}) {
  const { palette } = theme;

  const fadeUp = (delayKey) => ({
    opacity: entrance.interpolate({
      inputRange: [0, 0.35 + delayKey * 0.12, 1],
      outputRange: [0, 0, 1],
    }),
    transform: [
      {
        translateY: entrance.interpolate({
          inputRange: [0, 0.35 + delayKey * 0.12, 1],
          outputRange: [14, 14, 0],
        }),
      },
    ],
  });

  return (
    <View style={styles.wrap}>
      <Animated.View style={fadeUp(0)}>
        <Text style={[styles.eyebrow, { color: palette.deep }]}>
          {theme.eyebrow}
        </Text>
      </Animated.View>

      <Animated.Text style={[styles.headline, { color: palette.deep }, fadeUp(1)]}>
        {theme.headline}
      </Animated.Text>

      <Animated.Text style={[styles.description, fadeUp(2)]}>
        {theme.description}
      </Animated.Text>

      <Animated.View style={[styles.ctaRow, fadeUp(3)]}>
        <Pressable
          onPress={onPrimary}
          accessibilityRole="button"
          accessibilityLabel={theme.primaryCta}
          style={({ pressed }) => [
            styles.primaryCta,
            { backgroundColor: palette.accent },
            pressed && styles.primaryPressed,
          ]}
        >
          <Text style={[styles.primaryText, { color: palette.accentText }]}>
            {theme.primaryCta}
          </Text>
        </Pressable>

        {showSecondary ? (
          <Pressable
            onPress={onSecondary}
            accessibilityRole="button"
            accessibilityLabel={theme.secondaryCta}
            style={({ pressed }) => [
              styles.secondaryCta,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Text style={[styles.secondaryText, { color: palette.deep }]}>
              {theme.secondaryCta}
            </Text>
          </Pressable>
        ) : null}
      </Animated.View>

      <Animated.View style={[styles.delivery, fadeUp(4)]}>
        <View style={styles.deliveryIcon}>
          <Zap size={12} color={colors.accent} fill={colors.accent} />
        </View>
        <Text style={styles.deliveryText}>{theme.deliveryLabel}</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    minWidth: 0,
    paddingRight: spacing.sm,
  },
  eyebrow: {
    fontSize: 11,
    fontFamily: fonts.bold,
    letterSpacing: 0.6,
    textTransform: "uppercase",
    opacity: 0.72,
    marginBottom: 6,
  },
  headline: {
    fontSize: 26,
    lineHeight: 32,
    fontFamily: fonts.extraBold,
    letterSpacing: -0.7,
  },
  description: {
    marginTop: 8,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
    maxWidth: 280,
  },
  ctaRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 14,
  },
  primaryCta: {
    minHeight: 44,
    paddingHorizontal: 16,
    paddingVertical: 11,
    borderRadius: 12,
    justifyContent: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  primaryPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.92,
  },
  primaryText: {
    fontFamily: fonts.extraBold,
    fontSize: 13,
    letterSpacing: 0.1,
  },
  secondaryCta: {
    minHeight: 44,
    paddingHorizontal: 10,
    justifyContent: "center",
  },
  secondaryText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    textDecorationLine: "underline",
  },
  delivery: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  deliveryIcon: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  deliveryText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
  },
});
