import { useCallback, useEffect, useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  View,
  Text,
  TextInput,
  RefreshControl,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Search } from "../utils/lucideIcons";
import ScreenHeader from "../components/ScreenHeader";
import CategoryGrid from "../components/CategoryGrid";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { fetchCategories } from "../api/catalogApi";
import { colors, spacing, radii } from "../theme/colors";

export default function CategoriesScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");

  const loadCategories = useCallback(async ({ silent = false } = {}) => {
    if (silent) setRefreshing(true);
    else setLoading(true);
    setError("");
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) =>
      String(c.name).replace(/\n/g, " ").toLowerCase().includes(q)
    );
  }, [categories, query]);

  function openCategory(cat) {
    navigation.navigate("CategoryProducts", { categoryId: cat.id });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Categories"
        subtitle="Browse every aisle in minutes"
      />
      <View style={styles.curve} />

      {loading && categories.length === 0 ? (
        <LoadingState message="Loading categories..." />
      ) : error && categories.length === 0 ? (
        <ErrorState message={error} onRetry={() => loadCategories()} />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => loadCategories({ silent: true })}
              tintColor={colors.accent}
              colors={[colors.accent]}
              progressBackgroundColor={colors.white}
            />
          }
        >
          <View style={styles.searchWrap}>
            <Search size={16} color={colors.textMuted} strokeWidth={2.2} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search categories"
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
            />
          </View>

          <View style={styles.note}>
            <Text style={styles.noteTitle}>
              {filtered.length} categor{filtered.length === 1 ? "y" : "ies"}
            </Text>
            <Text style={styles.noteText}>
              Tap an aisle — fresh stock, same-day delivery feel
            </Text>
          </View>

          <CategoryGrid
            categories={filtered}
            onSelectCategory={openCategory}
            showTitle={false}
          />
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
  searchWrap: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
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
  note: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
  },
  noteTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: -0.3,
  },
  noteText: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "500",
  },
});
