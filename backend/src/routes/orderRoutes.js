import { Router } from "express";
import {
  createOrder,
  getOrderById,
  getOrdersByPhone,
  getReorderProducts,
} from "../data/orders.js";

const router = Router();

// POST /api/orders — place an order
router.post("/orders", (req, res) => {
  try {
    const { name, phone, items, address } = req.body || {};
    const order = createOrder({ name, phone, items, address });
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Could not place order",
    });
  }
});

// GET /api/orders?phone=9876543210
router.get("/orders", (req, res) => {
  const phone = String(req.query.phone || "").replace(/\D/g, "");

  if (phone.length !== 10) {
    return res.status(400).json({
      success: false,
      message: "Query phone (10 digits) is required",
    });
  }

  const list = getOrdersByPhone(phone);
  res.json({
    success: true,
    data: {
      phone,
      count: list.length,
      orders: list,
    },
  });
});

// GET /api/orders/reorder?phone=...
router.get("/orders/reorder", (req, res) => {
  const phone = String(req.query.phone || "").replace(/\D/g, "");

  if (phone.length !== 10) {
    return res.status(400).json({
      success: false,
      message: "Query phone (10 digits) is required",
    });
  }

  const products = getReorderProducts(phone);
  res.json({
    success: true,
    data: {
      phone,
      count: products.length,
      products,
    },
  });
});

// GET /api/orders/:id
router.get("/orders/:id", (req, res) => {
  const order = getOrderById(req.params.id);
  if (!order) {
    return res.status(404).json({
      success: false,
      message: "Order not found",
    });
  }
  res.json({ success: true, data: order });
});

export default router;
