/**
 * Typed Blinkit-style home feed sections.
 * Consumed by GET /api/home as `sections` (+ legacy `featuredRows`).
 */
import {
  categories,
  getAllProducts,
  getProductsByCategoryId,
} from "./catalog.js";
import { getBanners } from "./cmsStore.js";

function pickHero(source, patterns, limit = 12) {
  const out = [];
  const used = new Set();
  for (const pattern of patterns) {
    const hit = source.find((p) => !used.has(p.id) && pattern.test(p.name));
    if (hit) {
      used.add(hit.id);
      out.push(hit);
    }
    if (out.length >= limit) break;
  }
  for (const p of source) {
    if (out.length >= limit) break;
    if (used.has(p.id)) continue;
    used.add(p.id);
    out.push(p);
  }
  return out;
}

function withCategory(products, categoryId) {
  return products.map((p) => ({ ...p, categoryId: p.categoryId || categoryId }));
}

function dealsFrom(products, limit = 12) {
  return products
    .filter((p) => Number(p.mrp) > Number(p.price))
    .sort((a, b) => b.mrp - b.price - (a.mrp - a.price))
    .slice(0, limit);
}

function catTile(id) {
  const c = categories.find((x) => x.id === id);
  if (!c) return null;
  return {
    id: c.id,
    name: String(c.name).replace(/\n/g, " "),
    icon: c.icon,
    bg: c.bg,
    color: c.color,
    image: c.image || null,
  };
}

function tiles(ids) {
  return ids.map(catTile).filter(Boolean);
}

/** Lifestyle hubs — filter/reorder feed on the client; also returned for chip UI. */
export const lifestyleHubs = [
  { id: "all", label: "All", icon: "LayoutGrid" },
  { id: "electronics", label: "Electronics", icon: "Lightbulb", categoryIds: ["c14", "c15"] },
  { id: "beauty", label: "Beauty", icon: "Sparkles", categoryIds: ["c9"] },
  { id: "gifting", label: "Gifting", icon: "Gift", categoryIds: ["c16", "c13"] },
  { id: "decor", label: "Decor", icon: "SprayCan", categoryIds: ["c10", "c15"] },
  { id: "kids", label: "Kids", icon: "Baby", categoryIds: ["c11"] },
  { id: "imported", label: "Imported", icon: "Globe", keywords: ["organic", "imported", "premium", "extra virgin"] },
];

function matchesHub(product, hubId) {
  if (!hubId || hubId === "all") return true;
  const hub = lifestyleHubs.find((h) => h.id === hubId);
  if (!hub) return true;
  if (hub.categoryIds?.includes(product.categoryId)) return true;
  if (hub.keywords?.length) {
    const hay = `${product.name} ${product.brand || ""}`.toLowerCase();
    return hub.keywords.some((k) => hay.includes(k.toLowerCase()));
  }
  return false;
}

function filterProducts(products, hubId) {
  if (!hubId || hubId === "all") return products;
  const filtered = products.filter((p) => matchesHub(p, hubId));
  return filtered.length >= 4 ? filtered : products;
}

/**
 * Full section list. Client paginates for infinite scroll.
 * @param {{ hub?: string }} opts
 */
