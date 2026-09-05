import { View, Text, StyleSheet, Pressable, useWindowDimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { ChevronRight } from "../utils/lucideIcons";
import CategoryCard, { CategoryCardSkeleton } from "./CategoryCard";
import { getCategoryFestivalAccent } from "./categoryFestival";
import { colors, spacing } from "../theme/colors";
import { fonts } from "../theme/typography";

const PREVIEW_LIMIT = 8;

/**
 * Home feed "Shop by category" block — premium grid + View all.
 */
export default function CategoryBlock({
  title,
  subtitle,
  tiles = [],
  onSelect,
  loading = false,
  onViewAll,
}) {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const columns = width >= 900 ? 6 : width >= 600 ? 5 : 4;
  const itemWidth =
    columns === 6 ? "15.5%" : columns === 5 ? "18.5%" : "23%";

  function handleViewAll() {
    if (onViewAll) onViewAll();
    else navigation.navigate("Categories");
  }

  if (loading) {
    return (
      <View style={styles.wrap}>
        {title ? <Text style={styles.title}>{title}</Text> : null}
        <View style={styles.grid}>
          {Array.from({ length: columns * 2 }).map((_, i) => (
            <CategoryCardSkeleton key={i} width={itemWidth} />
          ))}
        </View>
      </View>
    );
  }

  if (!tiles.length) {
    return (
      <View style={styles.wrap}>
        <Text style={styles.title}>{title || "Shop by category"}</Text>
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No categories available right now</Text>
          <Text style={styles.emptyBody}>
            Pull to refresh, or browse products from search.
          </Text>
          <Pressable
            onPress={() => navigation.navigate("Search")}
            style={({ pressed }) => [
              styles.emptyBtn,
              pressed && { opacity: 0.85 },
            ]}
            accessibilityRole="button"
            accessibilityLabel="Browse products"
          >
            <Text style={styles.emptyBtnText}>Browse products</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  const visible = tiles.slice(0, PREVIEW_LIMIT);
  const hasMore = tiles.length > PREVIEW_LIMIT;

  return (
    <View style={styles.wrap} accessibilityRole="summary">
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        <Pressable
          onPress={handleViewAll}
          hitSlop={8}
          style={({ pressed }) => [
            styles.viewAll,
            pressed && { opacity: 0.7 },
          ]}
          accessibilityRole="button"
          accessibilityLabel="View all categories"
        >
          <Text style={styles.viewAllText}>View all</Text>
          <ChevronRight size={15} color={colors.accent} strokeWidth={2.6} />
        </Pressable>
      </View>

      <View style={styles.grid}>
        {visible.map((tile, index) => {
          const accent = getCategoryFestivalAccent(tile.id);
          return (
            <CategoryCard
              key={tile.key || `${tile.id}-${index}`}
              category={tile}
              index={index}
              animateEnter
              width={itemWidth}
              festivalAccent={accent.active}
              accentLabel={accent.label}
              onPress={onSelect}
            />
          );
        })}
      </View>

      {hasMore ? (
        <Pressable
          onPress={handleViewAll}
          style={({ pressed }) => [
            styles.moreRow,
            pressed && { opacity: 0.8 },
          ]}
          accessibilityRole="button"
        >
          <Text style={styles.moreText}>
            +{tiles.length - PREVIEW_LIMIT} more categories
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: 20,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
    gap: 8,
  },
  titleBlock: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 3,
    fontSize: 12,
    color: "#7D7D7D",
    fontFamily: fonts.medium,
  },
  viewAll: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 2,
  },
  viewAllText: {
    color: colors.accent,
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  moreRow: {
    alignSelf: "center",
    marginTop: 2,
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  moreText: {
    fontSize: 12,
    fontFamily: fonts.semiBold,
    color: colors.textMuted,
  },
  empty: {
    marginTop: 8,
    padding: 16,
    borderRadius: 14,
    backgroundColor: colors.surface,
    alignItems: "flex-start",
  },
  emptyTitle: {
    fontSize: 14,
    fontFamily: fonts.extraBold,
    color: colors.text,
  },
  emptyBody: {
    marginTop: 4,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.textSecondary,
    lineHeight: 17,
  },
  emptyBtn: {
    marginTop: 12,
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 10,
  },
  emptyBtnText: {
    color: colors.white,
    fontFamily: fonts.extraBold,
    fontSize: 13,
  },
});
