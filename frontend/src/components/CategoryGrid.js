import { View, Text, StyleSheet, useWindowDimensions } from "react-native";
import CategoryCard, { CategoryCardSkeleton } from "./CategoryCard";
import { getCategoryFestivalAccent } from "./categoryFestival";
import { colors, spacing } from "../theme/colors";
import { fonts } from "../theme/typography";

export default function CategoryGrid({
  categories = [],
  onSelectCategory,
  showTitle = true,
  loading = false,
  selectedId = null,
}) {
  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 6 : width >= 600 ? 5 : 4;
  const itemWidth =
    columns === 6 ? "15.5%" : columns === 5 ? "18.5%" : "23%";

  return (
    <View style={styles.wrap}>
      {showTitle ? (
        <View style={styles.titleRow}>
          <Text style={styles.title}>Shop by category</Text>
        </View>
      ) : null}

      {loading ? (
        <View style={styles.grid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <CategoryCardSkeleton key={i} width={itemWidth} />
          ))}
        </View>
      ) : !categories.length ? (
        <Text style={styles.empty}>No categories available right now.</Text>
      ) : (
        <View style={styles.grid}>
          {categories.map((cat, index) => {
            const accent = getCategoryFestivalAccent(cat.id);
            return (
              <CategoryCard
                key={cat.id}
                category={cat}
                index={index}
                animateEnter
                width={itemWidth}
                selected={selectedId === cat.id}
                festivalAccent={accent.active}
                accentLabel={accent.label}
                onPress={onSelectCategory}
              />
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: 18,
    backgroundColor: colors.background,
  },
  titleRow: {
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.4,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  empty: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.textMuted,
    paddingVertical: 20,
  },
});
