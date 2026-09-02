import { useCallback, useEffect, useState } from "react";
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

export default function CategoryProductsScreen({ navigation, route }) {
  const { categoryId } = route.params;
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");

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
    [categoryId]
  );

  useEffect(() => {
    setProducts([]);
    setPage(1);
    loadPage(1, { append: false });
  }, [categoryId, loadPage]);

  function onEndReached() {
    if (loading || loadingMore || !hasMore) return;
    loadPage(page + 1, { append: true });
  }

  const title = category ? categoryTitle(category) : "Products";
  const Icon = getLucideIcon(category?.icon);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <ChevronLeft size={24} color={colors.text} strokeWidth={2.4} />
        </Pressable>

        <View style={styles.titleBlock}>
          <View style={styles.titleRow}>
            {category ? (
              <View style={[styles.catChip, { backgroundColor: category.bg || colors.surface }]}>
                <Icon size={14} color={category.color || colors.accent} strokeWidth={2.2} />
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
              <Text style={styles.stripText}>Sorted by relevance</Text>
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
            <Text style={styles.empty}>No products in this category yet.</Text>
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
  list: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingBottom: 40,
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
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
