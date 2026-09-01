import { SafeAreaView, ScrollView, StyleSheet, StatusBar, Platform } from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import HomeHeader from "../components/HomeHeader";
import SearchBar from "../components/SearchBar";
import CategoryGrid from "../components/CategoryGrid";
import ProductRow from "../components/ProductRow";
import {
  deliveryInfo,
  categories,
  dairyProducts,
  snackProducts,
} from "../data/mockHome";
import { colors } from "../theme/colors";

export default function HomeScreen() {
  const navigation = useNavigation();

  function openCategory(cat) {
    navigation.navigate("CategoryProducts", { categoryId: cat.id });
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
          minutes={deliveryInfo.minutes}
          addressLabel={deliveryInfo.addressLabel}
          address={deliveryInfo.address}
        />
        <SearchBar />
        <CategoryGrid categories={categories} onSelectCategory={openCategory} />
        <ProductRow title="Dairy, Bread & Eggs" products={dairyProducts} />
        <ProductRow title="Snacks & Munchies" products={snackProducts} />
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
