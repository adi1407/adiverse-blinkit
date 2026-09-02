// Orders store backed by a JSON file (survives backend restarts).

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_PATH = path.join(__dirname, "orders.store.json");

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

function saveOrders(orders) {
  const tmp = `${STORE_PATH}.tmp`;
  const payload = JSON.stringify(
    { updatedAt: new Date().toISOString(), orders },
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

export function createOrder({ name, phone, items, address }) {
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
  const deliveryFee = itemTotal >= 199 ? 0 : 25;
  const grandTotal = itemTotal + deliveryFee;

  const deliveryAddress = address
    ? {
        label: String(address.label || "Home").trim() || "Home",
        line1: String(address.line1 || "").trim(),
        line2: String(address.line2 || "").trim(),
      }
    : null;

  const order = {
    id: makeId(),
    name: cleanName,
    phone: cleanPhone,
    address: deliveryAddress,
    items: normalized,
    itemTotal,
    deliveryFee,
    grandTotal,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  orders = [order, ...orders];
  saveOrders(orders);
  return order;
}

export function getOrdersByPhone(phone) {
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  return orders.filter((order) => order.phone === cleanPhone);
}

export function getOrderById(id) {
  return orders.find((order) => order.id === id);
}

/** Unique products from a user's past orders (newest first). */
export function getReorderProducts(phone) {
  const seen = new Set();
  const products = [];

  for (const order of getOrdersByPhone(phone)) {
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
