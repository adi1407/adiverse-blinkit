import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, spacing, radii } from "../theme/colors";

export default function QtyStepper({ qty, onIncrease, onDecrease, compact }) {
  return (
    <View style={[styles.wrap, compact && styles.compact]}>
      <Pressable onPress={onDecrease} style={styles.btn} hitSlop={8}>
        <Text style={styles.btnText}>−</Text>
      </Pressable>
      <View style={styles.qtyWrap}>
        <Text style={styles.qty}>{qty}</Text>
      </View>
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
    borderWidth: 1.2,
    borderColor: colors.accent,
    borderRadius: radii.sm,
    backgroundColor: colors.accentSoft,
    overflow: "hidden",
  },
  compact: {
    minWidth: 86,
  },
  btn: {
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  btnText: {
    color: colors.accent,
    fontWeight: "900",
    fontSize: 16,
    lineHeight: 18,
  },
  qtyWrap: {
    minWidth: 22,
    alignItems: "center",
  },
  qty: {
    textAlign: "center",
    color: colors.accent,
    fontWeight: "900",
    fontSize: 13,
  },
});
