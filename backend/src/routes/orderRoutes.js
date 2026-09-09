import { Router } from "express";
import {
  cancelOrder,
  createOrder,
  getOrderById,
  getOrdersByPhone,
  getReorderProducts,
  rateOrder,
} from "../data/orders.js";
import { requireShopper } from "../middleware/shopperAuth.js";

const router = Router();

function assertOwnsOrder(order, phone) {
  if (!order) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }
  const owner = String(order.phone || "").replace(/\D/g, "");
  if (owner !== phone) {
    const err = new Error("Order not found");
    err.status = 404;
    throw err;
  }
}

// All order endpoints require a shopper session. Phone comes from the token,
// never from the request body/query — that was an IDOR waiting to happen.
router.use("/orders", requireShopper);

// POST /api/orders — place an order
router.post("/orders", (req, res) => {
  try {
    const { items, address, couponCode, paymentMethod, tipAmount } =
      req.body || {};
    const order = createOrder({
      name: req.shopper.name,
      phone: req.shopper.phone,
      items,
      address,
      couponCode,
      paymentMethod,
      tipAmount,
    });
    res.status(201).json({ success: true, data: order });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Could not place order",
    });
  }
});

// POST /api/orders/:id/cancel
router.post("/orders/:id/cancel", (req, res) => {
  try {
    const order = cancelOrder({
      orderId: req.params.id,
      phone: req.shopper.phone,
    });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Could not cancel order",
    });
  }
});

// POST /api/orders/:id/rate
router.post("/orders/:id/rate", (req, res) => {
  try {
    const { stars, review } = req.body || {};
    const order = rateOrder({
      orderId: req.params.id,
      phone: req.shopper.phone,
      stars,
      review,
    });
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Could not save rating",
    });
  }
});

// GET /api/orders
router.get("/orders", (req, res) => {
  const phone = req.shopper.phone;
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

// GET /api/orders/reorder
router.get("/orders/reorder", (req, res) => {
  const phone = req.shopper.phone;
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

// GET /api/orders/:id — owner only (404 for others to avoid leaking existence)
router.get("/orders/:id", (req, res) => {
  try {
    const order = getOrderById(req.params.id);
    assertOwnsOrder(order, req.shopper.phone);
    res.json({ success: true, data: order });
  } catch (err) {
    res.status(err.status || 500).json({
      success: false,
      message: err.message || "Could not load order",
    });
  }
});

export default router;
