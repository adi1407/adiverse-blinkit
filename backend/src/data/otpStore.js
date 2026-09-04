import crypto from "crypto";

const OTP_TTL_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 5;
const RESEND_COOLDOWN_MS = 30 * 1000;
const OTP_PEPPER =
  process.env.OTP_SECRET ||
  process.env.JWT_SECRET ||
  "blinkit-clone-dev-otp-pepper-change-me";

/**
 * In-memory OTP challenges.
 * Production: swap for Redis + SMS provider; never store plaintext OTP.
 * @type {Map<string, { hash: string, salt: string, expiresAt: number, attempts: number, sentAt: number, name: string }>}
 */
const store = new Map();

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "").slice(-10);
}

function maskPhone(phone) {
  const p = normalizePhone(phone);
  if (p.length !== 10) return "****";
  return `${p.slice(0, 2)}******${p.slice(-2)}`;
}

/** HMAC so stolen hashes aren't reusable without the server pepper. */
function hashOtp(phone, otp, salt) {
  return crypto
    .createHmac("sha256", OTP_PEPPER)
    .update(`${phone}:${salt}:${otp}`)
    .digest();
}

function hashesEqual(a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b) || a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(a, b);
}

/** Cryptographically secure 6-digit OTP (000000–999999). */
export function generateSecureOtp() {
  return String(crypto.randomInt(0, 1_000_000)).padStart(6, "0");
}

function shouldLogOtp() {
  // Never log OTP in production. Local clone: log to server console only.
  if (process.env.NODE_ENV === "production") return false;
  if (process.env.AUTH_LOG_OTP === "0") return false;
  return true;
}

/**
 * Create OTP challenge. Plaintext OTP never leaves this function via the return value.
 * Without an SMS gateway, the code is written only to the server console in non-production.
 */
export function createOtpChallenge({ phone, name }) {
  const cleanPhone = normalizePhone(phone);
  if (cleanPhone.length !== 10) {
    const err = new Error("Enter a valid 10-digit Indian mobile number");
    err.status = 400;
    throw err;
  }

  const cleanName = String(name || "").trim() || "Blinkit User";
  const existing = store.get(cleanPhone);
  const now = Date.now();

  if (existing && now - existing.sentAt < RESEND_COOLDOWN_MS) {
    const wait = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.sentAt)) / 1000);
    const err = new Error(`Wait ${wait}s before requesting another OTP`);
    err.status = 429;
    throw err;
  }

  const otp = generateSecureOtp();
  const salt = crypto.randomBytes(16).toString("hex");

  store.set(cleanPhone, {
    hash: hashOtp(cleanPhone, otp, salt),
    salt,
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
    sentAt: now,
    name: cleanName,
  });

  if (shouldLogOtp()) {
    // Local-only delivery stand-in for SMS. Not returned over HTTP.
    console.log(
      `[auth] OTP for +91 ${maskPhone(cleanPhone)} → ${otp} (expires in ${OTP_TTL_MS / 60000} min)`
    );
  }

  // Wire real SMS here later, e.g. await sms.send(cleanPhone, `Your Blinkit code is ${otp}`);
  // Never include `otp` in the HTTP response.

  return {
    phone: cleanPhone,
    phoneMasked: `+91 ${maskPhone(cleanPhone)}`,
    name: cleanName,
    expiresInSec: Math.floor(OTP_TTL_MS / 1000),
    resendAfterSec: Math.floor(RESEND_COOLDOWN_MS / 1000),
    // Inform client how OTP was "delivered" without leaking the code
    delivery: shouldLogOtp() ? "dev_console" : "sms",
  };
}

export function verifyOtpChallenge({ phone, otp }) {
  const cleanPhone = normalizePhone(phone);
  const code = String(otp || "").replace(/\D/g, "");

  if (cleanPhone.length !== 10) {
    const err = new Error("Enter a valid 10-digit mobile number");
    err.status = 400;
    throw err;
  }
  if (!/^\d{6}$/.test(code)) {
    const err = new Error("Enter the 6-digit OTP");
    err.status = 400;
    throw err;
  }

  const entry = store.get(cleanPhone);
  if (!entry) {
    const err = new Error("Request an OTP first, then verify.");
    err.status = 400;
    throw err;
  }

  if (Date.now() > entry.expiresAt) {
    store.delete(cleanPhone);
    const err = new Error("OTP expired. Request a new one.");
    err.status = 400;
    throw err;
  }

  if (entry.attempts >= MAX_ATTEMPTS) {
    store.delete(cleanPhone);
    const err = new Error("Too many wrong attempts. Request a new OTP.");
    err.status = 429;
    throw err;
  }

  const candidate = hashOtp(cleanPhone, code, entry.salt);
  const ok = hashesEqual(candidate, entry.hash);

  if (!ok) {
    entry.attempts += 1;
    store.set(cleanPhone, entry);
    const left = MAX_ATTEMPTS - entry.attempts;
    // Same generic message shape; don't reveal hash/salt details
    const err = new Error(
      left > 0
        ? `Incorrect OTP. ${left} attempt${left === 1 ? "" : "s"} left.`
        : "Too many wrong attempts. Request a new OTP."
    );
    err.status = 401;
    if (left <= 0) store.delete(cleanPhone);
    throw err;
  }

  // One-time use: wipe challenge immediately after success
  const name = entry.name;
  store.delete(cleanPhone);

  return {
    name,
    phone: cleanPhone,
    sessionId: `sess_${crypto.randomBytes(16).toString("hex")}`,
  };
}
