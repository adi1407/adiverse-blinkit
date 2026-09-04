import { useCallback, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  View,
  Text,
  Pressable,
  RefreshControl,
  TextInput,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { RotateCcw, Search } from "../utils/lucideIcons";
import ScreenHeader from "../components/ScreenHeader";
import ProductRow from "../components/ProductRow";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { useAuth } from "../context/AuthContext";
import { fetchHomeData } from "../api/catalogApi";
import { fetchReorderProducts } from "../api/ordersApi";
import { colors, spacing, radii, shadows } from "../theme/colors";

export default function OrderAgainScreen() {
  const navigation = useNavigation();
  const { user, isLoggedIn } = useAuth();
  const [pastProducts, setPastProducts] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const hasContent = pastProducts.length > 0 || rows.length > 0;

  const load = useCallback(
    async ({ silent = false } = {}) => {
      if (silent) setRefreshing(true);
      else setLoading(true);
      setError("");
      try {
        const home = await fetchHomeData();
        const featured =
          home.featuredRows?.slice(0, 4) ||
          (home.sections || [])
            .filter((s) => s.type === "product_rail")
            .slice(0, 4)
            .map((s) => ({ id: s.id, title: s.title, products: s.products }));
        setRows(featured);

        if (isLoggedIn) {
          const data = await fetchReorderProducts(user.phone);
          setPastProducts(data.products || []);
        } else {
          setPastProducts([]);
        }
      } catch (err) {
        setError(err.message || "Failed to load");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [isLoggedIn, user?.phone]
  );

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const filteredPast = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return pastProducts;
    return pastProducts.filter((p) =>
      `${p.name} ${p.brand || ""}`.toLowerCase().includes(q)
    );
  }, [pastProducts, query]);

  const hasPast = pastProducts.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Order Again"
        subtitle="Your favourites, one tap away"
      />
      <View style={styles.curve} />

      {loading && !hasContent ? (
        <LoadingState message="Loading suggestions..." />
      ) : error && !hasContent ? (
        <ErrorState message={error} onRetry={() => load()} />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load({ silent: true })}
              tintColor={colors.accent}
              colors={[colors.accent]}
              progressBackgroundColor={colors.white}
            />
          }
        >
          <View style={[styles.hero, shadows.soft]}>
            <View style={styles.heroIcon}>
              <RotateCcw size={22} color={colors.text} strokeWidth={2.3} />
            </View>
            <View style={styles.heroCopy}>
              <Text style={styles.heroTitle}>
                {hasPast
                  ? "Buy again from past orders"
                  : isLoggedIn
                    ? "No past orders yet"
                    : "Login to reorder faster"}
              </Text>
              <Text style={styles.heroText}>
                {hasPast
                  ? `${pastProducts.length} items you’ve bought before`
                  : isLoggedIn
                    ? "Place an order from Cart — they’ll land here."
                    : "Sign in, checkout once, then reorder in seconds."}
              </Text>
              {!isLoggedIn ? (
                <Pressable
                  style={styles.loginBtn}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.loginBtnText}>Login</Text>
                </Pressable>
              ) : null}
            </View>
          </View>

          {hasPast ? (
            <View style={styles.searchWrap}>
              <Search size={16} color={colors.textMuted} strokeWidth={2.2} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search past orders"
                placeholderTextColor={colors.textMuted}
                value={query}
                onChangeText={setQuery}
              />
            </View>
          ) : null}

          {hasPast ? (
            <ProductRow title="From your orders" products={filteredPast} />
          ) : null}

          {hasPast && query && filteredPast.length === 0 ? (
            <Text style={styles.emptySearch}>No matches for “{query}”</Text>
          ) : null}

          {rows.map((row) => (
            <ProductRow key={row.id} title={row.title} products={row.products} />
          ))}
        </ScrollView>
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
  curve: {
    height: 14,
    backgroundColor: colors.background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
  },
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 110,
  },
  hero: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.primarySoft,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
    flexDirection: "row",
    gap: spacing.md,
  },
  heroIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  heroCopy: {
    flex: 1,
  },
  heroTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 4,
  },
  heroText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    fontWeight: "500",
  },
  loginBtn: {
    marginTop: 10,
    alignSelf: "flex-start",
    backgroundColor: colors.text,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: radii.pill,
  },
  loginBtnText: {
    color: colors.primary,
    fontWeight: "900",
    fontSize: 13,
  },
  searchWrap: {
    marginHorizontal: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.surface,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    height: 44,
    borderWidth: 1,
    borderColor: colors.border,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    fontWeight: "500",
  },
  emptySearch: {
    textAlign: "center",
    color: colors.textMuted,
    fontWeight: "600",
    padding: spacing.lg,
  },
});
