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
import { ChevronLeft, Search, X, Clock, ChevronRight } from "../utils/lucideIcons";
import ProductCard from "../components/ProductCard";
import ErrorState from "../components/ErrorState";
import { fetchSearch } from "../api/catalogApi";
import { useSearchHistory } from "../context/SearchHistoryContext";
import { colors, spacing, radii, shadows } from "../theme/colors";
import { fonts } from "../theme/typography";

const SUGGESTIONS = ["milk", "bread", "chips", "onion", "coke", "atta", "soap"];

function capitalize(term) {
  if (!term) return "";
  return term.charAt(0).toUpperCase() + term.slice(1);
}

export default function SearchScreen({ navigation, route }) {
  const initialQuery = route.params?.query || "";
  const isVoice = Boolean(route.params?.voice);
  const [query, setQuery] = useState(initialQuery);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);
  const inputRef = useRef(null);
  const requestId = useRef(0);
  const historyTimer = useRef(null);
  const { recent, addQuery, removeQuery, clearHistory } = useSearchHistory();

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 250);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    return () => {
      if (historyTimer.current) clearTimeout(historyTimer.current);
    };
  }, []);

  const runSearch = useCallback(
    async (raw) => {
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
        // Wait until typing pauses so we don't store "mi" / "mil" mid-word
        if (historyTimer.current) clearTimeout(historyTimer.current);
        historyTimer.current = setTimeout(() => {
          if (id === requestId.current) addQuery(q);
        }, 700);
      } catch (err) {
        if (id !== requestId.current) return;
        setProducts([]);
        setError(err.message || "Search failed");
      } finally {
        if (id === requestId.current) setLoading(false);
      }
    },
    [addQuery]
  );

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

  const showIdle = !searched || query.trim().length === 0;

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

      {isVoice ? (
        <Text style={styles.voiceCaption}>Voice search — type your query</Text>
      ) : null}

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
              {showIdle ? (
                <View>
                  {recent.length > 0 ? (
                    <View style={styles.recentBlock}>
                      <View style={styles.sectionRow}>
                        <Text style={[styles.sectionLabel, styles.sectionLabelInline]}>
                          Recent searches
                        </Text>
                        <Pressable onPress={clearHistory} hitSlop={8}>
                          <Text style={styles.clearHistory}>Clear</Text>
                        </Pressable>
                      </View>
                      {recent.map((term) => (
                        <Pressable
                          key={term}
                          style={styles.suggestRow}
                          onPress={() => applySuggestion(term)}
                        >
                          <View style={styles.suggestLeft}>
                            <Clock
                              size={16}
                              color={colors.textMuted}
                              strokeWidth={2.2}
                            />
                            <Text style={styles.suggestText}>{capitalize(term)}</Text>
                          </View>
                          <Pressable
                            onPress={() => removeQuery(term)}
                            hitSlop={8}
                            style={styles.recentRemove}
                          >
                            <X
                              size={14}
                              color={colors.textMuted}
                              strokeWidth={2.4}
                            />
                          </Pressable>
                        </Pressable>
                      ))}
                    </View>
                  ) : null}

                  <Text style={styles.sectionLabel}>Popular on Blinkit</Text>
                  {SUGGESTIONS.map((term) => (
                    <Pressable
                      key={term}
                      style={styles.suggestRow}
                      onPress={() => applySuggestion(term)}
                    >
                      <View style={styles.suggestLeft}>
                        <Search
                          size={16}
                          color={colors.textMuted}
                          strokeWidth={2.2}
                        />
                        <Text style={styles.suggestText}>{capitalize(term)}</Text>
                      </View>
                      <ChevronRight
                        size={16}
                        color={colors.textMuted}
                        strokeWidth={2.2}
                      />
                    </Pressable>
                  ))}
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
                <Text style={styles.emptyTitle}>Nothing matched</Text>
                <Text style={styles.emptyHint}>
                  Try a different word — milk, bread, chips, or atta usually work.
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
    paddingBottom: spacing.sm,
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
    fontFamily: fonts.semiBold,
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
  voiceCaption: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.sm,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
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
    fontSize: 14,
    fontFamily: fonts.extraBold,
    color: colors.text,
    marginBottom: spacing.sm,
    letterSpacing: -0.2,
  },
  sectionLabelInline: {
    marginBottom: 0,
  },
  sectionRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },
  clearHistory: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.accent,
  },
  recentBlock: {
    marginBottom: spacing.xl,
  },
  suggestRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  suggestLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  suggestText: {
    fontSize: 15,
    fontFamily: fonts.semiBold,
    color: colors.text,
  },
  recentRemove: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  resultMeta: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: spacing.sm,
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
    fontFamily: fonts.extraBold,
    color: colors.text,
    marginBottom: 6,
  },
  emptyHint: {
    fontSize: 13,
    color: colors.textMuted,
    textAlign: "center",
    fontFamily: fonts.medium,
    lineHeight: 19,
  },
});
