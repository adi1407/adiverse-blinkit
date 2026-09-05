/**
 * Festival-aware hero themes.
 * Add a new key here to introduce a festival — no JSX conditionals required in the hero.
 */
import { colors } from "../../theme/colors";
import { JANMASHTAMI_ASSETS } from "./festivalAssets";

export const FESTIVAL_IDS = {
  DEFAULT: "default",
  JANMASHTAMI: "janmashtami",
  DIWALI: "diwali",
  HOLI: "holi",
  CHRISTMAS: "christmas",
};

/** Active festival for the homepage hero (local default; API can override). */
export const ACTIVE_HERO_FESTIVAL = FESTIVAL_IDS.JANMASHTAMI;

/** Runtime override from GET /api/festivals/active */
let liveFestivalId = ACTIVE_HERO_FESTIVAL;

export function setLiveFestivalId(id) {
  if (id && (FESTIVAL_THEMES[id] || id)) {
    liveFestivalId = id;
  }
}

export function getLiveFestivalId() {
  return liveFestivalId || ACTIVE_HERO_FESTIVAL;
}

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
    visualType: "abstract",
    particleCount: 7,
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
    assets: null,
  },

  [FESTIVAL_IDS.JANMASHTAMI]: {
    id: FESTIVAL_IDS.JANMASHTAMI,
    eyebrow: "Janmashtami specials",
    headline: "Makhan, mishri\n& fresh joy",
    description:
      "Butter, sweets, flowers & daily groceries for the celebration — delivered in minutes.",
    primaryCta: "Shop festive picks",
    secondaryCta: "All groceries",
    deliveryLabel: "Quick delivery to your doorstep",
    visualLabel: "Lord Krishna Janmashtami",
    visualType: "janmashtami",
    particleCount: 12,
    palette: {
      bgTop: "#F3E9FF",
      bgBottom: "#FFF8E8",
      orbA: "rgba(123, 63, 190, 0.2)",
      orbB: "rgba(248, 203, 70, 0.38)",
      accent: colors.primary,
      accentText: colors.text,
      deep: "#2C1A4D",
      soft: "#E4D4FF",
      particle: "rgba(248, 203, 70, 0.65)",
    },
    decorations: ["peacock", "flute", "matki", "diya"],
    assets: JANMASHTAMI_ASSETS,
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
    visualType: "abstract",
    particleCount: 10,
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
    assets: null,
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
    visualType: "abstract",
    particleCount: 10,
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
    assets: null,
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
    visualType: "abstract",
    particleCount: 8,
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
    assets: null,
  },
};

export function getFestivalTheme(festivalId) {
  return (
    FESTIVAL_THEMES[festivalId] || FESTIVAL_THEMES[FESTIVAL_IDS.DEFAULT]
  );
}

/**
 * Merge CMS theme payload over local defaults (keeps local assets when URLs absent).
 */
export function mergeFestivalFromApi(payload) {
  const activeId = payload?.activeId || getLiveFestivalId();
  const remote = payload?.theme;
  const base = getFestivalTheme(activeId);

  if (!remote) {
    setLiveFestivalId(activeId);
    return { ...base, id: activeId };
  }

  setLiveFestivalId(remote.id || activeId);

  return {
    ...base,
    ...remote,
    id: remote.id || activeId,
    palette: {
      ...base.palette,
      ...(remote.palette || {}),
      accent: remote.palette?.accent || base.palette.accent,
      accentText: remote.palette?.accentText || base.palette.accentText,
    },
    decorations: remote.decorations || base.decorations,
    // Keep bundled assets unless remote supplies usable URIs
    assets: base.assets,
    particleCount: remote.particleCount ?? base.particleCount,
    visualType: remote.visualType || base.visualType,
  };
}
