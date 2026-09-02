import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, spacing, radii } from "../theme/colors";

// Shared + / qty / − control used on cards and cart rows.

export default function QtyStepper({ qty, onIncrease, onDecrease, compact }) {
  return (
    <View style={[styles.wrap, compact && styles.compact]}>
      <Pressable onPress={onDecrease} style={styles.btn} hitSlop={8}>
        <Text style={styles.btnText}>−</Text>
      </Pressable>
      <Text style={styles.qty}>{qty}</Text>
      <Pressable onPress={onIncrease} style={styles.btn} hitSlop={8}>
        <Text style={styles.btnText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.sm,
    backgroundColor: colors.accentSoft,
    overflow: "hidden",
  },
  compact: {
    minWidth: 88,
  },
  btn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 5,
  },
  btnText: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 16,
    lineHeight: 18,
  },
  qty: {
    minWidth: 22,
    textAlign: "center",
    color: colors.accent,
    fontWeight: "800",
    fontSize: 13,
  },
});
