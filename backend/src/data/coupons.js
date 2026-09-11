/**
 * Promo coupons — Postgres-backed.
 */

import { query } from "../db/pool.js";

const COUPON_TYPES = new Set(["flat", "percent", "free_delivery"]);

function normalizeCode(code) {
  return String(code || "")
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9_-]/g, "");
}

function rowToCoupon(row) {
  if (!row) return null;
  const coupon = {
    code: row.code,
    title: row.title,
    description: row.description || "",
    type: row.type,
    minOrder: Number(row.min_order) || 0,
    active: row.active !== false,
  };
  if (row.value != null) coupon.value = Number(row.value);
  if (row.max_discount != null) coupon.maxDiscount = Number(row.max_discount);
  return coupon;
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

export async function listCoupons() {
  const res = await query(
    "SELECT * FROM coupons ORDER BY code ASC"
  );
  return res.rows.map(rowToCoupon);
}

export async function listActiveCoupons() {
  const res = await query(
    "SELECT * FROM coupons WHERE active = TRUE ORDER BY code ASC"
  );
  return res.rows.map(rowToCoupon);
}

export async function getCouponByCode(code, { includeInactive = false } = {}) {
  const key = normalizeCode(code);
  const res = await query("SELECT * FROM coupons WHERE code = $1", [key]);
  const coupon = rowToCoupon(res.rows[0]);
  if (!coupon) return null;
  if (!includeInactive && coupon.active === false) return null;
  return coupon;
}

export async function createCoupon(input) {
  const coupon = normalizeCoupon(input);
  try {
    await query(
      `INSERT INTO coupons (code, title, description, type, value, max_discount, min_order, active, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,NOW())`,
      [
        coupon.code,
        coupon.title,
        coupon.description,
        coupon.type,
        coupon.value ?? null,
        coupon.maxDiscount ?? null,
        coupon.minOrder,
        coupon.active,
      ]
    );
  } catch (err) {
    if (err.code === "23505") {
      const e = new Error(`Coupon ${coupon.code} already exists`);
      e.status = 409;
      throw e;
    }
    throw err;
  }
  return coupon;
}

export async function updateCoupon(code, patch) {
  const key = normalizeCode(code);
  const existing = await getCouponByCode(key, { includeInactive: true });
  if (!existing) {
    const err = new Error("Coupon not found");
    err.status = 404;
    throw err;
  }
  const next = normalizeCoupon({ ...existing, ...patch, code: key });
  await query(
    `UPDATE coupons
     SET title=$2, description=$3, type=$4, value=$5, max_discount=$6,
         min_order=$7, active=$8, updated_at=NOW()
     WHERE code=$1`,
    [
      next.code,
      next.title,
      next.description,
      next.type,
      next.value ?? null,
      next.maxDiscount ?? null,
      next.minOrder,
      next.active,
    ]
  );
  return next;
}

export async function deleteCoupon(code) {
  const key = normalizeCode(code);
  const res = await query("DELETE FROM coupons WHERE code = $1 RETURNING code", [
    key,
  ]);
  if (!res.rowCount) {
    const err = new Error("Coupon not found");
    err.status = 404;
    throw err;
  }
  return { code: key };
}

export async function evaluateCoupon(code, itemTotal, baseDeliveryFee) {
  const coupon = await getCouponByCode(code);
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
