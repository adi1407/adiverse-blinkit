import { useEffect, useState } from "react";
import { adminApi } from "../api";

const EMPTY = {
  code: "",
  title: "",
  description: "",
  type: "flat",
  value: 50,
  maxDiscount: 80,
  minOrder: 99,
  active: true,
};

const TYPES = [
  { value: "flat", label: "Flat ₹ off" },
  { value: "percent", label: "Percent off" },
  { value: "free_delivery", label: "Free delivery" },
];

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]);
  const [draft, setDraft] = useState(EMPTY);
  const [editingCode, setEditingCode] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setCoupons(await adminApi.getCoupons());
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  function startEdit(coupon) {
    setEditingCode(coupon.code);
    setDraft({
      code: coupon.code,
      title: coupon.title || "",
      description: coupon.description || "",
      type: coupon.type || "flat",
      value: coupon.value ?? 50,
      maxDiscount: coupon.maxDiscount ?? 80,
      minOrder: coupon.minOrder ?? 0,
      active: coupon.active !== false,
    });
    setMessage("");
  }

  function startCreate() {
    setEditingCode(null);
    setDraft({ ...EMPTY });
    setMessage("");
  }

  function setField(key, value) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  async function save(e) {
    e.preventDefault();
    setError("");
    try {
      const body = {
        title: draft.title,
        description: draft.description,
        type: draft.type,
        minOrder: Number(draft.minOrder) || 0,
        active: Boolean(draft.active),
      };
      if (draft.type === "flat") {
        body.value = Number(draft.value) || 0;
      } else if (draft.type === "percent") {
        body.value = Number(draft.value) || 0;
        body.maxDiscount = Number(draft.maxDiscount) || 0;
      }

      if (editingCode) {
        await adminApi.updateCoupon(editingCode, body);
        setMessage(`Updated ${editingCode}`);
      } else {
        await adminApi.createCoupon({ ...body, code: draft.code });
        setMessage(`Created ${String(draft.code || "").toUpperCase()}`);
      }
      startCreate();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(code) {
    if (!confirm(`Delete coupon ${code}?`)) return;
    try {
      await adminApi.deleteCoupon(code);
      await load();
      if (editingCode === code) startCreate();
      setMessage(`Deleted ${code}`);
    } catch (err) {
      setError(err.message);
    }
  }

  async function toggleActive(coupon) {
    try {
      await adminApi.updateCoupon(coupon.code, {
        active: coupon.active === false,
      });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h2 className="page-title">Coupons</h2>
          <p className="muted">Cart promos — shopper only sees active codes</p>
        </div>
        <button type="button" className="btn primary" onClick={startCreate}>
          New coupon
        </button>
      </header>

      {message ? <p className="ok">{message}</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="split">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Code</th>
                <th>Offer</th>
                <th>Min</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan={5} className="muted">
                    No coupons yet.
                  </td>
                </tr>
              ) : (
                coupons.map((c) => (
                  <tr key={c.code}>
                    <td>
                      <strong className="mono">{c.code}</strong>
                      <div className="muted small">{c.title}</div>
                    </td>
                    <td>
                      {c.type === "flat"
                        ? `₹${c.value} off`
                        : c.type === "percent"
                          ? `${c.value}% off (max ₹${c.maxDiscount})`
                          : "Free delivery"}
                      <div className="muted small">{c.description}</div>
                    </td>
                    <td>₹{c.minOrder ?? 0}</td>
                    <td>
                      <span
                        className={
                          c.active === false ? "badge bad" : "badge ok"
                        }
                      >
                        {c.active === false ? "off" : "active"}
                      </span>
                    </td>
                    <td className="row gap">
                      <button
                        type="button"
                        className="btn"
                        onClick={() => startEdit(c)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn"
                        onClick={() => toggleActive(c)}
                      >
                        {c.active === false ? "Enable" : "Disable"}
                      </button>
                      <button
                        type="button"
                        className="btn danger"
                        onClick={() => remove(c.code)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <aside className="panel sticky-panel">
          <div className="panel-head tight">
            <h2>{editingCode ? `Edit ${editingCode}` : "New coupon"}</h2>
          </div>
          <form className="stack" onSubmit={save}>
            {!editingCode ? (
              <label>
                Code
                <input
                  value={draft.code}
                  onChange={(e) => setField("code", e.target.value.toUpperCase())}
                  placeholder="BLINKIT50"
                  required
                />
              </label>
            ) : null}

            <label>
              Title
              <input
                value={draft.title}
                onChange={(e) => setField("title", e.target.value)}
                placeholder="₹50 off"
                required
              />
            </label>

            <label>
              Description
              <input
                value={draft.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Shown on cart chip"
              />
            </label>

            <label>
              Type
              <select
                value={draft.type}
                onChange={(e) => setField("type", e.target.value)}
              >
                {TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </label>

            {draft.type !== "free_delivery" ? (
              <label>
                {draft.type === "percent" ? "Percent" : "Flat ₹"}
                <input
                  type="number"
                  min="1"
                  value={draft.value}
                  onChange={(e) => setField("value", e.target.value)}
                  required
                />
              </label>
            ) : null}

            {draft.type === "percent" ? (
              <label>
                Max discount ₹
                <input
                  type="number"
                  min="1"
                  value={draft.maxDiscount}
                  onChange={(e) => setField("maxDiscount", e.target.value)}
                />
              </label>
            ) : null}

            <label>
              Min order ₹
              <input
                type="number"
                min="0"
                value={draft.minOrder}
                onChange={(e) => setField("minOrder", e.target.value)}
              />
            </label>

            <label className="row gap" style={{ alignItems: "center" }}>
              <input
                type="checkbox"
                checked={Boolean(draft.active)}
                onChange={(e) => setField("active", e.target.checked)}
              />
              Active (visible in cart)
            </label>

            <div className="row gap">
              <button type="submit" className="btn primary">
                {editingCode ? "Save changes" : "Create coupon"}
              </button>
              {editingCode ? (
                <button type="button" className="btn" onClick={startCreate}>
                  Cancel
                </button>
              ) : null}
            </div>
          </form>
        </aside>
      </div>
    </div>
  );
}
