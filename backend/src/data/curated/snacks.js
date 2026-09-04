import { product } from "./helpers.js";

/** Snacks & Munchies — chips, healthy/protein chips, namkeen */
export const snackProducts = [
  // Lay's family
  product({ id: "chip-lays-classic", name: "Lay's Classic Salted", brand: "Lay's", unit: "52 g", price: 20, mrp: 20, photos: ["photo-1566478989037-eec175614204", "photo-1621447504864-d8686e126901", "photo-1599490659213-e2b9527bd087"] }),
  product({ id: "chip-lays-magic", name: "Lay's India's Magic Masala", brand: "Lay's", unit: "52 g", price: 20, mrp: 20, photos: ["photo-1613919113640-25732ec5e61f", "photo-1566478989037-eec175614204", "photo-1621939514649-cecb6959c1a0"] }),
  product({ id: "chip-lays-cream-onion", name: "Lay's American Style Cream & Onion", brand: "Lay's", unit: "52 g", price: 20, mrp: 20, photos: ["photo-1599490659213-e2b9527bd087", "photo-1566478989037-eec175614204", "photo-1621447504864-d8686e126901"] }),
  product({ id: "chip-lays-spanish", name: "Lay's Spanish Tomato Tango", brand: "Lay's", unit: "52 g", price: 20, mrp: 20, photos: ["photo-1621447504864-d8686e126901", "photo-1613919113640-25732ec5e61f", "photo-1566478989037-eec175614204"] }),
  product({ id: "chip-lays-west-indies", name: "Lay's West Indies Hot n Sweet Chilli", brand: "Lay's", unit: "52 g", price: 20, mrp: 20, photos: ["photo-1613919113640-25732ec5e61f", "photo-1599490659213-e2b9527bd087", "photo-1621939514649-cecb6959c1a0"] }),

  // Doritos
  product({ id: "chip-doritos-nacho", name: "Doritos Nacho Cheese", brand: "Doritos", unit: "70 g", price: 40, mrp: 45, photos: ["photo-1613919113640-25732ec5e61f", "photo-1621447504864-d8686e126901", "photo-1566478989037-eec175614204"] }),
  product({ id: "chip-doritos-cool", name: "Doritos Cool Ranch", brand: "Doritos", unit: "70 g", price: 40, mrp: 45, photos: ["photo-1599490659213-e2b9527bd087", "photo-1613919113640-25732ec5e61f", "photo-1621447504864-d8686e126901"] }),
  product({ id: "chip-doritos-flama", name: "Doritos Flamin' Hot", brand: "Doritos", unit: "70 g", price: 40, mrp: 45, photos: ["photo-1621939514649-cecb6959c1a0", "photo-1613919113640-25732ec5e61f", "photo-1566478989037-eec175614204"] }),
  product({ id: "chip-doritos-bbq", name: "Doritos Sweet Chili", brand: "Doritos", unit: "70 g", price: 40, mrp: 45, photos: ["photo-1566478989037-eec175614204", "photo-1599490659213-e2b9527bd087", "photo-1621939514649-cecb6959c1a0"] }),
  product({ id: "chip-doritos-cheese", name: "Doritos Cheese Supreme", brand: "Doritos", unit: "70 g", price: 40, mrp: 45, photos: ["photo-1621447504864-d8686e126901", "photo-1566478989037-eec175614204", "photo-1613919113640-25732ec5e61f"] }),

  // Kurkure
  product({ id: "chip-kurkure-masala", name: "Kurkure Masala Munch", brand: "Kurkure", unit: "75 g", price: 20, mrp: 20, photos: ["photo-1621939514649-cecb6959c1a0", "photo-1601050690597-df0568f70950", "photo-1599490659213-e2b9527bd087"] }),
  product({ id: "chip-kurkure-green", name: "Kurkure Green Chutney Rajasthani Style", brand: "Kurkure", unit: "75 g", price: 20, mrp: 20, photos: ["photo-1601050690597-df0568f70950", "photo-1621939514649-cecb6959c1a0", "photo-1566478989037-eec175614204"] }),
  product({ id: "chip-kurkure-puff", name: "Kurkure Puffcorn Yummy Cheese", brand: "Kurkure", unit: "55 g", price: 20, mrp: 20, photos: ["photo-1578849278619-e73505e9610f", "photo-1621939514649-cecb6959c1a0", "photo-1601050690597-df0568f70950"] }),
  product({ id: "chip-kurkure-chilli", name: "Kurkure Chilli Chatka", brand: "Kurkure", unit: "75 g", price: 20, mrp: 20, photos: ["photo-1613919113640-25732ec5e61f", "photo-1621939514649-cecb6959c1a0", "photo-1601050690597-df0568f70950"] }),
  product({ id: "chip-kurkure-solid", name: "Kurkure Solid Masti", brand: "Kurkure", unit: "75 g", price: 20, mrp: 20, photos: ["photo-1599490659213-e2b9527bd087", "photo-1601050690597-df0568f70950", "photo-1621939514649-cecb6959c1a0"] }),

  // Pringles
  product({ id: "chip-pringles-orig", name: "Pringles Original", brand: "Pringles", unit: "107 g", price: 99, mrp: 110, photos: ["photo-1621447504864-d8686e126901", "photo-1566478989037-eec175614204", "photo-1599490659213-e2b9527bd087"] }),
  product({ id: "chip-pringles-sour", name: "Pringles Sour Cream & Onion", brand: "Pringles", unit: "107 g", price: 99, mrp: 110, photos: ["photo-1599490659213-e2b9527bd087", "photo-1621447504864-d8686e126901", "photo-1566478989037-eec175614204"] }),
  product({ id: "chip-pringles-bbq", name: "Pringles BBQ", brand: "Pringles", unit: "107 g", price: 99, mrp: 110, photos: ["photo-1613919113640-25732ec5e61f", "photo-1621447504864-d8686e126901", "photo-1621939514649-cecb6959c1a0"] }),
  product({ id: "chip-pringles-cheese", name: "Pringles Cheddar Cheese", brand: "Pringles", unit: "107 g", price: 99, mrp: 110, photos: ["photo-1566478989037-eec175614204", "photo-1621447504864-d8686e126901", "photo-1599490659213-e2b9527bd087"] }),
  product({ id: "chip-pringles-peri", name: "Pringles Peri Peri", brand: "Pringles", unit: "107 g", price: 99, mrp: 110, photos: ["photo-1621939514649-cecb6959c1a0", "photo-1621447504864-d8686e126901", "photo-1613919113640-25732ec5e61f"] }),

  // Bingo / Uncle Chipps
  product({ id: "chip-bingo-mad", name: "Bingo Mad Angles Masala Madness", brand: "Bingo", unit: "66 g", price: 20, mrp: 20, photos: ["photo-1599490659213-e2b9527bd087", "photo-1613919113640-25732ec5e61f", "photo-1566478989037-eec175614204"] }),
  product({ id: "chip-bingo-tomato", name: "Bingo Mad Angles Tomato Madness", brand: "Bingo", unit: "66 g", price: 20, mrp: 20, photos: ["photo-1613919113640-25732ec5e61f", "photo-1599490659213-e2b9527bd087", "photo-1621447504864-d8686e126901"] }),
  product({ id: "chip-bingo-achat", name: "Bingo Tedhe Medhe", brand: "Bingo", unit: "70 g", price: 20, mrp: 20, photos: ["photo-1621939514649-cecb6959c1a0", "photo-1599490659213-e2b9527bd087", "photo-1601050690597-df0568f70950"] }),
  product({ id: "chip-uncle-spicy", name: "Uncle Chipps Spicy Treat", brand: "Uncle Chipps", unit: "55 g", price: 20, mrp: 20, photos: ["photo-1613919113640-25732ec5e61f", "photo-1566478989037-eec175614204", "photo-1621447504864-d8686e126901"] }),
  product({ id: "chip-uncle-plain", name: "Uncle Chipps Plain Salted", brand: "Uncle Chipps", unit: "55 g", price: 20, mrp: 20, photos: ["photo-1566478989037-eec175614204", "photo-1621447504864-d8686e126901", "photo-1599490659213-e2b9527bd087"] }),

  // Healthy / protein chips
  product({ id: "chip-yoga-bar", name: "Yoga Bar Multigrain Chips Peri Peri", brand: "Yoga Bar", unit: "60 g", price: 50, mrp: 55, photos: ["photo-1599490659213-e2b9527bd087", "photo-1512621776951-a57141f2eefd", "photo-1546069901-ba9599a7e63c"] }),
  product({ id: "chip-yoga-quinoa", name: "Yoga Bar Quinoa Chips Cheese", brand: "Yoga Bar", unit: "60 g", price: 55, mrp: 60, photos: ["photo-1512621776951-a57141f2eefd", "photo-1599490659213-e2b9527bd087", "photo-1490645935967-10de6ba17061"] }),
  product({ id: "chip-open-secret", name: "Open Secret Protein Chips Cream Onion", brand: "Open Secret", unit: "60 g", price: 60, mrp: 70, photos: ["photo-1490645935967-10de6ba17061", "photo-1566478989037-eec175614204", "photo-1512621776951-a57141f2eefd"] }),
  product({ id: "chip-the-whole-truth", name: "The Whole Truth Baked Chips", brand: "The Whole Truth", unit: "50 g", price: 65, mrp: 75, photos: ["photo-1546069901-ba9599a7e63c", "photo-1512621776951-a57141f2eefd", "photo-1599490659213-e2b9527bd087"] }),
  product({ id: "chip-hippie-snack", name: "Hippie Snacks Cauliflower Crisps", brand: "Hippie Snacks", unit: "70 g", price: 199, mrp: 220, photos: ["photo-1512621776951-a57141f2eefd", "photo-1546069901-ba9599a7e63c", "photo-1490645935967-10de6ba17061"] }),

  // Namkeen — Haldiram's
  product({ id: "nam-haldiram-bhujia", name: "Haldiram's Aloo Bhujia", brand: "Haldiram's", unit: "200 g", price: 55, mrp: 60, photos: ["photo-1601050690597-df0568f70950", "photo-1621939514649-cecb6959c1a0", "photo-1599490659213-e2b9527bd087"] }),
  product({ id: "nam-haldiram-mixture", name: "Haldiram's Navratan Mixture", brand: "Haldiram's", unit: "200 g", price: 58, mrp: 65, photos: ["photo-1621939514649-cecb6959c1a0", "photo-1601050690597-df0568f70950", "photo-1566478989037-eec175614204"] }),
  product({ id: "nam-haldiram-moong", name: "Haldiram's Moong Dal", brand: "Haldiram's", unit: "200 g", price: 60, mrp: 68, photos: ["photo-1596797038530-2c107229654b", "photo-1601050690597-df0568f70950", "photo-1621939514649-cecb6959c1a0"] }),
  product({ id: "nam-haldiram-khata", name: "Haldiram's Khata Meetha", brand: "Haldiram's", unit: "200 g", price: 55, mrp: 62, photos: ["photo-1601050690597-df0568f70950", "photo-1599490659213-e2b9527bd087", "photo-1621939514649-cecb6959c1a0"] }),
  product({ id: "nam-haldiram-sev", name: "Haldiram's Plain Sev", brand: "Haldiram's", unit: "200 g", price: 50, mrp: 55, photos: ["photo-1621939514649-cecb6959c1a0", "photo-1596797038530-2c107229654b", "photo-1601050690597-df0568f70950"] }),

  // Namkeen — Bikaji / Balaji
  product({ id: "nam-bikaji-bhujia", name: "Bikaji Bhujia", brand: "Bikaji", unit: "200 g", price: 52, mrp: 58, photos: ["photo-1601050690597-df0568f70950", "photo-1621939514649-cecb6959c1a0", "photo-1613919113640-25732ec5e61f"] }),
  product({ id: "nam-bikaji-kachori", name: "Bikaji Kachori", brand: "Bikaji", unit: "200 g", price: 65, mrp: 75, photos: ["photo-1621939514649-cecb6959c1a0", "photo-1601050690597-df0568f70950", "photo-1599490659213-e2b9527bd087"] }),
  product({ id: "nam-bikaji-rattlami", name: "Bikaji Ratlami Sev", brand: "Bikaji", unit: "200 g", price: 55, mrp: 60, photos: ["photo-1596797038530-2c107229654b", "photo-1601050690597-df0568f70950", "photo-1621939514649-cecb6959c1a0"] }),
  product({ id: "nam-balaji-wafers", name: "Balaji Wafers Simply Salted", brand: "Balaji", unit: "135 g", price: 30, mrp: 35, photos: ["photo-1566478989037-eec175614204", "photo-1621447504864-d8686e126901", "photo-1599490659213-e2b9527bd087"] }),
  product({ id: "nam-balaji-chaat", name: "Balaji Chaat Chaska", brand: "Balaji", unit: "150 g", price: 30, mrp: 35, photos: ["photo-1621939514649-cecb6959c1a0", "photo-1566478989037-eec175614204", "photo-1601050690597-df0568f70950"] }),

  // Popcorn
  product({ id: "snack-actii-butter", name: "Act II Butter Delight Popcorn", brand: "Act II", unit: "30 g", price: 25, mrp: 30, photos: ["photo-1578849278619-e73505e9610f", "photo-1585647347483-22b66260dfff", "photo-1505686994434-e3cc5abf1330"] }),
  product({ id: "snack-actii-cheese", name: "Act II Cheese Popcorn", brand: "Act II", unit: "30 g", price: 25, mrp: 30, photos: ["photo-1585647347483-22b66260dfff", "photo-1578849278619-e73505e9610f", "photo-1505686994434-e3cc5abf1330"] }),
  product({ id: "snack-actii-salted", name: "Act II Classic Salted Popcorn", brand: "Act II", unit: "30 g", price: 20, mrp: 25, photos: ["photo-1505686994434-e3cc5abf1330", "photo-1578849278619-e73505e9610f", "photo-1585647347483-22b66260dfff"] }),
];
