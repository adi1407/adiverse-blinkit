import { Router } from "express";
import { createOtpChallenge, verifyOtpChallenge } from "../data/otpStore.js";

const router = Router();

// POST /api/auth/send-otp — issue challenge (OTP never returned in body)
router.post("/auth/send-otp", (req, res) => {
  try {
    const { phone, name } = req.body || {};
    const data = createOtpChallenge({ phone, name });
    res.json({
      success: true,
      message: "OTP sent",
      data,
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Could not send OTP",
    });
  }
});

// POST /api/auth/verify-otp — verify code; challenge deleted on success
router.post("/auth/verify-otp", (req, res) => {
  try {
    const { phone, otp, name } = req.body || {};
    const user = verifyOtpChallenge({ phone, otp });
    if (name && String(name).trim()) {
      user.name = String(name).trim();
    }
    res.json({
      success: true,
      message: "Logged in",
      data: { user },
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "OTP verification failed",
    });
  }
});

export default router;
