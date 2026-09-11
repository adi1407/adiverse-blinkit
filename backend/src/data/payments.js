// Payment methods — mirrored on the frontend for the cart picker.
// COD is real; digital methods are demo-only (no PSP).

export const PAYMENT_METHODS = [
  {
    id: "cod",
    label: "Cash on delivery",
    hint: "Pay when order arrives",
  },
  {
    id: "upi",
    label: "UPI",
    hint: "Demo · no bank charge",
  },
  {
    id: "card",
    label: "Credit / Debit card",
    hint: "Demo · no bank charge",
  },
  {
    id: "wallet",
    label: "Blinkit Wallet",
    hint: "Demo · no bank charge",
  },
];

export function normalizePaymentMethod(id) {
  const key = String(id || "")
    .trim()
    .toLowerCase();
  const method = PAYMENT_METHODS.find((m) => m.id === key);
  return method
    ? { id: method.id, label: method.label }
    : { id: "cod", label: "Cash on delivery" };
}

export function paymentStatusForMethod(paymentId) {
  return paymentId === "cod" ? "pending" : "demo";
}
