/**
 * JSON file store helpers — festivals, banners, product overrides.
 * Survives backend restarts (same pattern as orders.store.json).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_DIR = path.join(__dirname, "store");

function ensureDir() {
  if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });
}

function storePath(name) {
  return path.join(STORE_DIR, name);
}

export function readJson(name, fallback) {
  ensureDir();
  const file = storePath(name);
  try {
    if (!fs.existsSync(file)) {
      writeJson(name, fallback);
      return structuredClone(fallback);
    }
    const raw = fs.readFileSync(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return structuredClone(fallback);
  }
}

export function writeJson(name, data) {
  ensureDir();
  const file = storePath(name);
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2), "utf8");
  fs.renameSync(tmp, file);
}

/* ——— Festivals ——— */

const FESTIVALS_FALLBACK = {
  activeId: "default",
  themes: {},
};

export function getFestivalsStore() {
  return readJson("festivals.json", FESTIVALS_FALLBACK);
}

export function saveFestivalsStore(data) {
  writeJson("festivals.json", data);
  return data;
}

export function getActiveFestival() {
  const store = getFestivalsStore();
  const id = store.activeId || "default";
  const theme = store.themes?.[id] || store.themes?.default || null;
  return { activeId: id, theme };
}

export function setActiveFestivalId(id) {
  const store = getFestivalsStore();
  if (!store.themes?.[id]) {
    const err = new Error(`Unknown festival: ${id}`);
    err.status = 400;
    throw err;
  }
  store.activeId = id;
  saveFestivalsStore(store);
  return getActiveFestival();
}

export function upsertFestivalTheme(id, patch) {
  const store = getFestivalsStore();
  const prev = store.themes?.[id] || { id };
  store.themes = store.themes || {};
  store.themes[id] = {
    ...prev,
    ...patch,
    id,
    palette: { ...(prev.palette || {}), ...(patch.palette || {}) },
  };
  saveFestivalsStore(store);
  return store.themes[id];
}

/* ——— Banners ——— */

const BANNERS_FALLBACK = { banners: [] };

export function getBanners() {
  const store = readJson("banners.json", BANNERS_FALLBACK);
  return Array.isArray(store.banners) ? store.banners : [];
}

export function saveBanners(banners) {
  writeJson("banners.json", { banners });
  return banners;
}

export function getBannerById(id) {
  return getBanners().find((b) => b.id === id) || null;
}

export function createBanner(input) {
  const banners = getBanners();
  const id =
    input.id ||
    `fest-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  if (banners.some((b) => b.id === id)) {
    const err = new Error("Banner id already exists");
    err.status = 409;
    throw err;
  }
  const banner = {
    id,
    title: String(input.title || "New banner").trim(),
    subtitle: String(input.subtitle || "").trim(),
    cta: String(input.cta || "Shop now").trim(),
    image: String(input.image || "").trim(),
    accent: String(input.accent || "#F8CB46").trim(),
    hub: String(input.hub || "all").trim(),
  };
  banners.push(banner);
  saveBanners(banners);
  return banner;
}

export function updateBanner(id, patch) {
  const banners = getBanners();
  const idx = banners.findIndex((b) => b.id === id);
  if (idx < 0) {
    const err = new Error("Banner not found");
    err.status = 404;
    throw err;
  }
  banners[idx] = { ...banners[idx], ...patch, id };
  saveBanners(banners);
  return banners[idx];
}

export function deleteBanner(id) {
  const banners = getBanners();
  const next = banners.filter((b) => b.id !== id);
  if (next.length === banners.length) {
    const err = new Error("Banner not found");
    err.status = 404;
    throw err;
  }
  saveBanners(next);
  return { id };
}

/* ——— Product overrides ——— */

const OVERRIDES_FALLBACK = { created: [], updated: {}, deleted: [] };

export function getProductOverrides() {
  return readJson("products-overrides.json", OVERRIDES_FALLBACK);
}

export function saveProductOverrides(data) {
  writeJson("products-overrides.json", {
    created: data.created || [],
    updated: data.updated || {},
    deleted: data.deleted || [],
  });
  return getProductOverrides();
}
