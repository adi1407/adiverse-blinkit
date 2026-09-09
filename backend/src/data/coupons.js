/**
 * Promo coupons — JSON store under data/store/coupons.json.
 * evaluateCoupon is the checkout source of truth; shopper UI previews the same rules.
 */

import { readJson, writeJson } from "./cmsStore.js";

const COUPON_TYPES = new Set(["flat", "percent", "free_delivery"]);
const FALLBACK = { coupons: [] };

function normalizeCode(code) {
  return String(code || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "");
}

function loadStore() {
  const store = readJson("coupons.json", FALLBACK);
  return Array.isArray(store.coupons) ? store.coupons : [];
}

function saveStore(coupons) {
  writeJson("coupons.json", { coupons });
  return coupons;
}

function normalizeCoupon(input, { requireCode = true } = {}) {
  const code = normalizeCode(input.code);
  if (requireCode && (code.length < 3 || code.length > 24)) {
    const err = new Error("Coupon code must be 3–24 letters/numbers");
    err.status = 400;
    throw err;
  }

  const type = String(input.type || "").trim();
  if (!COUPON_TYPES.has(type)) {
    const err = new Error("type must be flat, percent, or free_delivery");
    err.status = 400;
    throw err;
  }

  const title = String(input.title || "").trim() || code;
  const description = String(input.description || "").trim();
  const minOrder = Math.max(0, Math.round(Number(input.minOrder) || 0));
  const active = input.active !== false;

  const coupon = { code, title, description, type, minOrder, active };

  if (type === "flat") {
    const value = Math.max(1, Math.round(Number(input.value) || 0));
    if (!value) {
      const err = new Error("flat coupons need a value ≥ 1");
      err.status = 400;
      throw err;
    }
    coupon.value = value;
  } else if (type === "percent") {
    const value = Math.max(1, Math.min(100, Math.round(Number(input.value) || 0)));
    if (!value) {
      const err = new Error("percent coupons need value 1–100");
      err.status = 400;
      throw err;
    }
    coupon.value = value;
    coupon.maxDiscount = Math.max(
      1,
      Math.round(Number(input.maxDiscount) || value)
    );
  }

  return coupon;
}

/** All coupons (admin), including inactive. */
export function listCoupons() {
  return loadStore().map((c) => ({ ...c }));
}

/** Active coupons only (shopper chips + checkout). */
export function listActiveCoupons() {
  return loadStore().filter((c) => c.active !== false);
}

export function getCouponByCode(code, { includeInactive = false } = {}) {
  const key = normalizeCode(code);
  const coupon = loadStore().find((c) => c.code === key) || null;
  if (!coupon) return null;
  if (!includeInactive && coupon.active === false) return null;
  return { ...coupon };
}

export function createCoupon(input) {
  const coupons = loadStore();
  const coupon = normalizeCoupon(input);
  if (coupons.some((c) => c.code === coupon.code)) {
    const err = new Error(`Coupon ${coupon.code} already exists`);
    err.status = 409;
    throw err;
  }
  coupons.push(coupon);
  saveStore(coupons);
  return coupon;
}

export function updateCoupon(code, patch) {
  const key = normalizeCode(code);
  const coupons = loadStore();
  const idx = coupons.findIndex((c) => c.code === key);
  if (idx < 0) {
    const err = new Error("Coupon not found");
    err.status = 404;
    throw err;
  }

  const merged = {
    ...coupons[idx],
    ...patch,
    code: key, // code is identity — do not rename via patch
  };
  const next = normalizeCoupon(merged);
  coupons[idx] = next;
  saveStore(coupons);
  return next;
}

export function deleteCoupon(code) {
  const key = normalizeCode(code);
  const coupons = loadStore();
  const next = coupons.filter((c) => c.code !== key);
  if (next.length === coupons.length) {
    const err = new Error("Coupon not found");
    err.status = 404;
    throw err;
  }
  saveStore(next);
  return { code: key };
}

/**
 * @returns {{
 *   ok: boolean,
 *   coupon: object | null,
 *   discount: number,
 *   deliveryFee: number,
 *   message?: string
 * }}
 */
export function evaluateCoupon(code, itemTotal, baseDeliveryFee) {
  const coupon = getCouponByCode(code);
  if (!coupon) {
    return {
      ok: false,
      coupon: null,
      discount: 0,
      deliveryFee: baseDeliveryFee,
      message: "Invalid coupon code",
    };
  }

  if (itemTotal < coupon.minOrder) {
    return {
      ok: false,
      coupon,
      discount: 0,
      deliveryFee: baseDeliveryFee,
      message: `Add ₹${coupon.minOrder - itemTotal} more to use ${coupon.code}`,
    };
  }

  let discount = 0;
  let deliveryFee = baseDeliveryFee;

  if (coupon.type === "flat") {
    discount = Math.min(coupon.value, itemTotal);
  } else if (coupon.type === "percent") {
    const raw = Math.round((itemTotal * coupon.value) / 100);
    discount = Math.min(raw, coupon.maxDiscount || raw, itemTotal);
  } else if (coupon.type === "free_delivery") {
    discount = baseDeliveryFee;
    deliveryFee = 0;
  }

  return {
    ok: true,
    coupon,
    discount,
    deliveryFee,
    message: undefined,
  };
}
