/** Shared grocery delivery thresholds (match backend createOrder). */
export const FREE_DELIVERY_MIN = 199;
export const BASE_DELIVERY_FEE = 25;

export function getDeliveryProgress(itemTotal) {
  const total = Math.max(0, Number(itemTotal) || 0);
  const remaining = Math.max(0, Math.ceil(FREE_DELIVERY_MIN - total));
  const progress = Math.min(1, total / FREE_DELIVERY_MIN);
  return {
    remaining,
    progress,
    unlocked: remaining === 0,
    minOrder: FREE_DELIVERY_MIN,
  };
}
