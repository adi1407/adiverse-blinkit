// Demo promo codes — same rules as backend/src/data/coupons.js
// Frontend uses this for instant bill UI; server re-checks on checkout.

export const COUPONS = [
  {
    code: "BLINKIT50",
    title: "₹50 off",
    description: "Flat ₹50 · min order ₹199",
    type: "flat",
    value: 50,
    minOrder: 199,
  },
  {
    code: "SAVE20",
    title: "20% off",
    description: "Up to ₹80 · min order ₹149",
    type: "percent",
    value: 20,
    maxDiscount: 80,
    minOrder: 149,
  },
  {
    code: "FREESHIP",
    title: "Free delivery",
    description: "Waive partner fee · min ₹99",
    type: "free_delivery",
    minOrder: 99,
  },
  {
    code: "WELCOME100",
    title: "₹100 off",
    description: "Flat ₹100 · min order ₹499",
    type: "flat",
    value: 100,
    minOrder: 499,
  },
];

export function getCouponByCode(code) {
  const key = String(code || "")
    .trim()
    .toUpperCase();
  return COUPONS.find((c) => c.code === key) || null;
}

export function evaluateCoupon(code, itemTotal, baseDeliveryFee) {
  const coupon = getCouponByCode(code);
  if (!coupon) {
    return {
      ok: false,
      coupon: null,
      discount: 0,
      deliveryFee: baseDeliveryFee,
      message: "Invalid coupon code",
    };
  }

  if (itemTotal < coupon.minOrder) {
    return {
      ok: false,
      coupon,
      discount: 0,
      deliveryFee: baseDeliveryFee,
      message: `Add ₹${coupon.minOrder - itemTotal} more to use ${coupon.code}`,
    };
  }

  let discount = 0;
  let deliveryFee = baseDeliveryFee;

  if (coupon.type === "flat") {
    discount = Math.min(coupon.value, itemTotal);
  } else if (coupon.type === "percent") {
    const raw = Math.round((itemTotal * coupon.value) / 100);
    discount = Math.min(raw, coupon.maxDiscount || raw, itemTotal);
  } else if (coupon.type === "free_delivery") {
    discount = baseDeliveryFee;
    deliveryFee = 0;
  }

  return {
    ok: true,
    coupon,
    discount,
    deliveryFee,
    message: undefined,
  };
}
