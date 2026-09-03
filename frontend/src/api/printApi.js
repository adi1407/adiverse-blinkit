import { apiGet, apiPost } from "./client";

export function quotePrintJob(payload) {
  return apiPost("/api/print/quote", payload);
}

export function placePrintJob(payload) {
  return apiPost("/api/print/jobs", payload);
}

export function fetchPrintJobs(phone) {
  return apiGet(`/api/print/jobs?phone=${encodeURIComponent(phone)}`);
}

export function fetchPrintJobById(jobId) {
  return apiGet(`/api/print/jobs/${encodeURIComponent(jobId)}`);
}

export function cancelPrintJob({ jobId, phone }) {
  return apiPost(`/api/print/jobs/${encodeURIComponent(jobId)}/cancel`, {
    phone,
  });
}
