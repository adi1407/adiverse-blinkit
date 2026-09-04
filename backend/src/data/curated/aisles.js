import { product } from "./helpers.js";

export const vegProducts = [
  product({ id: "veg-onion", name: "Onion", brand: "Fresh", unit: "1 kg", price: 36, mrp: 42, photos: ["photo-1518977822534-7049a61ee0c2", "photo-1508747703725-719777637510", "photo-1587049352846-4a222e784d38"] }),
  product({ id: "veg-tomato", name: "Tomato", brand: "Fresh", unit: "500 g", price: 28, mrp: 32, photos: ["photo-1592924357228-91a4daadcfea", "photo-1546470427-e212b7d31075", "photo-1561136594-7f684c1eff6f"] }),
  product({ id: "veg-potato", name: "Potato", brand: "Fresh", unit: "1 kg", price: 32, mrp: 38, photos: ["photo-1518977676601-b53f82aba655", "photo-1590165482129-1b8b27698780", "photo-1508313880031-4f5c8c0a0f0f"] }),
  product({ id: "veg-banana", name: "Banana Robusta", brand: "Fresh", unit: "6 pcs", price: 49, mrp: 55, photos: ["photo-1571771894821-ce9b6c11b08e", "photo-1603833665858-e61d17a86224", "photo-1528825871115-3581ae39ce89"] }),
  product({ id: "veg-cucumber", name: "Cucumber", brand: "Fresh", unit: "500 g", price: 22, mrp: 28, photos: ["photo-1449300079323-98d43db8b1c0", "photo-1604977049044-2800d0b0f0f0", "photo-1568584719471-f4f0f0f0f0f0"] }),
  product({ id: "veg-apple", name: "Apple Royal Gala", brand: "Fresh", unit: "4 pcs", price: 160, mrp: 185, photos: ["photo-1560806887-1e4cd0b6cbd6", "photo-1568702846914-96b305d2aaeb", "photo-1570913149827-d2ac84ab3f9a"] }),
  product({ id: "veg-carrot", name: "Carrot", brand: "Fresh", unit: "500 g", price: 30, mrp: 36, photos: ["photo-1598170845058-32b9d6a5da37", "photo-1447176301812-16b0f0f0f0f0", "photo-1518977676601-b53f82aba655"] }),
  product({ id: "veg-lemon", name: "Lemon", brand: "Fresh", unit: "250 g", price: 24, mrp: 30, photos: ["photo-1570197788417-0e723334cb37", "photo-1590502593747-42a996133562", "photo-1587049352846-4a222e784d38"] }),
  product({ id: "veg-spinach", name: "Palak / Spinach", brand: "Fresh", unit: "1 bunch", price: 20, mrp: 25, photos: ["photo-1576045057995-568f588f82fb", "photo-1512621776951-a57141f2eefd", "photo-1540420773420-3366772f4999"] }),
  product({ id: "veg-capsicum", name: "Capsicum Green", brand: "Fresh", unit: "500 g", price: 45, mrp: 55, photos: ["photo-1563565375-f3fdfdbefa83", "photo-1592924357228-91a4daadcfea", "photo-1518977822534-7049a61ee0c2"] }),
  product({ id: "veg-ginger", name: "Ginger", brand: "Fresh", unit: "200 g", price: 30, mrp: 36, photos: ["photo-1599909533936-b894b409bbc0", "photo-1615485290382-441e4d049cb5", "photo-1506368083636-6defb67639a7"] }),
  product({ id: "veg-garlic", name: "Garlic", brand: "Fresh", unit: "200 g", price: 35, mrp: 42, photos: ["photo-1506368083636-6defb67639a7", "photo-1599909533936-b894b409bbc0", "photo-1518977822534-7049a61ee0c2"] }),
  product({ id: "veg-orange", name: "Orange Nagpur", brand: "Fresh", unit: "1 kg", price: 80, mrp: 95, photos: ["photo-1547514701-42782126124d", "photo-1582979512210-99b6a53386f9", "photo-1611080626919-7cf5a9dbab5b"] }),
  product({ id: "veg-mango", name: "Alphonso Mango", brand: "Fresh", unit: "2 pcs", price: 220, mrp: 250, photos: ["photo-1553279768-865429fa0078", "photo-1601493700631-2b16ec4b28d0", "photo-1591078609752-0c0f0f0f0f0f"] }),
  product({ id: "veg-cauliflower", name: "Cauliflower", brand: "Fresh", unit: "1 pc", price: 40, mrp: 48, photos: ["photo-1568584719471-0f0f0f0f0f0f", "photo-1512621776951-a57141f2eefd", "photo-1540420773420-3366772f4999"] }),
];

