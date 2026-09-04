import { View, Text, StyleSheet, Pressable, Image } from "react-native";
import { getLucideIcon } from "../utils/icons";
import { colors, spacing, radii } from "../theme/colors";
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
          const shortName = String(tile.name || "")
            .replace(/\s*&\s*/g, " &\n")
            .split(" ")
            .slice(0, 4)
            .join(" ");
          return (
            <Pressable
              key={tile.id}
              style={({ pressed }) => [
                styles.item,
                pressed && { opacity: 0.9, transform: [{ scale: 0.96 }] },
              ]}
              onPress={() => onSelect?.(tile)}
            >
              <View
                style={[
                  styles.tile,
                  { backgroundColor: tile.bg || "#F5F5F5" },
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
                    size={28}
                    color={tile.color || colors.accent}
                    strokeWidth={2}
                  />
                )}
              </View>
              <Text style={styles.name} numberOfLines={2}>
                {shortName}
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
    paddingTop: 22,
    paddingBottom: 8,
    backgroundColor: colors.background,
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.extraBold,
    color: colors.text,
    letterSpacing: -0.4,
  },
  subtitle: {
    marginTop: 3,
    marginBottom: 14,
    fontSize: 12,
    color: "#7D7D7D",
    fontFamily: fonts.medium,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  item: {
    width: "23%",
    marginBottom: 14,
    alignItems: "center",
  },
  tile: {
    width: "100%",
    aspectRatio: 0.92,
    borderRadius: 14,
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
    color: "#1F1F1F",
    lineHeight: 14,
    fontFamily: fonts.semiBold,
    minHeight: 28,
  },
});
