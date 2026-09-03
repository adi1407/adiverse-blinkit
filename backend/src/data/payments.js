// Demo payment methods — mirrored on the frontend for the cart picker.

export const PAYMENT_METHODS = [
  {
    id: "upi",
    label: "UPI",
    hint: "GPay · PhonePe · Paytm",
  },
  {
    id: "card",
    label: "Credit / Debit card",
    hint: "Visa · Mastercard · RuPay",
  },
  {
    id: "wallet",
    label: "Blinkit Wallet",
    hint: "Demo balance · instant",
  },
  {
    id: "cod",
    label: "Cash on delivery",
    hint: "Pay when order arrives",
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