export const meatProducts = [
  product({ id: "meat-chicken-curry", name: "Chicken Curry Cut", brand: "Fresh", unit: "500 g", price: 165, mrp: 185, photos: ["photo-1604503468506-a8da13d82713", "photo-1587593810167-a84920ea0781", "photo-1604908176997-125f25cc6f3d"] }),
  product({ id: "meat-chicken-breast", name: "Chicken Breast Boneless", brand: "Fresh", unit: "450 g", price: 210, mrp: 240, photos: ["photo-1604908176997-125f25cc6f3d", "photo-1604503468506-a8da13d82713", "photo-1587593810167-a84920ea0781"] }),
  product({ id: "meat-chicken-keema", name: "Chicken Keema", brand: "Fresh", unit: "250 g", price: 120, mrp: 140, photos: ["photo-1529692236671-f1f6cf9683ba", "photo-1604503468506-a8da13d82713", "photo-1604908176997-125f25cc6f3d"] }),
  product({ id: "meat-mutton", name: "Mutton Curry Cut", brand: "Fresh", unit: "500 g", price: 390, mrp: 420, photos: ["photo-1603048297172-c92544798d5a", "photo-1529692236671-f1f6cf9683ba", "photo-1604503468506-a8da13d82713"] }),
  product({ id: "meat-rohu", name: "Rohu Fish", brand: "Fresh", unit: "500 g", price: 220, mrp: 250, photos: ["photo-1519708227418-c8fd9a32b7a2", "photo-1519708227418-c8fd9a32b7a2", "photo-1565680018434-b513d5e5fd47"] }),
  product({ id: "meat-prawns", name: "Prawns Medium", brand: "Fresh", unit: "250 g", price: 280, mrp: 320, photos: ["photo-1565680018434-b513d5e5fd47", "photo-1519708227418-c8fd9a32b7a2", "photo-1604503468506-a8da13d82713"] }),
  product({ id: "meat-eggs-12", name: "Farm Eggs Pack", brand: "Farm Fresh", unit: "12 pcs", price: 96, mrp: 110, photos: ["photo-1582722872445-44dc5f7e3c8f", "photo-1482049016688-2d3e1b311543", "photo-1506976785307-45a436d8ce0a"] }),
  product({ id: "meat-chicken-wings", name: "Chicken Wings", brand: "Fresh", unit: "500 g", price: 175, mrp: 195, photos: ["photo-1587593810167-a84920ea0781", "photo-1604908176997-125f25cc6f3d", "photo-1604503468506-a8da13d82713"] }),
];

export const bakeryProducts = [
  product({ id: "bakery-parleg", name: "Parle-G Original Gluco Biscuits", brand: "Parle", unit: "250 g", price: 30, mrp: 30, photos: ["photo-1558961363-fa8fdf82db35", "photo-1486427944299-d1955d23e34d", "photo-1499636136210-6f4ee915583e"] }),
  product({ id: "bakery-oreo", name: "Oreo Original", brand: "Oreo", unit: "120 g", price: 30, mrp: 35, photos: ["photo-1499636136210-6f4ee915583e", "photo-1606313564200-e75d5e30476c", "photo-1558961363-fa8fdf82db35"] }),
  product({ id: "bakery-goodday", name: "Britannia Good Day Cashew", brand: "Britannia", unit: "200 g", price: 40, mrp: 45, photos: ["photo-1486427944299-d1955d23e34d", "photo-1558961363-fa8fdf82db35", "photo-1606312619070-d48b4c652a52"] }),
  product({ id: "bakery-hide", name: "Hide & Seek Chocolate Chip", brand: "Parle", unit: "120 g", price: 30, mrp: 30, photos: ["photo-1606313564200-e75d5e30476c", "photo-1499636136210-6f4ee915583e", "photo-1606312619070-d48b4c652a52"] }),
  product({ id: "bakery-darkfantasy", name: "Sunfeast Dark Fantasy Choco Fills", brand: "Sunfeast", unit: "75 g", price: 35, mrp: 40, photos: ["photo-1606312619070-d48b4c652a52", "photo-1606313564200-e75d5e30476c", "photo-1499636136210-6f4ee915583e"] }),
  product({ id: "bakery-jimjam", name: "Britannia Jim Jam", brand: "Britannia", unit: "100 g", price: 30, mrp: 35, photos: ["photo-1558961363-fa8fdf82db35", "photo-1486427944299-d1955d23e34d", "photo-1606313564200-e75d5e30476c"] }),
  product({ id: "bakery-bourbon", name: "Britannia Bourbon", brand: "Britannia", unit: "150 g", price: 30, mrp: 35, photos: ["photo-1606313564200-e75d5e30476c", "photo-1558961363-fa8fdf82db35", "photo-1499636136210-6f4ee915583e"] }),
  product({ id: "bakery-marie", name: "Britannia Marie Gold", brand: "Britannia", unit: "250 g", price: 35, mrp: 40, photos: ["photo-1486427944299-d1955d23e34d", "photo-1558961363-fa8fdf82db35", "photo-1606312619070-d48b4c652a52"] }),
  product({ id: "bakery-monaco", name: "Parle Monaco Classic", brand: "Parle", unit: "200 g", price: 30, mrp: 35, photos: ["photo-1558961363-fa8fdf82db35", "photo-1606313564200-e75d5e30476c", "photo-1486427944299-d1955d23e34d"] }),
  product({ id: "bakery-cake", name: "Britannia Fruit Cake Slice", brand: "Britannia", unit: "50 g", price: 20, mrp: 25, photos: ["photo-1578985545062-69928b1d9587", "photo-1464349095431-e9a21285b5f3", "photo-1486427944299-d1955d23e34d"] }),
];

