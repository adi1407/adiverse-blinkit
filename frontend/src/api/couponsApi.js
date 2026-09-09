import { apiGet } from "./client";
import { FALLBACK_COUPONS } from "../data/coupons";

export async function fetchCoupons() {
  try {
    const data = await apiGet("/api/coupons", { auth: false });
    const list = Array.isArray(data?.coupons) ? data.coupons : [];
    return list.length ? list : FALLBACK_COUPONS;
  } catch {
    return FALLBACK_COUPONS;
  }
}
