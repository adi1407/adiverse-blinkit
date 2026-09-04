import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { ChevronRight } from "../utils/lucideIcons";
import ProductCard from "./ProductCard";
import { colors, spacing } from "../theme/colors";

/** Horizontal product rail with optional auto-scroll (Blinkit “moving” strip). */
export default function ProductRow({
  title,
  subtitle,
  products = [],
  onSeeAll,
  autoScroll = false,
  tint,
}) {
  const scrollRef = useRef(null);
  const offset = useRef(0);

  useEffect(() => {
    if (!autoScroll || products.length < 3) return undefined;
    const id = setInterval(() => {
      offset.current += 118;
      const max = products.length * 118;
      if (offset.current > max - 280) offset.current = 0;
      scrollRef.current?.scrollTo({ x: offset.current, animated: true });
    }, 2800);
    return () => clearInterval(id);
  }, [autoScroll, products.length]);

  if (!products.length) return null;

  return (
    <View style={[styles.wrap, tint ? { backgroundColor: tint } : null]}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>
            {subtitle || `${products.length} products`}
          </Text>
        </View>
        {onSeeAll ? (
          <Pressable style={styles.seeAll} onPress={onSeeAll}>
            <Text style={styles.seeAllText}>See all</Text>
            <ChevronRight size={14} color={colors.accent} strokeWidth={2.6} />
          </Pressable>
        ) : null}
      </View>

      <ScrollView
        ref={scrollRef}
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
