const TOKEN_KEY = "blinkit_admin_token";

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || "";
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

async function parse(response) {
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error("Invalid JSON from API");
  }
  if (!response.ok || body.success === false) {
    throw new Error(body.message || `Request failed (${response.status})`);
  }
  return body.data;
}

export async function api(path, { method = "GET", body, auth = true } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const response = await fetch(path, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  });
  return parse(response);
}

export async function uploadFile(path, file, { auth = true } = {}) {
  const headers = {};
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const form = new FormData();
  form.append("file", file);
  const response = await fetch(path, {
    method: "POST",
    headers,
    body: form,
  });
  return parse(response);
}

export const adminApi = {
  login: (email, password) =>
    api("/api/admin/login", {
      method: "POST",
      body: { email, password },
      auth: false,
    }),
  stats: () => api("/api/admin/stats"),
  getFestivals: () => api("/api/admin/festivals"),
  setActiveFestival: (id) =>
    api("/api/admin/festivals/active", { method: "PUT", body: { id } }),
  updateFestival: (id, patch) =>
    api(`/api/admin/festivals/${id}`, { method: "PUT", body: patch }),
  getBanners: () => api("/api/admin/banners"),
  createBanner: (body) =>
    api("/api/admin/banners", { method: "POST", body }),
  updateBanner: (id, body) =>
    api(`/api/admin/banners/${id}`, { method: "PATCH", body }),
  deleteBanner: (id) =>
    api(`/api/admin/banners/${id}`, { method: "DELETE" }),
  getProducts: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return api(`/api/admin/products${q ? `?${q}` : ""}`);
  },
  createProduct: (body) =>
    api("/api/admin/products", { method: "POST", body }),
  updateProduct: (id, body) =>
    api(`/api/admin/products/${id}`, { method: "PATCH", body }),
  deleteProduct: (id) =>
    api(`/api/admin/products/${id}`, { method: "DELETE" }),
  getCategories: () => api("/api/admin/categories"),
  uploadImage: (file) => uploadFile("/api/admin/upload", file),
};
