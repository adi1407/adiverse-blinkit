import { View, Text, StyleSheet, Pressable } from "react-native";
import { Minus, Plus } from "../utils/lucideIcons";
import { hapticLight } from "../utils/haptics";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";

const SIZES = {
  sm: { height: 28, btn: 26, qty: 22, icon: 12, font: 12 },
  md: { height: 32, btn: 30, qty: 28, icon: 14, font: 13 },
  lg: { height: 40, btn: 38, qty: 36, icon: 18, font: 15 },
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
        accessibilityLabel="Decrease quantity"
      >
        <Minus size={s.icon} color={colors.white} strokeWidth={2.8} />
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
        accessibilityLabel="Increase quantity"
      >
        <Plus size={s.icon} color={colors.white} strokeWidth={2.8} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 6,
    backgroundColor: colors.accent,
    overflow: "hidden",
  },
  btn: {
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  btnPressed: {
    backgroundColor: colors.accentDark,
  },
  qtyWrap: {
    alignItems: "center",
    justifyContent: "center",
  },
  qty: {
    textAlign: "center",
    color: colors.white,
    fontFamily: fonts.extraBold,
  },
});
