/**
 * Subtle festival accents for category tiles (not full decorations).
 * Driven by the same ACTIVE_HERO_FESTIVAL used by the hero.
 */
import {
  ACTIVE_HERO_FESTIVAL,
  FESTIVAL_IDS,
} from "./hero/festivalThemes";

const ACCENTS = {
  [FESTIVAL_IDS.JANMASHTAMI]: {
    categoryIds: ["c16", "c5", "c8"],
    label: "Festive",
  },
  [FESTIVAL_IDS.DIWALI]: {
    categoryIds: ["c16", "c10", "c5"],
    label: "Diwali",
  },
  [FESTIVAL_IDS.HOLI]: {
    categoryIds: ["c7", "c8"],
    label: "Holi",
  },
  [FESTIVAL_IDS.CHRISTMAS]: {
    categoryIds: ["c5", "c16"],
    label: "Holiday",
  },
  [FESTIVAL_IDS.DEFAULT]: {
    categoryIds: [],
    label: "",
  },
};

export function getCategoryFestivalAccent(categoryId, festivalId = ACTIVE_HERO_FESTIVAL) {
  const cfg = ACCENTS[festivalId] || ACCENTS[FESTIVAL_IDS.DEFAULT];
  const active = cfg.categoryIds.includes(categoryId);
  return {
    active,
    label: active ? cfg.label : "",
  };
}
