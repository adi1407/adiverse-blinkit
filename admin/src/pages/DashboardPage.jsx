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
          <h1>Dashboard</h1>
          <p className="muted">Ops overview for the shopper app</p>
        </div>
      </header>

      {error ? <p className="error">{error}</p> : null}

      <div className="stat-grid">
        <Stat label="Products" value={stats?.products} />
        <Stat label="Categories" value={stats?.categories} />
        <Stat label="Banners" value={stats?.banners} />
        <Stat label="Orders" value={stats?.orders} />
      </div>

      <section className="panel">
        <h2>Active festival</h2>
        <p className="festival-chip">
          {stats?.activeFestivalId || "…"}
          <span>{stats?.activeFestivalLabel || ""}</span>
        </p>
        <div className="row gap">
          <Link className="btn primary" to="/festivals">
            Manage festivals
          </Link>
          <Link className="btn" to="/banners">
            Edit banners
          </Link>
          <Link className="btn" to="/products">
            Catalog
          </Link>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="stat">
      <p className="muted">{label}</p>
      <strong>{value ?? "—"}</strong>
    </div>
  );
}
