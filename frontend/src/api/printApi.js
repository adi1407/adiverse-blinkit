import { apiGet, apiPost, apiUpload } from "./client";

export function quotePrintJob(payload) {
  return apiPost("/api/print/quote", payload, { auth: false });
}

export function uploadPrintFile(file) {
  return apiUpload("/api/print/upload", {
    uri: file.uri,
    name: file.name || "file",
    type: file.mimeType || "application/octet-stream",
  });
}

export function placePrintJob(payload) {
  // phone/name are overwritten server-side from the session token
  return apiPost("/api/print/jobs", payload);
}

export function fetchPrintJobs() {
  return apiGet("/api/print/jobs");
}

export function fetchPrintJobById(jobId) {
  return apiGet(`/api/print/jobs/${encodeURIComponent(jobId)}`);
}

export function cancelPrintJob({ jobId }) {
  return apiPost(`/api/print/jobs/${encodeURIComponent(jobId)}/cancel`, {});
}
