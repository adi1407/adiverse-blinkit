import { Router } from "express";
import {
  getAdminCredentials,
  requireAdmin,
  signAdminToken,
} from "../middleware/adminAuth.js";
import {
  createBanner,
  deleteBanner,
  getActiveFestival,
  getBanners,
  getFestivalsStore,
  saveFestivalsStore,
  setActiveFestivalId,
  updateBanner,
  upsertFestivalTheme,
} from "../data/cmsStore.js";
import {
  createProductOverride,
  deleteProductOverride,
  updateProductOverride,
} from "../data/productOverrides.js";
import {
  catalogStats,
  categories,
  getAllProducts,
  getProductById,
  productExistsInBase,
} from "../data/catalog.js";
import { registerUploadRoute } from "./upload.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function countOrders() {
  try {
    const file = path.join(__dirname, "../data/orders.store.json");
    if (!fs.existsSync(file)) return 0;
    const parsed = JSON.parse(fs.readFileSync(file, "utf8"));
    return Array.isArray(parsed.orders) ? parsed.orders.length : 0;
  } catch {
    return 0;
  }
}

const router = Router();

function ok(res, data) {
  return res.json({ success: true, data });
}

function fail(res, err, fallbackStatus = 400) {
  const status = err.status || fallbackStatus;
  return res.status(status).json({
    success: false,
    message: err.message || "Request failed",
  });
}

/** POST /api/admin/login */
router.post("/login", (req, res) => {
  const email = String(req.body?.email || "")
    .trim()
    .toLowerCase();
  const password = String(req.body?.password || "");
  const creds = getAdminCredentials();

  if (email !== creds.email || password !== creds.password) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  const token = signAdminToken({ role: "admin", email });
  return ok(res, {
    token,
    email,
    expiresInHours: 12,
  });
});

router.use(requireAdmin);
registerUploadRoute(router);

/** GET /api/admin/stats */
router.get("/stats", (req, res) => {
  const { activeId, theme } = getActiveFestival();
  const orders = countOrders();
  return ok(res, {
    products: catalogStats.totalProducts,
    categories: catalogStats.categories,
    banners: getBanners().length,
    orders,
    activeFestivalId: activeId,
    activeFestivalLabel: theme?.eyebrow || activeId,
  });
});

/** GET /api/admin/festivals */
router.get("/festivals", (req, res) => {
  const store = getFestivalsStore();
  return ok(res, store);
});

/** PUT /api/admin/festivals/active  { id } */
router.put("/festivals/active", (req, res) => {
  try {
    const id = String(req.body?.id || "").trim();
    const result = setActiveFestivalId(id);
    return ok(res, result);
  } catch (err) {
    return fail(res, err);
  }
});

/** PUT /api/admin/festivals/:id — upsert theme fields */
router.put("/festivals/:id", (req, res) => {
  try {
    const id = String(req.params.id || "").trim();
    const theme = upsertFestivalTheme(id, req.body || {});
    return ok(res, theme);
  } catch (err) {
    return fail(res, err);
  }
});

/** PUT /api/admin/festivals — replace whole store (optional bulk) */
router.put("/festivals", (req, res) => {
  const body = req.body || {};
  if (!body.themes || typeof body.themes !== "object") {
    return fail(res, new Error("themes object required"));
  }
  const next = {
    activeId: body.activeId || getFestivalsStore().activeId,
    themes: body.themes,
  };
  saveFestivalsStore(next);
  return ok(res, next);
});

/** Banners CRUD */
router.get("/banners", (req, res) => ok(res, getBanners()));

router.post("/banners", (req, res) => {
  try {
    return ok(res, createBanner(req.body || {}));
  } catch (err) {
    return fail(res, err);
  }
});

router.patch("/banners/:id", (req, res) => {
  try {
    return ok(res, updateBanner(req.params.id, req.body || {}));
  } catch (err) {
    return fail(res, err);
  }
});

router.delete("/banners/:id", (req, res) => {
  try {
    return ok(res, deleteBanner(req.params.id));
  } catch (err) {
    return fail(res, err);
  }
});

/** Products */
router.get("/products", (req, res) => {
  const q = String(req.query.q || "")
    .trim()
    .toLowerCase();
  const categoryId = String(req.query.categoryId || "").trim();
  let list = getAllProducts();
  if (categoryId) list = list.filter((p) => p.categoryId === categoryId);
  if (q) {
    list = list.filter((p) => {
      const hay = `${p.name} ${p.brand || ""} ${p.unit}`.toLowerCase();
      return hay.includes(q);
    });
  }
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 40));
  const start = (page - 1) * limit;
  return ok(res, {
    items: list.slice(start, start + limit),
    total: list.length,
    page,
    limit,
    categories,
  });
});

router.get("/products/:id", (req, res) => {
  const product = getProductById(req.params.id);
  if (!product) {
    return fail(res, Object.assign(new Error("Product not found"), { status: 404 }));
  }
  return ok(res, product);
});

router.post("/products", (req, res) => {
  try {
    return ok(res, createProductOverride(req.body || {}));
  } catch (err) {
    return fail(res, err);
  }
});

router.patch("/products/:id", (req, res) => {
  try {
    const id = req.params.id;
    const result = updateProductOverride(
      id,
      req.body || {},
      productExistsInBase(id)
    );
    return ok(res, getProductById(id) || result);
  } catch (err) {
    return fail(res, err);
  }
});

router.delete("/products/:id", (req, res) => {
  try {
    const id = req.params.id;
    return ok(
      res,
      deleteProductOverride(id, productExistsInBase(id))
    );
  } catch (err) {
    return fail(res, err);
  }
});

router.get("/categories", (req, res) => ok(res, categories));

export default router;
