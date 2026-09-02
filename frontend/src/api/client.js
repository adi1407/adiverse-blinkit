import { API_BASE_URL } from "../config/api";

export async function apiGet(path) {
  const url = `${API_BASE_URL}${path}`;

  let response;
  try {
    response = await fetch(url);
  } catch {
    throw new Error(
      `Cannot reach API at ${API_BASE_URL}. Is the backend running on port 5000?`
    );
  }

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
