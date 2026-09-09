import { useEffect, useState } from "react";
import { adminApi } from "../api";

const STATUSES = [
  { value: "", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "printing", label: "Printing" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const STATUS_OPTIONS = STATUSES.filter((s) => s.value);

function formatWhen(iso) {
  try {
    return new Date(iso).toLocaleString(undefined, {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso || "—";
  }
}

function formatBytes(n) {
  const size = Number(n) || 0;
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function statusClass(status) {
  if (status === "delivered") return "badge ok";
  if (status === "cancelled") return "badge bad";
  if (status === "out_for_delivery" || status === "printing") return "badge warn";
  return "badge";
}

export default function PrintJobsPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(nextStatus = status, nextQ = q) {
    const data = await adminApi.getPrintJobs({
      status: nextStatus,
      q: nextQ,
      limit: 100,
    });
    setItems(data.items || []);
    setTotal(data.total || 0);
    if (selected) {
      const fresh = (data.items || []).find((j) => j.id === selected.id);
      setSelected(fresh || null);
    }
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function setJobStatus(next) {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      const updated = await adminApi.updatePrintJobStatus(selected.id, next);
      setSelected(updated);
      setMessage(`Status → ${next.replaceAll("_", " ")}`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function cancelSelected() {
    if (!selected) return;
    if (!confirm(`Cancel print job ${selected.id}?`)) return;
    setBusy(true);
    setError("");
    try {
      const updated = await adminApi.cancelPrintJob(selected.id);
      setSelected(updated);
      setMessage("Print job cancelled");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h2 className="page-title">Print jobs</h2>
          <p className="muted">{total} matching</p>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => load().catch((err) => setError(err.message))}
        >
          Refresh
        </button>
      </header>

      {message ? <p className="ok">{message}</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="toolbar row gap wrap">
        <input
          className="grow"
          placeholder="Search id / phone / name…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") load();
          }}
        />
        <select
          value={status}
          onChange={(e) => {
            const next = e.target.value;
            setStatus(next);
            load(next, q).catch((err) => setError(err.message));
          }}
        >
          {STATUSES.map((s) => (
            <option key={s.value || "all"} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <button type="button" className="btn primary" onClick={() => load()}>
          Search
        </button>
      </div>

      <div className="split">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Job</th>
                <th>Customer</th>
                <th>Kind</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted">
                    No print jobs yet. Place one from the shopper Print tab.
                  </td>
                </tr>
              ) : (
                items.map((job) => (
                  <tr
                    key={job.id}
                    className={
                      selected?.id === job.id ? "row-active" : undefined
                    }
                    onClick={() => {
                      setSelected(job);
                      setMessage("");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <strong className="mono">{job.id}</strong>
                      <div className="muted small">
                        {formatWhen(job.createdAt)}
                      </div>
                    </td>
                    <td>
                      <strong>{job.name || "—"}</strong>
                      <div className="muted small">{job.phone}</div>
                    </td>
                    <td>
                      {job.kind}
                      <div className="muted small">
                        {(job.files || []).length} file
                        {(job.files || []).length === 1 ? "" : "s"}
                      </div>
                    </td>
                    <td>₹{job.grandTotal ?? "—"}</td>
                    <td>
                      <span className={statusClass(job.status)}>
                        {(job.status || "").replaceAll("_", " ")}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <aside className="panel sticky-panel">
          {!selected ? (
            <p className="muted">Select a print job to open files and set status.</p>
          ) : (
            <>
              <div className="panel-head tight">
                <div>
                  <h2>Print detail</h2>
                  <p className="muted mono small">{selected.id}</p>
                </div>
                <span className={statusClass(selected.status)}>
                  {(selected.status || "").replaceAll("_", " ")}
                </span>
              </div>

              <dl className="detail-list">
                <div>
                  <dt>Customer</dt>
                  <dd>
                    {selected.name} · {selected.phone}
                  </dd>
                </div>
                <div>
                  <dt>Address</dt>
                  <dd>
                    {selected.address?.label
                      ? `${selected.address.label} · `
                      : ""}
                    {selected.address?.line1 || "—"}
                  </dd>
                </div>
                <div>
                  <dt>Specs</dt>
                  <dd>
                    {selected.kind}
                    {selected.kind === "document"
                      ? ` · ${selected.color ? "color" : "B&W"} · ${selected.pages || "?"} pages`
                      : ` · ${selected.photoSize || "4x6"}`}
                    {` · ${selected.copies || 1} copies`}
                  </dd>
                </div>
                <div>
                  <dt>Total</dt>
                  <dd>₹{selected.grandTotal}</dd>
                </div>
              </dl>

              <h3 className="section-label">Files</h3>
              <ul className="item-list">
                {(selected.files || []).length === 0 ? (
                  <li className="muted">No files attached</li>
                ) : (
                  (selected.files || []).map((file, i) => (
                    <li key={`${selected.id}-file-${i}`}>
                      <span>
                        {file.url ? (
                          <a href={file.url} target="_blank" rel="noreferrer">
                            {file.name || "file"}
                          </a>
                        ) : (
                          file.name || "file"
                        )}
                        <div className="muted small">
                          {formatBytes(file.size)}
                          {file.mimeType ? ` · ${file.mimeType}` : ""}
                        </div>
                      </span>
                      {file.url ? (
                        <a
                          className="btn"
                          href={file.url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ padding: "4px 8px", fontSize: 12 }}
                        >
                          Open
                        </a>
                      ) : (
                        <span className="muted small">no url</span>
                      )}
                    </li>
                  ))
                )}
              </ul>

              <h3 className="section-label">Set status</h3>
              <div className="action-row">
                {STATUS_OPTIONS.map((s) => (
                  <button
                    key={s.value}
                    type="button"
                    className={
                      selected.status === s.value ? "btn primary" : "btn"
                    }
                    disabled={busy || selected.status === s.value}
                    onClick={() => setJobStatus(s.value)}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {selected.status !== "cancelled" ? (
                <button
                  type="button"
                  className="btn danger block"
                  style={{ marginTop: 12 }}
                  disabled={busy}
                  onClick={cancelSelected}
                >
                  Cancel job
                </button>
              ) : null}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
