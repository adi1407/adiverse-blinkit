import { apiGet, apiPost } from "./client";

export function placeOrder({
  items,
  address,
  couponCode,
  paymentMethod,
  tipAmount,
  // name/phone ignored — identity comes from the Bearer token
}) {
  return apiPost("/api/orders", {
    items,
    address,
    couponCode,
    paymentMethod,
    tipAmount,
  });
}

export function fetchOrders() {
  return apiGet("/api/orders");
}

export function fetchOrderById(orderId) {
  return apiGet(`/api/orders/${encodeURIComponent(orderId)}`);
}

export function cancelOrder({ orderId }) {
  return apiPost(`/api/orders/${encodeURIComponent(orderId)}/cancel`, {});
}

export function rateOrder({ orderId, stars, review }) {
  return apiPost(`/api/orders/${encodeURIComponent(orderId)}/rate`, {
    stars,
    review,
  });
}

export function fetchReorderProducts() {
  return apiGet("/api/orders/reorder");
}
