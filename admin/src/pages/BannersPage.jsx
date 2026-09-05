import { useEffect, useState } from "react";
import { adminApi } from "../api";
import ImageField from "../ImageField";

const EMPTY = {
  title: "",
  subtitle: "",
  cta: "Shop now",
  image: "",
  accent: "#F8CB46",
  hub: "all",
};

export default function BannersPage() {
  const [banners, setBanners] = useState([]);
  const [draft, setDraft] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load() {
    setBanners(await adminApi.getBanners());
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
  }, []);

  function startEdit(banner) {
    setEditingId(banner.id);
    setDraft({ ...banner });
    setMessage("");
  }

  function startCreate() {
    setEditingId(null);
    setDraft({ ...EMPTY });
  }

  async function save(e) {
    e.preventDefault();
    setError("");
    try {
      if (editingId) {
        await adminApi.updateBanner(editingId, draft);
        setMessage("Banner updated");
      } else {
        await adminApi.createBanner(draft);
        setMessage("Banner created");
      }
      startCreate();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    if (!confirm("Delete this banner?")) return;
    try {
      await adminApi.deleteBanner(id);
      await load();
      if (editingId === id) startCreate();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Hero banners</h1>
          <p className="muted">Shown in the Expo home hero carousel</p>
        </div>
        <button type="button" className="btn" onClick={startCreate}>
          New banner
        </button>
      </header>

      {message ? <p className="ok">{message}</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="split">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Hub</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {banners.map((b) => (
                <tr key={b.id}>
                  <td>
                    <strong>{b.title}</strong>
                    <div className="muted small">{b.subtitle}</div>
                  </td>
                  <td>{b.hub}</td>
                  <td className="row gap end">
                    <button type="button" className="btn ghost" onClick={() => startEdit(b)}>
                      Edit
                    </button>
                    <button type="button" className="btn danger" onClick={() => remove(b.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form className="panel form-grid" onSubmit={save}>
          <h2>{editingId ? "Edit banner" : "Create banner"}</h2>
          <label className="full">
            Title
            <input
              required
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            />
          </label>
          <label className="full">
            Subtitle
            <input
              value={draft.subtitle}
              onChange={(e) => setDraft({ ...draft, subtitle: e.target.value })}
            />
          </label>
          <label>
            CTA
            <input
              value={draft.cta}
              onChange={(e) => setDraft({ ...draft, cta: e.target.value })}
            />
          </label>
          <label>
            Hub
            <select
              value={draft.hub}
              onChange={(e) => setDraft({ ...draft, hub: e.target.value })}
            >
              {["all", "gifting", "beauty", "electronics", "kids", "decor"].map(
                (h) => (
                  <option key={h} value={h}>
                    {h}
                  </option>
                )
              )}
            </select>
          </label>
          <ImageField
            label="Image (URL or upload)"
            value={draft.image}
            onChange={(image) => setDraft({ ...draft, image })}
          />
          <label>
            Accent
            <input
              value={draft.accent}
              onChange={(e) => setDraft({ ...draft, accent: e.target.value })}
            />
          </label>
          <button className="btn primary full" type="submit">
            {editingId ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
