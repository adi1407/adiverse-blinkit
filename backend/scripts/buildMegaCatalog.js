/**
 * Fetches real snack/drink products + front images from Open Food Facts.
 * Run: node scripts/buildMegaCatalog.js
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../src/data/generatedProducts.json");

const USER_AGENT = "BlinkitClone/1.0 (learning project; local demo)";

const SEARCHES = [
  // Chips & crisps
  { q: "lay's", categoryId: "c8", tag: "chips" },
  { q: "lays", categoryId: "c8", tag: "chips" },
  { q: "doritos", categoryId: "c8", tag: "chips" },
  { q: "pringles", categoryId: "c8", tag: "chips" },
  { q: "kurkure", categoryId: "c8", tag: "namkeen" },
  { q: "cheetos", categoryId: "c8", tag: "chips" },
  { q: "bingo mad angles", categoryId: "c8", tag: "chips" },
  { q: "uncle chipps", categoryId: "c8", tag: "chips" },
  { q: "nachos", categoryId: "c8", tag: "nachos" },
  { q: "tortilla chips", categoryId: "c8", tag: "nachos" },
  { q: "cornitos", categoryId: "c8", tag: "nachos" },
  { q: "haldiram", categoryId: "c8", tag: "namkeen" },
  { q: "popcorn", categoryId: "c8", tag: "popcorn" },
  { q: "protein bar", categoryId: "c8", tag: "protein" },
  { q: "granola bar", categoryId: "c8", tag: "protein" },
  { q: "kind bar", categoryId: "c8", tag: "protein" },
  { q: "quest bar", categoryId: "c8", tag: "protein" },
  { q: "monster energy", categoryId: "c7", tag: "energy" },
  { q: "red bull", categoryId: "c7", tag: "energy" },
  { q: "sting energy", categoryId: "c7", tag: "energy" },
  { q: "charged energy", categoryId: "c7", tag: "energy" },
  { q: "hell energy", categoryId: "c7", tag: "energy" },
  { q: "nescafe", categoryId: "c7", tag: "coffee" },
  { q: "nescafe coffee", categoryId: "c7", tag: "coffee" },
  { q: "bru coffee", categoryId: "c7", tag: "coffee" },
  { q: "coca cola", categoryId: "c7", tag: "soda" },
  { q: "pepsi", categoryId: "c7", tag: "soda" },
  { q: "sprite", categoryId: "c7", tag: "soda" },
  { q: "fanta", categoryId: "c7", tag: "soda" },
  { q: "thums up", categoryId: "c7", tag: "soda" },
  { q: "oreo", categoryId: "c5", tag: "biscuit" },
  { q: "parle-g", categoryId: "c5", tag: "biscuit" },
  { q: "britannia", categoryId: "c5", tag: "biscuit" },
  { q: "dark fantasy", categoryId: "c5", tag: "biscuit" },
  { q: "hide and seek", categoryId: "c5", tag: "biscuit" },
  { q: "maggi noodles", categoryId: "c4", tag: "instant" },
  { q: "amul milk", categoryId: "c2", tag: "dairy" },
  { q: "amul butter", categoryId: "c2", tag: "dairy" },
  { q: "mother dairy", categoryId: "c2", tag: "dairy" },
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function pickPrice(seed, tag) {
  const bases = {
    chips: [20, 30, 35, 40, 50, 99],
    namkeen: [20, 30, 45, 55, 80],
    nachos: [40, 50, 70, 99, 120],
    popcorn: [25, 35, 50, 80],
    protein: [99, 120, 150, 199, 249],
    energy: [50, 80, 110, 125, 150],
    coffee: [90, 140, 180, 250, 350],
    soda: [20, 35, 40, 60, 80],
    biscuit: [20, 30, 40, 50, 80],
    instant: [14, 28, 48, 72],
    dairy: [28, 45, 58, 72, 95],
  };
  const list = bases[tag] || [40, 60, 80, 100];
  return list[seed % list.length];
}

function unitFrom(product) {
  return (
    product.quantity ||
    product.product_quantity_unit ||
    "1 pack"
  )
    .toString()
    .slice(0, 24);
}

async function searchOff(query, page = 1) {
  const url =
    "https://world.openfoodfacts.org/cgi/search.pl?" +
    new URLSearchParams({
      search_terms: query,
      search_simple: "1",
      action: "process",
      json: "1",
      page_size: "100",
      page: String(page),
      fields:
        "code,product_name,brands,quantity,image_front_url,image_front_small_url,image_url",
    });

  const res = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`OFF ${res.status} for ${query}`);
  }

  return res.json();
}

function toProduct(raw, categoryId, tag, index) {
  const name = (raw.product_name || "").trim();
  const image =
    raw.image_front_url ||
    raw.image_front_small_url ||
    raw.image_url ||
    "";

  if (!name || name.length < 3 || !image) return null;
  if (name.length > 70) return null;

  const brand = (raw.brands || "").split(",")[0]?.trim();
  const displayName = brand && !name.toLowerCase().includes(brand.toLowerCase())
    ? `${brand} ${name}`.slice(0, 70)
    : name;

  const price = pickPrice(index + displayName.length, tag);
  const mrp = Math.round(price * (1.05 + (index % 5) * 0.03));

  return {
    id: `off_${raw.code}`,
    name: displayName,
    unit: unitFrom(raw),
    price,
    mrp: Math.max(mrp, price),
    image,
    categoryId,
    brand: brand || "",
    source: "openfoodfacts",
  };
}

async function main() {
  const byId = new Map();

  for (const job of SEARCHES) {
    for (let page = 1; page <= 3; page++) {
      process.stdout.write(`Fetching "${job.q}" page ${page}… `);
      try {
        const data = await searchOff(job.q, page);
        const products = data.products || [];
        let added = 0;
        products.forEach((raw, i) => {
          const p = toProduct(raw, job.categoryId, job.tag, i + page * 100);
          if (!p) return;
          if (byId.has(p.id)) return;
          byId.set(p.id, p);
          added++;
        });
        console.log(`+${added} (total ${byId.size})`);
        if (products.length < 40) break;
      } catch (err) {
        console.log(`fail: ${err.message}`);
      }
      await sleep(900); // be polite to OFF
      if (byId.size >= 1200) break;
    }
    if (byId.size >= 1200) break;
  }

  const products = [...byId.values()];
  fs.writeFileSync(
    OUT,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: products.length,
        products,
      },
      null,
      2
    )
  );

  console.log(`\nWrote ${products.length} products → ${OUT}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
