import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { colors, spacing, radii, shadows } from "../theme/colors";
import { fonts } from "../theme/typography";
import { getLucideIcon } from "../utils/icons";

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
        {categories.map((cat) => {
          const Icon = getLucideIcon(cat.icon);
          return (
            <Pressable
              key={cat.id}
              style={({ pressed }) => [
                styles.item,
                pressed && { opacity: 0.88, transform: [{ scale: 0.97 }] },
              ]}
              onPress={() => onSelectCategory?.(cat)}
            >
              <View
                style={[
                  styles.tile,
                  { backgroundColor: cat.bg },
                  shadows.soft,
                ]}
              >
                {cat.image ? (
                  <Image
                    source={{ uri: cat.image }}
                    style={styles.tileImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View style={styles.iconCircle}>
                    <Icon
                      size={26}
                      color={cat.color || colors.accent}
                      strokeWidth={2.1}
                    />
                  </View>
                )}
              </View>
              <Text style={styles.name}>{cat.name}</Text>
            </Pressable>
          );
        })}
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
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  caption: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
    fontFamily: fonts.medium,
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
    overflow: "hidden",
  },
  tileImage: {
    width: "100%",
    height: "100%",
  },
  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.72)",
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    fontSize: 11,
    textAlign: "center",
    color: colors.text,
    lineHeight: 14,
    fontFamily: fonts.semiBold,
  },
});
