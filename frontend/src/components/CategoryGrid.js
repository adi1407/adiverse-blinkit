import { View, Text, StyleSheet, Pressable } from "react-native";
import { colors, spacing, radii } from "../theme/colors";

export default function CategoryGrid({ categories, onSelectCategory, showTitle = true }) {
  return (
    <View style={styles.wrap}>
      {showTitle ? <Text style={styles.title}>Shop by category</Text> : null}
      <View style={styles.grid}>
        {categories.map((cat) => (
          <Pressable
            key={cat.id}
            style={styles.item}
            onPress={() => onSelectCategory?.(cat)}
          >
            <View style={[styles.tile, { backgroundColor: cat.bg }]}>
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
  title: {
    fontSize: 16,
    fontWeight: "700",
    color: colors.text,
    marginBottom: spacing.md,
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
    aspectRatio: 1,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.sm,
  },
  emoji: {
    fontSize: 28,
  },
  name: {
    fontSize: 11,
    textAlign: "center",
    color: colors.text,
    lineHeight: 14,
    fontWeight: "500",
  },
});
