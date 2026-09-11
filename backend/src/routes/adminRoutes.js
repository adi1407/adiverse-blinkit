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
  createCoupon,
  deleteCoupon,
  listCoupons,
  updateCoupon,
} from "../data/coupons.js";
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
router.get("/stats", async (req, res) => {
  const { activeId, theme } = await getActiveFestival();
  const { total: orders } = await listAllOrders({ limit: 1 });
  const products = await getAllProducts();
  const inv = await inventoryStats(products.map((p) => p.id));
  const stats = await catalogStats();
  const banners = await getBanners();
  return ok(res, {
    products: stats.totalProducts,
    categories: stats.categories,
    banners: banners.length,
    orders,
    inventoryOut: inv.out,
    inventoryLow: inv.low,
    inventoryTracked: inv.tracked,
    activeFestivalId: activeId,
    activeFestivalLabel: theme?.eyebrow || activeId,
  });
});

/** GET /api/admin/orders?status=&q=&limit= */
router.get("/orders", async (req, res) => {
  const data = await listAllOrders({
    status: req.query.status,
    q: req.query.q,
    limit: req.query.limit,
  });
  return ok(res, data);
});

/** GET /api/admin/orders/:id */
router.get("/orders/:id", async (req, res) => {
  const order = await getOrderById(req.params.id);
  if (!order) {
    return fail(res, Object.assign(new Error("Order not found"), { status: 404 }));
  }
  return ok(res, order);
});

/** PATCH /api/admin/orders/:id  { status } */
router.patch("/orders/:id", async (req, res) => {
  try {
    const status = String(req.body?.status || "").trim();
    if (!status) {
      return fail(res, new Error("status is required"));
    }
    return ok(res, await adminSetOrderStatus(req.params.id, status));
  } catch (err) {
    return fail(res, err);
  }
});

/** POST /api/admin/orders/:id/cancel */
router.post("/orders/:id/cancel", async (req, res) => {
  try {
    return ok(res, await adminCancelOrder(req.params.id));
  } catch (err) {
    return fail(res, err);
  }
});

/** GET /api/admin/print-jobs?status=&q=&limit= */
router.get("/print-jobs", async (req, res) => {
  const data = await listAllPrintJobs({
    status: req.query.status,
    q: req.query.q,
    limit: req.query.limit,
  });
  return ok(res, data);
});

/** GET /api/admin/print-jobs/:id */
router.get("/print-jobs/:id", async (req, res) => {
  const job = await getPrintJobById(req.params.id);
  if (!job) {
    return fail(res, Object.assign(new Error("Print job not found"), { status: 404 }));
  }
  return ok(res, job);
});

/** PATCH /api/admin/print-jobs/:id  { status } */
router.patch("/print-jobs/:id", async (req, res) => {
  try {
    const status = String(req.body?.status || "").trim();
    if (!status) {
      return fail(res, new Error("status is required"));
    }
    return ok(res, await adminSetPrintJobStatus(req.params.id, status));
  } catch (err) {
    return fail(res, err);
  }
});

/** POST /api/admin/print-jobs/:id/cancel */
router.post("/print-jobs/:id/cancel", async (req, res) => {
  try {
    return ok(res, await adminCancelPrintJob(req.params.id));
  } catch (err) {
    return fail(res, err);
  }
});

/** GET /api/admin/festivals */
router.get("/festivals", async (req, res) => {
  const store = await getFestivalsStore();
  return ok(res, store);
});

/** PUT /api/admin/festivals/active  { id } */
router.put("/festivals/active", async (req, res) => {
  try {
    const id = String(req.body?.id || "").trim();
    const result = await setActiveFestivalId(id);
    return ok(res, result);
  } catch (err) {
    return fail(res, err);
  }
});

/** PUT /api/admin/festivals/:id — upsert theme fields */
router.put("/festivals/:id", async (req, res) => {
  try {
    const id = String(req.params.id || "").trim();
    const theme = await upsertFestivalTheme(id, req.body || {});
    return ok(res, theme);
  } catch (err) {
    return fail(res, err);
  }
});

/** PUT /api/admin/festivals — replace whole store (optional bulk) */
router.put("/festivals", async (req, res) => {
  const body = req.body || {};
  if (!body.themes || typeof body.themes !== "object") {
    return fail(res, new Error("themes object required"));
  }
  const current = await getFestivalsStore();
  const next = {
    activeId: body.activeId || current.activeId,
    themes: body.themes,
  };
  await saveFestivalsStore(next);
  return ok(res, next);
});

