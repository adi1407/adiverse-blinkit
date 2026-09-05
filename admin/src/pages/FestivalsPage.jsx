import { useEffect, useMemo, useState } from "react";
import { adminApi } from "../api";

export default function FestivalsPage() {
  const [store, setStore] = useState(null);
  const [selectedId, setSelectedId] = useState("");
  const [draft, setDraft] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function load() {
    const data = await adminApi.getFestivals();
    setStore(data);
    const id = selectedId || data.activeId;
    setSelectedId(id);
    setDraft(data.themes?.[id] || null);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const themeIds = useMemo(
    () => Object.keys(store?.themes || {}),
    [store]
  );

  function selectTheme(id) {
    setSelectedId(id);
    setDraft(store.themes[id]);
    setMessage("");
  }

  function patchDraft(field, value) {
    setDraft((prev) => ({ ...prev, [field]: value }));
  }

  function patchPalette(key, value) {
    setDraft((prev) => ({
      ...prev,
      palette: { ...(prev.palette || {}), [key]: value },
    }));
  }

  async function activate() {
    setSaving(true);
    setError("");
    try {
      await adminApi.setActiveFestival(selectedId);
      setMessage(`Activated “${selectedId}” for the shopper app`);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function saveTheme() {
    if (!draft) return;
    setSaving(true);
    setError("");
    try {
      await adminApi.updateFestival(selectedId, draft);
      setMessage("Theme saved");
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  if (!store || !draft) {
    return (
      <div className="page">
        <h1>Festivals</h1>
        {error ? <p className="error">{error}</p> : <p className="muted">Loading…</p>}
      </div>
    );
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Festivals</h1>
          <p className="muted">
            Active: <strong>{store.activeId}</strong> — drives Expo hero
          </p>
        </div>
        <div className="row gap">
          <button
            type="button"
            className="btn"
            disabled={saving || selectedId === store.activeId}
            onClick={activate}
          >
            Set active
          </button>
          <button
            type="button"
            className="btn primary"
            disabled={saving}
            onClick={saveTheme}
          >
            Save theme
          </button>
        </div>
      </header>

      {message ? <p className="ok">{message}</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="festival-layout">
        <div className="theme-list">
          {themeIds.map((id) => (
            <button
              key={id}
              type="button"
              className={
                id === selectedId
                  ? "theme-item active"
                  : "theme-item"
              }
              onClick={() => selectTheme(id)}
            >
              <strong>{id}</strong>
              <span>{store.themes[id]?.eyebrow}</span>
              {id === store.activeId ? (
                <em className="pill">LIVE</em>
              ) : null}
            </button>
          ))}
        </div>

        <div className="panel form-grid">
          <label>
            Eyebrow
            <input
              value={draft.eyebrow || ""}
              onChange={(e) => patchDraft("eyebrow", e.target.value)}
            />
          </label>
          <label>
            Headline
            <textarea
              rows={2}
              value={draft.headline || ""}
              onChange={(e) => patchDraft("headline", e.target.value)}
            />
          </label>
          <label className="full">
            Description
            <textarea
              rows={3}
              value={draft.description || ""}
              onChange={(e) => patchDraft("description", e.target.value)}
            />
          </label>
          <label>
            Primary CTA
            <input
              value={draft.primaryCta || ""}
              onChange={(e) => patchDraft("primaryCta", e.target.value)}
            />
          </label>
          <label>
            Secondary CTA
            <input
              value={draft.secondaryCta || ""}
              onChange={(e) => patchDraft("secondaryCta", e.target.value)}
            />
          </label>
          <label>
            Visual type
            <select
              value={draft.visualType || "abstract"}
              onChange={(e) => patchDraft("visualType", e.target.value)}
            >
              <option value="abstract">abstract</option>
              <option value="janmashtami">janmashtami</option>
            </select>
          </label>
          <label>
            Particle count
            <input
              type="number"
              value={draft.particleCount ?? 8}
              onChange={(e) =>
                patchDraft("particleCount", Number(e.target.value) || 0)
              }
            />
          </label>
          <label>
            Palette bgTop
            <input
              value={draft.palette?.bgTop || ""}
              onChange={(e) => patchPalette("bgTop", e.target.value)}
            />
          </label>
          <label>
            Palette bgBottom
            <input
              value={draft.palette?.bgBottom || ""}
              onChange={(e) => patchPalette("bgBottom", e.target.value)}
            />
          </label>
          <label>
            Palette deep
            <input
              value={draft.palette?.deep || ""}
              onChange={(e) => patchPalette("deep", e.target.value)}
            />
          </label>
          <label>
            Palette soft
            <input
              value={draft.palette?.soft || ""}
              onChange={(e) => patchPalette("soft", e.target.value)}
            />
          </label>

          <div
            className="preview full"
            style={{
              background: `linear-gradient(180deg, ${draft.palette?.bgTop || "#fff"}, ${draft.palette?.bgBottom || "#fff"})`,
            }}
          >
            <p style={{ color: draft.palette?.deep || "#111" }}>
              {draft.eyebrow}
            </p>
            <h3 style={{ color: draft.palette?.deep || "#111", whiteSpace: "pre-line" }}>
              {draft.headline}
            </h3>
            <p className="muted">{draft.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
