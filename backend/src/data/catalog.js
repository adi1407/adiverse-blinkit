// Catalog data lives on the server — frontend fetches via API.

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
  { id: "c9", name: "Personal\nCare", emoji: "🧴", bg: "#E0F7FA" },
  { id: "c10", name: "Home &\nCleaning", emoji: "🧹", bg: "#F1F8E9" },
  { id: "c11", name: "Baby\nCare", emoji: "🍼", bg: "#FCE4EC" },
  { id: "c12", name: "Pet\nCare", emoji: "🐶", bg: "#FFF3E0" },
];

const dairyProducts = [
  { id: "p1", name: "Amul Taaza Toned Milk", unit: "500 ml", price: 28, mrp: 30, emoji: "🥛" },
  { id: "p2", name: "Britannia Bread", unit: "400 g", price: 45, mrp: 50, emoji: "🍞" },
  { id: "p3", name: "Farm Fresh Eggs", unit: "6 pcs", price: 52, mrp: 60, emoji: "🥚" },
  { id: "p4", name: "Amul Butter", unit: "100 g", price: 58, mrp: 62, emoji: "🧈" },
  { id: "p9", name: "Mother Dairy Curd", unit: "400 g", price: 35, mrp: 40, emoji: "🥣" },
  { id: "p10", name: "Amul Cheese Slices", unit: "100 g", price: 72, mrp: 80, emoji: "🧀" },
];

const snackProducts = [
  { id: "p5", name: "Lay's Classic Salted", unit: "52 g", price: 20, mrp: 20, emoji: "🥔" },
  { id: "p6", name: "Kurkure Masala Munch", unit: "75 g", price: 20, mrp: 20, emoji: "🌽" },
  { id: "p7", name: "Bingo Mad Angles", unit: "66 g", price: 20, mrp: 20, emoji: "🔺" },
  { id: "p8", name: "Haldiram's Bhujia", unit: "200 g", price: 55, mrp: 60, emoji: "🍘" },
  { id: "p11", name: "Uncle Chipps Spicy", unit: "55 g", price: 20, mrp: 20, emoji: "🍟" },
  { id: "p12", name: "Act II Butter Popcorn", unit: "30 g", price: 25, mrp: 30, emoji: "🍿" },
];

const vegProducts = [
  { id: "v1", name: "Onion", unit: "1 kg", price: 36, mrp: 42, emoji: "🧅" },
  { id: "v2", name: "Tomato", unit: "500 g", price: 28, mrp: 32, emoji: "🍅" },
  { id: "v3", name: "Banana Robusta", unit: "6 pcs", price: 49, mrp: 55, emoji: "🍌" },
  { id: "v4", name: "Potato", unit: "1 kg", price: 32, mrp: 38, emoji: "🥔" },
  { id: "v5", name: "Cucumber", unit: "500 g", price: 22, mrp: 28, emoji: "🥒" },
  { id: "v6", name: "Apple Royal Gala", unit: "4 pcs", price: 160, mrp: 185, emoji: "🍎" },
  { id: "v7", name: "Carrot", unit: "500 g", price: 30, mrp: 36, emoji: "🥕" },
  { id: "v8", name: "Lemon", unit: "250 g", price: 24, mrp: 30, emoji: "🍋" },
];

const attaProducts = [
  { id: "a1", name: "Aashirvaad Atta", unit: "5 kg", price: 248, mrp: 275, emoji: "🌾" },
  { id: "a2", name: "India Gate Basmati", unit: "1 kg", price: 145, mrp: 165, emoji: "🍚" },
  { id: "a3", name: "Tata Toor Dal", unit: "1 kg", price: 168, mrp: 180, emoji: "🫘" },
  { id: "a4", name: "Fortune Chana Dal", unit: "500 g", price: 72, mrp: 80, emoji: "🟡" },
  { id: "a5", name: "Saffola Gold Oil", unit: "1 L", price: 175, mrp: 199, emoji: "🫒" },
  { id: "a6", name: "Quaker Oats", unit: "1 kg", price: 185, mrp: 210, emoji: "🥣" },
];

const masalaProducts = [
  { id: "m1", name: "Tata Salt", unit: "1 kg", price: 28, mrp: 28, emoji: "🧂" },
  { id: "m2", name: "Fortune Sunlite Oil", unit: "1 L", price: 142, mrp: 155, emoji: "🫙" },
  { id: "m3", name: "MDH Turmeric", unit: "100 g", price: 42, mrp: 48, emoji: "🟨" },
  { id: "m4", name: "Everest Garam Masala", unit: "50 g", price: 62, mrp: 70, emoji: "🌶️" },
  { id: "m5", name: "Catch Red Chilli", unit: "100 g", price: 48, mrp: 55, emoji: "🔴" },
  { id: "m6", name: "Maggi Masala", unit: "100 g", price: 55, mrp: 60, emoji: "🍜" },
];

const bakeryProducts = [
  { id: "b1", name: "Parle-G Original", unit: "250 g", price: 30, mrp: 30, emoji: "🍪" },
  { id: "b2", name: "Oreo Original", unit: "120 g", price: 30, mrp: 35, emoji: "⬛" },
  { id: "b3", name: "Britannia Good Day", unit: "200 g", price: 40, mrp: 45, emoji: "🧈" },
  { id: "b4", name: "Hide & Seek", unit: "120 g", price: 30, mrp: 30, emoji: "🍫" },
  { id: "b5", name: "Dark Fantasy Choco", unit: "75 g", price: 35, mrp: 40, emoji: "🟤" },
  { id: "b6", name: "Jim Jam", unit: "100 g", price: 30, mrp: 35, emoji: "🍓" },
];

