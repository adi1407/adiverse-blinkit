import { useCallback, useEffect, useState } from "react";
import { SafeAreaView, ScrollView, StyleSheet, StatusBar, Platform } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import HomeHeader from "../components/HomeHeader";
import SearchBar from "../components/SearchBar";
import CategoryGrid from "../components/CategoryGrid";
import ProductRow from "../components/ProductRow";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import { fetchHomeData } from "../api/catalogApi";
import { colors } from "../theme/colors";

export default function HomeScreen() {
  const navigation = useNavigation();
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
        <HomeHeader
          minutes={data.deliveryInfo.minutes}
          addressLabel={data.deliveryInfo.addressLabel}
          address={data.deliveryInfo.address}
        />
        <SearchBar />
        <CategoryGrid
          categories={data.categories}
          onSelectCategory={openCategory}
        />
        {data.featuredRows.map((row) => (
          <ProductRow key={row.id} title={row.title} products={row.products} />
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
    paddingBottom: 32,
  },
});
