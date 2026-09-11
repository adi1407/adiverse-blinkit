// Payment methods at checkout.
// COD is the real path. Digital methods are demo-only (no PSP / no bank charge).

export const PAYMENT_METHODS = [
  {
    id: "cod",
    label: "Cash on delivery",
    hint: "Pay when order arrives",
    icon: "Banknote",
  },
  {
    id: "upi",
    label: "UPI",
    hint: "Demo · no bank charge",
    icon: "Smartphone",
  },
  {
    id: "card",
    label: "Credit / Debit card",
    hint: "Demo · no bank charge",
    icon: "CreditCard",
  },
  {
    id: "wallet",
    label: "Blinkit Wallet",
    hint: "Demo · no bank charge",
    icon: "Wallet",
  },
];

export function getPaymentMethod(id) {
  return PAYMENT_METHODS.find((m) => m.id === id) || null;
}

export function normalizePaymentMethod(id) {
  const method = getPaymentMethod(String(id || "").toLowerCase());
  return method
    ? { id: method.id, label: method.label }
    : { id: "cod", label: "Cash on delivery" };
}

/** Human-readable payment settlement label for order detail / admin. */
export function paymentStatusLabel(status, paymentId) {
  const key = String(status || "").toLowerCase();
  if (key === "demo") return "Demo · unpaid";
  if (key === "paid") return "Paid";
  if (key === "pending" || paymentId === "cod") return "Pay on delivery";
  return key || "—";
}
