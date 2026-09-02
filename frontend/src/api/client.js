import { API_BASE_URL } from "../config/api";

async function parseResponse(response) {
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

async function request(path, options) {
  const url = `${API_BASE_URL}${path}`;

  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new Error(
      `Cannot reach API at ${API_BASE_URL}. Is the backend running on port 5000?`
    );
  }

  return parseResponse(response);
}

export function apiGet(path) {
  return request(path);
}

export function apiPost(path, body) {
  return request(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}
