// Catalog data lives on the server now — frontend will fetch via API.

export const deliveryInfo = {
  minutes: 8,
  addressLabel: "Home",
  address: "12th Cross, Indiranagar",
};

export const categories = [
  { id: "c1", name: "Vegetables &\nFruits", emoji: "🥬", bg: "#E8F5E9" },
  { id: "c2", name: "Dairy, Bread\n& Eggs", emoji: "🥛", bg: "#FFF3E0" },
  { id: "c3", name: "Atta, Rice\n& Dal", emoji: "🌾", bg: "#FFF8E1" },
  { id: "c4", name: "Masala &\nOil", emoji: "🫙", bg: "#FCE4EC" },
  { id: "c5", name: "Bakery &\nBiscuits", emoji: "🍪", bg: "#F3E5F5" },
  { id: "c6", name: "Chicken,\nMeat & Fish", emoji: "🍗", bg: "#FFEBEE" },
  { id: "c7", name: "Cold Drinks\n& Juices", emoji: "🥤", bg: "#E3F2FD" },
  { id: "c8", name: "Snacks &\nMunchies", emoji: "🍿", bg: "#FFFDE7" },
];

const dairyProducts = [
  { id: "p1", name: "Amul Taaza Toned Milk", unit: "500 ml", price: 28, mrp: 30, emoji: "🥛" },
  { id: "p2", name: "Britannia Bread", unit: "400 g", price: 45, mrp: 50, emoji: "🍞" },
  { id: "p3", name: "Farm Fresh Eggs", unit: "6 pcs", price: 52, mrp: 60, emoji: "🥚" },
  { id: "p4", name: "Amul Butter", unit: "100 g", price: 58, mrp: 62, emoji: "🧈" },
];

const snackProducts = [
  { id: "p5", name: "Lay's Classic Salted", unit: "52 g", price: 20, mrp: 20, emoji: "🥔" },
  { id: "p6", name: "Kurkure Masala Munch", unit: "75 g", price: 20, mrp: 20, emoji: "🌽" },
  { id: "p7", name: "Bingo Mad Angles", unit: "66 g", price: 20, mrp: 20, emoji: "🔺" },
  { id: "p8", name: "Haldiram's Bhujia", unit: "200 g", price: 55, mrp: 60, emoji: "🍘" },
];

const vegProducts = [
  { id: "v1", name: "Onion", unit: "1 kg", price: 36, mrp: 42, emoji: "🧅" },
  { id: "v2", name: "Tomato", unit: "500 g", price: 28, mrp: 32, emoji: "🍅" },
  { id: "v3", name: "Banana Robusta", unit: "6 pcs", price: 49, mrp: 55, emoji: "🍌" },
  { id: "v4", name: "Potato", unit: "1 kg", price: 32, mrp: 38, emoji: "🥔" },
];

const attaProducts = [
  { id: "a1", name: "Aashirvaad Atta", unit: "5 kg", price: 248, mrp: 275, emoji: "🌾" },
  { id: "a2", name: "India Gate Basmati", unit: "1 kg", price: 145, mrp: 165, emoji: "🍚" },
  { id: "a3", name: "Tata Toor Dal", unit: "1 kg", price: 168, mrp: 180, emoji: "🫘" },
  { id: "a4", name: "Fortune Chana Dal", unit: "500 g", price: 72, mrp: 80, emoji: "🟡" },
];

const masalaProducts = [
  { id: "m1", name: "Tata Salt", unit: "1 kg", price: 28, mrp: 28, emoji: "🧂" },
  { id: "m2", name: "Fortune Sunlite Oil", unit: "1 L", price: 142, mrp: 155, emoji: "🫙" },
  { id: "m3", name: "MDH Turmeric", unit: "100 g", price: 42, mrp: 48, emoji: "🟨" },
  { id: "m4", name: "Everest Garam Masala", unit: "50 g", price: 62, mrp: 70, emoji: "🌶️" },
];

const bakeryProducts = [
  { id: "b1", name: "Parle-G Original", unit: "250 g", price: 30, mrp: 30, emoji: "🍪" },
  { id: "b2", name: "Oreo Original", unit: "120 g", price: 30, mrp: 35, emoji: "⬛" },
  { id: "b3", name: "Britannia Good Day", unit: "200 g", price: 40, mrp: 45, emoji: "🧈" },
  { id: "b4", name: "Hide & Seek", unit: "120 g", price: 30, mrp: 30, emoji: "🍫" },
];

const meatProducts = [
  { id: "t1", name: "Chicken Curry Cut", unit: "500 g", price: 165, mrp: 185, emoji: "🍗" },
  { id: "t2", name: "Eggs Pack", unit: "12 pcs", price: 96, mrp: 110, emoji: "🥚" },
  { id: "t3", name: "Rohu Fish", unit: "500 g", price: 220, mrp: 250, emoji: "🐟" },
  { id: "t4", name: "Mutton Curry Cut", unit: "500 g", price: 390, mrp: 420, emoji: "🥩" },
];

const drinkProducts = [
  { id: "d1", name: "Coca-Cola", unit: "750 ml", price: 40, mrp: 40, emoji: "🥤" },
  { id: "d2", name: "Tropicana Mixed Fruit", unit: "1 L", price: 110, mrp: 125, emoji: "🧃" },
  { id: "d3", name: "Kinley Soda", unit: "750 ml", price: 20, mrp: 20, emoji: "💧" },
  { id: "d4", name: "Real Orange", unit: "1 L", price: 95, mrp: 110, emoji: "🍊" },
];

export const productsByCategory = {
  c1: vegProducts,
  c2: dairyProducts,
  c3: attaProducts,
  c4: masalaProducts,
  c5: bakeryProducts,
  c6: meatProducts,
  c7: drinkProducts,
  c8: snackProducts,
};

export const featuredRows = [
  { id: "row-dairy", title: "Dairy, Bread & Eggs", products: dairyProducts },
  { id: "row-snacks", title: "Snacks & Munchies", products: snackProducts },
];

export function getCategoryById(id) {
  return categories.find((cat) => cat.id === id);
}

export function getProductsByCategoryId(id) {
  return productsByCategory[id] || [];
}
