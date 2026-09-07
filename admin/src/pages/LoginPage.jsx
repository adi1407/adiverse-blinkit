import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../AuthContext";

export default function LoginPage() {
  const { isAuthed, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("admin@blinkit.local");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthed) return <Navigate to="/" replace />;

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <form className="login-shell login-card" onSubmit={onSubmit}>
        <div className="login-card-head">
          <div className="brand">
            <span className="brand-mark">B</span>
            <div className="brand-copy">
              <strong>blinkit</strong>
              <p>Admin</p>
            </div>
          </div>
          <h2>Sign in</h2>
          <p className="muted">Ops credentials for this environment</p>
        </div>

        <label>
          Email
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            autoComplete="username"
          />
        </label>
        <label>
          Password
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            autoComplete="current-password"
          />
        </label>
        {error ? <p className="error">{error}</p> : null}
        <button className="btn primary block" type="submit" disabled={loading}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
        <p className="hint">Default: admin@blinkit.local / admin123</p>
      </form>
    </div>
  );
}
