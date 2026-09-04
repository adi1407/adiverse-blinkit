import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  StyleSheet,
  StatusBar,
  Platform,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { ChevronLeft, Search } from "../utils/lucideIcons";
import ProductCard from "../components/ProductCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { fetchCategoryProducts } from "../api/catalogApi";
import { categoryTitle } from "../utils/category";
import { getLucideIcon } from "../utils/icons";
import { colors, spacing, radii } from "../theme/colors";

const PAGE_SIZE = 40;

const BRAND_FILTERS = {
  c8: [
    { id: "all", label: "All", q: "" },
    { id: "lays", label: "Lay's", q: "lay" },
    { id: "doritos", label: "Doritos", q: "doritos" },
    { id: "kurkure", label: "Kurkure", q: "kurkure" },
    { id: "pringles", label: "Pringles", q: "pringles" },
    { id: "bingo", label: "Bingo", q: "bingo" },
    { id: "haldiram", label: "Haldiram's", q: "haldiram" },
    { id: "healthy", label: "Healthy", q: "yoga" },
  ],
  c7: [
    { id: "all", label: "All", q: "" },
    { id: "pepsi", label: "Pepsi", q: "pepsi" },
    { id: "coke", label: "Coca-Cola", q: "coca" },
    { id: "monster", label: "Monster", q: "monster" },
    { id: "redbull", label: "Red Bull", q: "red bull" },
    { id: "protein", label: "Protein", q: "protein" },
    { id: "sprite", label: "Sprite", q: "sprite" },
  ],
  c5: [
    { id: "all", label: "All", q: "" },
    { id: "oreo", label: "Oreo", q: "oreo" },
    { id: "parle", label: "Parle", q: "parle" },
    { id: "britannia", label: "Britannia", q: "britannia" },
  ],
  c4: [
    { id: "all", label: "All", q: "" },
    { id: "mdh", label: "MDH", q: "mdh" },
    { id: "everest", label: "Everest", q: "everest" },
    { id: "catch", label: "Catch", q: "catch" },
    { id: "oil", label: "Oil", q: "oil" },
  ],
  c2: [
    { id: "all", label: "All", q: "" },
    { id: "amul", label: "Amul", q: "amul" },
    { id: "mother", label: "Mother Dairy", q: "mother" },
    { id: "bread", label: "Bread", q: "bread" },
    { id: "eggs", label: "Eggs", q: "egg" },
  ],
  c10: [
    { id: "all", label: "All", q: "" },
    { id: "broom", label: "Broom", q: "broom" },
    { id: "phenyl", label: "Phenyl", q: "phenyl" },
    { id: "tissue", label: "Tissues", q: "tissue" },
    { id: "vim", label: "Vim", q: "vim" },
  ],
  c13: [
    { id: "all", label: "All", q: "" },
    { id: "pen", label: "Pens", q: "pen" },
    { id: "notebook", label: "Notebooks", q: "notebook" },
    { id: "classmate", label: "Classmate", q: "classmate" },
  ],
  c14: [
    { id: "all", label: "All", q: "" },
    { id: "duracell", label: "Duracell", q: "duracell" },
    { id: "eveready", label: "Eveready", q: "eveready" },
    { id: "aa", label: "AA", q: "aa" },
  ],
  c15: [
    { id: "all", label: "All", q: "" },
    { id: "philips", label: "Philips", q: "philips" },
    { id: "syska", label: "Syska", q: "syska" },
    { id: "led", label: "LED", q: "led" },
  ],
};

const SORT_OPTIONS = [
  { id: "relevance", label: "Relevance" },
  { id: "price_asc", label: "Price ↑" },
  { id: "price_desc", label: "Price ↓" },
];

function Chip({ label, active, onPress }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && styles.chipTextActive]}>
        {label}
      </Text>
    </Pressable>
  );
}

