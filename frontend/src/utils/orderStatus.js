/** Shared order-status labels for UI */

export const STATUS_LABELS = {
  confirmed: "Confirmed",
  packing: "Packing",
  out_for_delivery: "On the way",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export function statusLabel(status) {
  return STATUS_LABELS[status] || String(status || "confirmed").replace(/_/g, " ");
}

export function isCancelled(status) {
  return status === "cancelled";
}
