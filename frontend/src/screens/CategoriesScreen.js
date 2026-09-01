import { SafeAreaView, ScrollView, StyleSheet, StatusBar, Platform } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ScreenHeader from "../components/ScreenHeader";
import CategoryGrid from "../components/CategoryGrid";
import { categories } from "../data/mockHome";
import { colors } from "../theme/colors";

export default function CategoriesScreen() {
  const navigation = useNavigation();

  function openCategory(cat) {
    navigation.navigate("CategoryProducts", { categoryId: cat.id });
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScreenHeader
        title="Categories"
        subtitle="Browse everything we deliver"
      />
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
