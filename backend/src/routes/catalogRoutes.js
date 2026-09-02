import { Router } from "express";
import {
  categories,
  catalogStats,
  deliveryInfo,
  featuredRows,
  filterCategoryProducts,
  getCategoryById,
  getProductById,
  getSimilarProducts,
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
      stats: catalogStats,
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

// GET /api/categories/:id/products?page=1&limit=40&q=lays&sort=price_asc
router.get("/categories/:id/products", (req, res) => {
  const category = getCategoryById(req.params.id);

  if (!category) {
    return res.status(404).json({
      success: false,
      message: "Category not found",
    });
  }

  const q = String(req.query.q || "").trim();
  const sort = String(req.query.sort || "relevance");
  const all = filterCategoryProducts(req.params.id, { q, sort });
  const page = Math.max(1, Number(req.query.page) || 1);
  const limit = Math.min(60, Math.max(1, Number(req.query.limit) || 40));
  const start = (page - 1) * limit;
  const products = all.slice(start, start + limit);
  const total = all.length;
  const hasMore = start + products.length < total;

  res.json({
    success: true,
    data: {
      category,
      products,
      page,
      limit,
      total,
      hasMore,
      q,
      sort,
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

// GET /api/products/:id — PDP + similar picks
router.get("/products/:id", (req, res) => {
  const product = getProductById(req.params.id);

  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found",
    });
  }

  const category = getCategoryById(product.categoryId);
  const similar = getSimilarProducts(product.id, 12);

  res.json({
    success: true,
    data: {
      product,
      category: category || null,
      similar,
    },
  });
});

export default router;
