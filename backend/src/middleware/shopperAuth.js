/**
 * Shopper session token (HMAC JWT-lite) — issued on OTP verify.
 * Mirrors adminAuth; separate secret so admin/shopper tokens cannot be mixed.
 */
import crypto from "crypto";

const TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function secret() {
  return (
    process.env.SHOPPER_TOKEN_SECRET ||
    process.env.OTP_SECRET ||
    process.env.JWT_SECRET ||
    "dev-shopper-secret-change-me"
  );
}

function b64url(input) {
  return Buffer.from(input)
    .toString("base64")
    .replace(/=/g, "")
    .replace(/\+/g, "-")
    .replace(/\//g, "_");
}

function fromB64url(str) {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64").toString("utf8");
}

export function signShopperToken(payload) {
  const body = {
    role: "shopper",
    phone: String(payload.phone || "").replace(/\D/g, ""),
    name: String(payload.name || "").trim() || "Blinkit User",
    sid: payload.sessionId || null,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  if (body.phone.length !== 10) {
    throw Object.assign(new Error("Invalid shopper phone for token"), {
      status: 400,
    });
  }
  const data = b64url(JSON.stringify(body));
  const sig = crypto.createHmac("sha256", secret()).update(data).digest("base64");
  return `${data}.${b64url(Buffer.from(sig, "base64"))}`;
}

export function verifyShopperToken(token) {
  if (!token || typeof token !== "string") return null;
  const [data, sig] = token.split(".");
  if (!data || !sig) return null;
  const expectedRaw = crypto
    .createHmac("sha256", secret())
    .update(data)
    .digest("base64");
  const expected = b64url(Buffer.from(expectedRaw, "base64"));
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(fromB64url(data));
    if (payload?.role !== "shopper") return null;
    if (!payload?.exp || Date.now() > payload.exp) return null;
    const phone = String(payload.phone || "").replace(/\D/g, "");
    if (phone.length !== 10) return null;
    return {
      phone,
      name: String(payload.name || "").trim() || "Blinkit User",
      sessionId: payload.sid || null,
      exp: payload.exp,
      role: "shopper",
    };
  } catch {
    return null;
  }
}

function extractToken(req) {
  const header = req.headers.authorization || "";
  if (header.startsWith("Bearer ")) return header.slice(7).trim();
  return String(req.headers["x-session-token"] || "").trim();
}

/**
 * Express middleware — requires Authorization: Bearer <shopper token>
 * Sets req.shopper = { phone, name, sessionId, exp, role }
 */
export function requireShopper(req, res, next) {
  const payload = verifyShopperToken(extractToken(req));
  if (!payload) {
    return res.status(401).json({
      success: false,
      message: "Login required",
    });
  }
  req.shopper = payload;
  return next();
}
