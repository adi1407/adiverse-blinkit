import { View, Text, StyleSheet, Pressable, ScrollView } from "react-native";
import { ArrowRight, Zap, Percent, Pill } from "../utils/lucideIcons";
import { colors, spacing, radii, shadows } from "../theme/colors";

const OFFERS = [
  {
    id: "o1",
    title: "Get FREE delivery",
    subtitle: "on your first order above ₹199",
    Icon: Zap,
    bg: "#1C1C1C",
    tint: "#F8CB46",
  },
  {
    id: "o2",
    title: "Up to 50% OFF",
    subtitle: "Snacks, drinks & more",
    Icon: Percent,
    bg: "#0C831F",
    tint: "#FFFFFF",
  },
  {
    id: "o3",
    title: "Pharmacy in minutes",
    subtitle: "Medicines & wellness",
    Icon: Pill,
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
        {OFFERS.map((offer) => {
          const Icon = offer.Icon;
          return (
            <Pressable
              key={offer.id}
              style={[styles.card, { backgroundColor: offer.bg }, shadows.card]}
            >
              <View style={styles.copy}>
                <Text style={[styles.title, { color: offer.tint }]}>
                  {offer.title}
                </Text>
                <Text style={styles.subtitle}>{offer.subtitle}</Text>
                <View style={styles.ctaRow}>
                  <Text style={[styles.cta, { color: offer.tint }]}>Explore</Text>
                  <ArrowRight size={14} color={offer.tint} strokeWidth={2.4} />
                </View>
              </View>
              <View
                style={[
                  styles.iconWrap,
                  { backgroundColor: "rgba(255,255,255,0.12)" },
                ]}
              >
                <Icon size={28} color={offer.tint} strokeWidth={2} />
              </View>
            </Pressable>
          );
        })}
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
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
