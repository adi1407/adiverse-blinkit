import { useState } from "react";
import { adminApi } from "./api";

/**
 * Image field: paste a URL or upload a local file.
 * Uploads become `/uploads/...` paths (proxied in Vite, served by backend).
 */
export default function ImageField({
  label = "Image",
  value = "",
  onChange,
  className = "full",
}) {
  const [mode, setMode] = useState("url");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  async function onFileChange(e) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setError("");
    setUploading(true);
    try {
      const data = await adminApi.uploadImage(file);
      onChange(data.url);
      setMode("url");
    } catch (err) {
      setError(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={`image-field ${className}`.trim()}>
      <div className="image-field-head">
        <span className="image-field-label">{label}</span>
        <div className="seg">
          <button
            type="button"
            className={mode === "url" ? "seg-btn active" : "seg-btn"}
            onClick={() => setMode("url")}
          >
            URL
          </button>
          <button
            type="button"
            className={mode === "upload" ? "seg-btn active" : "seg-btn"}
            onClick={() => setMode("upload")}
          >
            Upload
          </button>
        </div>
      </div>

      {mode === "url" ? (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://… or /uploads/…"
        />
      ) : (
        <label className="upload-drop">
          <input
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif"
            onChange={onFileChange}
            disabled={uploading}
          />
          <span>
            {uploading ? "Uploading…" : "Choose an image (max 5MB)"}
          </span>
        </label>
      )}

      {error ? <p className="error tight">{error}</p> : null}

      {value ? (
        <div className="image-preview">
          <img src={value} alt="" />
          <button
            type="button"
            className="btn ghost small-btn"
            onClick={() => onChange("")}
          >
            Clear
          </button>
        </div>
      ) : null}
    </div>
  );
}
