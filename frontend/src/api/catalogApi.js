import { apiGet } from "./client";

export function fetchHomeData() {
  return apiGet("/api/home");
}

export function fetchCategories() {
  return apiGet("/api/categories");
}

export function fetchCategoryProducts(categoryId, { page = 1, limit = 40 } = {}) {
  return apiGet(
    `/api/categories/${categoryId}/products?page=${page}&limit=${limit}`
  );
}

export function fetchSearch(query) {
  const q = encodeURIComponent(String(query || "").trim());
  return apiGet(`/api/search?q=${q}`);
}
