/**
 * Lightweight serviceability rules for the clone.
 * Real Blinkit uses dark-store distance + demand; we gate on Bengaluru pincodes.
 */

const BLR_PREFIX = "560";

/** Known areas with a demo ETA + store label. */
export const AREA_PRESETS = [
  {
    id: "indir",
    label: "Indiranagar",
    line1: "12th Cross, Indiranagar",
    pincode: "560038",
    city: "Bengaluru",
    lat: 12.9784,
    lng: 77.6408,
    etaMinutes: 8,
    darkStore: "Indiranagar",
    mapX: 0.42,
    mapY: 0.48,
  },
  {
    id: "koram",
    label: "Koramangala",
    line1: "5th Block, Koramangala",
    pincode: "560034",
    city: "Bengaluru",
    lat: 12.9352,
    lng: 77.6245,
    etaMinutes: 10,
    darkStore: "Koramangala",
    mapX: 0.38,
    mapY: 0.72,
  },
  {
    id: "nagavara",
    label: "Nagavara",
    line1: "Manyata Tech Park, Nagavara",
    pincode: "560045",
    city: "Bengaluru",
    lat: 13.0465,
    lng: 77.62,
    etaMinutes: 12,
    darkStore: "Hebbal",
    mapX: 0.48,
    mapY: 0.22,
  },
  {
    id: "whitefield",
    label: "Whitefield",
    line1: "ITPL Main Road, Whitefield",
    pincode: "560066",
    city: "Bengaluru",
    lat: 12.9698,
    lng: 77.75,
    etaMinutes: 18,
    darkStore: "Whitefield",
    mapX: 0.78,
    mapY: 0.55,
  },
  {
    id: "jayanagar",
    label: "Jayanagar",
    line1: "4th Block, Jayanagar",
    pincode: "560041",
    city: "Bengaluru",
    lat: 12.9308,
    lng: 77.5838,
    etaMinutes: 11,
    darkStore: "Jayanagar",
    mapX: 0.28,
    mapY: 0.78,
  },
];

export function normalizePincode(raw) {
  return String(raw || "").replace(/\D/g, "").slice(0, 6);
}

export function checkServiceability(pincode) {
  const pin = normalizePincode(pincode);
  if (pin.length !== 6) {
    return {
      ok: false,
      serviceable: false,
      message: "Enter a 6-digit pincode",
    };
  }

  if (!pin.startsWith(BLR_PREFIX)) {
    return {
      ok: false,
      serviceable: false,
      message: "We deliver only in Bengaluru for now",
      city: null,
      etaMinutes: null,
    };
  }

  const preset = AREA_PRESETS.find((a) => a.pincode === pin);
  return {
    ok: true,
    serviceable: true,
    message: preset
      ? `Delivery in ${preset.etaMinutes} mins · ${preset.darkStore}`
      : "Delivery available in your area",
    city: "Bengaluru",
    etaMinutes: preset?.etaMinutes ?? 15,
    darkStore: preset?.darkStore ?? "Nearest store",
    presetId: preset?.id || null,
  };
}

export function enrichAddress(input = {}) {
  const pincode = normalizePincode(input.pincode);
  const check = checkServiceability(pincode);
  const preset =
    AREA_PRESETS.find((a) => a.id === input.areaId) ||
    AREA_PRESETS.find((a) => a.pincode === pincode);

  return {
    ...input,
    pincode: pincode || input.pincode || "",
    city: input.city || check.city || preset?.city || "",
    lat: Number(input.lat) || preset?.lat || null,
    lng: Number(input.lng) || preset?.lng || null,
    serviceable: check.serviceable,
    etaMinutes: check.etaMinutes ?? preset?.etaMinutes ?? null,
    darkStore: check.darkStore || preset?.darkStore || null,
    areaId: preset?.id || input.areaId || null,
  };
}

/** Upgrade legacy {label,line1,line2} rows saved before pins existed. */
export function migrateAddress(raw) {
  if (!raw || typeof raw !== "object") return null;
  const line2 = String(raw.line2 || "");
  const pinMatch = line2.match(/\b(560\d{3})\b/) || String(raw.line1 || "").match(/\b(560\d{3})\b/);
  const pincode = normalizePincode(raw.pincode || pinMatch?.[1] || "");
  const base = {
    id: raw.id || `addr_${Date.now().toString(36)}`,
    label: raw.label || "Home",
    line1: raw.line1 || "",
    line2: line2,
    pincode,
  };
  return enrichAddress(base);
}
