import { View, Text, StyleSheet, Pressable } from "react-native";
import { Zap } from "../utils/lucideIcons";
import { colors, spacing, radii, shadows } from "../theme/colors";
import { useCart } from "../context/CartContext";
import QtyStepper from "./QtyStepper";
import ProductImage from "./ProductImage";

export default function ProductCard({ product, variant = "carousel" }) {
  const { getQty, addItem, increaseQty, decreaseQty } = useCart();
  const qty = getQty(product.id);
  const showMrp = product.mrp > product.price;
  const discountPct = showMrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;
  const isGrid = variant === "grid";

  return (
    <View style={[styles.card, isGrid && styles.cardGrid, shadows.soft]}>
      <View style={styles.imageBox}>
        {discountPct > 0 ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPct}% OFF</Text>
          </View>
        ) : null}

        <ProductImage uri={product.image} style={styles.image} iconSize={32} />

        <View style={styles.etaChip}>
          <Zap size={10} color={colors.accent} fill={colors.accent} />
          <Text style={styles.etaText}>8 MINS</Text>
        </View>
      </View>

      <Text style={styles.unit}>{product.unit}</Text>
      <Text style={styles.name} numberOfLines={2}>
        {product.name}
      </Text>

      <View style={styles.footer}>
        <View style={styles.priceBlock}>
          <Text style={styles.price}>₹{product.price}</Text>
          {showMrp ? <Text style={styles.mrp}>₹{product.mrp}</Text> : null}
        </View>

        {qty > 0 ? (
          <QtyStepper
            qty={qty}
            compact
            onIncrease={() => increaseQty(product.id)}
            onDecrease={() => decreaseQty(product.id)}
          />
        ) : (
          <Pressable style={styles.addBtn} onPress={() => addItem(product)}>
            <Text style={styles.addText}>ADD</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 138,
    marginRight: spacing.md,
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 10,
  },
  cardGrid: {
    width: "100%",
    marginRight: 0,
    marginBottom: spacing.md,
    flex: 1,
  },
  imageBox: {
    height: 108,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
    marginBottom: spacing.sm,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  discountBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: colors.discount,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderBottomRightRadius: 8,
    zIndex: 2,
  },
  discountText: {
    color: colors.white,
    fontSize: 9,
    fontWeight: "900",
  },
  etaChip: {
    position: "absolute",
    left: 6,
    bottom: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    backgroundColor: colors.white,
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 2,
  },
  etaText: {
    fontSize: 9,
    fontWeight: "800",
    color: colors.text,
  },
  unit: {
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
    marginBottom: 2,
  },
  name: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
    minHeight: 34,
    lineHeight: 17,
    marginBottom: spacing.sm,
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 6,
  },
  priceBlock: {
    flexShrink: 1,
  },
  price: {
    fontSize: 14,
    fontWeight: "900",
    color: colors.text,
  },
  mrp: {
    fontSize: 11,
    color: colors.textMuted,
    textDecorationLine: "line-through",
    marginTop: 1,
  },
  addBtn: {
    borderWidth: 1.2,
    borderColor: colors.accent,
    borderRadius: radii.sm,
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: colors.white,
    minWidth: 54,
    alignItems: "center",
  },
  addText: {
    color: colors.accent,
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 0.3,
  },
});
