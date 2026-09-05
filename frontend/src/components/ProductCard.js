import { memo, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Animated,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Zap } from "../utils/lucideIcons";
import { colors } from "../theme/colors";
import { fonts } from "../theme/typography";
import ProductImage from "./ProductImage";
import AddToCartControl from "./AddToCartControl";
import usePrefersReducedMotion from "../hooks/usePrefersReducedMotion";

function isOutOfStock(product) {
  if (product?.outOfStock === true) return true;
  if (product?.inStock === false) return true;
  if (product?.available === false) return true;
  return false;
}

function ProductCard({ product, variant = "carousel" }) {
  const navigation = useNavigation();
  const reduceMotion = usePrefersReducedMotion();
  const imgScale = useRef(new Animated.Value(1)).current;
  const cardLift = useRef(new Animated.Value(0)).current;

  const showMrp = Number(product.mrp) > Number(product.price);
  const discountPct = showMrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;
  const saveAmt = showMrp
    ? Math.max(0, Math.round(Number(product.mrp) - Number(product.price)))
    : 0;
  const isGrid = variant === "grid";
  const oos = isOutOfStock(product);
  const name = String(product.name || "Product");

  function onHoverIn() {
    if (reduceMotion || Platform.OS !== "web") return;
    Animated.parallel([
      Animated.timing(imgScale, {
        toValue: 1.03,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(cardLift, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
  }

  function onHoverOut() {
    if (reduceMotion || Platform.OS !== "web") return;
    Animated.parallel([
      Animated.timing(imgScale, {
        toValue: 1,
        duration: 160,
        useNativeDriver: true,
      }),
      Animated.timing(cardLift, {
        toValue: 0,
        duration: 160,
        useNativeDriver: true,
      }),
    ]).start();
  }

  return (
    <Animated.View
      style={[
        styles.card,
        isGrid && styles.cardGrid,
        {
          transform: [
            {
              translateY: cardLift.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -2],
              }),
            },
          ],
        },
        oos && styles.cardOos,
      ]}
    >
      <Pressable
        onPress={() =>
          navigation.push("ProductDetail", { productId: product.id })
        }
        onHoverIn={onHoverIn}
        onHoverOut={onHoverOut}
        accessibilityRole="button"
        accessibilityLabel={`${name}, ${product.unit || ""}, ₹${product.price}`}
        style={styles.pressBody}
      >
        <View style={styles.imageBox}>
          {discountPct > 0 && !oos ? (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{discountPct}% OFF</Text>
            </View>
          ) : null}

          <Animated.View
            style={[styles.imageScale, { transform: [{ scale: imgScale }] }]}
          >
            <ProductImage
              uri={product.image}
              style={[styles.image, oos && styles.imageOos]}
              iconSize={30}
            />
          </Animated.View>

          {oos ? (
            <View style={styles.oosOverlay}>
              <Text style={styles.oosBanner}>Out of stock</Text>
            </View>
          ) : (
            <View style={styles.etaChip}>
              <Zap size={9} color={colors.accent} fill={colors.accent} />
              <Text style={styles.etaText}>8 MINS</Text>
            </View>
          )}
        </View>

        <Text style={styles.unit} numberOfLines={1}>
          {product.unit}
        </Text>
        <Text style={styles.name} numberOfLines={2}>
          {name}
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

          <AddToCartControl product={product} size="sm" disabled={oos} />
        </View>
      </Pressable>
    </Animated.View>
  );
}

export default memo(ProductCard);

const styles = StyleSheet.create({
  card: {
    width: 132,
    marginRight: 10,
    backgroundColor: colors.white,
    borderRadius: 14,
    padding: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: "#E6E6E6",
    shadowColor: "#000",
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardGrid: {
    width: "100%",
    marginRight: 0,
    marginBottom: 10,
    flex: 1,
  },
  cardOos: {
    opacity: 0.92,
  },
  pressBody: {
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
  imageScale: {
    width: "100%",
    height: "100%",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#F5F5F5",
  },
  imageOos: {
    opacity: 0.55,
  },
  discountBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#256FEF",
    paddingHorizontal: 6,
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
  },
  etaText: {
    fontSize: 8,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: 0.2,
  },
  oosOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.28)",
    zIndex: 2,
  },
  oosBanner: {
    backgroundColor: "rgba(31,31,31,0.78)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    overflow: "hidden",
    fontSize: 11,
    fontFamily: fonts.extraBold,
    color: colors.white,
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
    gap: 6,
    marginTop: "auto",
  },
  priceBlock: {
    flexShrink: 1,
  },
  price: {
    fontSize: 14,
    fontFamily: fonts.extraBold,
    color: "#1F1F1F",
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