export const personalCareProducts = [
  product({ id: "pc-dove-soap", name: "Dove Cream Beauty Bathing Bar", brand: "Dove", unit: "100 g", price: 55, mrp: 65, photos: ["photo-1584305574647-0cc949a2bb9f", "photo-1556228578-0d85b1a4d571", "photo-1607619056574-7b8d3ee536b2"] }),
  product({ id: "pc-colgate", name: "Colgate Strong Teeth", brand: "Colgate", unit: "200 g", price: 110, mrp: 125, photos: ["photo-1559591937-abc3a2bc4d0d", "photo-1607619056574-7b8d3ee536b2", "photo-1584305574647-0cc949a2bb9f"] }),
  product({ id: "pc-hs", name: "Head & Shoulders Anti-Dandruff", brand: "Head & Shoulders", unit: "180 ml", price: 165, mrp: 190, photos: ["photo-1535585209827-a15fcdbc4c2d", "photo-1522335789203-aabd1fc54bc9", "photo-1556228578-0d85b1a4d571"] }),
  product({ id: "pc-nivea", name: "Nivea Soft Cream", brand: "Nivea", unit: "100 ml", price: 99, mrp: 120, photos: ["photo-1556228578-0d85b1a4d571", "photo-1522335789203-aabd1fc54bc9", "photo-1584305574647-0cc949a2bb9f"] }),
  product({ id: "pc-gillette", name: "Gillette Guard Razor", brand: "Gillette", unit: "1 pc", price: 25, mrp: 30, photos: ["photo-1621607512214-68297480165e", "photo-1522335789203-aabd1fc54bc9", "photo-1607619056574-7b8d3ee536b2"] }),
  product({ id: "pc-dettol-hw", name: "Dettol Handwash Skincare", brand: "Dettol", unit: "200 ml", price: 89, mrp: 99, photos: ["photo-1584305574647-0cc949a2bb9f", "photo-1583947215259-38e31be8751f", "photo-1556228578-0d85b1a4d571"] }),
  product({ id: "pc-lifebuoy", name: "Lifebuoy Total Soap", brand: "Lifebuoy", unit: "100 g", price: 30, mrp: 35, photos: ["photo-1607619056574-7b8d3ee536b2", "photo-1584305574647-0cc949a2bb9f", "photo-1556228578-0d85b1a4d571"] }),
  product({ id: "pc-clinic-plus", name: "Clinic Plus Shampoo", brand: "Clinic Plus", unit: "175 ml", price: 95, mrp: 110, photos: ["photo-1522335789203-aabd1fc54bc9", "photo-1535585209827-a15fcdbc4c2d", "photo-1556228578-0d85b1a4d571"] }),
  product({ id: "pc-pepsodent", name: "Pepsodent Germicheck", brand: "Pepsodent", unit: "150 g", price: 85, mrp: 95, photos: ["photo-1559591937-abc3a2bc4d0d", "photo-1607619056574-7b8d3ee536b2", "photo-1583947215259-38e31be8751f"] }),
  product({ id: "pc-vaseline", name: "Vaseline Intensive Care Lotion", brand: "Vaseline", unit: "200 ml", price: 145, mrp: 165, photos: ["photo-1556228578-0d85b1a4d571", "photo-1522335789203-aabd1fc54bc9", "photo-1584305574647-0cc949a2bb9f"] }),
];

