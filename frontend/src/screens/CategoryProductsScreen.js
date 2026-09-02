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
import { Ionicons } from "@expo/vector-icons";
import ProductCard from "../components/ProductCard";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { fetchCategoryProducts } from "../api/catalogApi";
import { categoryTitle } from "../utils/category";
import { colors, spacing } from "../theme/colors";

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

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color={colors.text} />
        </Pressable>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={styles.backBtn} />
      </View>

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
    paddingBottom: spacing.md,
  },
  backBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
  },
  list: {
    flexGrow: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: 32,
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
