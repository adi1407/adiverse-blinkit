import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronLeft } from "../utils/lucideIcons";
import { colors, spacing } from "../theme/colors";
import { fonts } from "../theme/typography";

export default function ScreenHeader({
  title,
  subtitle,
  showBack = false,
  right = null,
  compact = false,
}) {
  const navigation = useNavigation();

  return (
    <View style={[styles.wrap, compact && styles.wrapCompact]}>
      <View style={styles.row}>
        {showBack ? (
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.side}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="Go back"
          >
            <ChevronLeft size={24} color={colors.text} strokeWidth={2.4} />
          </Pressable>
        ) : (
          <View style={styles.side} />
        )}
        <View style={styles.titles}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          {subtitle ? (
            <Text style={styles.subtitle} numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}
        </View>
        <View style={styles.side}>{right}</View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  wrapCompact: {
    paddingTop: spacing.sm,
    paddingBottom: spacing.md,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  side: {
    width: 44,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  titles: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "center",
    fontFamily: fonts.medium,
  },
});
