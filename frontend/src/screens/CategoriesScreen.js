import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  View,
  Text,
  Pressable,
  Image,
  RefreshControl,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Search, ChevronRight } from "../utils/lucideIcons";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import ProductCard from "../components/ProductCard";
import {
  fetchCategories,
  fetchCategoryProducts,
} from "../api/catalogApi";
import { colors, spacing } from "../theme/colors";
import { fonts } from "../theme/typography";

function shortLabel(name) {
  return String(name || "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function RailItem({ cat, active, onPress }) {
  const label = shortLabel(cat.name);
  return (
    <Pressable
      style={[styles.railItem, active && styles.railItemActive]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
    >
      {active ? <View style={styles.railBar} /> : null}
      <View
        style={[
          styles.railThumb,
          { backgroundColor: cat.bg || "#F0F0F0" },
          active && styles.railThumbActive,
        ]}
      >
        {cat.image ? (
          <Image source={{ uri: cat.image }} style={styles.railImage} />
        ) : null}
      </View>
      <Text
        style={[styles.railLabel, active && styles.railLabelActive]}
        numberOfLines={2}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export default function CategoriesScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const selected = useMemo(
    () => categories.find((c) => c.id === selectedId) || null,
    [categories, selectedId]
  );

  const loadCategories = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const data = await fetchCategories();
      setCategories(data);
      setSelectedId((prev) => prev || data[0]?.id || null);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const loadProducts = useCallback(async (categoryId) => {
    if (!categoryId) return;
    setProductsLoading(true);
    try {
      const res = await fetchCategoryProducts(categoryId, { limit: 48 });
      setProducts(res?.products || res || []);
    } catch {
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  useEffect(() => {
    if (selectedId) loadProducts(selectedId);
  }, [selectedId, loadProducts]);

  function openAll() {
    if (!selectedId) return;
    navigation.navigate("CategoryProducts", { categoryId: selectedId });
  }

  const title = selected ? shortLabel(selected.name) : "Categories";

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <Pressable
          style={styles.searchPill}
          onPress={() => navigation.navigate("Search")}
          accessibilityRole="search"
        >
          <Search size={16} color="#6B6B6B" strokeWidth={2.4} />
          <Text style={styles.searchHint} numberOfLines={1}>
            Search for atta, milk, bread…
          </Text>
        </Pressable>
      </View>

      {loading && categories.length === 0 ? (
        <LoadingState message="Loading categories..." />
      ) : error && categories.length === 0 ? (
        <ErrorState message={error} onRetry={() => loadCategories()} />
      ) : (
        <View style={styles.split}>
          {/* Left aisle rail — Blinkit / Zepto style */}
          <ScrollView
            style={styles.rail}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.railContent}
          >
            {categories.map((cat) => (
              <RailItem
                key={cat.id}
                cat={cat}
                active={cat.id === selectedId}
                onPress={() => setSelectedId(cat.id)}
              />
            ))}
          </ScrollView>

          {/* Right product pane */}
          <View style={styles.pane}>
            <View style={styles.paneHeader}>
              <View style={styles.paneTitleBlock}>
                <Text style={styles.paneTitle} numberOfLines={1}>
                  {title}
                </Text>
                <Text style={styles.paneMeta}>
                  {productsLoading
                    ? "Loading…"
                    : `${products.length} items · 8 mins`}
                </Text>
              </View>
              <Pressable style={styles.seeAll} onPress={openAll} hitSlop={8}>
                <Text style={styles.seeAllText}>see all</Text>
                <ChevronRight
                  size={15}
                  color={colors.accent}
                  strokeWidth={2.6}
                />
              </Pressable>
            </View>

            {productsLoading && products.length === 0 ? (
              <LoadingState message="Fetching aisle…" />
            ) : (
              <FlatList
                data={products}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.gridRow}
                contentContainerStyle={styles.gridContent}
                showsVerticalScrollIndicator={false}
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => {
                      loadCategories({ silent: true });
                      if (selectedId) loadProducts(selectedId);
                    }}
                    tintColor={colors.accent}
                    colors={[colors.accent]}
                  />
                }
                ListEmptyComponent={
                  <Text style={styles.empty}>No items in this aisle yet</Text>
                }
                renderItem={({ item }) => (
                  <View style={styles.cardWrap}>
                    <ProductCard product={item} variant="grid" />
                  </View>
                )}
                ListFooterComponent={<View style={{ height: 100 }} />}
              />
            )}
          </View>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.white,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: 10,
    paddingBottom: 12,
    backgroundColor: colors.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#EEEEEE",
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.5,
    marginBottom: 10,
  },
  searchPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 42,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  searchHint: {
    flex: 1,
    fontSize: 13,
    color: "#8A8A8A",
    fontFamily: fonts.medium,
  },
  split: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: colors.white,
  },
  rail: {
    width: 86,
    backgroundColor: "#F6F6F6",
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: "#E8E8E8",
  },
  railContent: {
    paddingTop: 4,
    paddingBottom: 120,
  },
  railItem: {
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 6,
    minHeight: 88,
  },
  railItemActive: {
    backgroundColor: colors.white,
  },
  railBar: {
    position: "absolute",
    left: 0,
    top: 14,
    bottom: 14,
    width: 3,
    borderTopRightRadius: 3,
    borderBottomRightRadius: 3,
    backgroundColor: colors.accent,
  },
  railThumb: {
    width: 48,
    height: 48,
    borderRadius: 14,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  railThumbActive: {
    borderWidth: 1.5,
    borderColor: colors.accent,
  },
  railImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  railLabel: {
    fontSize: 10,
    textAlign: "center",
    color: "#7A7A7A",
    fontFamily: fonts.semiBold,
    lineHeight: 13,
  },
  railLabelActive: {
    color: colors.text,
    fontFamily: fonts.extraBold,
  },
  pane: {
    flex: 1,
    backgroundColor: colors.white,
  },
  paneHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  paneTitleBlock: {
    flex: 1,
    paddingRight: 8,
  },
  paneTitle: {
    fontSize: 16,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  paneMeta: {
    marginTop: 2,
    fontSize: 11,
    color: "#8C8C8C",
    fontFamily: fonts.medium,
  },
  seeAll: {
    flexDirection: "row",
    alignItems: "center",
  },
  seeAllText: {
    color: colors.accent,
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  gridContent: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
  gridRow: {
    justifyContent: "space-between",
    gap: 8,
  },
  cardWrap: {
    flex: 1,
    maxWidth: "48.5%",
  },
  empty: {
    textAlign: "center",
    marginTop: 48,
    color: "#9A9A9A",
    fontFamily: fonts.medium,
    fontSize: 13,
  },
});
