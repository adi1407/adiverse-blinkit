import { useCallback, useEffect, useRef, useState } from "react";
import {
  SafeAreaView,
  FlatList,
  View,
  Text,
  TextInput,
  StyleSheet,
  StatusBar,
  Platform,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { ChevronLeft, Search, X } from "../utils/lucideIcons";
import ProductCard from "../components/ProductCard";
import ErrorState from "../components/ErrorState";
import { fetchSearch } from "../api/catalogApi";
import { colors, spacing, radii, shadows } from "../theme/colors";

const SUGGESTIONS = ["milk", "bread", "chips", "onion", "coke", "atta", "soap"];

export default function SearchScreen({ navigation, route }) {
  const initialQuery = route.params?.query || "";
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);
  const requestId = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(t);
  }, []);

  const runSearch = useCallback(async (raw) => {
    const q = String(raw || "").trim();
    if (!q) {
      setProducts([]);
      setError("");
      setLoading(false);
      setSearched(false);
      return;
    }

    const id = ++requestId.current;
    setLoading(true);
    setError("");
    setSearched(true);

    try {
      const data = await fetchSearch(q);
      if (id !== requestId.current) return;
      setProducts(data.products || []);
    } catch (err) {
      if (id !== requestId.current) return;
      setProducts([]);
      setError(err.message || "Search failed");
    } finally {
      if (id === requestId.current) setLoading(false);
    }
  }, []);

  // Debounce API calls while typing
  useEffect(() => {
    const id = setTimeout(() => runSearch(query), 320);
    return () => clearTimeout(id);
  }, [query, runSearch]);

  function clearQuery() {
    setQuery("");
    setProducts([]);
    setError("");
    setSearched(false);
    inputRef.current?.focus();
  }

  function applySuggestion(term) {
    setQuery(term);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn} hitSlop={8}>
          <ChevronLeft size={24} color={colors.text} strokeWidth={2.4} />
        </Pressable>

        <View style={[styles.inputWrap, shadows.soft]}>
          <Search size={18} color={colors.textMuted} strokeWidth={2.2} />
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={query}
            onChangeText={setQuery}
            placeholder='Search for "milk"'
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            autoCorrect={false}
            autoCapitalize="none"
            clearButtonMode="never"
          />
          {query.length > 0 ? (
            <Pressable onPress={clearQuery} hitSlop={8} style={styles.clearBtn}>
              <X size={16} color={colors.textSecondary} strokeWidth={2.4} />
            </Pressable>
          ) : null}
        </View>
      </View>

      <View style={styles.curve} />

      {error ? (
        <ErrorState message={error} onRetry={() => runSearch(query)} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.row}
          contentContainerStyle={styles.list}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View style={styles.listHeader}>
              {!searched || query.trim().length === 0 ? (
                <View>
                  <Text style={styles.sectionLabel}>Popular searches</Text>
                  <View style={styles.chips}>
                    {SUGGESTIONS.map((term) => (
                      <Pressable
                        key={term}
                        style={styles.chip}
                        onPress={() => applySuggestion(term)}
                      >
                        <Search size={12} color={colors.textSecondary} strokeWidth={2.2} />
                        <Text style={styles.chipText}>{term}</Text>
                      </Pressable>
                    ))}
                  </View>
                </View>
              ) : (
                <View style={styles.resultMeta}>
                  <Text style={styles.sectionLabel}>
                    {loading
                      ? "Searching…"
                      : `${products.length} result${products.length === 1 ? "" : "s"} for “${query.trim()}”`}
                  </Text>
                  {loading ? (
                    <ActivityIndicator size="small" color={colors.accent} />
                  ) : null}
                </View>
              )}
            </View>
          }
          ListEmptyComponent={
            searched && !loading ? (
              <View style={styles.empty}>
                <Text style={styles.emptyTitle}>No products found</Text>
                <Text style={styles.emptyHint}>
                  Try milk, bread, chips, onion, or soap
                </Text>
              </View>
            ) : null
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
    gap: 4,
  },
  iconBtn: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.white,
    borderRadius: radii.md,
    paddingHorizontal: spacing.md,
    height: 46,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: colors.text,
    fontWeight: "600",
    paddingVertical: 0,
  },
  clearBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
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
  listHeader: {
    marginBottom: spacing.md,
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: colors.text,
    marginBottom: spacing.sm,
  },
  resultMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  chip: {
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
  chipText: {
    fontSize: 13,
    fontWeight: "700",
    color: colors.textSecondary,
    textTransform: "capitalize",
  },
  row: {
    gap: spacing.md,
  },
  cell: {
    flex: 1,
  },
  empty: {
    alignItems: "center",
    paddingTop: 48,
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 6,
  },
  emptyHint: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    fontWeight: "500",
  },
});
