import { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  StatusBar,
  Platform,
  View,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import HomeHeader from "../components/HomeHeader";
import SearchBar from "../components/SearchBar";
import PromoBanner from "../components/PromoBanner";
import CategoryGrid from "../components/CategoryGrid";
import ProductRow from "../components/ProductRow";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { fetchHomeData } from "../api/catalogApi";
import { useRecentlyViewed } from "../context/RecentlyViewedContext";
import { colors } from "../theme/colors";

export default function HomeScreen() {
  const navigation = useNavigation();
  const { items: recentItems } = useRecentlyViewed();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadHome = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const homeData = await fetchHomeData();
      setData(homeData);
    } catch (err) {
      setError(err.message || "Failed to load home data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHome();
  }, [loadHome]);

  function openCategory(cat) {
    navigation.navigate("CategoryProducts", { categoryId: cat.id });
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <LoadingState message="Loading home..." />
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safe}>
        <ErrorState message={error} onRetry={loadHome} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ExpoStatusBar style="dark" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <HomeHeader minutes={data.deliveryInfo.minutes} />
          <SearchBar onPress={() => navigation.navigate("Search")} />
          <View style={styles.heroCurve} />
        </View>

        <PromoBanner />

        <CategoryGrid
          categories={data.categories}
          onSelectCategory={openCategory}
        />

        {recentItems.length > 0 ? (
          <ProductRow title="Recently viewed" products={recentItems} />
        ) : null}

        {data.featuredRows.map((row) => (
          <ProductRow
            key={row.id}
            title={row.title}
            products={row.products}
            onSeeAll={() => navigation.navigate("Categories")}
          />
        ))}
      </ScrollView>
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
    paddingBottom: 120,
  },
  hero: {
    backgroundColor: colors.primary,
    position: "relative",
  },
  heroCurve: {
    height: 14,
    backgroundColor: colors.background,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    marginTop: -2,
  },
});
