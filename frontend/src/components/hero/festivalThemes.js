/**
 * Festival-aware hero themes.
 * Add a new key here to introduce a festival — no JSX conditionals required in the hero.
 */
import { colors } from "../../theme/colors";

export const FESTIVAL_IDS = {
  DEFAULT: "default",
  JANMASHTAMI: "janmashtami",
  DIWALI: "diwali",
  HOLI: "holi",
  CHRISTMAS: "christmas",
};

/** Active festival for the homepage hero. Swap this (or drive from API later). */
export const ACTIVE_HERO_FESTIVAL = FESTIVAL_IDS.JANMASHTAMI;

export const FESTIVAL_THEMES = {
  [FESTIVAL_IDS.DEFAULT]: {
    id: FESTIVAL_IDS.DEFAULT,
    eyebrow: "Everyday essentials",
    headline: "Fresh groceries,\ndelivered fast",
    description:
      "Milk, veggies, snacks & more from nearby dark stores — at your door in minutes.",
    primaryCta: "Shop groceries",
    secondaryCta: "Browse categories",
    deliveryLabel: "Delivered in minutes",
    visualLabel: "Fresh basket",
    palette: {
      bgTop: "#FFF8E1",
      bgBottom: "#FFFFFF",
      orbA: "rgba(248,203,70,0.35)",
      orbB: "rgba(12,131,31,0.12)",
      accent: colors.primary,
      accentText: colors.text,
      deep: colors.text,
      soft: "#FFE58A",
      particle: "rgba(12,131,31,0.22)",
    },
    decorations: ["leaf", "bag", "spark"],
  },

  [FESTIVAL_IDS.JANMASHTAMI]: {
    id: FESTIVAL_IDS.JANMASHTAMI,
    eyebrow: "Janmashtami essentials",
    headline: "Celebrate with\nfresh festivity",
    description:
      "Butter, sweets, flowers & daily groceries — curated for the occasion, delivered in minutes.",
    primaryCta: "Shop festive picks",
    secondaryCta: "All groceries",
    deliveryLabel: "Quick delivery to your doorstep",
    visualLabel: "Festive décor",
    palette: {
      bgTop: "#F5EEFF",
      bgBottom: "#FFF9EC",
      orbA: "rgba(123, 63, 190, 0.16)",
      orbB: "rgba(248, 203, 70, 0.32)",
      accent: colors.primary,
      accentText: colors.text,
      deep: "#2C1A4D",
      soft: "#E9D9FF",
      particle: "rgba(248, 203, 70, 0.55)",
    },
    decorations: ["peacock", "flute", "matki", "diya"],
  },

  [FESTIVAL_IDS.DIWALI]: {
    id: FESTIVAL_IDS.DIWALI,
    eyebrow: "Diwali store",
    headline: "Lights, sweets\n& essentials",
    description:
      "Diyas, snacks, sweets and home staples — stock up before the celebrations begin.",
    primaryCta: "Shop Diwali picks",
    secondaryCta: "Browse home",
    deliveryLabel: "Delivered in minutes",
    visualLabel: "Diwali glow",
    palette: {
      bgTop: "#FFF3E0",
      bgBottom: "#FFFBF5",
      orbA: "rgba(239, 108, 0, 0.14)",
      orbB: "rgba(248, 203, 70, 0.28)",
      accent: colors.primary,
      accentText: colors.text,
      deep: "#4E342E",
      soft: "#FFE0B2",
      particle: "rgba(255, 193, 7, 0.5)",
    },
    decorations: ["diya", "spark", "bag"],
  },

  [FESTIVAL_IDS.HOLI]: {
    id: FESTIVAL_IDS.HOLI,
    eyebrow: "Holi colours",
    headline: "Colourful carts,\nfresh bites",
    description:
      "Thandai mixes, snacks and party essentials — ready before the gulaal flies.",
    primaryCta: "Shop Holi picks",
    secondaryCta: "Snacks & drinks",
    deliveryLabel: "Delivered in minutes",
    visualLabel: "Holi hues",
    palette: {
      bgTop: "#FCE4EC",
      bgBottom: "#E3F2FD",
      orbA: "rgba(233, 30, 99, 0.12)",
      orbB: "rgba(33, 150, 243, 0.14)",
      accent: colors.primary,
      accentText: colors.text,
      deep: "#4A148C",
      soft: "#F8BBD0",
      particle: "rgba(233, 30, 99, 0.35)",
    },
    decorations: ["spark", "leaf", "bag"],
  },

  [FESTIVAL_IDS.CHRISTMAS]: {
    id: FESTIVAL_IDS.CHRISTMAS,
    eyebrow: "Holiday pantry",
    headline: "Warm kitchens,\nquick delivery",
    description:
      "Baking staples, snacks and gifting picks — for cozy evenings without the rush.",
    primaryCta: "Shop holiday picks",
    secondaryCta: "Gifting aisle",
    deliveryLabel: "Delivered in minutes",
    visualLabel: "Holiday basket",
    palette: {
      bgTop: "#E8F5E9",
      bgBottom: "#FFF8E1",
      orbA: "rgba(46, 125, 50, 0.14)",
      orbB: "rgba(198, 40, 40, 0.1)",
      accent: colors.primary,
      accentText: colors.text,
      deep: "#1B5E20",
      soft: "#C8E6C9",
      particle: "rgba(255, 255, 255, 0.7)",
    },
    decorations: ["spark", "bag", "leaf"],
  },
};

export function getFestivalTheme(festivalId) {
  return (
    FESTIVAL_THEMES[festivalId] || FESTIVAL_THEMES[FESTIVAL_IDS.DEFAULT]
  );
}
