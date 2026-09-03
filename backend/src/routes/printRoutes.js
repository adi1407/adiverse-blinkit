import { Router } from "express";
import {
  cancelPrintJob,
  createPrintJob,
  getPrintJobById,
  getPrintJobsByPhone,
  quotePrintJob,
} from "../data/printJobs.js";

const router = Router();

// POST /api/print/quote — price preview (no auth)
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

// POST /api/print/jobs
router.post("/print/jobs", (req, res) => {
  try {
    const job = createPrintJob(req.body || {});
    res.status(201).json({ success: true, data: job });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Could not create print job",
    });
  }
});

// GET /api/print/jobs?phone=
router.get("/print/jobs", (req, res) => {
  const phone = String(req.query.phone || "").replace(/\D/g, "");
  if (phone.length !== 10) {
    return res.status(400).json({
      success: false,
      message: "Query phone (10 digits) is required",
    });
  }

  const list = getPrintJobsByPhone(phone);
  res.json({
    success: true,
    data: { phone, count: list.length, jobs: list },
  });
});

// GET /api/print/jobs/:id
router.get("/print/jobs/:id", (req, res) => {
  const job = getPrintJobById(req.params.id);
  if (!job) {
    return res.status(404).json({
      success: false,
      message: "Print job not found",
    });
  }
  res.json({ success: true, data: job });
});

// POST /api/print/jobs/:id/cancel
router.post("/print/jobs/:id/cancel", (req, res) => {
  try {
    const job = cancelPrintJob({
      jobId: req.params.id,
      phone: req.body?.phone,
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
