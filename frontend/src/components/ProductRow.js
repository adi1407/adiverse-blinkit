import { View, Text, StyleSheet, ScrollView } from "react-native";
import ProductCard from "./ProductCard";
import { colors, spacing } from "../theme/colors";

export default function ProductRow({ title, products }) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
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
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  list: {
    paddingHorizontal: spacing.lg,
  },
});
