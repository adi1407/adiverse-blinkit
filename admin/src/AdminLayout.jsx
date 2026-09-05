import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const LINKS = [
  { to: "/", label: "Dashboard", end: true },
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
          <div>
            <strong>Blinkit Ops</strong>
            <p>Admin portal</p>
          </div>
        </div>
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
        <div className="sidebar-foot">
          <p className="muted">{email}</p>
          <button type="button" className="btn ghost" onClick={onLogout}>
            Sign out
          </button>
        </div>
      </aside>
      <main className="main">
        <Outlet />
      </main>
    </div>
  );
}
