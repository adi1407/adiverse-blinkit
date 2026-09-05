/**
 * Admin JWT-lite (HMAC) — separate from shopper phone OTP.
 */
import crypto from "crypto";

const TOKEN_TTL_MS = 12 * 60 * 60 * 1000; // 12h

function secret() {
  return (
    process.env.ADMIN_TOKEN_SECRET ||
    process.env.OTP_SECRET ||
    "dev-admin-secret-change-me"
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

export function signAdminToken(payload) {
  const body = {
    ...payload,
    exp: Date.now() + TOKEN_TTL_MS,
  };
  const data = b64url(JSON.stringify(body));
  const sig = crypto.createHmac("sha256", secret()).update(data).digest("base64");
  return `${data}.${b64url(Buffer.from(sig, "base64"))}`;
}

export function verifyAdminToken(token) {
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
    if (!payload?.exp || Date.now() > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getAdminCredentials() {
  return {
    email: (process.env.ADMIN_EMAIL || "admin@blinkit.local").toLowerCase(),
    password: process.env.ADMIN_PASSWORD || "admin123",
  };
}

/**
 * Express middleware — requires Authorization: Bearer <token>
 */
export function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ")
    ? header.slice(7).trim()
    : String(req.headers["x-admin-token"] || "").trim();

  const payload = verifyAdminToken(token);
  if (!payload) {
    return res.status(401).json({
      success: false,
      message: "Admin authentication required",
    });
  }
  req.admin = payload;
  return next();
}
