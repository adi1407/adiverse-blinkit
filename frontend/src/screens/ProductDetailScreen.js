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

          <View style={styles.priceRow}>
            <Text style={styles.price}>₹{product.price}</Text>
            {showMrp ? <Text style={styles.mrp}>₹{product.mrp}</Text> : null}
            {youSave > 0 ? (
              <View style={styles.savePill}>
                <Text style={styles.saveText}>Save ₹{youSave}</Text>
              </View>
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
    fontWeight: "800",
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
  hero: {
    margin: spacing.lg,
    height: 280,
    borderRadius: radii.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
  heroImage: {
    width: "88%",
    height: "88%",
  },
  discountBadge: {
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
    backgroundColor: colors.discount,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomRightRadius: 10,
  },
  discountText: {
    color: colors.white,
    fontSize: 11,
    fontWeight: "900",
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
  etaChip: {
    position: "absolute",
    left: 12,
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: colors.white,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 2,
  },
  etaText: {
    fontSize: 11,
    fontWeight: "800",
    color: colors.text,
  },
  info: {
    paddingHorizontal: spacing.lg,
  },
  brand: {
    fontSize: 12,
    fontWeight: "800",
    color: colors.accent,
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.4,
  },
  unit: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textMuted,
  },
  name: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: -0.4,
    lineHeight: 28,
  },
  priceRow: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  price: {
    fontSize: 24,
    fontWeight: "900",
    color: colors.text,
  },
  mrp: {
    fontSize: 15,
    color: colors.textMuted,
    textDecorationLine: "line-through",
    fontWeight: "600",
  },
  savePill: {
    backgroundColor: colors.accentSoft,
    borderRadius: radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  saveText: {
    fontSize: 12,
    fontWeight: "800",
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
    fontWeight: "700",
    color: colors.textSecondary,
  },
  section: {
    marginTop: spacing.xxl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "900",
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
    fontWeight: "600",
    color: colors.textMuted,
  },
  detailValue: {
    flex: 1,
    textAlign: "right",
    fontSize: 13,
    fontWeight: "700",
    color: colors.text,
  },
  about: {
    marginTop: spacing.sm,
    fontSize: 13,
    lineHeight: 19,
    color: colors.textSecondary,
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
    paddingVertical: spacing.md,
    paddingBottom: Platform.OS === "ios" ? 28 : spacing.md,
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  footerHint: {
    fontSize: 11,
    fontWeight: "600",
    color: colors.textMuted,
  },
  footerPrice: {
    marginTop: 2,
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
  },
  addBtn: {
    minWidth: 120,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.accent,
    borderRadius: radii.md,
    paddingVertical: 14,
    paddingHorizontal: spacing.xl,
  },
  addText: {
    color: colors.white,
    fontWeight: "900",
    fontSize: 15,
    letterSpacing: 0.4,
  },
});
