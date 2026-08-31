import { View, Text, StyleSheet } from "react-native";
import { colors, spacing } from "../theme/colors";

// Small reusable top bar for non-Home screens
export default function ScreenHeader({ title, subtitle }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: "800",
    color: colors.text,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 13,
    color: colors.textSecondary,
  },
});
