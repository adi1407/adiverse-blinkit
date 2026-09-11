import fs from "fs";
import path from "path";
import { Router } from "express";
import multer from "multer";
import {
  cancelPrintJob,
  createPrintJob,
  getPrintJobById,
  getPrintJobsByPhone,
  quotePrintJob,
} from "../data/printJobs.js";
import { requireShopper } from "../middleware/shopperAuth.js";
import { UPLOADS_DIR } from "./upload.js";

const router = Router();

const PRINT_UPLOADS_DIR = path.join(UPLOADS_DIR, "print");
if (!fs.existsSync(PRINT_UPLOADS_DIR)) {
  fs.mkdirSync(PRINT_UPLOADS_DIR, { recursive: true });
}

const PRINT_MIME = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/heic",
  "image/heif",
]);

const PRINT_EXT = new Set([
  ".pdf",
  ".doc",
  ".docx",
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
  ".heic",
  ".heif",
]);

const printStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, PRINT_UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const safeExt = PRINT_EXT.has(ext) ? ext : ".bin";
    const name = `print-${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}${safeExt}`;
    cb(null, name);
  },
});

const printUpload = multer({
  storage: printStorage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: (_req, file, cb) => {
    const ext = path.extname(file.originalname || "").toLowerCase();
    const mimeOk = PRINT_MIME.has(String(file.mimetype || "").toLowerCase());
    const extOk = PRINT_EXT.has(ext);
    if (!mimeOk && !extOk) {
      cb(new Error("Only PDF, DOC/DOCX, or images are allowed"));
      return;
    }
    cb(null, true);
  },
});

function assertOwnsJob(job, phone) {
  if (!job) {
    const err = new Error("Print job not found");
    err.status = 404;
    throw err;
  }
  const owner = String(job.phone || "").replace(/\D/g, "");
  if (owner !== phone) {
    const err = new Error("Print job not found");
    err.status = 404;
    throw err;
  }
}

// POST /api/print/quote — price preview stays public
router.post("/print/quote", (req, res) => {
  try {
    const quote = quotePrintJob(req.body || {});
    res.json({ success: true, data: quote });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Could not quote print job",
    });
  }
});

// POST /api/print/upload — shopper multipart file → /uploads/print/...
router.post(
  "/print/upload",
  requireShopper,
  (req, res, next) => {
    printUpload.single("file")(req, res, (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: err.message || "Upload failed",
        });
      }
      return next();
    });
  },
  (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file provided (field name: file)",
      });
    }
    const url = `/uploads/print/${req.file.filename}`;
    return res.json({
      success: true,
      data: {
        url,
        filename: req.file.filename,
        name: req.file.originalname || req.file.filename,
        size: req.file.size,
        mimeType: req.file.mimetype,
      },
    });
  }
);

router.use("/print/jobs", requireShopper);

// POST /api/print/jobs
router.post("/print/jobs", async (req, res) => {
  try {
    const body = req.body || {};
    const job = await createPrintJob({
      ...body,
      name: req.shopper.name,
      phone: req.shopper.phone,
    });
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Could not create print job",
    });
  }
});

// GET /api/print/jobs
router.get("/print/jobs", async (req, res) => {
  const phone = req.shopper.phone;
  const list = await getPrintJobsByPhone(phone);
  res.json({
    success: true,
    data: { phone, count: list.length, jobs: list },
  });
});

// GET /api/print/jobs/:id
router.get("/print/jobs/:id", async (req, res) => {
  try {
    const job = await getPrintJobById(req.params.id);
    assertOwnsJob(job, req.shopper.phone);
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Could not load print job",
    });
  }
});

// POST /api/print/jobs/:id/cancel
router.post("/print/jobs/:id/cancel", async (req, res) => {
  try {
    const job = await cancelPrintJob({
      jobId: req.params.id,
      phone: req.shopper.phone,
    });
    res.json({ success: true, data: job });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Could not cancel print job",
    });
  }
});

export default router;
