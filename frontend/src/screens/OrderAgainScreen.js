import { useCallback, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  View,
  Text,
  Pressable,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { RotateCcw } from "../utils/lucideIcons";
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
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const home = await fetchHomeData();
      setRows(home.featuredRows || []);

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
    }
  }, [isLoggedIn, user?.phone]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const hasPast = pastProducts.length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Order Again"
        subtitle="Reorder favorites in one tap"
      />
      <View style={styles.curve} />

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
          <View style={[styles.banner, shadows.soft]}>
            <View style={styles.bannerIcon}>
              <RotateCcw size={20} color={colors.accent} strokeWidth={2.3} />
            </View>
            <View style={styles.bannerCopy}>
              <Text style={styles.bannerTitle}>
                {hasPast
                  ? "From your past orders"
                  : isLoggedIn
                    ? "No past orders yet"
                    : "Login to reorder"}
              </Text>
              <Text style={styles.bannerText}>
                {hasPast
                  ? "Tap ADD on anything you’ve bought before."
                  : isLoggedIn
                    ? "Checkout from Cart and your basket items will show here."
                    : "Login, place an order, then reorder from this tab."}
              </Text>
              {!isLoggedIn ? (
                <Pressable
                  style={styles.loginLink}
                  onPress={() => navigation.navigate("Login")}
                >
                  <Text style={styles.loginLinkText}>Login →</Text>
                </Pressable>
              ) : null}
            </View>
          </View>

          {hasPast ? (
            <ProductRow title="Buy again" products={pastProducts} />
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
  banner: {
    margin: spacing.lg,
    padding: spacing.lg,
    backgroundColor: colors.white,
    borderRadius: radii.lg,
    borderWidth: 1,
    borderColor: colors.border,
    flexDirection: "row",
    gap: spacing.md,
  },
  bannerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerCopy: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 15,
    fontWeight: "900",
    color: colors.text,
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
    fontWeight: "500",
  },
  loginLink: {
    marginTop: 8,
    alignSelf: "flex-start",
  },
  loginLinkText: {
    color: colors.accent,
    fontWeight: "900",
    fontSize: 13,
  },
});
