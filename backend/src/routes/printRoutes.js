import { Router } from "express";
import {
  cancelPrintJob,
  createPrintJob,
  getPrintJobById,
  getPrintJobsByPhone,
  quotePrintJob,
} from "../data/printJobs.js";
import { requireShopper } from "../middleware/shopperAuth.js";

const router = Router();

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

// Job create / list / detail / cancel require a shopper session
router.use("/print/jobs", requireShopper);

// POST /api/print/jobs
router.post("/print/jobs", (req, res) => {
  try {
    const body = req.body || {};
    const job = createPrintJob({
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
router.get("/print/jobs", (req, res) => {
  const phone = req.shopper.phone;
  const list = getPrintJobsByPhone(phone);
  res.json({
    success: true,
    data: { phone, count: list.length, jobs: list },
  });
});

// GET /api/print/jobs/:id — owner only
router.get("/print/jobs/:id", (req, res) => {
  try {
    const job = getPrintJobById(req.params.id);
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
router.post("/print/jobs/:id/cancel", (req, res) => {
  try {
    const job = cancelPrintJob({
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
