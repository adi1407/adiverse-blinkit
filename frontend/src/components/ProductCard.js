import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Zap } from "../utils/lucideIcons";
import { hapticLight } from "../utils/haptics";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import { useCart } from "../context/CartContext";
import QtyStepper from "./QtyStepper";
import ProductImage from "./ProductImage";

export default function ProductCard({ product, variant = "carousel" }) {
  const navigation = useNavigation();
  const { getQty, addItem, increaseQty, decreaseQty } = useCart();
  const qty = getQty(product.id);
  const showMrp = product.mrp > product.price;
  const discountPct = showMrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;
  const isGrid = variant === "grid";

  return (
    <Pressable
      onPress={() =>
        navigation.push("ProductDetail", { productId: product.id })
      }
      style={[styles.card, isGrid && styles.cardGrid]}
    >
      <View style={styles.imageBox}>
        {discountPct > 0 ? (
          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>{discountPct}% OFF</Text>
          </View>
        ) : null}

        <ProductImage uri={product.image} style={styles.image} iconSize={30} />

        <View style={styles.etaChip}>
          <Zap size={9} color={colors.accent} fill={colors.accent} />
          <Text style={styles.etaText}>8 MINS</Text>
        </View>
      </View>

      <Text style={styles.unit} numberOfLines={1}>
        {product.unit}
      </Text>
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
            size="sm"
            onIncrease={() => {
              hapticLight();
              increaseQty(product.id);
            }}
            onDecrease={() => {
              hapticLight();
              decreaseQty(product.id);
            }}
          />
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.addBtn,
              pressed && styles.addBtnPressed,
            ]}
            onPress={(e) => {
              e?.stopPropagation?.();
              hapticLight();
              addItem(product);
            }}
          >
            {({ pressed }) => (
              <Text style={[styles.addText, pressed && styles.addTextPressed]}>
                ADD
              </Text>
            )}
          </Pressable>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 126,
    marginRight: 10,
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 8,
    borderWidth: 0.8,
    borderColor: "#E8E8E8",
  },
  cardGrid: {
    width: "100%",
    marginRight: 0,
    marginBottom: 10,
    flex: 1,
  },
  imageBox: {
    height: 118,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    marginBottom: 8,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F5F5F5",
  },
  discountBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#256FEF",
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderBottomRightRadius: 8,
    zIndex: 2,
  },
  discountText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.extraBold,
  },
  etaChip: {
    position: "absolute",
    left: 5,
    bottom: 5,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    backgroundColor: colors.white,
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    zIndex: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  etaText: {
    fontSize: 8,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: 0.2,
  },
  unit: {
    fontSize: 11,
    color: "#7D7D7D",
    fontFamily: fonts.medium,
    marginBottom: 2,
  },
  name: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: "#1F1F1F",
    minHeight: 32,
    lineHeight: 16,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 4,
    marginTop: "auto",
  },
  priceBlock: {
    flexShrink: 1,
  },
  price: {
    fontSize: 13,
    fontFamily: fonts.extraBold,
    color: "#1F1F1F",
  },
  mrp: {
    fontSize: 10,
    color: "#9C9C9C",
    textDecorationLine: "line-through",
    marginTop: 1,
    fontFamily: fonts.medium,
  },
  addBtn: {
    borderWidth: 1.2,
    borderColor: colors.accent,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: colors.white,
    minWidth: 50,
    alignItems: "center",
  },
  addBtnPressed: {
    backgroundColor: colors.accent,
  },
  addText: {
    color: colors.accent,
    fontFamily: fonts.extraBold,
    fontSize: 11,
    letterSpacing: 0.4,
  },
  addTextPressed: {
    color: colors.white,
  },
});
