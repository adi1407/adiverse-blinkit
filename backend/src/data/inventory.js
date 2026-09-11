/**
 * Inventory ops layer — Postgres-backed.
 */
import { query, withTransaction } from "../db/pool.js";

function normalizeRecord(raw = {}) {
  const onHand = Math.max(0, Math.floor(Number(raw.onHand ?? raw.on_hand) || 0));
  const lowStockAt = Math.max(
    0,
    Math.floor(Number(raw.lowStockAt ?? raw.low_stock_at) || 5)
  );
  return {
    tracked: raw.tracked !== false,
    onHand,
    lowStockAt,
    updatedAt:
      raw.updatedAt ||
      raw.updated_at ||
      new Date().toISOString(),
  };
}

function rowToRecord(row) {
  if (!row) return null;
  const record = normalizeRecord(row);
  return {
    productId: row.product_id,
    ...record,
    status: stockStatusFor(record),
  };
}

export function stockStatusFor(record) {
  if (!record || record.tracked === false) return "untracked";
  if (record.onHand <= 0) return "out";
  if (record.onHand <= record.lowStockAt) return "low";
  return "ok";
}

function applyFromMap(product, map) {
  if (!product?.id) return product;
  const row = map[product.id];
  if (!row || row.tracked === false) {
    return {
      ...product,
      stockTracked: false,
      stockQty: null,
      stockStatus: "untracked",
      inStock: product.inStock !== false,
    };
  }
  return {
    ...product,
    stockTracked: true,
    stockQty: row.onHand,
    lowStockAt: row.lowStockAt,
    stockStatus: row.status,
    inStock: row.status !== "out",
    outOfStock: row.status === "out",
  };
}

export async function listInventoryMap() {
  const res = await query("SELECT * FROM inventory");
  const map = {};
  for (const row of res.rows) {
    const record = rowToRecord(row);
    map[record.productId] = record;
  }
  return map;
}

export async function applyInventoryToProduct(product) {
  if (!product?.id) return product;
  const res = await query(
    "SELECT * FROM inventory WHERE product_id = $1",
    [product.id]
  );
  const map = {};
  if (res.rows[0]) {
    const record = rowToRecord(res.rows[0]);
    map[record.productId] = record;
  }
  return applyFromMap(product, map);
}

export async function applyInventoryToList(list) {
  const map = await listInventoryMap();
  return (list || []).map((p) => applyFromMap(p, map));
}

export async function getInventoryRecord(productId) {
  const res = await query(
    "SELECT * FROM inventory WHERE product_id = $1",
    [productId]
  );
  return rowToRecord(res.rows[0]);
}

export async function setInventory(
  productId,
  { onHand, lowStockAt, tracked = true } = {}
) {
  const id = String(productId || "").trim();
  if (!id) {
    const err = new Error("productId required");
    err.status = 400;
    throw err;
  }

  if (tracked === false) {
    await query("DELETE FROM inventory WHERE product_id = $1", [id]);
    return {
      productId: id,
      tracked: false,
      onHand: null,
      lowStockAt: null,
      status: "untracked",
    };
  }

  const prev = await getInventoryRecord(id);
  const next = normalizeRecord({
    tracked: true,
    onHand: onHand != null ? onHand : prev?.onHand ?? 0,
    lowStockAt: lowStockAt != null ? lowStockAt : prev?.lowStockAt ?? 5,
  });

  await query(
    `INSERT INTO inventory (product_id, tracked, on_hand, low_stock_at, updated_at)
     VALUES ($1, TRUE, $2, $3, NOW())
     ON CONFLICT (product_id) DO UPDATE SET
       tracked = TRUE,
       on_hand = EXCLUDED.on_hand,
       low_stock_at = EXCLUDED.low_stock_at,
       updated_at = NOW()`,
    [id, next.onHand, next.lowStockAt]
  );
  return getInventoryRecord(id);
}

export async function adjustInventory(productId, delta, { lowStockAt } = {}) {
  const id = String(productId || "").trim();
  const change = Math.trunc(Number(delta));
  if (!id || !Number.isFinite(change) || change === 0) {
    const err = new Error("productId and non-zero delta required");
    err.status = 400;
    throw err;
  }

  const prev =
    (await getInventoryRecord(id)) ||
    normalizeRecord({ tracked: true, onHand: 0, lowStockAt: 5 });

  return setInventory(id, {
    tracked: true,
    onHand: Math.max(0, (prev.onHand || 0) + change),
    lowStockAt: lowStockAt != null ? lowStockAt : prev.lowStockAt,
  });
}

export async function consumeStockForOrder(items) {
  const lines = Array.isArray(items) ? items : [];

  await withTransaction(async (client) => {
    for (const line of lines) {
      const id = line.id;
      const qty = Math.max(1, Number(line.qty) || 1);
      const res = await client.query(
        "SELECT * FROM inventory WHERE product_id = $1 FOR UPDATE",
        [id]
      );
      const row = res.rows[0];
      if (!row || row.tracked === false) continue;
      const record = normalizeRecord(row);
      if (record.onHand < qty) {
        const err = new Error(
          record.onHand <= 0
            ? `${line.name || "Item"} is out of stock`
            : `Only ${record.onHand} left for ${line.name || "item"}`
        );
        err.status = 409;
        throw err;
      }
    }

    for (const line of lines) {
      const id = line.id;
      const qty = Math.max(1, Number(line.qty) || 1);
      const res = await client.query(
        "SELECT * FROM inventory WHERE product_id = $1 FOR UPDATE",
        [id]
      );
      const row = res.rows[0];
      if (!row || row.tracked === false) continue;
      const record = normalizeRecord(row);
      await client.query(
        `UPDATE inventory SET on_hand = $2, updated_at = NOW() WHERE product_id = $1`,
        [id, Math.max(0, record.onHand - qty)]
      );
    }
  });
}

export async function restockForOrder(items) {
  const lines = Array.isArray(items) ? items : [];
  await withTransaction(async (client) => {
    for (const line of lines) {
      const id = line.id;
      const qty = Math.max(1, Number(line.qty) || 1);
      const res = await client.query(
        "SELECT * FROM inventory WHERE product_id = $1 FOR UPDATE",
        [id]
      );
      const row = res.rows[0];
      if (!row || row.tracked === false) continue;
      const record = normalizeRecord(row);
      await client.query(
        `UPDATE inventory SET on_hand = $2, updated_at = NOW() WHERE product_id = $1`,
        [id, record.onHand + qty]
      );
    }
  });
}

export async function inventoryStats(productIds = []) {
  const map = await listInventoryMap();
  let tracked = 0;
  let out = 0;
  let low = 0;
  let ok = 0;
  for (const id of productIds) {
    const row = map[id];
    if (!row || !row.tracked) continue;
    tracked += 1;
    if (row.status === "out") out += 1;
    else if (row.status === "low") low += 1;
    else ok += 1;
  }
  return {
    tracked,
    out,
    low,
    ok,
    untracked: Math.max(0, productIds.length - tracked),
  };
}
