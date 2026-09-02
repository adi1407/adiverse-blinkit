import { apiGet } from "./client";

export function fetchHomeData() {
  return apiGet("/api/home");
}

export function fetchCategories() {
  return apiGet("/api/categories");
}

export function fetchCategoryProducts(
  categoryId,
  { page = 1, limit = 40, q = "", sort = "relevance" } = {}
) {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
    sort: String(sort || "relevance"),
  });
  if (q) params.set("q", q);
  return apiGet(`/api/categories/${categoryId}/products?${params.toString()}`);
}

export function fetchSearch(query) {
  const q = encodeURIComponent(String(query || "").trim());
  return apiGet(`/api/search?q=${q}`);
}

export function fetchProduct(productId) {
  return apiGet(`/api/products/${encodeURIComponent(productId)}`);
}
