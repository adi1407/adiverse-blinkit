import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { query } from "./pool.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SCHEMA_PATH = path.join(__dirname, "schema.sql");
const DATA_DIR = path.join(__dirname, "../data");
const STORE_DIR = path.join(DATA_DIR, "store");

function readJsonFile(filePath, fallback) {
  try {
    if (!fs.existsSync(filePath)) return fallback;
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {
    return fallback;
  }
}

async function applied(id) {
  const res = await query(
    "SELECT 1 FROM schema_migrations WHERE id = $1",
    [id]
  );
  return res.rowCount > 0;
}

async function mark(id) {
  await query(
    "INSERT INTO schema_migrations (id) VALUES ($1) ON CONFLICT DO NOTHING",
    [id]
  );
}

async function seedIfEmpty() {
  const ordersCount = (await query("SELECT COUNT(*)::int AS n FROM orders"))
    .rows[0].n;
  const couponsCount = (await query("SELECT COUNT(*)::int AS n FROM coupons"))
    .rows[0].n;
  const bannersCount = (await query("SELECT COUNT(*)::int AS n FROM banners"))
    .rows[0].n;
  const invCount = (await query("SELECT COUNT(*)::int AS n FROM inventory"))
    .rows[0].n;
  const printCount = (await query("SELECT COUNT(*)::int AS n FROM print_jobs"))
    .rows[0].n;
  const docsCount = (
    await query("SELECT COUNT(*)::int AS n FROM app_documents")
  ).rows[0].n;

  if (couponsCount === 0) {
    const store = readJsonFile(path.join(STORE_DIR, "coupons.json"), {
      coupons: [],
    });
    for (const c of store.coupons || []) {
      await query(
        `INSERT INTO coupons (code, title, description, type, value, max_discount, min_order, active)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (code) DO NOTHING`,
        [
          c.code,
          c.title || c.code,
          c.description || "",
          c.type,
          c.value ?? null,
          c.maxDiscount ?? null,
          c.minOrder ?? 0,
          c.active !== false,
        ]
      );
    }
    console.log(`[db] seeded coupons: ${(store.coupons || []).length}`);
  }

  if (bannersCount === 0) {
    const store = readJsonFile(path.join(STORE_DIR, "banners.json"), {
      banners: [],
    });
    let i = 0;
    for (const b of store.banners || []) {
      await query(
        `INSERT INTO banners (id, title, subtitle, cta, image, accent, hub, sort_order)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)
         ON CONFLICT (id) DO NOTHING`,
        [
          b.id,
          b.title || "Banner",
          b.subtitle || "",
          b.cta || "Shop now",
          b.image || "",
          b.accent || "#F8CB46",
          b.hub || "all",
          i++,
        ]
      );
    }
    console.log(`[db] seeded banners: ${(store.banners || []).length}`);
  }

  if (invCount === 0) {
    const store = readJsonFile(path.join(STORE_DIR, "inventory.json"), {
      items: {},
    });
    const entries = Object.entries(store.items || {});
    for (const [productId, raw] of entries) {
      await query(
        `INSERT INTO inventory (product_id, tracked, on_hand, low_stock_at, updated_at)
         VALUES ($1,$2,$3,$4,COALESCE($5::timestamptz, NOW()))
         ON CONFLICT (product_id) DO NOTHING`,
        [
          productId,
          raw.tracked !== false,
          Math.max(0, Math.floor(Number(raw.onHand) || 0)),
          Math.max(0, Math.floor(Number(raw.lowStockAt) || 5)),
          raw.updatedAt || null,
        ]
      );
    }
    console.log(`[db] seeded inventory rows: ${entries.length}`);
  }

  if (docsCount === 0 || !(await query(
    "SELECT 1 FROM app_documents WHERE key = 'festivals'"
  )).rowCount) {
    const festivals = readJsonFile(path.join(STORE_DIR, "festivals.json"), {
      activeId: "default",
      themes: {},
    });
    await query(
      `INSERT INTO app_documents (key, payload)
       VALUES ('festivals', $1::jsonb)
       ON CONFLICT (key) DO NOTHING`,
      [JSON.stringify(festivals)]
    );
    console.log("[db] seeded festivals document");
  }

  if (!(await query(
    "SELECT 1 FROM app_documents WHERE key = 'product_overrides'"
  )).rowCount) {
    const overrides = readJsonFile(
      path.join(STORE_DIR, "products-overrides.json"),
      { created: [], updated: {}, deleted: [] }
    );
    await query(
      `INSERT INTO app_documents (key, payload)
       VALUES ('product_overrides', $1::jsonb)
       ON CONFLICT (key) DO NOTHING`,
      [JSON.stringify(overrides)]
    );
    console.log("[db] seeded product_overrides document");
  }

  if (ordersCount === 0) {
    const store = readJsonFile(path.join(DATA_DIR, "orders.store.json"), {
      orders: [],
    });
    for (const order of store.orders || []) {
      await query(
        `INSERT INTO orders (id, phone, status, payment_status, grand_total, created_at, updated_at, payload)
         VALUES ($1,$2,$3,$4,$5,COALESCE($6::timestamptz, NOW()), NOW(), $7::jsonb)
         ON CONFLICT (id) DO NOTHING`,
        [
          order.id,
          order.phone,
          order.status || "confirmed",
          order.paymentStatus || null,
          order.grandTotal ?? null,
          order.createdAt || null,
          JSON.stringify(order),
        ]
      );
    }
    console.log(`[db] seeded orders: ${(store.orders || []).length}`);
  }

  if (printCount === 0) {
    const store = readJsonFile(path.join(DATA_DIR, "print.store.json"), {
      jobs: [],
    });
    for (const job of store.jobs || []) {
      await query(
        `INSERT INTO print_jobs (id, phone, status, kind, grand_total, created_at, updated_at, payload)
         VALUES ($1,$2,$3,$4,$5,COALESCE($6::timestamptz, NOW()), NOW(), $7::jsonb)
         ON CONFLICT (id) DO NOTHING`,
        [
          job.id,
          job.phone,
          job.status || "confirmed",
          job.kind || null,
          job.grandTotal ?? null,
          job.createdAt || null,
          JSON.stringify(job),
        ]
      );
    }
    console.log(`[db] seeded print jobs: ${(store.jobs || []).length}`);
  }
}

export async function migrate() {
  const sql = fs.readFileSync(SCHEMA_PATH, "utf8");
  await query(sql);

  if (!(await applied("seed_v1"))) {
    await seedIfEmpty();
    await mark("seed_v1");
  }

  // Always allow empty-table catch-up from JSON for fresh volumes
  await seedIfEmpty();
}
