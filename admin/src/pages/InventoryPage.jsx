import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../api";

const STATUS_FILTERS = [
  { value: "", label: "All" },
  { value: "out", label: "Out of stock" },
  { value: "low", label: "Low stock" },
  { value: "ok", label: "Healthy" },
  { value: "tracked", label: "Tracked" },
  { value: "untracked", label: "Untracked" },
];

function statusBadge(status) {
  if (status === "out") return "badge bad";
  if (status === "low") return "badge warn";
  if (status === "ok") return "badge ok";
  return "badge";
}

function statusLabel(status) {
  if (status === "out") return "Out";
  if (status === "low") return "Low";
  if (status === "ok") return "OK";
  return "Untracked";
}

export default function InventoryPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState(null);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [selected, setSelected] = useState(null);
  const [onHand, setOnHand] = useState(20);
  const [lowStockAt, setLowStockAt] = useState(5);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(next = {}) {
    const data = await adminApi.getInventory({
      q: next.q ?? q,
      status: next.status ?? status,
      categoryId: next.categoryId ?? categoryId,
      limit: 100,
    });
    setItems(data.items || []);
    setTotal(data.total || 0);
    setStats(data.stats || null);
    if (data.categories) setCategories(data.categories);
    if (selected) {
      const fresh = (data.items || []).find((r) => r.id === selected.id);
      if (fresh) selectRow(fresh);
      else setSelected(null);
    }
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectRow(row) {
    setSelected(row);
    setOnHand(row.stockTracked ? row.stockQty ?? 0 : 20);
    setLowStockAt(row.lowStockAt ?? 5);
    setMessage("");
    setError("");
  }

  async function saveStock(e) {
    e?.preventDefault?.();
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      await adminApi.setInventory(selected.id, {
        onHand: Number(onHand),
        lowStockAt: Number(lowStockAt),
        tracked: true,
      });
      setMessage(`Tracking on · ${selected.name}`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function bump(delta) {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      if (!selected.stockTracked) {
        await adminApi.setInventory(selected.id, {
          onHand: Math.max(0, Number(onHand) + delta),
          lowStockAt: Number(lowStockAt),
          tracked: true,
        });
      } else {
        await adminApi.adjustInventory(selected.id, delta);
      }
      setMessage(`${delta > 0 ? "+" : ""}${delta} · ${selected.name}`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function stopTracking() {
    if (!selected) return;
    if (!confirm(`Stop tracking stock for “${selected.name}”?`)) return;
    setBusy(true);
    try {
      await adminApi.setInventory(selected.id, { tracked: false });
      setMessage("SKU untracked — shopper sees in stock");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const categoryName = useMemo(() => {
    const map = Object.fromEntries(
      (categories || []).map((c) => [c.id, String(c.name || "").replace(/\n/g, " ")])
    );
    return (id) => map[id] || id || "—";
  }, [categories]);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h2 className="page-title">Inventory</h2>
          <p className="muted">
            Dark-store stock · tracked SKUs enforce OOS on the shopper app
          </p>
        </div>
        <button
          type="button"
          className="btn"
          onClick={() => load().catch((err) => setError(err.message))}
        >
          Refresh
        </button>
      </header>

      <div className="stat-grid inv-stats">
        <div className="stat">
          <p className="stat-label">Tracked</p>
          <strong className="stat-value">{stats?.tracked ?? "—"}</strong>
        </div>
        <div className="stat">
          <p className="stat-label">Out of stock</p>
          <strong className="stat-value">{stats?.out ?? "—"}</strong>
        </div>
        <div className="stat">
          <p className="stat-label">Low stock</p>
          <strong className="stat-value">{stats?.low ?? "—"}</strong>
        </div>
        <div className="stat">
          <p className="stat-label">Untracked</p>
          <strong className="stat-value">{stats?.untracked ?? "—"}</strong>
        </div>
      </div>

      {message ? <p className="ok">{message}</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="toolbar row gap wrap">
        <input
          className="grow"
          placeholder="Search name / brand / id…"
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
            load({ status: next }).catch((err) => setError(err.message));
          }}
        >
          {STATUS_FILTERS.map((s) => (
            <option key={s.value || "all"} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
        <select
          value={categoryId}
          onChange={(e) => {
            const next = e.target.value;
            setCategoryId(next);
            load({ categoryId: next }).catch((err) => setError(err.message));
          }}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {String(c.name || "").replace(/\n/g, " ")}
            </option>
          ))}
        </select>
        <button type="button" className="btn primary" onClick={() => load()}>
          Search
        </button>
      </div>

      <p className="muted" style={{ marginBottom: 10 }}>
        {total} SKUs
      </p>

      <div className="split">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>On hand</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={3} className="muted">
                    No products match.
                  </td>
                </tr>
              ) : (
                items.map((row) => (
                  <tr
                    key={row.id}
                    className={selected?.id === row.id ? "row-active" : undefined}
                    style={{ cursor: "pointer" }}
                    onClick={() => selectRow(row)}
                  >
                    <td>
                      <div className="prod-cell">
                        {row.image ? (
                          <img src={row.image} alt="" />
                        ) : (
                          <span className="ph" />
                        )}
                        <div>
                          <strong>{row.name}</strong>
                          <div className="muted small">
                            {categoryName(row.categoryId)} · {row.unit}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="mono">
                      {row.stockTracked ? row.stockQty : "—"}
                    </td>
                    <td>
                      <span className={statusBadge(row.stockStatus)}>
                        {statusLabel(row.stockStatus)}
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
            <p className="muted">
              Select a SKU to set stock. Untracked items stay sellable until you
              enable tracking.
            </p>
          ) : (
            <form onSubmit={saveStock}>
              <div className="panel-head tight">
                <div>
                  <h2>{selected.name}</h2>
                  <p className="muted mono small">{selected.id}</p>
                </div>
                <span className={statusBadge(selected.stockStatus)}>
                  {statusLabel(selected.stockStatus)}
                </span>
              </div>

              <dl className="detail-list">
                <div>
                  <dt>Category</dt>
                  <dd>{categoryName(selected.categoryId)}</dd>
                </div>
                <div>
                  <dt>Unit / price</dt>
                  <dd>
                    {selected.unit} · ₹{selected.price}
                  </dd>
                </div>
              </dl>

              <label className="full" style={{ marginTop: 12 }}>
                On hand
                <input
                  type="number"
                  min="0"
                  value={onHand}
                  onChange={(e) => setOnHand(e.target.value)}
                />
              </label>
              <label className="full" style={{ marginTop: 10 }}>
                Low-stock alert at
                <input
                  type="number"
                  min="0"
                  value={lowStockAt}
                  onChange={(e) => setLowStockAt(e.target.value)}
                />
              </label>

              <div className="action-row" style={{ marginTop: 12 }}>
                <button
                  type="button"
                  className="btn"
                  disabled={busy}
                  onClick={() => bump(-1)}
                >
                  −1
                </button>
                <button
                  type="button"
                  className="btn"
                  disabled={busy}
                  onClick={() => bump(1)}
                >
                  +1
                </button>
                <button
                  type="button"
                  className="btn"
                  disabled={busy}
                  onClick={() => bump(10)}
                >
                  +10
                </button>
              </div>

              <button
                type="submit"
                className="btn primary block"
                style={{ marginTop: 12 }}
                disabled={busy}
              >
                {selected.stockTracked ? "Update stock" : "Start tracking"}
              </button>

              {selected.stockTracked ? (
                <button
                  type="button"
                  className="btn ghost block"
                  style={{ marginTop: 8 }}
                  disabled={busy}
                  onClick={stopTracking}
                >
                  Stop tracking
                </button>
              ) : null}

              <p className="muted small" style={{ marginTop: 12 }}>
                Checkout blocks oversell for tracked SKUs and restores stock on
                cancel.
              </p>
            </form>
          )}
        </aside>
      </div>
    </div>
  );
}
