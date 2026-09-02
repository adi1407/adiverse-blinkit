import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { colors, spacing } from "../theme/colors";

export default function LoadingState({ message = "Loading..." }) {
  return (
    <View style={styles.wrap}>
      <ActivityIndicator size="large" color={colors.accent} />
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
  text: {
    marginTop: spacing.md,
    color: colors.textSecondary,
    fontSize: 14,
  },
});
