import { Router } from "express";
import { getActiveFestival } from "../data/cmsStore.js";

const router = Router();

/** Public — Expo hero / category accents */
router.get("/festivals/active", async (req, res) => {
  const { activeId, theme } = await getActiveFestival();
  res.json({
    success: true,
    data: {
      activeId,
      theme,
    },
  });
});

export default router;
