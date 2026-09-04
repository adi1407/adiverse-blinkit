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

export async function shareOrder(order) {
  if (!order?.id) {
    throw new Error("Nothing to share");
  }

  const message = buildOrderShareMessage(order);
  const result = await Share.share(
    Platform.OS === "ios"
      ? { message, title: `Order ${order.id}` }
      : { message, title: `Order ${order.id}` }
  );
  return result;
}
