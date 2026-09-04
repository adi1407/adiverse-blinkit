/** Shared curated catalog helpers */

export const img = (photoId, w = 800) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&q=85`;

/** Wikimedia Commons direct file (high-quality pack / object shots). */
export const wiki = (path) =>
  `https://upload.wikimedia.org/wikipedia/commons/${path}`;

/**
 * @param {{ id: string, name: string, brand?: string, unit: string, price: number, mrp?: number, photos?: string[], wikiPaths?: string[] }} spec
 */
export function product(spec) {
  const images = [];
  if (Array.isArray(spec.wikiPaths)) {
    for (const path of spec.wikiPaths) images.push(wiki(path));
  }
  if (Array.isArray(spec.photos)) {
    for (const photoId of spec.photos) images.push(img(photoId));
  }
  if (!images.length && spec.image) images.push(spec.image);

  const unique = [...new Set(images.filter(Boolean))].slice(0, 3);
  while (unique.length < 2 && unique.length > 0) {
    // Duplicate last with different crop width so gallery always has 2+ slots
    unique.push(img(spec.photos?.[0] || "photo-1542838132-92c53300491e", 600));
  }

  return {
    id: spec.id,
    name: spec.name,
    brand: spec.brand || "",
    unit: spec.unit,
    price: spec.price,
    mrp: spec.mrp ?? spec.price,
    images: unique,
    image: unique[0] || "",
  };
}

export function normalizeProduct(raw) {
  if (!raw?.id) return null;
  const fromImages = Array.isArray(raw.images)
    ? raw.images.filter(Boolean)
    : [];
  const images =
    fromImages.length > 0
      ? fromImages.slice(0, 3)
      : raw.image
        ? [raw.image]
        : [];
  if (!images.length) return null;
  return {
    id: raw.id,
    name: String(raw.name || "Product"),
    brand: String(raw.brand || ""),
    unit: String(raw.unit || ""),
    price: Number(raw.price) || 0,
    mrp: Number(raw.mrp) || Number(raw.price) || 0,
    images,
    image: images[0],
  };
}
