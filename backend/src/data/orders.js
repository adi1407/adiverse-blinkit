// Orders store backed by Postgres (JSONB payload + indexed columns).
// Status auto-advances over time for demo tracking (unless cancelled).

import { query } from "../db/pool.js";
import { evaluateCoupon, getCouponByCode } from "./coupons.js";
import { normalizePaymentMethod, paymentStatusForMethod } from "./payments.js";
import {
  consumeStockForOrder,
  restockForOrder,
} from "./inventory.js";

/** Demo timeline (seconds after place order). Real apps use rider GPS/events. */
export const STATUS_STEPS = [
  { key: "confirmed", afterSec: 0, title: "Order confirmed", hint: "Store got your order" },
  { key: "packing", afterSec: 20, title: "Packing", hint: "Items are being packed" },
  { key: "out_for_delivery", afterSec: 50, title: "Out for delivery", hint: "Partner is on the way" },
  { key: "delivered", afterSec: 90, title: "Delivered", hint: "Enjoy your order" },
];

async function loadAllOrders() {
  const res = await query(
    "SELECT payload FROM orders ORDER BY created_at DESC"
  );
  return res.rows.map((row) => row.payload);
}

async function saveOrder(order) {
  const createdAt = order.createdAt || new Date().toISOString();
  await query(
    `INSERT INTO orders (id, phone, status, payment_status, grand_total, created_at, updated_at, payload)
     VALUES ($1, $2, $3, $4, $5, $6::timestamptz, NOW(), $7::jsonb)
     ON CONFLICT (id) DO UPDATE SET
       phone = EXCLUDED.phone,
       status = EXCLUDED.status,
       payment_status = EXCLUDED.payment_status,
       grand_total = EXCLUDED.grand_total,
       updated_at = NOW(),
       payload = EXCLUDED.payload`,
    [
      order.id,
      order.phone,
      order.status,
      order.paymentStatus ?? null,
      order.grandTotal ?? null,
      createdAt,
      JSON.stringify(order),
    ]
  );
  return order;
}

async function findOrder(id) {
  const res = await query("SELECT payload FROM orders WHERE id = $1", [id]);
  return res.rows[0]?.payload ?? null;
}