/** Banners CRUD */
router.get("/banners", async (req, res) => ok(res, await getBanners()));

router.post("/banners", async (req, res) => {
  try {
    return ok(res, await createBanner(req.body || {}));
  } catch (err) {
    return fail(res, err);
  }
});

router.patch("/banners/:id", async (req, res) => {
  try {
    return ok(res, await updateBanner(req.params.id, req.body || {}));
  } catch (err) {
    return fail(res, err);
  }
});

router.delete("/banners/:id", async (req, res) => {
  try {
    return ok(res, await deleteBanner(req.params.id));
  } catch (err) {
    return fail(res, err);
  }
});

/** Coupons CRUD */
router.get("/coupons", async (_req, res) => ok(res, await listCoupons()));

router.post("/coupons", async (req, res) => {
  try {
    return ok(res, await createCoupon(req.body || {}));
  } catch (err) {
    return fail(res, err);
  }
});

router.patch("/coupons/:code", async (req, res) => {
  try {
    return ok(res, await updateCoupon(req.params.code, req.body || {}));
  } catch (err) {
    return fail(res, err);
  }
});

router.delete("/coupons/:code", async (req, res) => {
  try {
    return ok(res, await deleteCoupon(req.params.code));
  } catch (err) {
    return fail(res, err);
  }
});

/** Products */
router.get("/products", async (req, res) => {
  const q = String(req.query.q || "")
    .trim()
    .toLowerCase();
  const categoryId = String(req.query.categoryId || "").trim();
  let list = await getAllProducts();
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

router.get("/products/:id", async (req, res) => {
  const product = await getProductById(req.params.id);
  if (!product) {
    return fail(res, Object.assign(new Error("Product not found"), { status: 404 }));
  }
  return ok(res, product);
});

router.post("/products", async (req, res) => {
  try {
    return ok(res, await createProductOverride(req.body || {}));
  } catch (err) {
    return fail(res, err);
  }
});

router.patch("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const result = await updateProductOverride(
      id,
      req.body || {},
      productExistsInBase(id)
    );
    return ok(res, (await getProductById(id)) || result);
  } catch (err) {
    return fail(res, err);
  }
});

router.delete("/products/:id", async (req, res) => {
  try {
    const id = req.params.id;
    return ok(
      res,
      await deleteProductOverride(id, productExistsInBase(id))
    );
  } catch (err) {
    return fail(res, err);
  }
});

router.get("/categories", (req, res) => ok(res, categories));

/** GET /api/admin/inventory?q=&status=&categoryId=&limit= */
router.get("/inventory", async (req, res) => {
  const q = String(req.query.q || "")
    .trim()
    .toLowerCase();
  const status = String(req.query.status || "").trim(); // out|low|ok|untracked|tracked|""
  const categoryId = String(req.query.categoryId || "").trim();
  const limit = Math.min(200, Math.max(1, Number(req.query.limit) || 80));

  let products = await getAllProducts();
  if (categoryId) {
    products = products.filter((p) => p.categoryId === categoryId);
  }
  if (q) {
    products = products.filter((p) => {
      const hay = `${p.name} ${p.brand || ""} ${p.id}`.toLowerCase();
      return hay.includes(q);
    });
  }

  const map = await listInventoryMap();
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

  const stats = await inventoryStats(products.map((p) => p.id));
  return ok(res, {
    items: rows.slice(0, limit),
    total: rows.length,
    stats,
    categories,
  });
});

/** PUT /api/admin/inventory/:id  { onHand, lowStockAt, tracked } */
router.put("/inventory/:id", async (req, res) => {
  try {
    const body = req.body || {};
    const record = await setInventory(req.params.id, {
      onHand: body.onHand,
      lowStockAt: body.lowStockAt,
      tracked: body.tracked !== false,
    });
    const product = await getProductById(req.params.id);
    return ok(res, { ...record, product });
  } catch (err) {
    return fail(res, err);
  }
});

/** POST /api/admin/inventory/:id/adjust  { delta, lowStockAt? } */
router.post("/inventory/:id/adjust", async (req, res) => {
  try {
    const delta = Number(req.body?.delta);
    const record = await adjustInventory(req.params.id, delta, {
      lowStockAt: req.body?.lowStockAt,
    });
    const product = await getProductById(req.params.id);
    return ok(res, { ...record, product });
  } catch (err) {
    return fail(res, err);
  }
});

export default router;
