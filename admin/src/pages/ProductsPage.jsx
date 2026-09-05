import { useEffect, useState } from "react";
import { adminApi } from "../api";
import ImageField from "../ImageField";

const EMPTY = {
  name: "",
  brand: "",
  unit: "1 pc",
  price: 0,
  mrp: 0,
  categoryId: "c8",
  image: "",
};

export default function ProductsPage() {
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState([]);
  const [q, setQ] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [draft, setDraft] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function load(nextQ = q, nextCat = categoryId) {
    const data = await adminApi.getProducts({
      q: nextQ,
      categoryId: nextCat,
      limit: 60,
    });
    setItems(data.items || []);
    setTotal(data.total || 0);
    if (data.categories) setCategories(data.categories);
  }

  useEffect(() => {
    load().catch((err) => setError(err.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function startCreate() {
    setEditingId(null);
    setDraft({ ...EMPTY });
  }

  function startEdit(p) {
    setEditingId(p.id);
    setDraft({
      name: p.name || "",
      brand: p.brand || "",
      unit: p.unit || "",
      price: p.price || 0,
      mrp: p.mrp || 0,
      categoryId: p.categoryId || "c8",
      image: p.image || p.images?.[0] || "",
    });
  }

  async function save(e) {
    e.preventDefault();
    setError("");
    try {
      const payload = {
        ...draft,
        price: Number(draft.price),
        mrp: Number(draft.mrp),
        images: draft.image ? [draft.image] : [],
      };
      if (editingId) {
        await adminApi.updateProduct(editingId, payload);
        setMessage("Product updated");
      } else {
        await adminApi.createProduct(payload);
        setMessage("Product created");
      }
      startCreate();
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function remove(id) {
    if (!confirm("Remove / hide this product?")) return;
    try {
      await adminApi.deleteProduct(id);
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
          <h1>Products</h1>
          <p className="muted">{total} items (curated + overrides)</p>
        </div>
        <button type="button" className="btn" onClick={startCreate}>
          Add product
        </button>
      </header>

      <div className="toolbar row gap">
        <input
          className="grow"
          placeholder="Search name / brand…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") load();
          }}
        />
        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            load(q, e.target.value).catch((err) => setError(err.message));
          }}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {String(c.name).replace(/\n/g, " ")}
            </option>
          ))}
        </select>
        <button type="button" className="btn primary" onClick={() => load()}>
          Search
        </button>
      </div>

      {message ? <p className="ok">{message}</p> : null}
      {error ? <p className="error">{error}</p> : null}

      <div className="split">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Cat</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className="prod-cell">
                      {p.image ? (
                        <img src={p.image} alt="" />
                      ) : (
                        <span className="ph" />
                      )}
                      <div>
                        <strong>{p.name}</strong>
                        <div className="muted small">
                          {p.brand} · {p.unit}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    ₹{p.price}
                    {p.mrp > p.price ? (
                      <span className="muted small"> / ₹{p.mrp}</span>
                    ) : null}
                  </td>
                  <td>{p.categoryId}</td>
                  <td className="row gap end">
                    <button type="button" className="btn ghost" onClick={() => startEdit(p)}>
                      Edit
                    </button>
                    <button type="button" className="btn danger" onClick={() => remove(p.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <form className="panel form-grid" onSubmit={save}>
          <h2>{editingId ? "Edit product" : "New product"}</h2>
          <label className="full">
            Name
            <input
              required
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            />
          </label>
          <label>
            Brand
            <input
              value={draft.brand}
              onChange={(e) => setDraft({ ...draft, brand: e.target.value })}
            />
          </label>
          <label>
            Unit
            <input
              value={draft.unit}
              onChange={(e) => setDraft({ ...draft, unit: e.target.value })}
            />
          </label>
          <label>
            Price
            <input
              type="number"
              value={draft.price}
              onChange={(e) => setDraft({ ...draft, price: e.target.value })}
            />
          </label>
          <label>
            MRP
            <input
              type="number"
              value={draft.mrp}
              onChange={(e) => setDraft({ ...draft, mrp: e.target.value })}
            />
          </label>
          <label className="full">
            Category
            <select
              value={draft.categoryId}
              onChange={(e) =>
                setDraft({ ...draft, categoryId: e.target.value })
              }
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {String(c.name).replace(/\n/g, " ")}
                </option>
              ))}
            </select>
          </label>
          <ImageField
            label="Image (URL or upload)"
            value={draft.image}
            onChange={(image) => setDraft({ ...draft, image })}
          />
          <button className="btn primary full" type="submit">
            {editingId ? "Update" : "Create"}
          </button>
        </form>
      </div>
    </div>
  );
}
