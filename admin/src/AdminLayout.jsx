import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const LINKS = [
  { to: "/", label: "Dashboard", end: true },
  { to: "/orders", label: "Orders" },
  { to: "/festivals", label: "Festivals" },
  { to: "/banners", label: "Banners" },
  { to: "/products", label: "Products" },
];

export default function AdminLayout() {
  const { email, logout } = useAuth();
  const navigate = useNavigate();

  function onLogout() {
    logout();
    navigate("/login");
  }

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-mark">B</span>
          <div className="brand-copy">
            <strong>blinkit</strong>
            <p>Admin</p>
          </div>
        </div>

        <div>
          <p className="nav-label">Menu</p>
          <nav className="nav">
            {LINKS.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.end}
                className={({ isActive }) =>
                  isActive ? "nav-link active" : "nav-link"
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-foot">
          <div className="user-card">
            <div className="user-meta">
              <strong>Signed in</strong>
              <p title={email}>{email}</p>
            </div>
          </div>
          <button type="button" className="btn ghost block" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </aside>

      <div className="content-pane">
        <header className="topbar">
          <h1 className="topbar-title">Operations</h1>
          <div className="topbar-right">
            <span className="status-pill">
              <i />
              Connected
            </span>
          </div>
        </header>
        <main className="main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
