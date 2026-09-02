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
} from "react-native";
import { ChevronLeft, Search } from "../utils/lucideIcons";
import ProductCard from "../components/ProductCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { fetchCategoryProducts } from "../api/catalogApi";
import { categoryTitle } from "../utils/category";
import { getLucideIcon } from "../utils/icons";
import { colors, spacing, radii, shadows } from "../theme/colors";

export default function CategoryProductsScreen({ navigation, route }) {
  const { categoryId } = route.params;
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchCategoryProducts(categoryId);
      setCategory(data.category);
      setProducts(data.products);
    } catch (err) {
      setError(err.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

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
            <Text style={styles.count}>{products.length} items · delivery in 8 mins</Text>
          ) : null}
        </View>

        <Pressable style={styles.iconBtn}>
          <Search size={20} color={colors.text} strokeWidth={2.2} />
        </Pressable>
      </View>

      <View style={styles.curve} />

      {loading ? (
        <LoadingState message="Loading products..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadProducts} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.strip}>
              <Text style={styles.stripText}>Sorted by relevance</Text>
              <Text style={styles.stripLink}>Filters</Text>
            </View>
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
});
