import { Router } from "express";
import { getActiveFestival } from "../data/cmsStore.js";

const router = Router();

/** Public — Expo hero / category accents */
router.get("/festivals/active", (req, res) => {
  const { activeId, theme } = getActiveFestival();
  res.json({
    success: true,
    data: {
      activeId,
      theme,
    },
  });
});

export default router;
