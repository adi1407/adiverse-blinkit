import { apiGet, apiPost } from "./client";

export function placeOrder({ name, phone, items, address, couponCode, paymentMethod }) {
  return apiPost("/api/orders", {
    name,
    phone,
    items,
    address,
    couponCode,
    paymentMethod,
  });
}

export function fetchOrders(phone) {
  return apiGet(`/api/orders?phone=${encodeURIComponent(phone)}`);
}

export function fetchOrderById(orderId) {
  return apiGet(`/api/orders/${encodeURIComponent(orderId)}`);
}

export function cancelOrder({ orderId, phone }) {
  return apiPost(`/api/orders/${encodeURIComponent(orderId)}/cancel`, { phone });
}

export function fetchReorderProducts(phone) {
  return apiGet(`/api/orders/reorder?phone=${encodeURIComponent(phone)}`);
}
