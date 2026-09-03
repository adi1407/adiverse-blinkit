// Orders store backed by a JSON file (survives backend restarts).
// Status auto-advances over time for demo tracking (unless cancelled).

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { evaluateCoupon, getCouponByCode } from "./coupons.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_PATH = path.join(__dirname, "orders.store.json");

/** Demo timeline (seconds after place order). Real apps use rider GPS/events. */
export const STATUS_STEPS = [
  { key: "confirmed", afterSec: 0, title: "Order confirmed", hint: "Store got your order" },
  { key: "packing", afterSec: 20, title: "Packing", hint: "Items are being packed" },
  { key: "out_for_delivery", afterSec: 50, title: "Out for delivery", hint: "Partner is on the way" },
  { key: "delivered", afterSec: 90, title: "Delivered", hint: "Enjoy your order" },
];

function loadOrders() {
  try {
    if (!fs.existsSync(STORE_PATH)) return [];
    const raw = fs.readFileSync(STORE_PATH, "utf8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.orders) ? parsed.orders : [];
  } catch {
    return [];
  }
}

function saveOrders(list) {
  const tmp = `${STORE_PATH}.tmp`;
  const payload = JSON.stringify(
    { updatedAt: new Date().toISOString(), orders: list },
    null,
    2
  );
  fs.writeFileSync(tmp, payload, "utf8");
  fs.renameSync(tmp, STORE_PATH);
}

let orders = loadOrders();

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

function withTimeline(order) {
  const created = new Date(order.createdAt).getTime();
  const ageSec = Math.max(0, Math.floor((Date.now() - created) / 1000));

  if (order.status === "cancelled") {
    return {
      ...order,
      status: "cancelled",
      canCancel: false,
      ageSec,
      timeline: STATUS_STEPS.map((step) => ({
        ...step,
        done: false,
        active: false,
      })),
    };
  }

  const status = statusForAge(ageSec);
  const stepIndex = STATUS_STEPS.findIndex((s) => s.key === status);

  return {
    ...order,
    status,
    statusUpdatedAt: order.statusUpdatedAt || order.createdAt,
    canCancel: status === "confirmed",
    timeline: STATUS_STEPS.map((step, index) => ({
      ...step,
      done: index <= stepIndex,
      active: index === stepIndex,
    })),
    ageSec,
  };
}

function refreshAllStatuses() {
  let changed = false;
  orders = orders.map((order) => {
    if (order.status === "cancelled") return order;

    const next = withTimeline(order);
    if (next.status !== order.status) {
      changed = true;
      return {
        ...order,
        status: next.status,
        statusUpdatedAt: new Date().toISOString(),
      };
    }
    return order;
  });
  if (changed) saveOrders(orders);
}

export function createOrder({ name, phone, items, address, couponCode }) {
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  const cleanName = String(name || "").trim() || "Blinkit User";
  const cartItems = Array.isArray(items) ? items : [];

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
    const result = evaluateCoupon(requested, itemTotal, baseDeliveryFee);
    if (!result.ok) {
      const err = new Error(result.message || "Coupon not applicable");
      err.status = 400;
      throw err;
    }

    const meta = getCouponByCode(requested);
    coupon = {
      code: meta.code,
      title: meta.title,
      type: meta.type,
    };
    couponDiscount = result.discount;
    deliveryFee = result.deliveryFee;
  }

  const itemOff = coupon?.type === "free_delivery" ? 0 : couponDiscount;
  const grandTotal = Math.max(0, itemTotal - itemOff + deliveryFee);

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
    coupon,
    couponDiscount,
    grandTotal,
    status: "confirmed",
    statusUpdatedAt: now,
    createdAt: now,
  };

  orders = [order, ...orders];
  saveOrders(orders);
  return withTimeline(order);
}

export function cancelOrder({ orderId, phone }) {
  refreshAllStatuses();

  const cleanPhone = String(phone || "").replace(/\D/g, "");
  const index = orders.findIndex((o) => o.id === orderId);

  if (index < 0) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }

  const existing = orders[index];
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

  orders[index] = cancelled;
  saveOrders(orders);
  return withTimeline(cancelled);
}

export function getOrdersByPhone(phone) {
  refreshAllStatuses();
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  return orders
    .filter((order) => order.phone === cleanPhone)
    .map(withTimeline);
}

export function getOrderById(id) {
  refreshAllStatuses();
  const order = orders.find((o) => o.id === id);
  return order ? withTimeline(order) : null;
}

/** Unique products from a user's past orders (newest first). */
export function getReorderProducts(phone) {
  const seen = new Set();
  const products = [];

  for (const order of getOrdersByPhone(phone)) {
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
