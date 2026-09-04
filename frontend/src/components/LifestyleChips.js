import { ScrollView, Pressable, Text, StyleSheet, View } from "react-native";
import { getLucideIcon } from "../utils/icons";
import { colors, spacing, radii } from "../theme/colors";
import { fonts } from "../theme/typography";

const FALLBACK_HUBS = [
  { id: "all", label: "All", icon: "LayoutGrid" },
  { id: "electronics", label: "Electronics", icon: "Lightbulb" },
  { id: "beauty", label: "Beauty", icon: "Sparkles" },
  { id: "gifting", label: "Gifting", icon: "Gift" },
  { id: "decor", label: "Decor", icon: "SprayCan" },
  { id: "kids", label: "Kids", icon: "Baby" },
  { id: "imported", label: "Imported", icon: "Globe" },
];

export default function LifestyleChips({ hubs, selectedId, onSelect }) {
  const list = hubs?.length ? hubs : FALLBACK_HUBS;

  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.row}
      >
        {list.map((hub) => {
          const active = hub.id === selectedId;
          const Icon = getLucideIcon(hub.icon);
          return (
            <Pressable
              key={hub.id}
              onPress={() => onSelect?.(hub.id)}
              style={[styles.chip, active && styles.chipActive]}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
            >
              <Icon
                size={15}
                color={active ? colors.text : colors.textSecondary}
                strokeWidth={active ? 2.4 : 2.1}
              />
              <Text style={[styles.label, active && styles.labelActive]}>
                {hub.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
      <View pointerEvents="none" style={styles.fadeLeft} />
      <View pointerEvents="none" style={styles.fadeRight} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primary,
    paddingBottom: spacing.sm,
    position: "relative",
  },
  row: {
    paddingHorizontal: spacing.lg,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: radii.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  chipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.text,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.text,
    fontFamily: fonts.extraBold,
  },
  fadeLeft: {
    position: "absolute",
    left: 0,
    top: 0,
    bottom: spacing.sm,
    width: 16,
    backgroundColor: "transparent",
  },
  fadeRight: {
    position: "absolute",
    right: 0,
    top: 0,
    bottom: spacing.sm,
    width: 20,
    backgroundColor: "transparent",
  },
});