export default function CategoryProductsScreen({ navigation, route }) {
  const { categoryId } = route.params;
  const brandFilters = BRAND_FILTERS[categoryId] || [
    { id: "all", label: "All", q: "" },
  ];

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [brandId, setBrandId] = useState("all");
  const [sort, setSort] = useState("relevance");

  const activeBrand = useMemo(
    () => brandFilters.find((b) => b.id === brandId) || brandFilters[0],
    [brandFilters, brandId]
  );

  const loadPage = useCallback(
    async (nextPage, { append } = { append: false }) => {
      if (append) setLoadingMore(true);
      else {
        setLoading(true);
        setError("");
      }

      try {
        const data = await fetchCategoryProducts(categoryId, {
          page: nextPage,
          limit: PAGE_SIZE,
          q: activeBrand.q,
          sort,
        });
        setCategory(data.category);
        setTotal(data.total || 0);
        setHasMore(Boolean(data.hasMore));
        setPage(data.page || nextPage);
        setProducts((prev) =>
          append ? [...prev, ...(data.products || [])] : data.products || []
        );
      } catch (err) {
        if (!append) {
          setError(err.message || "Failed to load products");
          setProducts([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [categoryId, activeBrand.q, sort]
  );

  useEffect(() => {
    setProducts([]);
    setPage(1);
    loadPage(1, { append: false });
  }, [categoryId, activeBrand.q, sort, loadPage]);

  function onEndReached() {
    if (loading || loadingMore || !hasMore) return;
    loadPage(page + 1, { append: true });
  }

  const title = category ? categoryTitle(category) : "Products";
  const Icon = getLucideIcon(category?.icon);
  const sortLabel =
    SORT_OPTIONS.find((s) => s.id === sort)?.label || "Relevance";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ChevronLeft size={24} color={colors.text} strokeWidth={2.4} />
        </Pressable>

        <View style={styles.titleBlock}>
          <View style={styles.titleRow}>
            {category ? (
              <View
                style={[
                  styles.catChip,
                  { backgroundColor: category.bg || colors.surface },
                ]}
              >
                <Icon
                  size={14}
                  color={category.color || colors.accent}
                  strokeWidth={2.2}
                />
              </View>
            ) : null}
            <Text style={styles.title} numberOfLines={1}>
              {title}
            </Text>
          </View>
          {!loading && !error ? (
            <Text style={styles.count}>
              {total} items · showing {products.length}
            </Text>
          ) : null}
        </View>

        <Pressable
          style={styles.iconBtn}
          onPress={() => navigation.navigate("Search")}
        >
          <Search size={20} color={colors.text} strokeWidth={2.2} />
        </Pressable>
      </View>

      <View style={styles.curve} />

      <View style={styles.filtersWrap}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {brandFilters.map((f) => (
            <Chip
              key={f.id}
              label={f.label}
              active={brandId === f.id}
              onPress={() => setBrandId(f.id)}
            />
          ))}
        </ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipRow}
        >
          {SORT_OPTIONS.map((s) => (
            <Chip
              key={s.id}
              label={s.label}
              active={sort === s.id}
              onPress={() => setSort(s.id)}
            />
          ))}
        </ScrollView>
      </View>

      {loading ? (
        <LoadingState message="Loading products..." />
      ) : error ? (
        <ErrorState message={error} onRetry={() => loadPage(1)} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          ListHeaderComponent={
            <View style={styles.strip}>
              <Text style={styles.stripText}>
                {activeBrand.label}
                {activeBrand.q ? ` · “${activeBrand.q}”` : ""} · {sortLabel}
              </Text>
              <Text style={styles.stripLink}>
                {hasMore ? "Scroll for more" : "All loaded"}
              </Text>
            </View>
          }
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color={colors.accent} />
              </View>
            ) : (
              <View style={{ height: 24 }} />
            )
          }
          ListEmptyComponent={
            <Text style={styles.empty}>
              No products match this filter. Try All or another brand.
            </Text>
          }
          renderItem={({ item }) => (
            <View style={styles.cell}>
              <ProductCard product={item} variant="grid" />
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.sm,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  titleBlock: {
    flex: 1,
    alignItems: "center",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    maxWidth: "92%",
  },
  catChip: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: -0.2,
    flexShrink: 1,
  },
  count: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textSecondary,
    fontWeight: "600",
  },
  curve: {
    height: 14,
    backgroundColor: colors.background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  filtersWrap: {
    backgroundColor: colors.background,
    paddingTop: spacing.sm,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingBottom: spacing.sm,
  },
  chipRow: {
    paddingHorizontal: spacing.lg,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: radii.pill,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.accentSoft,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.accentDark,
  },
  list: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
    paddingTop: spacing.md,
  },
  strip: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  stripText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
    flexShrink: 1,
    paddingRight: 8,
  },
  stripLink: {
    fontSize: 12,
    color: colors.accent,
    fontWeight: "800",
  },
  row: {
    gap: spacing.md,
  },
  cell: {
    flex: 1,
  },
  empty: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: 40,
    paddingHorizontal: spacing.lg,
    lineHeight: 20,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
