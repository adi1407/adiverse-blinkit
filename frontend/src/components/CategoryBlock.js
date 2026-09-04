import { View, Text, StyleSheet, Pressable } from "react-native";
import { getLucideIcon } from "../utils/icons";
import { colors, spacing, radii, shadows } from "../theme/colors";

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
              style={styles.item}
              onPress={() => onSelect?.(tile)}
            >
              <View
                style={[
                  styles.tile,
                  { backgroundColor: tile.bg || colors.surface },
                  shadows.soft,
                ]}
              >
                <Icon
                  size={24}
                  color={tile.color || colors.accent}
                  strokeWidth={2.1}
                />
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
    paddingTop: spacing.lg,
    paddingBottom: spacing.md,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.text,
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 2,
    marginBottom: spacing.md,
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
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  name: {
    fontSize: 11,
    textAlign: "center",
    color: colors.text,
    lineHeight: 14,
    fontWeight: "600",
  },
});
