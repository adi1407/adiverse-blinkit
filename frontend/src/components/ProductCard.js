import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, spacing, radii } from "../theme/colors";

export default function ProductCard({ product }) {
  const showMrp = product.mrp > product.price;

  return (
    <View style={styles.card}>
      <View style={styles.imageBox}>
        <Text style={styles.emoji}>{product.emoji}</Text>
      </View>

      <Text style={styles.unit}>{product.unit}</Text>
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>

      <View style={styles.footer}>
        <View>
          <Text style={styles.price}>₹{product.price}</Text>
          {showMrp ? <Text style={styles.mrp}>₹{product.mrp}</Text> : null}
        </View>

        <Pressable style={styles.addBtn}>
          <Text style={styles.addText}>ADD</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 130,
    marginRight: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
  imageBox: {
    height: 100,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  emoji: {
    fontSize: 40,
  },
  unit: {
    fontSize: 11,
    color: colors.textMuted,
    marginBottom: 2,
  },
  name: {
    fontSize: 13,
    fontWeight: "600",
    color: colors.text,
    minHeight: 34,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  price: {
    fontSize: 14,
    fontWeight: "700",
    color: colors.text,
  },
  mrp: {
    fontSize: 11,
    color: colors.textMuted,
    textDecorationLine: "line-through",
  },
  addBtn: {
    borderWidth: 1,
    borderColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 5,
    backgroundColor: colors.accentSoft,
  },
  addText: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 12,
  },
});
