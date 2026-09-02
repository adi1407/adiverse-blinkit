import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, spacing, radii, shadows } from "../theme/colors";

export default function CategoryGrid({
  categories,
  onSelectCategory,
  showTitle = true,
}) {
  return (
    <View style={styles.wrap}>
      {showTitle ? (
        <View style={styles.titleRow}>
          <Text style={styles.title}>Shop by category</Text>
          <Text style={styles.caption}>Fresh picks near you</Text>
        </View>
      ) : null}

      <View style={styles.grid}>
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            style={styles.item}
            onPress={() => onSelectCategory?.(cat)}
          >
            <View style={[styles.tile, { backgroundColor: cat.bg }, shadows.soft]}>
              <Text style={styles.emoji}>{cat.emoji}</Text>
            </View>
            <Text style={styles.name}>{cat.name}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    backgroundColor: colors.background,
  },
  titleRow: {
    marginBottom: spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: -0.3,
  },
  caption: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "500",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  item: {
    width: "23%",
    marginBottom: spacing.lg,
    alignItems: "center",
  },
  tile: {
    width: "100%",
    aspectRatio: 0.95,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  emoji: {
    fontSize: 30,
  },
  name: {
    fontSize: 11,
    textAlign: "center",
    color: colors.text,
    lineHeight: 14,
    fontWeight: "600",
  },
});