function makeId() {
  return `ord_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function statusForAge(ageSec) {
  let current = STATUS_STEPS[0].key;
  for (const step of STATUS_STEPS) {
    if (ageSec >= step.afterSec) current = step.key;
  }
  return current;
}

const PARTNERS = [
  { name: "Rahul S.", phone: "9876501234", vehicle: "Bike", code: "BK-214" },
  { name: "Aisha K.", phone: "9876505678", vehicle: "Scooter", code: "SC-883" },
  { name: "Vikram P.", phone: "9876509012", vehicle: "Bike", code: "BK-551" },
  { name: "Neha M.", phone: "9876503456", vehicle: "Scooter", code: "SC-107" },
];

function partnerForOrder(orderId) {
  const id = String(orderId || "");
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash + id.charCodeAt(i) * (i + 1)) % PARTNERS.length;
  }
  return PARTNERS[hash];
}

function withTimeline(order) {
  const created = new Date(order.createdAt).getTime();
  const ageSec = Math.max(0, Math.floor((Date.now() - created) / 1000));
  const deliverAfter =
    STATUS_STEPS.find((s) => s.key === "delivered")?.afterSec ?? 90;

  if (order.status === "cancelled") {
    return {
      ...order,
      status: "cancelled",
      canCancel: false,
      canRate: false,
      ageSec,
      etaMinutes: null,
      etaSeconds: null,
      deliveryProgress: 0,
      partner: null,
      tracking: null,
      timeline: STATUS_STEPS.map((step) => ({
        ...step,
        done: false,
        active: false,
      })),
    };
  }

  // Admin-locked status skips the demo auto-advance clock.
  const status = order.statusLocked
    ? order.status
    : statusForAge(ageSec);
  const stepIndex = STATUS_STEPS.findIndex((s) => s.key === status);
  const hasRating = Boolean(order.rating?.stars);

  const remainingSec = Math.max(0, deliverAfter - ageSec);
  const etaSeconds =
    status === "delivered" ? 0 : order.statusLocked ? null : remainingSec;
  const etaMinutes =
    etaSeconds == null
      ? null
      : etaSeconds <= 0
        ? 0
        : Math.max(1, Math.ceil(etaSeconds / 60));

  // Map marker: slow crawl until OFD, then ride to home.
  let deliveryProgress = 0;
  if (status === "confirmed") deliveryProgress = 0.08;
  else if (status === "packing") deliveryProgress = 0.22;
  else if (status === "out_for_delivery") {
    const ofdAt =
      STATUS_STEPS.find((s) => s.key === "out_for_delivery")?.afterSec ?? 50;
    const span = Math.max(1, deliverAfter - ofdAt);
    const ride = Math.min(1, Math.max(0, (ageSec - ofdAt) / span));
    deliveryProgress = 0.28 + ride * 0.7;
  } else if (status === "delivered") deliveryProgress = 1;

  const showPartner =
    status === "packing" ||
    status === "out_for_delivery" ||
    status === "delivered";

  return {
    ...order,
    status,
    statusUpdatedAt: order.statusUpdatedAt || order.createdAt,
    canCancel: status === "confirmed" && !order.statusLocked,
    canRate: status === "delivered" && !hasRating,
    timeline: STATUS_STEPS.map((step, index) => ({
      ...step,
      done: index <= stepIndex,
      active: index === stepIndex,
    })),
    ageSec,
    etaMinutes,
    etaSeconds,
    deliveryProgress,
    partner: showPartner ? partnerForOrder(order.id) : null,
    tracking: {
      storeLabel: "blinkit · Indiranagar",
      destinationLabel: order.address?.label || "Home",
      phase: status,
    },
  };
}

async function refreshAllStatuses() {
  const orders = await loadAllOrders();
  for (const order of orders) {
    if (order.status === "cancelled" || order.statusLocked) continue;

    const next = withTimeline(order);
    if (next.status !== order.status) {
      await saveOrder({
        ...order,
        status: next.status,
        statusUpdatedAt: new Date().toISOString(),
      });
    }
  }
}

export async function createOrder({
  name,
  phone,
  items,
  address,
  couponCode,
  paymentMethod,
  tipAmount,
}) {
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  const cleanName = String(name || "").trim() || "Blinkit User";
  const cartItems = Array.isArray(items) ? items : [];
  const payment = normalizePaymentMethod(paymentMethod);
  const tip = Math.max(0, Math.min(500, Math.round(Number(tipAmount) || 0)));

  if (cleanPhone.length !== 10) {
    const err = new Error("Valid 10-digit phone is required");
    err.status = 400;
    throw err;
  }

  if (cartItems.length === 0) {
    const err = new Error("Cart is empty");
    err.status = 400;
    throw err;
  }

  const normalized = cartItems.map((item) => {
    const qty = Math.max(1, Number(item.qty) || 1);
    const price = Number(item.price) || 0;
    return {
      id: item.id,
      name: item.name,
      unit: item.unit,
      price,
      qty,
      image: item.image || "",
      lineTotal: price * qty,
    };
  });

  const itemTotal = normalized.reduce((sum, item) => sum + item.lineTotal, 0);
  const baseDeliveryFee = itemTotal >= 199 ? 0 : 25;

  let deliveryFee = baseDeliveryFee;
  let couponDiscount = 0;
  let coupon = null;

  const requested = String(couponCode || "").trim();
  if (requested) {
    const result = await evaluateCoupon(requested, itemTotal, baseDeliveryFee);
    if (!result.ok) {
      const err = new Error(result.message || "Coupon not applicable");
      err.status = 400;
      throw err;
    }

    const meta = await getCouponByCode(requested);
    coupon = {
      code: meta.code,
      title: meta.title,
      type: meta.type,
    };
    couponDiscount = result.discount;
    deliveryFee = result.deliveryFee;
  }

  const itemOff = coupon?.type === "free_delivery" ? 0 : couponDiscount;
  const grandTotal = Math.max(0, itemTotal - itemOff + deliveryFee + tip);

  // Enforce tracked inventory before persisting the order.
  await consumeStockForOrder(normalized);

  const deliveryAddress = address
    ? {
        label: String(address.label || "Home").trim() || "Home",
        line1: String(address.line1 || "").trim(),
        line2: String(address.line2 || "").trim(),
      }
    : null;

  const now = new Date().toISOString();
  const order = {
    id: makeId(),
    name: cleanName,
    phone: cleanPhone,
    address: deliveryAddress,
    items: normalized,
    itemTotal,
    deliveryFee,
    tipAmount: tip,
    coupon,
    couponDiscount,
    payment,
    paymentStatus: paymentStatusForMethod(payment.id),
    grandTotal,
    status: "confirmed",
    statusUpdatedAt: now,
    createdAt: now,
  };

  await saveOrder(order);
  return withTimeline(order);
}

export async function cancelOrder({ orderId, phone }) {
  await refreshAllStatuses();

  const cleanPhone = String(phone || "").replace(/\D/g, "");
  const existing = await findOrder(orderId);

  if (!existing) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }

  if (existing.phone !== cleanPhone) {
    const err = new Error("Order does not belong to this phone");
    err.status = 403;
    throw err;
  }

  if (existing.status === "cancelled") {
    const err = new Error("Order is already cancelled");
    err.status = 400;
    throw err;
  }

  const live = withTimeline(existing);
  if (!live.canCancel) {
    const err = new Error(
      "Too late to cancel — order is already being packed or out for delivery"
    );
    err.status = 400;
    throw err;
  }

  const now = new Date().toISOString();
  const cancelled = {
    ...existing,
    status: "cancelled",
    statusUpdatedAt: now,
    cancelledAt: now,
  };

  await saveOrder(cancelled);
  await restockForOrder(cancelled.items || []);
  return withTimeline(cancelled);
}

export async function rateOrder({ orderId, phone, stars, review }) {
  await refreshAllStatuses();

  const cleanPhone = String(phone || "").replace(/\D/g, "");
  const existing = await findOrder(orderId);

  if (!existing) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }

  if (existing.phone !== cleanPhone) {
    const err = new Error("Order does not belong to this phone");
    err.status = 403;
    throw err;
  }

  const live = withTimeline(existing);
  if (live.status !== "delivered") {
    const err = new Error("You can rate only after delivery");
    err.status = 400;
    throw err;
  }

  if (existing.rating?.stars) {
    const err = new Error("Order already rated");
    err.status = 400;
    throw err;
  }

  const score = Math.max(1, Math.min(5, Math.round(Number(stars) || 0)));
  if (!score) {
    const err = new Error("Pick a rating from 1 to 5 stars");
    err.status = 400;
    throw err;
  }

  const note = String(review || "")
    .trim()
    .slice(0, 280);

  const rated = {
    ...existing,
    status: "delivered",
    rating: {
      stars: score,
      review: note,
      ratedAt: new Date().toISOString(),
    },
  };

  await saveOrder(rated);
  return withTimeline(rated);
}

export async function getOrdersByPhone(phone) {
  await refreshAllStatuses();
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  const res = await query(
    "SELECT payload FROM orders WHERE phone = $1 ORDER BY created_at DESC",
    [cleanPhone]
  );
  return res.rows.map((row) => withTimeline(row.payload));
}

export async function getOrderById(id) {
  await refreshAllStatuses();
  const order = await findOrder(id);
  return order ? withTimeline(order) : null;
}

const ADMIN_STATUSES = [
  "confirmed",
  "packing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

/** Ops console: list / filter all orders (newest first). */
export async function listAllOrders({ status = "", q = "", limit = 80 } = {}) {
  await refreshAllStatuses();
  const needle = String(q || "")
    .trim()
    .toLowerCase();
  const statusFilter = String(status || "").trim();

  const orders = await loadAllOrders();
  let list = orders.map(withTimeline);
  if (statusFilter) {
    list = list.filter((o) => o.status === statusFilter);
  }
  if (needle) {
    list = list.filter((o) => {
      const hay = `${o.id} ${o.name || ""} ${o.phone || ""} ${o.address?.line1 || ""} ${o.address?.label || ""}`.toLowerCase();
      return hay.includes(needle);
    });
  }

  const capped = Math.min(200, Math.max(1, Number(limit) || 80));
  return {
    items: list.slice(0, capped),
    total: list.length,
  };
}

/** Ops: set status manually and lock auto-advance. */
export async function adminSetOrderStatus(orderId, status) {
  await refreshAllStatuses();
  const nextStatus = String(status || "").trim();
  if (!ADMIN_STATUSES.includes(nextStatus)) {
    const err = new Error(`Invalid status. Use: ${ADMIN_STATUSES.join(", ")}`);
    err.status = 400;
    throw err;
  }

  const existing = await findOrder(orderId);
  if (!existing) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }

  const now = new Date().toISOString();
  const wasCancelled = existing.status === "cancelled";
  const patched = {
    ...existing,
    status: nextStatus,
    statusUpdatedAt: now,
    statusLocked: true,
  };
  if (nextStatus === "cancelled") {
    patched.cancelledAt = now;
  }

  await saveOrder(patched);

  if (nextStatus === "cancelled" && !wasCancelled) {
    await restockForOrder(existing.items || []);
  }

  return withTimeline(patched);
}

/** Ops cancel — no shopper phone check. */
export async function adminCancelOrder(orderId) {
  return adminSetOrderStatus(orderId, "cancelled");
}

/** Unique products from a user's past orders (newest first). */
export async function getReorderProducts(phone) {
  const seen = new Set();
  const products = [];

  for (const order of await getOrdersByPhone(phone)) {
    if (order.status === "cancelled") continue;

    for (const item of order.items) {
      if (seen.has(item.id)) continue;
      seen.add(item.id);
      products.push({
        id: item.id,
        name: item.name,
        unit: item.unit,
        price: item.price,
        mrp: item.price,
        image: item.image,
      });
    }
  }

  return products;
}
