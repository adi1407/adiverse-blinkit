import { apiPost } from "./client";

export function sendOtp({ phone, name }) {
  return apiPost("/api/auth/send-otp", { phone, name });
}

export function verifyOtp({ phone, otp, name }) {
  return apiPost("/api/auth/verify-otp", { phone, otp, name });
}
