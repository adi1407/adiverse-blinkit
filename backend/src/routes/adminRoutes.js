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
import {
  adminCancelOrder,
  adminSetOrderStatus,
  getOrderById,
  listAllOrders,
} from "../data/orders.js";
import {
  adminCancelPrintJob,
  adminSetPrintJobStatus,
  getPrintJobById,
  listAllPrintJobs,
} from "../data/printJobs.js";
import {
  adjustInventory,
  inventoryStats,
  listInventoryMap,
  setInventory,
} from "../data/inventory.js";
import { registerUploadRoute } from "./upload.js";

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
  const { total: orders } = listAllOrders({ limit: 1 });
  const products = getAllProducts();
  const inv = inventoryStats(products.map((p) => p.id));
  return ok(res, {
    products: catalogStats.totalProducts,
    categories: catalogStats.categories,
    banners: getBanners().length,
    orders,
    inventoryOut: inv.out,
    inventoryLow: inv.low,
    inventoryTracked: inv.tracked,
    activeFestivalId: activeId,
    activeFestivalLabel: theme?.eyebrow || activeId,
  });
});

/** GET /api/admin/orders?status=&q=&limit= */
router.get("/orders", (req, res) => {
  const data = listAllOrders({
    status: req.query.status,
    q: req.query.q,
    limit: req.query.limit,
  });
  return ok(res, data);
});

/** GET /api/admin/orders/:id */
router.get("/orders/:id", (req, res) => {
  const order = getOrderById(req.params.id);
  if (!order) {
    return fail(res, Object.assign(new Error("Order not found"), { status: 404 }));
  }
  return ok(res, order);
});

/** PATCH /api/admin/orders/:id  { status } */
router.patch("/orders/:id", (req, res) => {
  try {
    const status = String(req.body?.status || "").trim();
    if (!status) {
      return fail(res, new Error("status is required"));
    }
    return ok(res, adminSetOrderStatus(req.params.id, status));
  } catch (err) {
    return fail(res, err);
  }
});

/** POST /api/admin/orders/:id/cancel */
router.post("/orders/:id/cancel", (req, res) => {
  try {
    return ok(res, adminCancelOrder(req.params.id));
  } catch (err) {
    return fail(res, err);
  }
});

/** GET /api/admin/print-jobs?status=&q=&limit= */
router.get("/print-jobs", (req, res) => {
  const data = listAllPrintJobs({
    status: req.query.status,
    q: req.query.q,
    limit: req.query.limit,
  });
  return ok(res, data);
});

/** GET /api/admin/print-jobs/:id */
router.get("/print-jobs/:id", (req, res) => {
  const job = getPrintJobById(req.params.id);
  if (!job) {
    return fail(res, Object.assign(new Error("Print job not found"), { status: 404 }));
  }
  return ok(res, job);
});

/** PATCH /api/admin/print-jobs/:id  { status } */
router.patch("/print-jobs/:id", (req, res) => {
  try {
    const status = String(req.body?.status || "").trim();
    if (!status) {
      return fail(res, new Error("status is required"));
    }
    return ok(res, adminSetPrintJobStatus(req.params.id, status));
  } catch (err) {
    return fail(res, err);
  }
});

/** POST /api/admin/print-jobs/:id/cancel */
router.post("/print-jobs/:id/cancel", (req, res) => {
  try {
    return ok(res, adminCancelPrintJob(req.params.id));
  } catch (err) {
    return fail(res, err);
  }
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

/** GET /api/admin/inventory?q=&status=&categoryId=&limit= */
router.get("/inventory", (req, res) => {
  const q = String(req.query.q || "")
    .trim()
    .toLowerCase();
  const status = String(req.query.status || "").trim(); // out|low|ok|untracked|tracked|""
  const categoryId = String(req.query.categoryId || "").trim();
  const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 80));

  let products = getAllProducts();
  if (categoryId) {
    products = products.filter((p) => p.categoryId === categoryId);
  }
  if (q) {
    products = products.filter((p) => {
      const hay = `${p.name} ${p.brand || ""} ${p.id}`.toLowerCase();
      return hay.includes(q);
    });
  }

  const map = listInventoryMap();
  let rows = products.map((p) => {
    const inv = map[p.id];
    const stockStatus = p.stockStatus || inv?.status || "untracked";
    return {
      id: p.id,
      name: p.name,
      brand: p.brand || "",
      unit: p.unit,
      categoryId: p.categoryId,
      image: p.image || p.images?.[0] || null,
      price: p.price,
      stockTracked: Boolean(p.stockTracked),
      stockQty: p.stockQty,
      lowStockAt: p.lowStockAt ?? inv?.lowStockAt ?? 5,
      stockStatus,
      updatedAt: inv?.updatedAt || null,
    };
  });

  if (status === "tracked") {
    rows = rows.filter((r) => r.stockTracked);
  } else if (status === "untracked") {
    rows = rows.filter((r) => !r.stockTracked);
  } else if (status) {
    rows = rows.filter((r) => r.stockStatus === status);
  }

  // Surface problems first when browsing all / tracked
  if (!status || status === "tracked") {
    const rank = { out: 0, low: 1, ok: 2, untracked: 3 };
    rows.sort(
      (a, b) =>
        (rank[a.stockStatus] ?? 9) - (rank[b.stockStatus] ?? 9) ||
        a.name.localeCompare(b.name)
    );
  }

  const stats = inventoryStats(products.map((p) => p.id));
  return ok(res, {
    items: rows.slice(0, limit),
    total: rows.length,
    stats,
    categories,
  });
});

/** PUT /api/admin/inventory/:id  { onHand, lowStockAt, tracked } */
router.put("/inventory/:id", (req, res) => {
  try {
    const body = req.body || {};
    const record = setInventory(req.params.id, {
      onHand: body.onHand,
      lowStockAt: body.lowStockAt,
      tracked: body.tracked !== false,
    });
    const product = getProductById(req.params.id);
    return ok(res, { ...record, product });
  } catch (err) {
    return fail(res, err);
  }
});

/** POST /api/admin/inventory/:id/adjust  { delta, lowStockAt? } */
router.post("/inventory/:id/adjust", (req, res) => {
  try {
    const delta = Number(req.body?.delta);
    const record = adjustInventory(req.params.id, delta, {
      lowStockAt: req.body?.lowStockAt,
    });
    const product = getProductById(req.params.id);
    return ok(res, { ...record, product });
  } catch (err) {
    return fail(res, err);
  }
});

export default router;
