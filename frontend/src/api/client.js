import { API_BASE_URL } from "../config/api";

export async function apiGet(path) {
  const response = await fetch(`${API_BASE_URL}${path}`);

  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error("Server returned invalid JSON");
  }

  if (!response.ok || body.success === false) {
    throw new Error(body.message || `Request failed (${response.status})`);
  }

  return body.data;
}
