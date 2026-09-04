import { Platform, Share } from "react-native";
import { statusLabel } from "./orderStatus";

/** Plain-text summary for the system share sheet. */
export function buildOrderShareMessage(order) {
  if (!order) return "";

  const lines = (order.items || []).slice(0, 5).map(
    (item) => `• ${item.name} ×${item.qty}`
  );
  const extra = (order.items?.length || 0) - lines.length;
  if (extra > 0) lines.push(`• +${extra} more`);

  const address = order.address
    ? `${order.address.label || "Home"} — ${order.address.line1 || ""}`.trim()
    : "Address on file";

  return [
    `Blinkit Clone · Order ${order.id}`,
    `Status: ${statusLabel(order.status)}`,
    `Total: ₹${order.grandTotal}`,
    `Payment: ${order.payment?.label || "—"}`,
    `Deliver to: ${address}`,
    "",
    "Items:",
    ...lines,
    "",
    "Shared from the Blinkit Clone demo app.",
  ].join("\n");
}

export function buildProductShareMessage(product, categoryLabel) {
  if (!product) return "";

  const showMrp = Number(product.mrp) > Number(product.price);
  const priceLine = showMrp
    ? `₹${product.price} (MRP ₹${product.mrp})`
    : `₹${product.price}`;
  const cat = categoryLabel ? `\nCategory: ${categoryLabel}` : "";

  return [
    `Check this out on Blinkit Clone`,
    "",
    product.name,
    product.unit ? `Unit: ${product.unit}` : null,
    `Price: ${priceLine}`,
    cat.trim() || null,
    "",
    "Shared from the Blinkit Clone demo app.",
  ]
    .filter(Boolean)
    .join("\n");
}

async function openShareSheet({ message, title }) {
  return Share.share(
    Platform.OS === "ios" ? { message, title } : { message, title }
  );
}

export async function shareOrder(order) {
  if (!order?.id) {
    throw new Error("Nothing to share");
  }
  return openShareSheet({
    message: buildOrderShareMessage(order),
    title: `Order ${order.id}`,
  });
}

export async function shareProduct(product, categoryLabel) {
  if (!product?.id) {
    throw new Error("Nothing to share");
  }
  return openShareSheet({
    message: buildProductShareMessage(product, categoryLabel),
    title: product.name || "Product",
  });
}
