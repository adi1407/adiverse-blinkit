// Catalog: curated staples + Open Food Facts mega pack (real packaging photos).

import generated from "./generatedProducts.json" with { type: "json" };

const img = (photoId) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=400&q=80`;

export const deliveryInfo = {
  minutes: 8,
  addressLabel: "Home",
  address: "12th Cross, Indiranagar",
};

export const categories = [
  { id: "c1", name: "Vegetables &\nFruits", icon: "Salad", bg: "#E8F5E9", color: "#2E7D32" },
  { id: "c2", name: "Dairy, Bread\n& Eggs", icon: "Milk", bg: "#FFF3E0", color: "#EF6C00" },
  { id: "c3", name: "Atta, Rice\n& Dal", icon: "Wheat", bg: "#FFF8E1", color: "#F9A825" },
  { id: "c4", name: "Masala &\nOil", icon: "Flame", bg: "#FCE4EC", color: "#C2185B" },
  { id: "c5", name: "Bakery &\nBiscuits", icon: "Cookie", bg: "#F3E5F5", color: "#7B1FA2" },
  { id: "c6", name: "Chicken,\nMeat & Fish", icon: "Drumstick", bg: "#FFEBEE", color: "#D32F2F" },
  { id: "c7", name: "Cold Drinks\n& Juices", icon: "CupSoda", bg: "#E3F2FD", color: "#1976D2" },
  { id: "c8", name: "Snacks &\nMunchies", icon: "Popcorn", bg: "#FFFDE7", color: "#F57F17" },
  { id: "c9", name: "Personal\nCare", icon: "Sparkles", bg: "#E0F7FA", color: "#00838F" },
  { id: "c10", name: "Home &\nCleaning", icon: "SprayCan", bg: "#F1F8E9", color: "#558B2F" },
  { id: "c11", name: "Baby\nCare", icon: "Baby", bg: "#FCE4EC", color: "#AD1457" },
  { id: "c12", name: "Pet\nCare", icon: "PawPrint", bg: "#FFF3E0", color: "#E65100" },
];

const dairyProducts = [
  { id: "p1", name: "Amul Taaza Toned Milk", unit: "500 ml", price: 28, mrp: 30, image: img("photo-1563636619-e9143da7973b") },
  { id: "p2", name: "Britannia Bread", unit: "400 g", price: 45, mrp: 50, image: img("photo-1509440159596-0249088772ff") },
  { id: "p3", name: "Farm Fresh Eggs", unit: "6 pcs", price: 52, mrp: 60, image: img("photo-1582722872445-44dc5f7e3c8f") },
  { id: "p4", name: "Amul Butter", unit: "100 g", price: 58, mrp: 62, image: img("photo-1589985270826-4b7bb135bc9d") },
  { id: "p9", name: "Mother Dairy Curd", unit: "400 g", price: 35, mrp: 40, image: img("photo-1628088062854-d1870b4553da") },
  { id: "p10", name: "Amul Cheese Slices", unit: "100 g", price: 72, mrp: 80, image: img("photo-1486297678162-eb2a19b0a32d") },
];

const vegProducts = [
  { id: "v1", name: "Onion", unit: "1 kg", price: 36, mrp: 42, image: img("photo-1518977822534-7049a61ee0c2") },
  { id: "v2", name: "Tomato", unit: "500 g", price: 28, mrp: 32, image: img("photo-1592924357228-91a4daadcfea") },
  { id: "v3", name: "Banana Robusta", unit: "6 pcs", price: 49, mrp: 55, image: img("photo-1571771894821-ce9b6c11b08e") },
  { id: "v4", name: "Potato", unit: "1 kg", price: 32, mrp: 38, image: img("photo-1518977676601-b53f82aba655") },
  { id: "v5", name: "Cucumber", unit: "500 g", price: 22, mrp: 28, image: img("photo-1449300079323-98d43db8b1c0") },
  { id: "v6", name: "Apple Royal Gala", unit: "4 pcs", price: 160, mrp: 185, image: img("photo-1560806887-1e4cd0b6cbd6") },
  { id: "v7", name: "Carrot", unit: "500 g", price: 30, mrp: 36, image: img("photo-1598170845058-32b9d6a5da37") },
  { id: "v8", name: "Lemon", unit: "250 g", price: 24, mrp: 30, image: img("photo-1570197788417-0e723334cb37") },
];

const attaProducts = [
  { id: "a1", name: "Aashirvaad Atta", unit: "5 kg", price: 248, mrp: 275, image: img("photo-1574323347407-f5e1ad6d020b") },
  { id: "a2", name: "India Gate Basmati", unit: "1 kg", price: 145, mrp: 165, image: img("photo-1586201375761-83865001e31c") },
  { id: "a3", name: "Tata Toor Dal", unit: "1 kg", price: 168, mrp: 180, image: img("photo-1596797038530-2c107229654b") },
  { id: "a4", name: "Fortune Chana Dal", unit: "500 g", price: 72, mrp: 80, image: img("photo-1615485290382-441e4d049cb5") },
  { id: "a5", name: "Saffola Gold Oil", unit: "1 L", price: 175, mrp: 199, image: img("photo-1474979266404-7eaacbcd87c5") },
  { id: "a6", name: "Quaker Oats", unit: "1 kg", price: 185, mrp: 210, image: img("photo-1517673402038-1c2c0f0f0f0f") },
];

const masalaProducts = [
  { id: "m1", name: "Tata Salt", unit: "1 kg", price: 28, mrp: 28, image: img("photo-1621939514649-cecb6959c1a0") },
  { id: "m2", name: "Fortune Sunlite Oil", unit: "1 L", price: 142, mrp: 155, image: img("photo-1474979266404-7eaacbcd87c5") },
  { id: "m3", name: "MDH Turmeric", unit: "100 g", price: 42, mrp: 48, image: img("photo-1596040033229-a9821ebd058d") },
  { id: "m4", name: "Everest Garam Masala", unit: "50 g", price: 62, mrp: 70, image: img("photo-1596040033229-a9821ebd058d") },
  { id: "m5", name: "Catch Red Chilli", unit: "100 g", price: 48, mrp: 55, image: img("photo-1583208926680-8d0f8f0f0f0f") },
  { id: "m6", name: "Maggi Masala", unit: "100 g", price: 55, mrp: 60, image: img("photo-1612927601601-982702fa963a") },
];

const bakeryProducts = [
  { id: "b1", name: "Parle-G Original", unit: "250 g", price: 30, mrp: 30, image: img("photo-1558961363-fa8fdf82db35") },
  { id: "b2", name: "Oreo Original", unit: "120 g", price: 30, mrp: 35, image: img("photo-1499636136210-6f4ee915583e") },
  { id: "b3", name: "Britannia Good Day", unit: "200 g", price: 40, mrp: 45, image: img("photo-1486427944299-d1955d23e34d") },
  { id: "b4", name: "Hide & Seek", unit: "120 g", price: 30, mrp: 30, image: img("photo-1606313564200-e75d5e30476c") },
  { id: "b5", name: "Dark Fantasy Choco", unit: "75 g", price: 35, mrp: 40, image: img("photo-1606312619070-d48b4c652a52") },
  { id: "b6", name: "Jim Jam", unit: "100 g", price: 30, mrp: 35, image: img("photo-1558961363-fa8fdf82db35") },
];

const meatProducts = [
  { id: "t1", name: "Chicken Curry Cut", unit: "500 g", price: 165, mrp: 185, image: img("photo-1604503468506-a8da13d82713") },
  { id: "t2", name: "Eggs Pack", unit: "12 pcs", price: 96, mrp: 110, image: img("photo-1582722872445-44dc5f7e3c8f") },
  { id: "t3", name: "Rohu Fish", unit: "500 g", price: 220, mrp: 250, image: img("photo-1519708227418-c8fd9a32b7a2") },
  { id: "t4", name: "Mutton Curry Cut", unit: "500 g", price: 390, mrp: 420, image: img("photo-1603048297172-c92544798d5a") },
  { id: "t5", name: "Chicken Keema", unit: "250 g", price: 120, mrp: 140, image: img("photo-1529692236671-f1f6cf9683ba") },
  { id: "t6", name: "Prawns Medium", unit: "250 g", price: 280, mrp: 320, image: img("photo-1565680018434-b513d5e5fd47") },
];

const drinkSeed = [
  { id: "d1", name: "Coca-Cola", unit: "750 ml", price: 40, mrp: 40, image: img("photo-1554866585-cd94860890b7") },
  { id: "d2", name: "Tropicana Mixed Fruit", unit: "1 L", price: 110, mrp: 125, image: img("photo-1600271886742-f049cd062f01") },
  { id: "d3", name: "Kinley Soda", unit: "750 ml", price: 20, mrp: 20, image: img("photo-1523362628745-0c100150b504") },
  { id: "d4", name: "Real Orange", unit: "1 L", price: 95, mrp: 110, image: img("photo-1621506289937-a8e4df240d0b") },
  { id: "d5", name: "Sprite", unit: "750 ml", price: 40, mrp: 40, image: img("photo-1625772299848-391b6a87d7b3") },
  { id: "d6", name: "Red Bull", unit: "250 ml", price: 125, mrp: 125, image: img("photo-1613479020146-448cb276463e") },
];

const snackSeed = [
  { id: "p5", name: "Lay's Classic Salted", unit: "52 g", price: 20, mrp: 20, image: img("photo-1566478989037-eec175614204") },
  { id: "p6", name: "Kurkure Masala Munch", unit: "75 g", price: 20, mrp: 20, image: img("photo-1621939514649-cecb6959c1a0") },
  { id: "p7", name: "Bingo Mad Angles", unit: "66 g", price: 20, mrp: 20, image: img("photo-1599490659213-e2b9527bd087") },
  { id: "p8", name: "Haldiram's Bhujia", unit: "200 g", price: 55, mrp: 60, image: img("photo-1601050690597-df0568f70950") },
  { id: "p11", name: "Uncle Chipps Spicy", unit: "55 g", price: 20, mrp: 20, image: img("photo-1613919113640-25732ec5e61f") },
  { id: "p12", name: "Act II Butter Popcorn", unit: "30 g", price: 25, mrp: 30, image: img("photo-1578849278619-e73505e9610f") },
];

const personalCareProducts = [
  { id: "pc1", name: "Dove Soap", unit: "100 g", price: 55, mrp: 65, image: img("photo-1584305574647-0cc949a2bb9f") },
  { id: "pc2", name: "Colgate Strong", unit: "200 g", price: 110, mrp: 125, image: img("photo-1559591937-abc3a2bc4d0d") },
  { id: "pc3", name: "Head & Shoulders", unit: "180 ml", price: 165, mrp: 190, image: img("photo-1535585209827-a15fcdbc4c2d") },
  { id: "pc4", name: "Nivea Soft Cream", unit: "100 ml", price: 99, mrp: 120, image: img("photo-1556228578-0d85b1a4d571") },
  { id: "pc5", name: "Gillette Guard", unit: "1 pc", price: 25, mrp: 30, image: img("photo-1621607512214-68297480165e") },
  { id: "pc6", name: "Dettol Handwash", unit: "200 ml", price: 89, mrp: 99, image: img("photo-1584305574647-0cc949a2bb9f") },
];

const cleaningProducts = [
  { id: "h1", name: "Vim Dishwash Gel", unit: "500 ml", price: 105, mrp: 120, image: img("photo-1563453392212-326f5e854473") },
  { id: "h2", name: "Surf Excel Easy Wash", unit: "1 kg", price: 145, mrp: 165, image: img("photo-1610557892470-55d9e80c0bce") },
  { id: "h3", name: "Harpic Toilet Cleaner", unit: "500 ml", price: 98, mrp: 110, image: img("photo-1585421514738-01798b92221c") },
  { id: "h4", name: "Lizol Floor Cleaner", unit: "500 ml", price: 95, mrp: 108, image: img("photo-1581578731548-c64695cc6952") },
  { id: "h5", name: "Scotch-Brite Scrub", unit: "1 pc", price: 35, mrp: 40, image: img("photo-1563453392212-326f5e854473") },
  { id: "h6", name: "Garbage Bags Medium", unit: "30 pcs", price: 70, mrp: 85, image: img("photo-1610557892470-55d9e80c0bce") },
];

const babyProducts = [
  { id: "bb1", name: "Pampers Pants M", unit: "56 pcs", price: 699, mrp: 799, image: img("photo-1515488042361-ee00e0ddd4e4") },
  { id: "bb2", name: "Johnson Baby Soap", unit: "75 g", price: 55, mrp: 65, image: img("photo-1515488042361-ee00e0ddd4e4") },
  { id: "bb3", name: "Himalaya Baby Lotion", unit: "200 ml", price: 145, mrp: 165, image: img("photo-1556228578-0d85b1a4d571") },
  { id: "bb4", name: "Cerelac Wheat", unit: "300 g", price: 245, mrp: 275, image: img("photo-1574323347407-f5e1ad6d020b") },
];

const petProducts = [
  { id: "pt1", name: "Pedigree Adult", unit: "1.2 kg", price: 320, mrp: 360, image: img("photo-1587300003388-59208cc962cb") },
  { id: "pt2", name: "Whiskas Tuna", unit: "1.2 kg", price: 340, mrp: 380, image: img("photo-1574158622682-e40e69881006") },
  { id: "pt3", name: "Pet Shampoo", unit: "200 ml", price: 180, mrp: 210, image: img("photo-1548199973-03cce0bbc87b") },
  { id: "pt4", name: "Dog Chew Stick", unit: "4 pcs", price: 90, mrp: 110, image: img("photo-1587300003388-59208cc962cb") },
];

function stripMeta(product) {
  const { id, name, unit, price, mrp, image } = product;
  return { id, name, unit, price, mrp, image };
}

function mergeUnique(seed, extras) {
  const map = new Map();
  for (const p of seed) map.set(p.id, stripMeta(p));
  for (const p of extras) {
    if (!p?.id || !p?.image || !p?.name) continue;
    if (!map.has(p.id)) map.set(p.id, stripMeta(p));
  }
  return [...map.values()];
}

const offProducts = Array.isArray(generated.products) ? generated.products : [];

const offSnacks = offProducts.filter((p) => p.categoryId === "c8");
const offDrinks = offProducts.filter((p) => p.categoryId === "c7");
const offBakery = offProducts.filter((p) => p.categoryId === "c5");

const snackProducts = mergeUnique(snackSeed, offSnacks);
const drinkProducts = mergeUnique(drinkSeed, offDrinks);
const bakeryMerged = mergeUnique(bakeryProducts, offBakery);

/** Pick first match by name keywords (for Home featured rows). */
function pickHero(list, patterns, limit = 12) {
  const out = [];
  const used = new Set();

  for (const pattern of patterns) {
    const hit = list.find(
      (p) => !used.has(p.id) && pattern.test(p.name)
    );
    if (hit) {
      used.add(hit.id);
      out.push(hit);
    }
    if (out.length >= limit) break;
  }

  for (const p of list) {
    if (out.length >= limit) break;
    if (used.has(p.id)) continue;
    used.add(p.id);
    out.push(p);
  }

  return out;
}

const heroSnacks = pickHero(snackProducts, [
  /lay'?s.*classic|classic.*salted|salted/i,
  /lay'?s.*(magic|india|masala|spanish|tomato|green)/i,
  /lay'?s.*(cream|onion|blue|american)/i,
  /doritos.*nacho/i,
  /doritos.*(cool|ranch|cheese|flama|bbq)/i,
  /doritos/i,
  /kurkure.*masala/i,
  /kurkure.*puff|kurkure.*green|kurkure/i,
  /pringles.*original/i,
  /pringles.*(sour|onion)/i,
  /pringles.*(bbq|cheese|hot)/i,
  /cheetos/i,
  /bingo/i,
  /nacho/i,
  /protein\s*bar|quest.*bar|yoga\s*bar/i,
  /popcorn/i,
]);

const heroEnergyCoffee = pickHero(drinkProducts, [
  /monster.*energy(?!.*ultra)/i,
  /monster.*ultra|monster.*white|monster.*zero/i,
  /monster/i,
  /red\s*bull/i,
  /nescafe.*classic|nescaf[eé].*classic/i,
  /nescafe|nescaf[eé]/i,
  /charged|sting|hell energy/i,
  /coca.?cola|coke/i,
  /sprite|pepsi|fanta/i,
]);

export const productsByCategory = {
  c1: vegProducts,
  c2: dairyProducts,
  c3: attaProducts,
  c4: masalaProducts,
  c5: bakeryMerged,
  c6: meatProducts,
  c7: drinkProducts,
  c8: snackProducts,
  c9: personalCareProducts,
  c10: cleaningProducts,
  c11: babyProducts,
  c12: petProducts,
};

export const featuredRows = [
  {
    id: "row-hero-snacks",
    title: "Chips, nachos & munchies",
    products: heroSnacks.slice(0, 14),
  },
  {
    id: "row-energy-coffee",
    title: "Energy drinks & coffee",
    products: heroEnergyCoffee.slice(0, 12),
  },
  { id: "row-dairy", title: "Dairy, Bread & Eggs", products: dairyProducts },
  {
    id: "row-snacks-more",
    title: "More snacks to explore",
    products: snackProducts.slice(14, 28),
  },
  { id: "row-veg", title: "Fresh Vegetables & Fruits", products: vegProducts },
  {
    id: "row-drinks",
    title: "Cold Drinks & Juices",
    products: drinkProducts.slice(0, 12),
  },
  {
    id: "row-bakery",
    title: "Bakery & Biscuits",
    products: bakeryMerged.slice(0, 12),
  },
  { id: "row-personal", title: "Personal Care", products: personalCareProducts },
];

export function getCategoryById(id) {
  return categories.find((cat) => cat.id === id);
}

export function getProductsByCategoryId(id) {
  return productsByCategory[id] || [];
}

export function getAllProducts() {
  return Object.entries(productsByCategory).flatMap(([categoryId, products]) =>
    products.map((product) => ({ ...product, categoryId }))
  );
}

export function searchProducts(query) {
  const q = String(query || "")
    .trim()
    .toLowerCase();

  if (!q) return [];

  // Cap search results so the phone stays snappy with a huge catalog
  return getAllProducts()
    .filter((product) => {
      const haystack = `${product.name} ${product.unit}`.toLowerCase();
      return haystack.includes(q);
    })
    .slice(0, 80);
}

export const catalogStats = {
  generatedCount: generated.count || offProducts.length,
  totalProducts: getAllProducts().length,
  snacks: snackProducts.length,
  drinks: drinkProducts.length,
};
