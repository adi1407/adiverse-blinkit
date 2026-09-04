import { ScrollView, Pressable, Text, StyleSheet, View } from "react-native";
import { getLucideIcon } from "../utils/icons";
import { colors, spacing } from "../theme/colors";
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
              <View style={[styles.iconWrap, active && styles.iconWrapActive]}>
                <Icon
                  size={13}
                  color={colors.text}
                  strokeWidth={active ? 2.5 : 2.1}
                />
              </View>
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
    paddingBottom: 12,
  },
  row: {
    paddingHorizontal: spacing.lg,
    gap: 8,
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingLeft: 4,
    paddingRight: 12,
    paddingVertical: 4,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.42)",
    borderWidth: 1.2,
    borderColor: "transparent",
  },
  chipActive: {
    backgroundColor: colors.white,
    borderColor: colors.text,
  },
  iconWrap: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.85)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconWrapActive: {
    backgroundColor: colors.primary,
  },
  label: {
    fontSize: 12,
    fontFamily: fonts.bold,
    color: "rgba(31,31,31,0.72)",
  },
  labelActive: {
    color: colors.text,
    fontFamily: fonts.extraBold,
  },
});
