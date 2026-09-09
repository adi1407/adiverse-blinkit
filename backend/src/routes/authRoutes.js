import { Router } from "express";
import { createOtpChallenge, verifyOtpChallenge } from "../data/otpStore.js";
import { signShopperToken } from "../middleware/shopperAuth.js";

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

// POST /api/auth/verify-otp — verify code; issue Bearer session token
router.post("/auth/verify-otp", (req, res) => {
  try {
    const { phone, otp, name } = req.body || {};
    const user = verifyOtpChallenge({ phone, otp });
    if (name && String(name).trim()) {
      user.name = String(name).trim();
    }
    const token = signShopperToken({
      phone: user.phone,
      name: user.name,
      sessionId: user.sessionId,
    });
    res.json({
      success: true,
      message: "Logged in",
      data: {
        user: {
          ...user,
          token,
        },
        token,
      },
    });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "OTP verification failed",
    });
  }
});

export default router;
