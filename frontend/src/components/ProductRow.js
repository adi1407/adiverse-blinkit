import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { ChevronRight } from "../utils/lucideIcons";
import ProductCard from "./ProductCard";
import { colors, spacing } from "../theme/colors";
import { fonts } from "../theme/typography";

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
      offset.current += 50;
      const max = products.length * 136;
      if (offset.current > max - 260) offset.current = 0;
      scrollRef.current?.scrollTo({ x: offset.current, animated: true });
    }, 2400);
    return () => clearInterval(id);
  }, [autoScroll, products.length]);

  if (!products.length) return null;

  return (
    <View style={[styles.wrap, tint ? { backgroundColor: tint } : null]}>
      <View style={styles.header}>
        <View style={styles.titleBlock}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
        {onSeeAll ? (
          <Pressable style={styles.seeAll} onPress={onSeeAll} hitSlop={8}>
            <Text style={styles.seeAllText}>see all</Text>
            <ChevronRight size={15} color={colors.accent} strokeWidth={2.6} />
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
    paddingTop: 18,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: spacing.lg,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  titleBlock: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.extraBold,
    color: "#1F1F1F",
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 2,
    fontSize: 12,
    color: "#7D7D7D",
    fontFamily: fonts.medium,
  },
  seeAll: {
    flexDirection: "row",
    alignItems: "center",
    gap: 0,
  },
  seeAllText: {
    color: colors.accent,
    fontFamily: fonts.bold,
    fontSize: 13,
  },
  list: {
    paddingHorizontal: spacing.lg,
    paddingBottom: 8,
  },
});
