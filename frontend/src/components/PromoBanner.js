import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, spacing, radii, shadows } from "../theme/colors";

const OFFERS = [
  {
    id: "o1",
    title: "Get FREE delivery",
    subtitle: "on your first order above ₹199",
    emoji: "⚡",
    bg: "#1C1C1C",
    tint: "#F8CB46",
  },
  {
    id: "o2",
    title: "Up to 50% OFF",
    subtitle: "Snacks, drinks & more",
    emoji: "🔥",
    bg: "#0C831F",
    tint: "#FFFFFF",
  },
  {
    id: "o3",
    title: "Pharmacy in minutes",
    subtitle: "Medicines & wellness",
    emoji: "💊",
    bg: "#1434A0",
    tint: "#FFFFFF",
  },
];

export default function PromoBanner() {
  return (
    <View style={styles.wrap}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.list}
        decelerationRate="fast"
        snapToInterval={292}
      >
        {OFFERS.map((offer) => (
          <Pressable
            key={offer.id}
            style={[styles.card, { backgroundColor: offer.bg }, shadows.card]}
          >
            <View style={styles.copy}>
              <Text style={[styles.title, { color: offer.tint }]}>{offer.title}</Text>
              <Text style={styles.subtitle}>{offer.subtitle}</Text>
              <View style={styles.ctaRow}>
                <Text style={[styles.cta, { color: offer.tint }]}>Explore</Text>
                <Ionicons name="arrow-forward" size={14} color={offer.tint} />
              </View>
            </View>
            <Text style={styles.emoji}>{offer.emoji}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    backgroundColor: colors.background,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
  },
  list: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  card: {
    width: 280,
    minHeight: 108,
    borderRadius: radii.lg,
    padding: spacing.lg,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  copy: {
    flex: 1,
    paddingRight: spacing.sm,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: -0.2,
  },
  subtitle: {
    marginTop: 4,
    fontSize: 12,
    color: "rgba(255,255,255,0.82)",
    lineHeight: 16,
  },
  ctaRow: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  cta: {
    fontSize: 12,
    fontWeight: "800",
  },
  emoji: {
    fontSize: 42,
  },
});
