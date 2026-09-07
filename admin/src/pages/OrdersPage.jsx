import { useEffect, useState } from "react";
import { adminApi } from "../api";

const STATUSES = [
  { value: "", label: "All" },
  { value: "confirmed", label: "Confirmed" },
  { value: "packing", label: "Packing" },
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

function statusClass(status) {
  if (status === "delivered") return "badge ok";
  if (status === "cancelled") return "badge bad";
  if (status === "out_for_delivery") return "badge warn";
  return "badge";
}

export default function OrdersPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState("");
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function load(nextStatus = status, nextQ = q) {
    const data = await adminApi.getOrders({
      status: nextStatus,
      q: nextQ,
      limit: 100,
    });
    setItems(data.items || []);
    setTotal(data.total || 0);
    if (selected) {
      const fresh = (data.items || []).find((o) => o.id === selected.id);
      setSelected(fresh || null);
    }
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function setOrderStatus(next) {
    if (!selected) return;
    setBusy(true);
    setError("");
    try {
      const updated = await adminApi.updateOrderStatus(selected.id, next);
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
    if (!confirm(`Cancel order ${selected.id}?`)) return;
    setBusy(true);
    setError("");
    try {
      const updated = await adminApi.cancelOrder(selected.id);
      setSelected(updated);
      setMessage("Order cancelled");
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
          <h2 className="page-title">Orders</h2>
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
                <th>Order</th>
                <th>Customer</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 ? (
                <tr>
                  <td colSpan={4} className="muted">
                    No orders yet. Place one from the shopper app.
                  </td>
                </tr>
              ) : (
                items.map((order) => (
                  <tr
                    key={order.id}
                    className={
                      selected?.id === order.id ? "row-active" : undefined
                    }
                    onClick={() => {
                      setSelected(order);
                      setMessage("");
                    }}
                    style={{ cursor: "pointer" }}
                  >
                    <td>
                      <strong className="mono">{order.id}</strong>
                      <div className="muted small">
                        {formatWhen(order.createdAt)}
                      </div>
                    </td>
                    <td>
                      <strong>{order.name || "—"}</strong>
                      <div className="muted small">{order.phone}</div>
                    </td>
                    <td>₹{order.grandTotal ?? "—"}</td>
                    <td>
                      <span className={statusClass(order.status)}>
                        {(order.status || "").replaceAll("_", " ")}
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
            <p className="muted">Select an order to manage status.</p>
          ) : (
            <>
              <div className="panel-head tight">
                <div>
                  <h2>Order detail</h2>
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
                    {selected.address?.line1 ||
                      selected.address?.address ||
                      "—"}
                  </dd>
                </div>
                <div>
                  <dt>Payment</dt>
                  <dd>
                    {selected.payment?.label ||
                      selected.payment?.id ||
                      "—"}{" "}
                    · {selected.paymentStatus || "—"}
                  </dd>
                </div>
                <div>
                  <dt>Total</dt>
                  <dd>₹{selected.grandTotal}</dd>
                </div>
                {selected.statusLocked ? (
                  <div>
                    <dt>Note</dt>
                    <dd>Status locked by ops (no auto-advance)</dd>
                  </div>
                ) : null}
              </dl>

              <h3 className="section-label">Items</h3>
              <ul className="item-list">
                {(selected.items || []).map((item) => (
                  <li key={`${selected.id}-${item.id}`}>
                    <span>
                      {item.name} × {item.qty}
                    </span>
                    <span>₹{(item.price || 0) * (item.qty || 1)}</span>
                  </li>
                ))}
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
                    onClick={() => setOrderStatus(s.value)}
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
                  Cancel order
                </button>
              ) : null}
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
