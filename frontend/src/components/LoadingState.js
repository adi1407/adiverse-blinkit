import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, spacing } from "../theme/colors";

export default function LoadingState({ message = "Loading..." }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.badge}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
      <Text style={styles.text}>{message}</Text>
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
  badge: {
    width: 72,
    height: 72,
    borderRadius: 20,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: 14,
    fontWeight: "600",
  },
});
