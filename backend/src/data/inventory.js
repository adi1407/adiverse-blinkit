/**
 * Inventory ops layer — separate from catalog merchandising.
 *
 * Model (v1 / dark-store lite):
 * - Untracked SKU  → treated as in stock (unlimited) until ops enables tracking
 * - Tracked SKU    → onHand qty; lowStockAt threshold; status = ok | low | out
 * - Checkout       → refuses OOS / oversell; decrements onHand
 * - Cancel         → restocks qty (confirmed cancellations)
 *
 * Later (not in this file yet): multi-store bins, reservations, WMS sync.
 */
import { readJson, writeJson } from "./cmsStore.js";

const FILE = "inventory.json";
const FALLBACK = { items: {}, updatedAt: null };

function load() {
  const data = readJson(FILE, FALLBACK);
  if (!data.items || typeof data.items !== "object") {
    return { items: {}, updatedAt: null };
  }
  return data;
}

function save(store) {
  store.updatedAt = new Date().toISOString();
  writeJson(FILE, store);
  return store;
}

function normalizeRecord(raw = {}) {
  const onHand = Math.max(0, Math.floor(Number(raw.onHand) || 0));
  const lowStockAt = Math.max(0, Math.floor(Number(raw.lowStockAt) || 5));
  return {
    tracked: raw.tracked !== false,
    onHand,
    lowStockAt,
    updatedAt: raw.updatedAt || new Date().toISOString(),
  };
}

export function stockStatusFor(record) {
  if (!record || record.tracked === false) return "untracked";
  if (record.onHand <= 0) return "out";
  if (record.onHand <= record.lowStockAt) return "low";
  return "ok";
}

export function applyInventoryToProduct(product) {
  if (!product?.id) return product;
  const store = load();
  const raw = store.items[product.id];
  if (!raw || raw.tracked === false) {
    return {
      ...product,
      stockTracked: false,
      stockQty: null,
      stockStatus: "untracked",
      inStock: product.inStock !== false,
    };
  }
  const record = normalizeRecord(raw);
  const status = stockStatusFor(record);
  return {
    ...product,
    stockTracked: true,
    stockQty: record.onHand,
    lowStockAt: record.lowStockAt,
    stockStatus: status,
    inStock: status !== "out",
    outOfStock: status === "out",
  };
}

export function applyInventoryToList(list) {
  return (list || []).map(applyInventoryToProduct);
}

export function getInventoryRecord(productId) {
  const store = load();
  const raw = store.items[productId];
  if (!raw) return null;
  const record = normalizeRecord(raw);
  return {
    productId,
    ...record,
    status: stockStatusFor(record),
  };
}

export function listInventoryMap() {
  const store = load();
  const map = {};
  for (const [productId, raw] of Object.entries(store.items || {})) {
    const record = normalizeRecord(raw);
    map[productId] = {
      productId,
      ...record,
      status: stockStatusFor(record),
    };
  }
  return map;
}

/** Set absolute stock and enable tracking. */
export function setInventory(productId, { onHand, lowStockAt, tracked = true } = {}) {
  const id = String(productId || "").trim();
  if (!id) {
    const err = new Error("productId required");
    err.status = 400;
    throw err;
  }

  const store = load();
  const prev = store.items[id] ? normalizeRecord(store.items[id]) : null;
  const next = normalizeRecord({
    tracked,
    onHand: onHand != null ? onHand : prev?.onHand ?? 0,
    lowStockAt: lowStockAt != null ? lowStockAt : prev?.lowStockAt ?? 5,
    updatedAt: new Date().toISOString(),
  });

  if (tracked === false) {
    delete store.items[id];
  } else {
    store.items[id] = next;
  }
  save(store);
  return getInventoryRecord(id) || {
    productId: id,
    tracked: false,
    onHand: null,
    lowStockAt: null,
    status: "untracked",
  };
}

/** Relative adjust: delta can be +/−. Enables tracking if missing. */
export function adjustInventory(productId, delta, { lowStockAt } = {}) {
  const id = String(productId || "").trim();
  const change = Math.trunc(Number(delta));
  if (!id || !Number.isFinite(change) || change === 0) {
    const err = new Error("productId and non-zero delta required");
    err.status = 400;
    throw err;
  }

  const store = load();
  const prev = store.items[id]
    ? normalizeRecord(store.items[id])
    : normalizeRecord({ tracked: true, onHand: 0, lowStockAt: 5 });

  const next = normalizeRecord({
    ...prev,
    onHand: Math.max(0, prev.onHand + change),
    lowStockAt: lowStockAt != null ? lowStockAt : prev.lowStockAt,
    updatedAt: new Date().toISOString(),
  });
  store.items[id] = next;
  save(store);
  return getInventoryRecord(id);
}

/**
 * Checkout guard + decrement.
 * Only tracked SKUs are enforced; untracked pass through.
 */
export function consumeStockForOrder(items) {
  const store = load();
  const lines = Array.isArray(items) ? items : [];

  for (const line of lines) {
    const id = line.id;
    const qty = Math.max(1, Number(line.qty) || 1);
    const raw = store.items[id];
    if (!raw || raw.tracked === false) continue;
    const record = normalizeRecord(raw);
    if (record.onHand < qty) {
      const err = new Error(
        record.onHand <= 0
          ? `${line.name || "Item"} is out of stock`
          : `Only ${record.onHand} left for ${line.name || "item"}`
      );
      err.status = 409;
      throw err;
    }
  }

  let changed = false;
  for (const line of lines) {
    const id = line.id;
    const qty = Math.max(1, Number(line.qty) || 1);
    const raw = store.items[id];
    if (!raw || raw.tracked === false) continue;
    const record = normalizeRecord(raw);
    store.items[id] = normalizeRecord({
      ...record,
      onHand: Math.max(0, record.onHand - qty),
      updatedAt: new Date().toISOString(),
    });
    changed = true;
  }
  if (changed) save(store);
}

export function restockForOrder(items) {
  const store = load();
  const lines = Array.isArray(items) ? items : [];
  let changed = false;
  for (const line of lines) {
    const id = line.id;
    const qty = Math.max(1, Number(line.qty) || 1);
    const raw = store.items[id];
    if (!raw || raw.tracked === false) continue;
    const record = normalizeRecord(raw);
    store.items[id] = normalizeRecord({
      ...record,
      onHand: record.onHand + qty,
      updatedAt: new Date().toISOString(),
    });
    changed = true;
  }
  if (changed) save(store);
}

export function inventoryStats(productIds = []) {
  const map = listInventoryMap();
  let tracked = 0;
  let out = 0;
  let low = 0;
  let ok = 0;
  for (const id of productIds) {
    const row = map[id];
    if (!row || !row.tracked) continue;
    tracked += 1;
    if (row.status === "out") out += 1;
    else if (row.status === "low") low += 1;
    else ok += 1;
  }
  return {
    tracked,
    out,
    low,
    ok,
    untracked: Math.max(0, productIds.length - tracked),
  };
}