const meatProducts = [
  { id: "t1", name: "Chicken Curry Cut", unit: "500 g", price: 165, mrp: 185, emoji: "🍗" },
  { id: "t2", name: "Eggs Pack", unit: "12 pcs", price: 96, mrp: 110, emoji: "🥚" },
  { id: "t3", name: "Rohu Fish", unit: "500 g", price: 220, mrp: 250, emoji: "🐟" },
  { id: "t4", name: "Mutton Curry Cut", unit: "500 g", price: 390, mrp: 420, emoji: "🥩" },
  { id: "t5", name: "Chicken Keema", unit: "250 g", price: 120, mrp: 140, emoji: "🍖" },
  { id: "t6", name: "Prawns Medium", unit: "250 g", price: 280, mrp: 320, emoji: "🦐" },
];

const drinkProducts = [
  { id: "d1", name: "Coca-Cola", unit: "750 ml", price: 40, mrp: 40, emoji: "🥤" },
  { id: "d2", name: "Tropicana Mixed Fruit", unit: "1 L", price: 110, mrp: 125, emoji: "🧃" },
  { id: "d3", name: "Kinley Soda", unit: "750 ml", price: 20, mrp: 20, emoji: "💧" },
  { id: "d4", name: "Real Orange", unit: "1 L", price: 95, mrp: 110, emoji: "🍊" },
  { id: "d5", name: "Sprite", unit: "750 ml", price: 40, mrp: 40, emoji: "💚" },
  { id: "d6", name: "Red Bull", unit: "250 ml", price: 125, mrp: 125, emoji: "🐂" },
];

const personalCareProducts = [
  { id: "pc1", name: "Dove Soap", unit: "100 g", price: 55, mrp: 65, emoji: "🧼" },
  { id: "pc2", name: "Colgate Strong", unit: "200 g", price: 110, mrp: 125, emoji: "🦷" },
  { id: "pc3", name: "Head & Shoulders", unit: "180 ml", price: 165, mrp: 190, emoji: "🧴" },
  { id: "pc4", name: "Nivea Soft Cream", unit: "100 ml", price: 99, mrp: 120, emoji: "🧴" },
  { id: "pc5", name: "Gillette Guard", unit: "1 pc", price: 25, mrp: 30, emoji: "🪒" },
  { id: "pc6", name: "Dettol Handwash", unit: "200 ml", price: 89, mrp: 99, emoji: "🫧" },
];

const cleaningProducts = [
  { id: "h1", name: "Vim Dishwash Gel", unit: "500 ml", price: 105, mrp: 120, emoji: "🍽️" },
  { id: "h2", name: "Surf Excel Easy Wash", unit: "1 kg", price: 145, mrp: 165, emoji: "🧺" },
  { id: "h3", name: "Harpic Toilet Cleaner", unit: "500 ml", price: 98, mrp: 110, emoji: "🚽" },
  { id: "h4", name: "Lizol Floor Cleaner", unit: "500 ml", price: 95, mrp: 108, emoji: "🧹" },
  { id: "h5", name: "Scotch-Brite Scrub", unit: "1 pc", price: 35, mrp: 40, emoji: "🧽" },
  { id: "h6", name: "Garbage Bags Medium", unit: "30 pcs", price: 70, mrp: 85, emoji: "🗑️" },
];

const babyProducts = [
  { id: "bb1", name: "Pampers Pants M", unit: "56 pcs", price: 699, mrp: 799, emoji: "🧷" },
  { id: "bb2", name: "Johnson Baby Soap", unit: "75 g", price: 55, mrp: 65, emoji: "🧼" },
  { id: "bb3", name: "Himalaya Baby Lotion", unit: "200 ml", price: 145, mrp: 165, emoji: "🧴" },
  { id: "bb4", name: "Cerelac Wheat", unit: "300 g", price: 245, mrp: 275, emoji: "🍼" },
];

const petProducts = [
  { id: "pt1", name: "Pedigree Adult", unit: "1.2 kg", price: 320, mrp: 360, emoji: "🐶" },
  { id: "pt2", name: "Whiskas Tuna", unit: "1.2 kg", price: 340, mrp: 380, emoji: "🐱" },
  { id: "pt3", name: "Pet Shampoo", unit: "200 ml", price: 180, mrp: 210, emoji: "🧴" },
  { id: "pt4", name: "Dog Chew Stick", unit: "4 pcs", price: 90, mrp: 110, emoji: "🦴" },
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
  c9: personalCareProducts,
  c10: cleaningProducts,
  c11: babyProducts,
  c12: petProducts,
};

export const featuredRows = [
  { id: "row-dairy", title: "Dairy, Bread & Eggs", products: dairyProducts },
  { id: "row-snacks", title: "Snacks & Munchies", products: snackProducts },
  { id: "row-veg", title: "Fresh Vegetables & Fruits", products: vegProducts },
  { id: "row-drinks", title: "Cold Drinks & Juices", products: drinkProducts },
  { id: "row-bakery", title: "Bakery & Biscuits", products: bakeryProducts },
  { id: "row-personal", title: "Personal Care", products: personalCareProducts },
];

export function getCategoryById(id) {
  return categories.find((cat) => cat.id === id);
}

export function getProductsByCategoryId(id) {
  return productsByCategory[id] || [];
}
