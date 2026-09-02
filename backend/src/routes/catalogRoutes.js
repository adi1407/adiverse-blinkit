import { Router } from "express";
import {
  categories,
  deliveryInfo,
  featuredRows,
  getCategoryById,
  getProductsByCategoryId,
  searchProducts,
} from "../data/catalog.js";

const router = Router();

// GET /api/home — everything the Home screen needs
router.get("/home", (req, res) => {
  res.json({
    success: true,
    data: {
      deliveryInfo,
      categories,
      featuredRows,
    },
  });
});

// GET /api/categories
router.get("/categories", (req, res) => {
  res.json({
    success: true,
    data: categories,
  });
});

// GET /api/categories/:id
router.get("/categories/:id", (req, res) => {
  const category = getCategoryById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  res.json({
    success: true,
    data: category,
  });
});

// GET /api/categories/:id/products
router.get("/categories/:id/products", (req, res) => {
  const category = getCategoryById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  res.json({
    success: true,
    data: {
      category,
      products: getProductsByCategoryId(req.params.id),
    },
  });
});

// GET /api/search?q=milk
router.get("/search", (req, res) => {
  const q = String(req.query.q || "").trim();
  const products = searchProducts(q);

  res.json({
    success: true,
    data: {
      query: q,
      count: products.length,
      products,
    },
  });
});

export default router;
