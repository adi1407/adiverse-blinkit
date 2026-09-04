import { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Pressable,
  Alert,
} from "react-native";
import {
  ChevronLeft,
  Zap,
  ShieldCheck,
  Bike,
  Heart,
  Share2,
} from "../utils/lucideIcons";
import ProductImageGallery from "../components/ProductImageGallery";
import ProductRow from "../components/ProductRow";
import QtyStepper from "../components/QtyStepper";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { fetchProduct } from "../api/catalogApi";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";
import { categoryTitle } from "../utils/category";
import { shareProduct } from "../utils/share";
import { colors, spacing, radii, shadows } from "../theme/colors";
import { fonts } from "../theme/typography";

export default function ProductDetailScreen({ navigation, route }) {
  const { productId } = route.params;
  const { getQty, addItem, increaseQty, decreaseQty } = useCart();
  const { isSaved, toggleItem } = useWishlist();
  const { trackView } = useRecentlyViewed();

  const [product, setProduct] = useState(null);
  const [category, setCategory] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchProduct(productId);
      setProduct(data.product);
      setCategory(data.category);
      setSimilar(data.similar || []);
    } catch (err) {
      setError(err.message || "Failed to load product");
    } finally {
      setLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (product?.id) trackView(product);
  }, [product?.id, trackView]);

  if (loading && !product) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingState label="Loading product…" />
      </SafeAreaView>
    );
  }

  if (error && !product) {
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorState message={error} onRetry={load} />
      </SafeAreaView>
    );
  }

  if (!product) return null;

  const qty = getQty(product.id);
  const saved = isSaved(product.id);
  const showMrp = product.mrp > product.price;
  const discountPct = showMrp
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;
  const youSave = showMrp ? product.mrp - product.price : 0;
  const catLabel = categoryTitle(category);

  async function onShare() {
    try {
      await shareProduct(product, catLabel);
    } catch (err) {
      if (err?.message && !/dismiss|cancel/i.test(String(err.message))) {
        Alert.alert("Could not share", err.message);
      }
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.topBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          hitSlop={8}
        >
          <ChevronLeft size={24} color={colors.text} strokeWidth={2.4} />
        </Pressable>
        <Text style={styles.topTitle} numberOfLines={1}>
          {catLabel}
        </Text>
        <View style={styles.topActions}>
          <Pressable onPress={onShare} style={styles.backBtn} hitSlop={8}>
            <Share2 size={20} color={colors.text} strokeWidth={2.2} />
          </Pressable>
          <Pressable
            onPress={() => toggleItem(product)}
            style={styles.backBtn}
            hitSlop={8}
          >
            <Heart
              size={22}
              color={saved ? colors.danger : colors.text}
              fill={saved ? colors.danger : "transparent"}
              strokeWidth={2.2}
            />
          </Pressable>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProductImageGallery
          images={product.images}
          fallbackUri={product.image}
          discountPct={discountPct}
          badge={
            discountPct > 0 ? (
              <Text style={styles.discountText}>{discountPct}% OFF</Text>
            ) : null
          }
        />

        <View style={styles.etaChipFloat}>
          <Zap size={11} color={colors.accent} fill={colors.accent} />
          <Text style={styles.etaText}>8 MINS</Text>
        </View>

        <View style={styles.info}>
          {product.brand ? (
            <Text style={styles.brand}>{product.brand}</Text>
          ) : null}
          <Text style={styles.unit}>{product.unit}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.priceBlock}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>₹{product.price}</Text>
              {showMrp ? <Text style={styles.mrp}>₹{product.mrp}</Text> : null}
              {discountPct > 0 ? (
                <Text style={styles.discountInline}>{discountPct}% OFF</Text>
              ) : null}
            </View>
            {youSave > 0 ? (
              <Text style={styles.youSave}>You save ₹{youSave}</Text>
            ) : null}
          </View>

          <View style={styles.trustRow}>
            <View style={styles.trustItem}>
              <Bike size={14} color={colors.accent} strokeWidth={2.2} />
              <Text style={styles.trustText}>Delivery in 8 mins</Text>
            </View>
            <View style={styles.trustItem}>
              <ShieldCheck size={14} color={colors.accent} strokeWidth={2.2} />
              <Text style={styles.trustText}>Best quality</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Product details</Text>
          <View style={styles.detailCard}>
            <DetailRow label="Unit" value={product.unit} />
            <DetailRow label="Category" value={catLabel} />
            <DetailRow
              label="MRP"
              value={showMrp ? `₹${product.mrp} (incl. of all taxes)` : `₹${product.price}`}
            />
            <Text style={styles.about}>
              Fresh stock from nearby dark stores. Packed carefully so it reaches
              you in minutes — same Blinkit-style last-minute grocery feel.
            </Text>
          </View>
        </View>

        {similar.length > 0 ? (
          <ProductRow
            title="You might also like"
            products={similar}
            onSeeAll={
              category
                ? () =>
                    navigation.navigate("CategoryProducts", {
                      categoryId: category.id,
                    })
                : undefined
            }
          />
        ) : null}

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={[styles.footer, shadows.card]}>
        <View>
          <Text style={styles.footerHint}>
            {qty > 0 ? `${qty} in cart` : "Add to cart"}
          </Text>
          <Text style={styles.footerPrice}>
            ₹{product.price * Math.max(qty, 1)}
          </Text>
        </View>

        {qty > 0 ? (
          <QtyStepper
            qty={qty}
            onIncrease={() => increaseQty(product.id)}
            onDecrease={() => decreaseQty(product.id)}
          />
        ) : (
          <Pressable style={styles.addBtn} onPress={() => addItem(product)}>
            <Text style={styles.addText}>ADD</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

function DetailRow({ label, value }) {
  return (
    <View style={styles.detailRow}>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
    backgroundColor: colors.primary,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  topActions: {
    flexDirection: "row",
    alignItems: "center",
  },
  topTitle: {
    flex: 1,
    textAlign: "center",
    fontSize: 15,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  scrollContent: {
    paddingBottom: spacing.lg,
  },
  discountText: {
    color: colors.white,
    fontSize: 11,
    fontFamily: fonts.extraBold,
  },
  etaChipFloat: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    gap: 4,
    marginLeft: spacing.lg,
    marginBottom: spacing.sm,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: radii.pill,
  },
  etaText: {
    fontSize: 11,
    fontFamily: fonts.bold,
    color: colors.text,
  },
  info: {
    paddingHorizontal: spacing.lg,
  },
  brand: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.accent,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  unit: {
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
  },
  name: {
    marginTop: 4,
    fontSize: 22,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  priceBlock: {
    marginTop: spacing.md,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  price: {
    fontSize: 24,
    fontFamily: fonts.extraBold,
    color: colors.text,
  },
  mrp: {
    fontSize: 15,
    color: colors.textMuted,
    textDecorationLine: "line-through",
    fontFamily: fonts.medium,
  },
  discountInline: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.discount,
  },
  youSave: {
    marginTop: 4,
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.accent,
  },
  trustRow: {
    marginTop: spacing.lg,
    flexDirection: "row",
    gap: spacing.md,
  },
  trustItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.surface,
    borderRadius: radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  trustText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.textSecondary,
  },
  section: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: fonts.extraBold,
    color: colors.text,
    marginBottom: spacing.md,
  },
  detailCard: {
    backgroundColor: colors.white,
    borderRadius: radii.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  detailLabel: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textMuted,
  },
  detailValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  about: {
    marginTop: spacing.sm,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
    fontFamily: fonts.medium,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: 12,
    paddingBottom: Platform.OS === "ios" ? 28 : 14,
    backgroundColor: colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -4 },
    elevation: 12,
  },
  footerHint: {
    fontSize: 11,
    fontFamily: fonts.medium,
    color: "#8C8C8C",
  },
  footerPrice: {
    marginTop: 2,
    fontSize: 20,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  addBtn: {
    minWidth: 132,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
  },
  addText: {
    color: colors.white,
    fontFamily: fonts.extraBold,
    fontSize: 15,
    letterSpacing: 0.6,
  },
});
