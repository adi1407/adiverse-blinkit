import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { getLucideIcon } from "../utils/icons";
import { colors, spacing, radii, shadows } from "../theme/colors";
import { fonts } from "../theme/typography";

export default function CategoryBlock({ title, subtitle, tiles = [], onSelect }) {
  if (!tiles.length) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      <View style={styles.grid}>
        {tiles.slice(0, 8).map((tile) => {
          const Icon = getLucideIcon(tile.icon);
          return (
            <Pressable
              key={tile.id}
              style={({ pressed }) => [
                styles.item,
                pressed && { opacity: 0.85, transform: [{ scale: 0.97 }] },
              ]}
              onPress={() => onSelect?.(tile)}
            >
              <View
                style={[
                  styles.tile,
                  { backgroundColor: tile.bg || colors.surface },
                  shadows.soft,
                ]}
              >
                {tile.image ? (
                  <Image
                    source={{ uri: tile.image }}
                    style={styles.tileImage}
                    resizeMode="cover"
                  />
                ) : (
                  <Icon
                    size={24}
                    color={tile.color || colors.accent}
                    strokeWidth={2.1}
                  />
                )}
              </View>
              <Text style={styles.name} numberOfLines={2}>
                {tile.name}
              </Text>
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
    paddingTop: spacing.xl,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 2,
    marginBottom: spacing.md,
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
    marginBottom: spacing.md,
    alignItems: "center",
  },
  tile: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: radii.md,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
    overflow: "hidden",
  },
  tileImage: {
    width: "100%",
    height: "100%",
  },
  name: {
    fontSize: 11,
    textAlign: "center",
    color: colors.text,
    lineHeight: 14,
    fontFamily: fonts.semiBold,
  },
});
