/**
 * Print jobs store — files live under /uploads/print/; status is ops-owned.
 * Shopper cancel is only allowed while status is still `confirmed`.
 * Postgres-backed (JSONB payload + indexed columns).
 */

import { query } from "../db/pool.js";

const DOC_RATE = { bw: 3, color: 8 };
const PHOTO_RATE = { "4x6": 12, polaroid: 25 };
const DELIVERY_FEE = 15;

export const PRINT_STATUSES = [
  "confirmed",
  "printing",
  "out_for_delivery",
  "delivered",
  "cancelled",
];

async function loadAllJobs() {
  const res = await query(
    "SELECT payload FROM print_jobs ORDER BY created_at DESC"
  );
  return res.rows.map((row) => row.payload);
}

async function saveJob(job) {
  const createdAt = job.createdAt || new Date().toISOString();
  await query(
    `INSERT INTO print_jobs (id, phone, status, kind, grand_total, created_at, updated_at, payload)
     VALUES ($1, $2, $3, $4, $5, $6::timestamptz, NOW(), $7::jsonb)
     ON CONFLICT (id) DO UPDATE SET
       phone = EXCLUDED.phone,
       status = EXCLUDED.status,
       kind = EXCLUDED.kind,
       grand_total = EXCLUDED.grand_total,
       updated_at = NOW(),
       payload = EXCLUDED.payload`,
    [
      job.id,
      job.phone,
      job.status,
      job.kind ?? null,
      job.grandTotal ?? null,
      createdAt,
      JSON.stringify(job),
    ]
  );
  return job;
}

async function findJob(id) {
  const res = await query("SELECT payload FROM print_jobs WHERE id = $1", [id]);
  return res.rows[0]?.payload ?? null;
}

