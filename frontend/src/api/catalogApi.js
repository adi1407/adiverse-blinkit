import { apiGet } from "./client";

export function fetchHomeData() {
  return apiGet("/api/home");
}

export function fetchCategories() {
  return apiGet("/api/categories");
}

export function fetchCategoryProducts(categoryId) {
  return apiGet(`/api/categories/${categoryId}/products`);
}
