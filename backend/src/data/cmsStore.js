/**
 * CMS documents + banners — Postgres-backed.
 */
import { query } from "../db/pool.js";

async function getDocument(key, fallback) {
  const res = await query(
    "SELECT payload FROM app_documents WHERE key = $1",
    [key]
  );
  if (!res.rows[0]) return structuredClone(fallback);
  return res.rows[0].payload;
}

async function saveDocument(key, payload) {
  await query(
    `INSERT INTO app_documents (key, payload, updated_at)
     VALUES ($1, $2::jsonb, NOW())
     ON CONFLICT (key) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()`,
    [key, JSON.stringify(payload)]
  );
  return payload;
}

/* ——— Festivals ——— */

const FESTIVALS_FALLBACK = {
  activeId: "default",
  themes: {},
};

export async function getFestivalsStore() {
  return getDocument("festivals", FESTIVALS_FALLBACK);
}

export async function saveFestivalsStore(store) {
  return saveDocument("festivals", store);
}

export async function getActiveFestival() {
  const store = await getFestivalsStore();
  const activeId = store.activeId || "default";
  const theme =
    store.themes?.[activeId] || store.themes?.default || null;
  return { activeId, theme };
}

export async function setActiveFestivalId(id) {
  const store = await getFestivalsStore();
  const nextId = String(id || "").trim() || "default";
  if (nextId !== "default" && !store.themes?.[nextId]) {
    const err = new Error("Festival theme not found");
    err.status = 404;
    throw err;
  }
  store.activeId = nextId;
  await saveFestivalsStore(store);
  return { activeId: nextId };
}

export async function upsertFestivalTheme(id, patch) {
  const store = await getFestivalsStore();
  const key = String(id || "").trim();
  if (!key) {
    const err = new Error("Festival id required");
    err.status = 400;
    throw err;
  }
  store.themes = store.themes || {};
  store.themes[key] = {
    ...(store.themes[key] || { id: key }),
    ...patch,
    id: key,
  };
  await saveFestivalsStore(store);
  return store.themes[key];
}

/* ——— Banners ——— */

function rowToBanner(row) {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle || "",
    cta: row.cta || "Shop now",
    image: row.image || "",
    accent: row.accent || "#F8CB46",
    hub: row.hub || "all",
  };
}

export async function getBanners() {
  const res = await query(
    "SELECT * FROM banners ORDER BY sort_order ASC, id ASC"
  );
  return res.rows.map(rowToBanner);
}

export async function getBannerById(id) {
  const res = await query("SELECT * FROM banners WHERE id = $1", [id]);
  return res.rows[0] ? rowToBanner(res.rows[0]) : null;
}

export async function createBanner(input) {
  const id =
    input.id ||
    `fest-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
  const existing = await getBannerById(id);
  if (existing) {
    const err = new Error("Banner id already exists");
    err.status = 409;
    throw err;
  }
  const count = (
    await query("SELECT COUNT(*)::int AS n FROM banners")
  ).rows[0].n;
  const banner = {
    id,
    title: String(input.title || "New banner").trim(),
    subtitle: String(input.subtitle || "").trim(),
    cta: String(input.cta || "Shop now").trim(),
    image: String(input.image || "").trim(),
    accent: String(input.accent || "#F8CB46").trim(),
    hub: String(input.hub || "all").trim(),
  };
  await query(
    `INSERT INTO banners (id, title, subtitle, cta, image, accent, hub, sort_order, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())`,
    [
      banner.id,
      banner.title,
      banner.subtitle,
      banner.cta,
      banner.image,
      banner.accent,
      banner.hub,
      count,
    ]
  );
  return banner;
}

export async function updateBanner(id, patch) {
  const existing = await getBannerById(id);
  if (!existing) {
    const err = new Error("Banner not found");
    err.status = 404;
    throw err;
  }
  const next = { ...existing, ...patch, id };
  await query(
    `UPDATE banners SET title=$2, subtitle=$3, cta=$4, image=$5, accent=$6, hub=$7, updated_at=NOW()
     WHERE id=$1`,
    [
      id,
      next.title,
      next.subtitle,
      next.cta,
      next.image,
      next.accent,
      next.hub,
    ]
  );
  return next;
}

export async function deleteBanner(id) {
  const res = await query("DELETE FROM banners WHERE id = $1 RETURNING id", [
    id,
  ]);
  if (!res.rowCount) {
    const err = new Error("Banner not found");
    err.status = 404;
    throw err;
  }
  return { id };
}

/* ——— Product overrides ——— */

const OVERRIDES_FALLBACK = { created: [], updated: {}, deleted: [] };

export async function getProductOverrides() {
  return getDocument("product_overrides", OVERRIDES_FALLBACK);
}

export async function saveProductOverrides(data) {
  return saveDocument("product_overrides", {
    created: data.created || [],
    updated: data.updated || {},
    deleted: data.deleted || [],
  });
}