export function buildHomeSections({ hub = "all" } = {}) {
  const snacks = getProductsByCategoryId("c8");
  const drinks = getProductsByCategoryId("c7");
  const dairy = getProductsByCategoryId("c2");
  const veg = getProductsByCategoryId("c1");
  const personal = getProductsByCategoryId("c9");
  const bakery = getProductsByCategoryId("c5");
  const all = getAllProducts();
  const festivalBanners = getBanners();

  const moving = pickHero(
    snacks,
    [/lay'?s/i, /doritos/i, /kurkure/i, /pringles/i, /bingo/i, /haldiram/i],
    16
  );

  const frequently = [
    ...withCategory(dairy.slice(0, 4), "c2"),
    ...withCategory(snacks.slice(0, 4), "c8"),
    ...withCategory(drinks.slice(0, 4), "c7"),
  ];

  const featuredWeek = pickHero(
    all,
    [/amul/i, /lay'?s/i, /coca|coke/i, /fortune/i, /dove/i, /maggi/i],
    12
  );

  const topPicks = [
    ...withCategory(veg.slice(0, 4), "c1"),
    ...withCategory(bakery.slice(0, 4), "c5"),
    ...withCategory(personal.slice(0, 4), "c9"),
  ];

  const lifestyleNew = [
    ...withCategory(getProductsByCategoryId("c13").slice(0, 4), "c13"),
    ...withCategory(getProductsByCategoryId("c16").slice(0, 4), "c16"),
    ...withCategory(getProductsByCategoryId("c15").slice(0, 4), "c15"),
  ];

  const dealProducts = dealsFrom(all, 12);

  const breakfast = pickHero(
    [...dairy, ...bakery, ...getProductsByCategoryId("c3")],
    [/milk|bread|egg|oats|butter|jam|cornflake|atta/i],
    10
  );

  const heatwave = pickHero(
    drinks,
    [/water|juice|cola|sprite|frooti|sting|red\s*bull|ice|nimbu/i],
    10
  );

  const cleaning = getProductsByCategoryId("c10");

  const hosting = pickHero(
    [...snacks, ...drinks, ...getProductsByCategoryId("c16")],
    [/chips|namkeen|cola|juice|coin|festive|mixture/i],
    10
  );

  const moreRails = [
    {
      id: "rail-namkeen",
      title: "Namkeen favourites",
      products: pickHero(snacks, [/haldiram/i, /bikaji/i, /bhujia|mixture|sev/i], 10),
    },
    {
      id: "rail-energy",
      title: "Energy & protein drinks",
      products: pickHero(drinks, [/red\s*bull|monster|sting|protein|muscle/i], 10),
    },
    {
      id: "rail-dairy",
      title: "Dairy, Bread & Eggs",
      products: dairy.slice(0, 12),
    },
    {
      id: "rail-masala",
      title: "Masala & Oil",
      products: getProductsByCategoryId("c4").slice(0, 12),
    },
    {
      id: "rail-veg",
      title: "Fresh Vegetables & Fruits",
      products: veg,
    },
    {
      id: "rail-home",
      title: "Home & Cleaning",
      products: cleaning.slice(0, 12),
    },
    {
      id: "rail-stationery",
      title: "Stationery essentials",
      products: getProductsByCategoryId("c13").slice(0, 10),
    },
    {
      id: "rail-baby",
      title: "Baby care picks",
      products: getProductsByCategoryId("c11").slice(0, 10),
    },
    {
      id: "rail-pet",
      title: "Pet favourites",
      products: getProductsByCategoryId("c12").slice(0, 10),
    },
    {
      id: "rail-meat",
      title: "Chicken, Meat & Fish",
      products: getProductsByCategoryId("c6").slice(0, 10),
    },
  ];

  const sections = [
    {
      type: "hero_banner",
      id: "sec-hero",
      banners: festivalBanners,
    },
    {
      type: "product_rail",
      id: "sec-moving",
      title: "Moving fast today",
      subtitle: "Grab before they’re gone",
      autoScroll: true,
      products: filterProducts(withCategory(moving, "c8"), hub),
    },
    {
      type: "product_rail",
      id: "sec-freq",
      title: "Frequently bought",
      subtitle: "Household staples people reorder",
      products: filterProducts(frequently, hub),
    },
    {
      type: "product_rail",
      id: "sec-featured",
      title: "Featured this week",
      subtitle: "Editor’s picks",
      products: filterProducts(featuredWeek, hub),
    },
    {
      type: "product_rail",
      id: "sec-top-picks",
      title: "Top picks of the day",
      subtitle: "What everyone’s adding",
      products: filterProducts(topPicks, hub),
    },
    {
      type: "category_block",
      id: "sec-grocery",
      title: "Grocery & Kitchen",
      subtitle: "Everyday cooking essentials",
      tiles: tiles(["c1", "c2", "c3", "c4", "c5", "c6", "c8", "c7"]),
    },
    {
      type: "category_block",
      id: "sec-snacks-drinks",
      title: "Snacks & Drinks",
      subtitle: "Crunch & chill",
      tiles: tiles(["c8", "c7", "c5", "c16"]),
    },
    {
      type: "category_block",
      id: "sec-beauty",
      title: "Beauty & Personal Care",
      subtitle: "Look & feel fresh",
      tiles: tiles(["c9", "c11"]),
    },
    {
      type: "category_block",
      id: "sec-household",
      title: "Household essentials",
      subtitle: "Home, power & printables",
      tiles: tiles(["c10", "c13", "c14", "c15", "c12", "c16"]),
    },
    {
      type: "product_rail",
      id: "sec-lifestyle",
      title: "Pick of lifestyle",
      subtitle: "Newly added & trending",
      products: filterProducts(lifestyleNew, hub),
    },
    {
      type: "deals_grid",
      id: "sec-deals",
      title: "Deals worth grabbing",
      subtitle: "Save more on bestsellers",
      products: filterProducts(dealProducts, hub),
    },
    {
      type: "essentials",
      id: "sec-breakfast",
      title: "Breakfast essentials",
      subtitle: "Start strong",
      theme: "breakfast",
      products: filterProducts(breakfast, hub),
    },
    {
      type: "essentials",
      id: "sec-heatwave",
      title: "Heatwave essentials",
      subtitle: "Stay cool",
      theme: "heatwave",
      products: filterProducts(heatwave, hub),
    },
    {
      type: "essentials",
      id: "sec-hosting",
      title: "Hosting essentials",
      subtitle: "Guests sorted",
      theme: "hosting",
      products: filterProducts(hosting, hub),
    },
    ...moreRails.map((rail) => ({
      type: "product_rail",
      id: rail.id,
      title: rail.title,
      products: filterProducts(
        rail.products.map((p) => ({ ...p, categoryId: p.categoryId })),
        hub
      ),
    })),
  ];

  return sections.filter((sec) => {
    if (sec.products) return sec.products.length > 0;
    if (sec.tiles) return sec.tiles.length > 0;
    if (sec.banners) return sec.banners.length > 0;
    return true;
  });
}

/** Legacy shape for older screens (Order Again). */
export function buildFeaturedRowsFromSections(sections) {
  return sections
    .filter((s) => s.type === "product_rail" || s.type === "essentials")
    .map((s) => ({
      id: s.id,
      title: s.title,
      products: s.products || [],
    }));
}