export const babyProducts = [
  product({ id: "baby-pampers", name: "Pampers Pants M", brand: "Pampers", unit: "56 pcs", price: 699, mrp: 799, photos: ["photo-1515488042361-ee00e0ddd4e4", "photo-1519689680058-324335c77eba", "photo-1555252333-9f8e92e65df9"] }),
  product({ id: "baby-huggies", name: "Huggies Wonder Pants M", brand: "Huggies", unit: "50 pcs", price: 649, mrp: 749, photos: ["photo-1519689680058-324335c77eba", "photo-1515488042361-ee00e0ddd4e4", "photo-1555252333-9f8e92e65df9"] }),
  product({ id: "baby-johnson-soap", name: "Johnson's Baby Soap", brand: "Johnson's", unit: "75 g", price: 55, mrp: 65, photos: ["photo-1555252333-9f8e92e65df9", "photo-1515488042361-ee00e0ddd4e4", "photo-1556228578-0d85b1a4d571"] }),
  product({ id: "baby-himalaya", name: "Himalaya Baby Lotion", brand: "Himalaya", unit: "200 ml", price: 145, mrp: 165, photos: ["photo-1556228578-0d85b1a4d571", "photo-1555252333-9f8e92e65df9", "photo-1519689680058-324335c77eba"] }),
  product({ id: "baby-cerelac", name: "Nestlé Cerelac Wheat", brand: "Cerelac", unit: "300 g", price: 245, mrp: 275, photos: ["photo-1574323347407-f5e1ad6d020b", "photo-1515488042361-ee00e0ddd4e4", "photo-1490645935967-10de6ba17061"] }),
  product({ id: "baby-wipes", name: "Himalaya Baby Wipes", brand: "Himalaya", unit: "72 pcs", price: 120, mrp: 140, photos: ["photo-1583947215259-38e31be8751f", "photo-1555252333-9f8e92e65df9", "photo-1515488042361-ee00e0ddd4e4"] }),
  product({ id: "baby-oil", name: "Johnson's Baby Oil", brand: "Johnson's", unit: "200 ml", price: 165, mrp: 185, photos: ["photo-1556228578-0d85b1a4d571", "photo-1519689680058-324335c77eba", "photo-1555252333-9f8e92e65df9"] }),
  product({ id: "baby-powder", name: "Himalaya Baby Powder", brand: "Himalaya", unit: "200 g", price: 110, mrp: 125, photos: ["photo-1515488042361-ee00e0ddd4e4", "photo-1556228578-0d85b1a4d571", "photo-1519689680058-324335c77eba"] }),
];

export const petProducts = [
  product({ id: "pet-pedigree", name: "Pedigree Adult Dog Food", brand: "Pedigree", unit: "1.2 kg", price: 320, mrp: 360, photos: ["photo-1587300003388-59208cc962cb", "photo-1548199973-03cce0bbc87b", "photo-1583511655857-d19b40a7a54e"] }),
  product({ id: "pet-whiskas", name: "Whiskas Tuna Cat Food", brand: "Whiskas", unit: "1.2 kg", price: 340, mrp: 380, photos: ["photo-1574158622682-e40e69881006", "photo-1514888286974-6c03e2ca1dba", "photo-1573865526739-10659fec78a0"] }),
  product({ id: "pet-shampoo", name: "Pet Shampoo Mild", brand: "PetCare", unit: "200 ml", price: 180, mrp: 210, photos: ["photo-1548199973-03cce0bbc87b", "photo-1587300003388-59208cc962cb", "photo-1530281700549-e82e7bf110d6"] }),
  product({ id: "pet-chew", name: "Dog Chew Stick", brand: "PetCare", unit: "4 pcs", price: 90, mrp: 110, photos: ["photo-1587300003388-59208cc962cb", "photo-1530281700549-e82e7bf110d6", "photo-1548199973-03cce0bbc87b"] }),
  product({ id: "pet-litter", name: "Cat Litter Clumping", brand: "PetCare", unit: "5 kg", price: 450, mrp: 520, photos: ["photo-1514888286974-6c03e2ca1dba", "photo-1574158622682-e40e69881006", "photo-1573865526739-10659fec78a0"] }),
  product({ id: "pet-collar", name: "Dog Collar Adjustable", brand: "PetCare", unit: "1 pc", price: 199, mrp: 249, photos: ["photo-1583511655857-d19b40a7a54e", "photo-1530281700549-e82e7bf110d6", "photo-1587300003388-59208cc962cb"] }),
];
