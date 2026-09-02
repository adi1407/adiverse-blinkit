import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { ChevronRight } from "../utils/lucideIcons";
import ProductCard from "./ProductCard";
import { colors, spacing } from "../theme/colors";

export default function ProductRow({ title, products, onSeeAll }) {
  return (
    <View style={styles.wrap}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{products.length} products</Text>
        </View>
        {onSeeAll ? (
          <Pressable style={styles.seeAll} onPress={onSeeAll}>
            <Text style={styles.seeAllText}>See all</Text>
            <ChevronRight size={14} color={colors.accent} strokeWidth={2.6} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        decelerationRate="fast"
      >
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.sm,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  titleBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    fontSize: 17,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: -0.2,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 11,
    color: colors.textMuted,
    fontWeight: "600",
  },
  seeAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingBottom: 2,
  },
  seeAllText: {
    color: colors.accent,
    fontWeight: "800",
    fontSize: 12,
  },
  list: {
    paddingHorizontal: spacing.lg,
  },
});
