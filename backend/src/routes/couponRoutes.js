import { Router } from "express";
import { listActiveCoupons } from "../data/coupons.js";

const router = Router();

/** GET /api/coupons — active promos for cart chips (public) */
router.get("/coupons", (_req, res) => {
  res.json({
    success: true,
    data: {
      coupons: listActiveCoupons(),
    },
  });
});

export default router;
