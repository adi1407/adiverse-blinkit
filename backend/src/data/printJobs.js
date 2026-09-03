// Print jobs store (JSON file) — metadata only; files stay on the phone.

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORE_PATH = path.join(__dirname, "print.store.json");

const DOC_RATE = { bw: 3, color: 8 };
const PHOTO_RATE = { "4x6": 12, polaroid: 25 };
const DELIVERY_FEE = 15;

function loadJobs() {
  try {
    if (!fs.existsSync(STORE_PATH)) return [];
    const parsed = JSON.parse(fs.readFileSync(STORE_PATH, "utf8"));
    return Array.isArray(parsed.jobs) ? parsed.jobs : [];
  } catch {
    return [];
  }
}

function saveJobs(list) {
  const tmp = `${STORE_PATH}.tmp`;
  fs.writeFileSync(
    tmp,
    JSON.stringify({ updatedAt: new Date().toISOString(), jobs: list }, null, 2),
    "utf8"
  );
  fs.renameSync(tmp, STORE_PATH);
}

let jobs = loadJobs();

function makeId() {
  return `print_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
}

function statusForAge(ageSec) {
  if (ageSec >= 70) return "delivered";
  if (ageSec >= 35) return "out_for_delivery";
  if (ageSec >= 15) return "printing";
  return "confirmed";
}

function withStatus(job) {
  const ageSec = Math.max(
    0,
    Math.floor((Date.now() - new Date(job.createdAt).getTime()) / 1000)
  );
  if (job.status === "cancelled") {
    return { ...job, status: "cancelled", ageSec, canCancel: false };
  }
  const status = statusForAge(ageSec);
  return {
    ...job,
    status,
    ageSec,
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

export function createPrintJob({
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
  const list = Array.isArray(files) ? files : [];

  if (cleanPhone.length !== 10) {
    const err = new Error("Valid 10-digit phone is required");
    err.status = 400;
    throw err;
  }

  if (list.length === 0) {
    const err = new Error("Add at least one file to print");
    err.status = 400;
    throw err;
  }

  if (kind !== "document" && kind !== "photo") {
    const err = new Error("kind must be document or photo");
    err.status = 400;
    throw err;
  }

  const quote = quotePrintJob({ kind, files: list, color, copies, photoSize, pages });

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
    photoSize: kind === "photo" ? (photoSize === "polaroid" ? "polaroid" : "4x6") : null,
    pages: kind === "document" ? Math.max(1, Math.min(50, Number(pages) || list.length || 1)) : null,
    copies: quote.copies,
    files: list.map((file) => ({
      name: String(file.name || "file").slice(0, 120),
      size: Number(file.size) || 0,
      mimeType: String(file.mimeType || ""),
    })),
    ...quote,
    status: "confirmed",
    createdAt: now,
  };

  jobs = [job, ...jobs];
  saveJobs(jobs);
  return withStatus(job);
}

export function getPrintJobsByPhone(phone) {
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  return jobs.filter((job) => job.phone === cleanPhone).map(withStatus);
}

export function getPrintJobById(id) {
  const job = jobs.find((j) => j.id === id);
  return job ? withStatus(job) : null;
}

export function cancelPrintJob({ jobId, phone }) {
  const cleanPhone = String(phone || "").replace(/\D/g, "");
  const index = jobs.findIndex((j) => j.id === jobId);

  if (index < 0) {
    const err = new Error("Print job not found");
    err.status = 404;
    throw err;
  }

  const existing = jobs[index];
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

  const cancelled = {
    ...existing,
    status: "cancelled",
    cancelledAt: new Date().toISOString(),
  };
  jobs[index] = cancelled;
  saveJobs(jobs);
  return withStatus(cancelled);
}
