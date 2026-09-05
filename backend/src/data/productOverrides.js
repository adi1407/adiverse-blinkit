/**
 * Apply CMS product overrides on top of curated catalog base lists.
 */
import { getProductOverrides, saveProductOverrides } from "./cmsStore.js";

function applyOverridesToList(baseList, categoryId) {
  const { created = [], updated = {}, deleted = [] } = getProductOverrides();
  const deletedSet = new Set(deleted);

  let list = baseList
    .filter((p) => p && !deletedSet.has(p.id))
    .map((p) => {
      const patch = updated[p.id];
      if (!patch) return { ...p, categoryId: p.categoryId || categoryId };
      return {
        ...p,
        ...patch,
        id: p.id,
        categoryId: patch.categoryId || p.categoryId || categoryId,
        images: patch.images || p.images,
        image: patch.image || patch.images?.[0] || p.image,
      };
    });

  const extras = created.filter(
    (p) =>
      p &&
      !deletedSet.has(p.id) &&
      (p.categoryId || categoryId) === categoryId
  );
  for (const extra of extras) {
    if (list.some((p) => p.id === extra.id)) continue;
    list.push({
      ...extra,
      categoryId: extra.categoryId || categoryId,
      image: extra.image || extra.images?.[0] || null,
      images: extra.images || (extra.image ? [extra.image] : []),
    });
  }

  return list;
}

export function mergeCategoryProducts(baseList, categoryId) {
  return applyOverridesToList(baseList, categoryId);
}

export function mergeAllProducts(getBaseAll) {
  const { created = [], updated = {}, deleted = [] } = getProductOverrides();
  const deletedSet = new Set(deleted);
  const base = getBaseAll()
    .filter((p) => !deletedSet.has(p.id))
    .map((p) => {
      const patch = updated[p.id];
      if (!patch) return p;
      return {
        ...p,
        ...patch,
        id: p.id,
        categoryId: patch.categoryId || p.categoryId,
        images: patch.images || p.images,
        image: patch.image || patch.images?.[0] || p.image,
      };
    });

  const seen = new Set(base.map((p) => p.id));
  for (const extra of created) {
    if (!extra?.id || deletedSet.has(extra.id) || seen.has(extra.id)) continue;
    base.push({
      ...extra,
      image: extra.image || extra.images?.[0] || null,
      images: extra.images || (extra.image ? [extra.image] : []),
    });
  }
  return base;
}

export function createProductOverride(input) {
  const overrides = getProductOverrides();
  const id =
    input.id ||
    `admin-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  const product = {
    id,
    name: String(input.name || "New product").trim(),
    brand: String(input.brand || "").trim(),
    unit: String(input.unit || "1 pc").trim(),
    price: Number(input.price) || 0,
    mrp: Number(input.mrp) || Number(input.price) || 0,
    categoryId: String(input.categoryId || "c8"),
    image: String(input.image || "").trim() || null,
    images: Array.isArray(input.images)
      ? input.images.filter(Boolean)
      : input.image
        ? [String(input.image).trim()]
        : [],
  };

  overrides.created = overrides.created.filter((p) => p.id !== id);
  overrides.created.push(product);
  overrides.deleted = (overrides.deleted || []).filter((d) => d !== id);
  saveProductOverrides(overrides);
  return product;
}

export function updateProductOverride(id, patch, existsInBase) {
  const overrides = getProductOverrides();
  const createdIdx = (overrides.created || []).findIndex((p) => p.id === id);

  if (createdIdx >= 0) {
    overrides.created[createdIdx] = {
      ...overrides.created[createdIdx],
      ...patch,
      id,
      images:
        patch.images ||
        overrides.created[createdIdx].images ||
        (patch.image ? [patch.image] : overrides.created[createdIdx].images),
      image:
        patch.image ||
        patch.images?.[0] ||
        overrides.created[createdIdx].image,
    };
    saveProductOverrides(overrides);
    return overrides.created[createdIdx];
  }

  if (!existsInBase) {
    const err = new Error("Product not found");
    err.status = 404;
    throw err;
  }

  overrides.updated = overrides.updated || {};
  overrides.updated[id] = {
    ...(overrides.updated[id] || {}),
    ...patch,
  };
  if (patch.image && !patch.images) {
    overrides.updated[id].images = [patch.image];
  }
  saveProductOverrides(overrides);
  return { id, ...overrides.updated[id] };
}

export function deleteProductOverride(id, existsInBase) {
  const overrides = getProductOverrides();
  const beforeCreated = overrides.created.length;
  overrides.created = (overrides.created || []).filter((p) => p.id !== id);
  const wasCreated = overrides.created.length < beforeCreated;

  if (overrides.updated?.[id]) delete overrides.updated[id];

  if (!wasCreated && existsInBase) {
    if (!overrides.deleted.includes(id)) overrides.deleted.push(id);
  }

  if (!wasCreated && !existsInBase && !overrides.deleted.includes(id)) {
    const err = new Error("Product not found");
    err.status = 404;
    throw err;
  }

  saveProductOverrides(overrides);
  return { id };
}
