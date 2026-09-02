import { View, Text, StyleSheet, Pressable } from "react-native";
import { TriangleAlert, RefreshCw } from "../utils/lucideIcons";
import { colors, spacing, radii } from "../theme/colors";

export default function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.iconWrap}>
        <TriangleAlert size={28} color={colors.danger} strokeWidth={2.2} />
      </View>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable style={styles.btn} onPress={onRetry}>
          <RefreshCw size={16} color={colors.white} strokeWidth={2.4} />
          <Text style={styles.btnText}>Try again</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.background,
    padding: spacing.lg,
  },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#FDECEC",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.lg,
    fontWeight: "500",
  },
  btn: {
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  btnText: {
    color: colors.white,
    fontWeight: "800",
    fontSize: 14,
  },
});
