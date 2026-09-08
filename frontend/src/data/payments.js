// Payment methods shown at checkout. Amounts are settled in-app only
// (no external PSP) — the UI still follows a real payment handoff flow.

export const PAYMENT_METHODS = [
  {
    id: "upi",
    label: "UPI",
    hint: "GPay · PhonePe · Paytm",
    icon: "Smartphone",
  },
  {
    id: "card",
    label: "Credit / Debit card",
    hint: "Visa · Mastercard · RuPay",
    icon: "CreditCard",
  },
  {
    id: "wallet",
    label: "Blinkit Wallet",
    hint: "₹500 available · instant",
    icon: "Wallet",
  },
  {
    id: "cod",
    label: "Cash on delivery",
    hint: "Pay when order arrives",
    icon: "Banknote",
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
