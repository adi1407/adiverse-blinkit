import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, spacing, radii } from "../theme/colors";

export default function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? (
        <Pressable style={styles.btn} onPress={onRetry}>
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
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  message: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: spacing.lg,
  },
  btn: {
    backgroundColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  btnText: {
    color: colors.white,
    fontWeight: "700",
    fontSize: 14,
  },
});
