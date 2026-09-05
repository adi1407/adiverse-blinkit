import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Zap } from "../utils/lucideIcons";
import ProductImage from "./ProductImage";
import AddToCartControl from "./AddToCartControl";
import { colors, spacing } from "../theme/colors";
import { fonts } from "../theme/typography";

function discountPct(product) {
  const mrp = Number(product.mrp) || 0;
  const price = Number(product.price) || 0;
  if (mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

function DealCell({ product }) {
  const navigation = useNavigation();
  const off = discountPct(product);
  const showMrp = product.mrp > product.price;
  const saveAmt = showMrp
    ? Math.max(0, Math.round(Number(product.mrp) - Number(product.price)))
    : 0;

  return (
    <Pressable
      style={styles.card}
      onPress={() =>
        navigation.navigate("ProductDetail", { productId: product.id })
      }
      accessibilityRole="button"
      accessibilityLabel={`${product.name}, ₹${product.price}`}
    >
      <View style={styles.imageBox}>
        {off > 0 ? (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{off}% OFF</Text>
          </View>
        ) : null}
        <ProductImage uri={product.image} style={styles.image} iconSize={28} />
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
          {showMrp ? (
            <View style={styles.mrpRow}>
              <Text style={styles.mrp}>₹{product.mrp}</Text>
              {saveAmt > 0 ? (
                <Text style={styles.save}>Save ₹{saveAmt}</Text>
              ) : null}
            </View>
          ) : null}
        </View>

        <AddToCartControl product={product} size="sm" />
      </View>
    </Pressable>
  );
}

export default function DealsGrid({ title, subtitle, products = [] }) {
  if (!products.length) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.grid}>
        {products.slice(0, 8).map((product) => (
          <DealCell key={product.id} product={product} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: 18,
    paddingBottom: 14,
    backgroundColor: "#FFF8E1",
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 2,
    marginBottom: 14,
    fontSize: 12,
    color: "#7D7D7D",
    fontFamily: fonts.medium,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 8,
    marginBottom: 10,
    borderWidth: 0.8,
    borderColor: "#E8E8E8",
  },
  imageBox: {
    height: 130,
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    marginBottom: 8,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  badge: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#256FEF",
    paddingHorizontal: 5,
    paddingVertical: 3,
    borderBottomRightRadius: 8,
    zIndex: 2,
  },
  badgeText: {
    color: colors.white,
    fontSize: 9,
    fontFamily: fonts.extraBold,
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F5F5F5",
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
  },
  etaText: {
    fontSize: 8,
    fontFamily: fonts.extraBold,
    color: colors.text,
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
    color: colors.text,
    minHeight: 32,
    lineHeight: 16,
    marginBottom: 8,
  },
  footer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 4,
  },
  priceBlock: {
    flexShrink: 1,
  },
  price: {
    fontSize: 13,
    fontFamily: fonts.extraBold,
    color: colors.text,
  },
  mrpRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 1,
    flexWrap: "wrap",
  },
  mrp: {
    fontSize: 10,
    color: "#9C9C9C",
    textDecorationLine: "line-through",
    fontFamily: fonts.medium,
  },
  save: {
    fontSize: 9,
    color: colors.accent,
    fontFamily: fonts.bold,
  },
});
