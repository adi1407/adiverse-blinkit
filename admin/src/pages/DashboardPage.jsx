import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminApi } from "../api";

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .stats()
      .then(setStats)
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h2 className="page-title">Dashboard</h2>
          <p className="muted">Catalog and live festival status</p>
        </div>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <div className="stat-grid">
        <Stat label="Products" value={stats?.products} />
        <Stat label="Orders" value={stats?.orders} />
        <Stat label="Out of stock" value={stats?.inventoryOut} />
        <Stat label="Low stock" value={stats?.inventoryLow} />
      </div>

      <section className="panel">
        <div className="panel-head">
          <div>
            <h2>Active festival</h2>
            <p className="muted" style={{ marginTop: 4 }}>
              Controls the shopper app hero theme
            </p>
          </div>
          <p className="festival-chip">
            <span className="chip-id">{stats?.activeFestivalId || "…"}</span>
            <span className="chip-label">
              {stats?.activeFestivalLabel || "Loading"}
            </span>
          </p>
        </div>
        <div className="action-row" style={{ marginTop: 12 }}>
          <Link className="btn primary" to="/orders">
            View orders
          </Link>
          <Link className="btn" to="/inventory">
            Inventory
          </Link>
          <Link className="btn" to="/festivals">
            Manage festivals
          </Link>
          <Link className="btn" to="/products">
            Products
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <p className="stat-label">{label}</p>
      <strong className="stat-value">{value ?? "—"}</strong>
    </div>
  );
}
