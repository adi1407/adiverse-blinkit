import { View, Text, StyleSheet, Pressable } from "react-native";
import { Minus, Plus } from "../utils/lucideIcons";
import { hapticLight } from "../utils/haptics";
import { colors, radii } from "../theme/colors";
import { fonts } from "../theme/typography";

const SIZES = {
  sm: { height: 30, btn: 28, qty: 22, icon: 13, font: 12 },
  md: { height: 34, btn: 32, qty: 26, icon: 14, font: 13 },
  lg: { height: 42, btn: 40, qty: 36, icon: 18, font: 15 },
};

export default function QtyStepper({
  qty,
  onIncrease,
  onDecrease,
  compact,
  size = compact ? "sm" : "md",
}) {
  const s = SIZES[size] || SIZES.md;

  return (
    <View style={[styles.wrap, { height: s.height }]}>
      <Pressable
        onPress={() => {
          hapticLight();
          onDecrease?.();
        }}
        style={({ pressed }) => [
          styles.btn,
          { width: s.btn },
          pressed && styles.btnPressed,
        ]}
        hitSlop={6}
      >
        <Minus size={s.icon} color={colors.accent} strokeWidth={2.6} />
      </Pressable>
      <View style={[styles.qtyWrap, { minWidth: s.qty }]}>
        <Text style={[styles.qty, { fontSize: s.font }]}>{qty}</Text>
      </View>
      <Pressable
        onPress={() => {
          hapticLight();
          onIncrease?.();
        }}
        style={({ pressed }) => [
          styles.btn,
          { width: s.btn },
          pressed && styles.btnPressed,
        ]}
        hitSlop={6}
      >
        <Plus size={s.icon} color={colors.accent} strokeWidth={2.6} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.4,
    borderColor: colors.accent,
    borderRadius: radii.sm,
    backgroundColor: colors.accentSoft,
    overflow: "hidden",
  },
  btn: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  btnPressed: {
    backgroundColor: colors.primarySoft,
  },
  qtyWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  qty: {
    textAlign: "center",
    color: colors.accent,
    fontFamily: fonts.extraBold,
  },
});
