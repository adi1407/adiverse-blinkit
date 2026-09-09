import { API_BASE_URL } from "../config/api";

/** Module-level token so apiGet/apiPost can attach Bearer without React. */
let shopperToken = "";

export function setShopperToken(token) {
  shopperToken = token ? String(token) : "";
}

export function getShopperToken() {
  return shopperToken;
}

async function parseResponse(response) {
  let body;
  try {
    body = await response.json();
  } catch {
    throw new Error("Server returned invalid JSON");
  }

  if (!response.ok || body.success === false) {
    const err = new Error(body.message || `Request failed (${response.status})`);
    err.status = response.status;
    throw err;
  }

  return body.data;
}

function buildHeaders({ json = false, auth = true } = {}) {
  const headers = {};
  if (json) headers["Content-Type"] = "application/json";
  if (auth && shopperToken) {
    headers.Authorization = `Bearer ${shopperToken}`;
  }
  return headers;
}

async function request(path, options = {}) {
  const { auth = true, headers: extra, ...rest } = options;
  const url = `${API_BASE_URL}${path}`;

  let response;
  try {
    response = await fetch(url, {
      ...rest,
      headers: {
        ...buildHeaders({
          json: Boolean(rest.body),
          auth,
        }),
        ...extra,
      },
    });
  } catch {
    throw new Error(
      `Cannot reach API at ${API_BASE_URL}. Is the backend running on port 5000?`
    );
  }

  return parseResponse(response);
}

export function apiGet(path, { auth = true } = {}) {
  return request(path, { method: "GET", auth });
}

export function apiPost(path, body, { auth = true } = {}) {
  return request(path, {
    method: "POST",
    auth,
    body: body != null ? JSON.stringify(body) : undefined,
  });
}

/**
 * Multipart upload for React Native / Expo.
 * Pass `{ uri, name, type }` (or a web File). Do not set Content-Type —
 * fetch sets the multipart boundary itself.
 */
export async function apiUpload(path, file, { auth = true, fieldName = "file" } = {}) {
  const form = new FormData();
  if (file?.uri) {
    form.append(fieldName, {
      uri: file.uri,
      name: file.name || "upload.bin",
      type: file.type || file.mimeType || "application/octet-stream",
    });
  } else {
    form.append(fieldName, file);
  }

  const url = `${API_BASE_URL}${path}`;
  let response;
  try {
    response = await fetch(url, {
      method: "POST",
      headers: buildHeaders({ json: false, auth }),
      body: form,
    });
  } catch {
    throw new Error(
      `Cannot reach API at ${API_BASE_URL}. Is the backend running on port 5000?`
    );
  }

  return parseResponse(response);
}
