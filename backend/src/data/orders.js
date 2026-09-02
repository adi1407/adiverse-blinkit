// In-memory orders store (resets when the backend restarts).

const orders = [];

function makeId() {
  return `ord_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

export function createOrder({ name, phone, items }) {
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

  const order = {
    id: makeId(),
    name: cleanName,
    phone: cleanPhone,
    items: normalized,
    itemTotal,
    deliveryFee,
    grandTotal,
    status: "confirmed",
    createdAt: new Date().toISOString(),
  };

  orders.unshift(order);
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
