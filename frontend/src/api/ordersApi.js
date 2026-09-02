import { apiGet, apiPost } from "./client";

export function placeOrder({ name, phone, items }) {
  return apiPost("/api/orders", { name, phone, items });
}

export function fetchOrders(phone) {
  return apiGet(`/api/orders?phone=${encodeURIComponent(phone)}`);
}

export function fetchReorderProducts(phone) {
  return apiGet(`/api/orders/reorder?phone=${encodeURIComponent(phone)}`);
}