function makeId() {
  return `print_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function normalizeFile(file) {
  const url = String(file?.url || "").trim();
  if (!url.startsWith("/uploads/print/")) {
    const err = new Error(
      "Each file must be uploaded first (missing /uploads/print/ url)"
    );
    err.status = 400;
    throw err;
  }
  return {
    name: String(file.name || "file").slice(0, 120),
    size: Number(file.size) || 0,
    mimeType: String(file.mimeType || ""),
    url,
  };
}

function withStatus(job) {
  const status = PRINT_STATUSES.includes(job.status) ? job.status : "confirmed";
  return {
    ...job,
    status,
    canCancel: status === "confirmed",
  };
}

export function quotePrintJob({ kind, files, color, copies, photoSize, pages }) {
  const list = Array.isArray(files) ? files : [];
  const copyCount = Math.max(1, Math.min(20, Number(copies) || 1));
  const isPhoto = kind === "photo";

  let units;
  let unitPrice;
  let unitLabel;

  if (isPhoto) {
    const size = photoSize === "polaroid" ? "polaroid" : "4x6";
    units = Math.max(1, list.length) * copyCount;
    unitPrice = PHOTO_RATE[size];
    unitLabel = size === "polaroid" ? "Polaroid print" : "4×6 photo";
  } else {
    const pageCount = Math.max(1, Math.min(50, Number(pages) || list.length || 1));
    units = pageCount * copyCount;
    const mode = color ? "color" : "bw";
    unitPrice = DOC_RATE[mode];
    unitLabel = color ? "color page" : "B&W page";
  }

  const printTotal = units * unitPrice;
  const deliveryFee = printTotal >= 99 ? 0 : DELIVERY_FEE;
  const grandTotal = printTotal + deliveryFee;

  return {
    units,
    unitPrice,
    unitLabel,
    printTotal,
    deliveryFee,
    grandTotal,
    copies: copyCount,
  };
}

export async function createPrintJob({
  name,
  phone,
  address,
  kind,
  files,
  color,
  copies,
  photoSize,
  pages,
}) {
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  const cleanName = String(name || "").trim() || "Blinkit User";
  const rawFiles = Array.isArray(files) ? files : [];

  if (cleanPhone.length !== 10) {
    const err = new Error("Valid 10-digit phone is required");
    err.status = 400;
    throw err;
  }

  if (rawFiles.length === 0) {
    const err = new Error("Add at least one file to print");
    err.status = 400;
    throw err;
  }

  if (kind !== "document" && kind !== "photo") {
    const err = new Error("kind must be document or photo");
    err.status = 400;
    throw err;
  }

  const list = rawFiles.map(normalizeFile);
  const quote = quotePrintJob({
    kind,
    files: list,
    color,
    copies,
    photoSize,
    pages,
  });

  const deliveryAddress = address
    ? {
        label: String(address.label || "Home").trim() || "Home",
        line1: String(address.line1 || "").trim(),
        line2: String(address.line2 || "").trim(),
      }
    : null;

  if (!deliveryAddress?.line1) {
    const err = new Error("Delivery address is required");
    err.status = 400;
    throw err;
  }

  const now = new Date().toISOString();
  const job = {
    id: makeId(),
    name: cleanName,
    phone: cleanPhone,
    address: deliveryAddress,
    kind,
    color: Boolean(color),
    photoSize:
      kind === "photo" ? (photoSize === "polaroid" ? "polaroid" : "4x6") : null,
    pages:
      kind === "document"
        ? Math.max(1, Math.min(50, Number(pages) || list.length || 1))
        : null,
    copies: quote.copies,
    files: list,
    ...quote,
    status: "confirmed",
    statusLocked: true,
    createdAt: now,
    statusUpdatedAt: now,
  };

  await saveJob(job);
  return withStatus(job);
}

export async function getPrintJobsByPhone(phone) {
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  const res = await query(
    "SELECT payload FROM print_jobs WHERE phone = $1 ORDER BY created_at DESC",
    [cleanPhone]
  );
  return res.rows.map((row) => withStatus(row.payload));
}

export async function getPrintJobById(id) {
  const job = await findJob(id);
  return job ? withStatus(job) : null;
}

export async function cancelPrintJob({ jobId, phone }) {
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  const existing = await findJob(jobId);

  if (!existing) {
    const err = new Error("Print job not found");
    err.status = 404;
    throw err;
  }

  if (existing.phone !== cleanPhone) {
    const err = new Error("Print job does not belong to this phone");
    err.status = 403;
    throw err;
  }

  const live = withStatus(existing);
  if (!live.canCancel) {
    const err = new Error("Too late to cancel — printing has started");
    err.status = 400;
    throw err;
  }

  const now = new Date().toISOString();
  const cancelled = {
    ...existing,
    status: "cancelled",
    statusLocked: true,
    cancelledAt: now,
    statusUpdatedAt: now,
  };
  await saveJob(cancelled);
  return withStatus(cancelled);
}

export async function listAllPrintJobs({ status = "", q = "", limit = 80 } = {}) {
  const needle = String(q || "").trim().toLowerCase();
  const want = String(status || "").trim();

  const jobs = await loadAllJobs();
  let list = jobs.map(withStatus);

  if (want && PRINT_STATUSES.includes(want)) {
    list = list.filter((job) => job.status === want);
  }

  if (needle) {
    list = list.filter((job) => {
      const hay = `${job.id} ${job.phone} ${job.name} ${job.kind}`.toLowerCase();
      return hay.includes(needle);
    });
  }

  list.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));

  const capped = Math.min(200, Math.max(1, Number(limit) || 80));
  return {
    items: list.slice(0, capped),
    total: list.length,
  };
}

export async function adminSetPrintJobStatus(jobId, status) {
  const nextStatus = String(status || "").trim();
  if (!PRINT_STATUSES.includes(nextStatus)) {
    const err = new Error(`Invalid status. Use: ${PRINT_STATUSES.join(", ")}`);
    err.status = 400;
    throw err;
  }

  const existing = await findJob(jobId);
  if (!existing) {
    const err = new Error("Print job not found");
    err.status = 404;
    throw err;
  }

  const now = new Date().toISOString();
  const patched = {
    ...existing,
    status: nextStatus,
    statusLocked: true,
    statusUpdatedAt: now,
  };
  if (nextStatus === "cancelled") {
    patched.cancelledAt = now;
  }

  await saveJob(patched);
  return withStatus(patched);
}

export async function adminCancelPrintJob(jobId) {
  return adminSetPrintJobStatus(jobId, "cancelled");
}
