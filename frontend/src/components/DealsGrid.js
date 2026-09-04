import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ProductImage from "./ProductImage";
import { colors, spacing, radii, shadows } from "../theme/colors";

function discountPct(product) {
  const mrp = Number(product.mrp) || 0;
  const price = Number(product.price) || 0;
  if (mrp <= price) return 0;
  return Math.round(((mrp - price) / mrp) * 100);
}

export default function DealsGrid({ title, subtitle, products = [] }) {
  const navigation = useNavigation();
  if (!products.length) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.grid}>
        {products.slice(0, 8).map((product) => {
          const off = discountPct(product);
          return (
            <Pressable
              key={product.id}
              style={[styles.card, shadows.soft]}
              onPress={() =>
                navigation.navigate("ProductDetail", { productId: product.id })
              }
            >
              {off > 0 ? (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{off}% OFF</Text>
                </View>
              ) : null}
              <ProductImage uri={product.image} style={styles.image} iconSize={28} />
              <Text style={styles.name} numberOfLines={2}>
                {product.name}
              </Text>
              <View style={styles.priceRow}>
                <Text style={styles.price}>₹{product.price}</Text>
                {product.mrp > product.price ? (
                  <Text style={styles.mrp}>₹{product.mrp}</Text>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
    backgroundColor: colors.surfaceWarm,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 2,
    marginBottom: spacing.md,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "500",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  card: {
    width: "48%",
    backgroundColor: colors.white,
    borderRadius: radii.md,
    padding: spacing.sm,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badge: {
    alignSelf: "flex-start",
    backgroundColor: colors.discount,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginBottom: 6,
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: "900",
  },
  image: {
    width: "100%",
    height: 88,
    borderRadius: radii.sm,
    backgroundColor: colors.surface,
  },
  name: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "700",
    color: colors.text,
    minHeight: 32,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginTop: 4,
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
    fontWeight: "600",
  },
});
