import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, StatusBar, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ScreenHeader from "../components/ScreenHeader";
import CategoryGrid from "../components/CategoryGrid";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { fetchCategories } from "../api/catalogApi";
import { colors } from "../theme/colors";

export default function CategoriesScreen() {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCategories = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchCategories();
      setCategories(data);
    } catch (err) {
      setError(err.message || "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  function openCategory(cat) {
    navigation.navigate("CategoryProducts", { categoryId: cat.id });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Categories"
        subtitle="Browse everything we deliver"
      />

      {loading ? (
        <LoadingState message="Loading categories..." />
      ) : error ? (
        <ErrorState message={error} onRetry={loadCategories} />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <CategoryGrid
            categories={categories}
            onSelectCategory={openCategory}
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
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 24,
  },
});
