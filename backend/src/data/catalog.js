// Curated Blinkit-scale catalog — no Open Food Facts mega dump.
import { normalizeProduct } from "./curated/helpers.js";
import { snackProducts } from "./curated/snacks.js";
import {
  dairyProducts,
  staplesProducts,
  masalaProducts,
} from "./curated/grocery.js";
import { drinkProducts, cleaningProducts } from "./curated/drinksCleaning.js";
import {
  vegProducts,
  meatProducts,
  bakeryProducts,
  personalCareProducts,
  babyProducts,
  petProducts,
} from "./curated/aisles.js";
import {
  stationeryProducts,
  batteryProducts,
  bulbProducts,
  coinProducts,
} from "./curated/specialty.js";
import imageOverrides from "./curated/imageOverrides.json" with { type: "json" };
import { mergeAllProducts, mergeCategoryProducts } from "./productOverrides.js";

export const deliveryInfo = {
  minutes: 8,
  addressLabel: "Home",
  address: "12th Cross, Indiranagar",
};

export const categories = [
  { id: "c1", name: "Vegetables &\nFruits", icon: "Salad", bg: "#E8F5E9", color: "#2E7D32", image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80" },
  { id: "c2", name: "Dairy, Bread\n& Eggs", icon: "Milk", bg: "#FFF3E0", color: "#EF6C00", image: "https://images.unsplash.com/photo-1628088062854-d1870b4553da?auto=format&fit=crop&w=400&q=80" },
  { id: "c3", name: "Atta, Rice\n& Dal", icon: "Wheat", bg: "#FFF8E1", color: "#F9A825", image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=400&q=80" },
  { id: "c4", name: "Masala &\nOil", icon: "Flame", bg: "#FCE4EC", color: "#C2185B", image: "https://images.unsplash.com/photo-1596040033229-a0b3b83f63b2?auto=format&fit=crop&w=400&q=80" },
  { id: "c5", name: "Bakery &\nBiscuits", icon: "Cookie", bg: "#F3E5F5", color: "#7B1FA2", image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?auto=format&fit=crop&w=400&q=80" },
  { id: "c6", name: "Chicken,\nMeat & Fish", icon: "Drumstick", bg: "#FFEBEE", color: "#D32F2F", image: "https://images.unsplash.com/photo-1604503468506-a8da13d82791?auto=format&fit=crop&w=400&q=80" },
  { id: "c7", name: "Cold Drinks\n& Juices", icon: "CupSoda", bg: "#E3F2FD", color: "#1976D2", image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&w=400&q=80" },
  { id: "c8", name: "Snacks &\nMunchies", icon: "Popcorn", bg: "#FFFDE7", color: "#F57F17", image: "https://images.unsplash.com/photo-1621939514649-280e2ee25f60?auto=format&fit=crop&w=400&q=80" },
  { id: "c9", name: "Personal\nCare", icon: "Sparkles", bg: "#E0F7FA", color: "#00838F", image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?auto=format&fit=crop&w=400&q=80" },
  { id: "c10", name: "Home &\nCleaning", icon: "SprayCan", bg: "#F1F8E9", color: "#558B2F", image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=400&q=80" },
  { id: "c11", name: "Baby\nCare", icon: "Baby", bg: "#FCE4EC", color: "#AD1457", image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?auto=format&fit=crop&w=400&q=80" },
  { id: "c12", name: "Pet\nCare", icon: "PawPrint", bg: "#FFF3E0", color: "#E65100", image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=400&q=80" },
  { id: "c13", name: "Stationery\n& Pens", icon: "PenLine", bg: "#E8EAF6", color: "#3949AB", image: "https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=400&q=80" },
  { id: "c14", name: "Batteries\n& Cells", icon: "Battery", bg: "#ECEFF1", color: "#455A64", image: "https://images.unsplash.com/photo-1619643082566-b9a2c3f1f0c2?auto=format&fit=crop&w=400&q=80" },
  { id: "c15", name: "Bulbs &\nElectrical", icon: "Lightbulb", bg: "#FFF8E1", color: "#F9A825", image: "https://images.unsplash.com/photo-1565814636199-ae80925dcbd0?auto=format&fit=crop&w=400&q=80" },
  { id: "c16", name: "Coins &\nFestive", icon: "Coins", bg: "#FFF3E0", color: "#EF6C00", image: "https://images.unsplash.com/photo-1604608672516-f1b9b1c37076?auto=format&fit=crop&w=400&q=80" },
];

function list(products) {
  const overrides = imageOverrides?.products || {};
  return products
    .map((raw) => {
      const base = normalizeProduct(raw);
      if (!base) return null;
      const over = overrides[base.id];
      if (over?.images?.length) {
        const images = over.images.filter(Boolean).slice(0, 3);
        return {
          ...base,
          images,
          image: images[0] || base.image,
        };
      }
      return base;
    })
    .filter(Boolean);
}

export const productsByCategory = {
  c1: list(vegProducts),
  c2: list(dairyProducts),
  c3: list(staplesProducts),
  c4: list(masalaProducts),
  c5: list(bakeryProducts),
  c6: list(meatProducts),
  c7: list(drinkProducts),
  c8: list(snackProducts),
  c9: list(personalCareProducts),
  c10: list(cleaningProducts),
  c11: list(babyProducts),
  c12: list(petProducts),
  c13: list(stationeryProducts),
  c14: list(batteryProducts),
  c15: list(bulbProducts),
  c16: list(coinProducts),
};

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

const snacks = productsByCategory.c8;
const drinks = productsByCategory.c7;

export const featuredRows = [
  {
    id: "row-hero-snacks",
    title: "Chips, nachos & munchies",
    products: pickHero(snacks, [/lay'?s/i, /doritos/i, /kurkure/i, /pringles/i, /bingo/i], 14),
  },
  {
    id: "row-namkeen",
    title: "Namkeen favourites",
    products: pickHero(snacks, [/haldiram/i, /bikaji/i, /balaji/i, /bhujia|mixture|sev/i], 10),
  },
  {
    id: "row-energy",
    title: "Energy & protein drinks",
    products: pickHero(drinks, [/red\s*bull|monster|sting|charged|protein|muscle|whey/i], 12),
  },
  { id: "row-dairy", title: "Dairy, Bread & Eggs", products: productsByCategory.c2.slice(0, 12) },
  { id: "row-masala", title: "Masala & Oil", products: productsByCategory.c4.slice(0, 12) },
  { id: "row-veg", title: "Fresh Vegetables & Fruits", products: productsByCategory.c1 },
  { id: "row-drinks", title: "Cold Drinks & Juices", products: drinks.slice(0, 12) },
  { id: "row-home", title: "Home & Cleaning", products: productsByCategory.c10.slice(0, 12) },
  { id: "row-stationery", title: "Stationery essentials", products: productsByCategory.c13.slice(0, 10) },
];

export function getCategoryById(id) {
  return categories.find((cat) => cat.id === id);
}

export function getProductsByCategoryId(id) {
  const base = productsByCategory[id] || [];
  return mergeCategoryProducts(base, id);
}

export function filterCategoryProducts(id, { q = "", sort = "relevance" } = {}) {
  const query = String(q || "")
    .trim()
    .toLowerCase();

  let listItems = [...getProductsByCategoryId(id)];

  if (query) {
    listItems = listItems.filter((product) => {
      const haystack = `${product.name} ${product.brand || ""} ${product.unit}`.toLowerCase();
      return haystack.includes(query);
    });
  }

  if (sort === "price_asc") listItems.sort((a, b) => a.price - b.price);
  else if (sort === "price_desc") listItems.sort((a, b) => b.price - a.price);

  return listItems;
}

function getBaseAllProducts() {
  return Object.entries(productsByCategory).flatMap(([categoryId, products]) =>
    products.map((product) => ({ ...product, categoryId }))
  );
}

export function getAllProducts() {
  return mergeAllProducts(getBaseAllProducts);
}

export function productExistsInBase(id) {
  return getBaseAllProducts().some((p) => p.id === id);
}

export function getProductById(id) {
  return getAllProducts().find((product) => product.id === id) || null;
}

export function getSimilarProducts(id, limit = 12) {
  const product = getProductById(id);
  if (!product) return [];

  const tokens = String(product.name || "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 2);

  const scored = getProductsByCategoryId(product.categoryId)
    .filter((item) => item.id !== id)
    .map((item) => {
      const haystack = `${item.name} ${item.brand || ""} ${item.unit}`.toLowerCase();
      const score = tokens.reduce(
        (sum, token) => sum + (haystack.includes(token) ? 1 : 0),
        0
      );
      return { item, score };
    });

  scored.sort((a, b) => b.score - a.score || a.item.price - b.item.price);
  return scored.slice(0, limit).map(({ item }) => item);
}

export function searchProducts(query) {
  const q = String(query || "")
    .trim()
    .toLowerCase();
  if (!q) return [];

  return getAllProducts()
    .filter((product) => {
      const haystack = `${product.name} ${product.brand || ""} ${product.unit}`.toLowerCase();
      return haystack.includes(q);
    })
    .slice(0, 80);
}

export const catalogStats = {
  get generatedCount() {
    return 0;
  },
  get totalProducts() {
    return getAllProducts().length;
  },
  get snacks() {
    return getProductsByCategoryId("c8").length;
  },
  get drinks() {
    return getProductsByCategoryId("c7").length;
  },
  get masalas() {
    return getProductsByCategoryId("c4").length;
  },
  get categories() {
    return categories.length;
  },
};
