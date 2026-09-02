import { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  View,
  Text,
} from "react-native";
import ScreenHeader from "../components/ScreenHeader";
import ProductRow from "../components/ProductRow";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { fetchHomeData } from "../api/catalogApi";
import { colors, spacing } from "../theme/colors";

export default function OrderAgainScreen() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchHomeData();
      setRows(data.featuredRows || []);
    } catch (err) {
      setError(err.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Order Again"
        subtitle="Your previous picks & bestsellers"
      />

      {loading ? (
        <LoadingState message="Loading suggestions..." />
      ) : error ? (
        <ErrorState message={error} onRetry={load} />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.banner}>
            <Text style={styles.bannerTitle}>No past orders yet</Text>
            <Text style={styles.bannerText}>
              After your first order, reorder will show here. Till then, try these
              bestsellers.
            </Text>
          </View>
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
  scroll: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingBottom: 100,
  },
  banner: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.accentSoft,
    borderRadius: 12,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: colors.text,
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
