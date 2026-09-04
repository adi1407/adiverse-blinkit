import { ScrollView, Pressable, Text, StyleSheet, View } from "react-native";
import { getLucideIcon } from "../utils/icons";
import { colors, spacing, radii } from "../theme/colors";

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
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.primary,
    paddingBottom: spacing.sm,
  },
  row: {
    paddingHorizontal: spacing.lg,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radii.pill,
    backgroundColor: "rgba(255,255,255,0.45)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  chipActive: {
    backgroundColor: colors.primarySoft,
    borderColor: colors.text,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
  },
  labelActive: {
    color: colors.text,
    fontWeight: "900",
  },
});
