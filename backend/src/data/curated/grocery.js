import { product } from "./helpers.js";

export const dairyProducts = [
  product({ id: "milk-amul-taaza", name: "Amul Taaza Toned Milk", brand: "Amul", unit: "500 ml", price: 28, mrp: 30, photos: ["photo-1563636619-e9143da7973b", "photo-1550583724-b2692b85b150", "photo-1628088062854-d1870b4553da"] }),
  product({ id: "milk-amul-gold", name: "Amul Gold Full Cream Milk", brand: "Amul", unit: "500 ml", price: 33, mrp: 35, photos: ["photo-1550583724-b2692b85b150", "photo-1563636619-e9143da7973b", "photo-1571212515416-fef01fc43637"] }),
  product({ id: "milk-mother-toned", name: "Mother Dairy Toned Milk", brand: "Mother Dairy", unit: "500 ml", price: 27, mrp: 29, photos: ["photo-1571212515416-fef01fc43637", "photo-1563636619-e9143da7973b", "photo-1550583724-b2692b85b150"] }),
  product({ id: "milk-mother-full", name: "Mother Dairy Full Cream Milk", brand: "Mother Dairy", unit: "1 L", price: 64, mrp: 68, photos: ["photo-1563636619-e9143da7973b", "photo-1628088062854-d1870b4553da", "photo-1571212515416-fef01fc43637"] }),
  product({ id: "milk-nestle-a+", name: "Nestlé A+ Toned Milk", brand: "Nestlé", unit: "1 L", price: 66, mrp: 70, photos: ["photo-1550583724-b2692b85b150", "photo-1571212515416-fef01fc43637", "photo-1563636619-e9143da7973b"] }),

  product({ id: "egg-farm-6", name: "Farm Fresh Eggs", brand: "Farm Fresh", unit: "6 pcs", price: 52, mrp: 60, photos: ["photo-1582722872445-44dc5f7e3c8f", "photo-1482049016688-2d3e1b311543", "photo-1506976785307-45a436d8ce0a"] }),
  product({ id: "egg-farm-12", name: "Farm Fresh Eggs Tray", brand: "Farm Fresh", unit: "12 pcs", price: 96, mrp: 110, photos: ["photo-1482049016688-2d3e1b311543", "photo-1582722872445-44dc5f7e3c8f", "photo-1506976785307-45a436d8ce0a"] }),
  product({ id: "egg-organic-6", name: "Organic Brown Eggs", brand: "Organic", unit: "6 pcs", price: 78, mrp: 90, photos: ["photo-1506976785307-45a436d8ce0a", "photo-1582722872445-44dc5f7e3c8f", "photo-1482049016688-2d3e1b311543"] }),
  product({ id: "egg-country-6", name: "Country Eggs", brand: "Local", unit: "6 pcs", price: 60, mrp: 70, photos: ["photo-1582722872445-44dc5f7e3c8f", "photo-1506976785307-45a436d8ce0a", "photo-1482049016688-2d3e1b311543"] }),
  product({ id: "egg-quail-12", name: "Quail Eggs", brand: "Farm Fresh", unit: "12 pcs", price: 85, mrp: 95, photos: ["photo-1482049016688-2d3e1b311543", "photo-1506976785307-45a436d8ce0a", "photo-1582722872445-44dc5f7e3c8f"] }),

  product({ id: "bread-britannia-white", name: "Britannia White Bread", brand: "Britannia", unit: "400 g", price: 45, mrp: 50, photos: ["photo-1509440159596-0249088772ff", "photo-1549931319-a545dcf3bc73", "photo-1586444248902-2f64eddc13df"] }),
  product({ id: "bread-britannia-brown", name: "Britannia Whole Wheat Bread", brand: "Britannia", unit: "400 g", price: 50, mrp: 55, photos: ["photo-1549931319-a545dcf3bc73", "photo-1509440159596-0249088772ff", "photo-1586444248902-2f64eddc13df"] }),
  product({ id: "bread-english-oven", name: "English Oven Sandwich Bread", brand: "English Oven", unit: "400 g", price: 48, mrp: 55, photos: ["photo-1586444248902-2f64eddc13df", "photo-1509440159596-0249088772ff", "photo-1549931319-a545dcf3bc73"] }),
  product({ id: "bread-modern", name: "Modern Whole Wheat Bread", brand: "Modern", unit: "400 g", price: 46, mrp: 52, photos: ["photo-1509440159596-0249088772ff", "photo-1586444248902-2f64eddc13df", "photo-1549931319-a545dcf3bc73"] }),
  product({ id: "bread-pav", name: "Fresh Pav Buns", brand: "Local Bakery", unit: "6 pcs", price: 30, mrp: 35, photos: ["photo-1549931319-a545dcf3bc73", "photo-1509440159596-0249088772ff", "photo-1555507036-ab1f4038808a"] }),

  product({ id: "dairy-amul-butter", name: "Amul Butter", brand: "Amul", unit: "100 g", price: 58, mrp: 62, photos: ["photo-1589985270826-4b7bb135bc9d", "photo-1628088062854-d1870b4553da", "photo-1486297678162-eb2a19b0a32d"] }),
  product({ id: "dairy-amul-cheese", name: "Amul Cheese Slices", brand: "Amul", unit: "100 g", price: 72, mrp: 80, photos: ["photo-1486297678162-eb2a19b0a32d", "photo-1589985270826-4b7bb135bc9d", "photo-1550583724-b2692b85b150"] }),
  product({ id: "dairy-mother-curd", name: "Mother Dairy Classic Curd", brand: "Mother Dairy", unit: "400 g", price: 35, mrp: 40, photos: ["photo-1628088062854-d1870b4553da", "photo-1550583724-b2692b85b150", "photo-1563636619-e9143da7973b"] }),
  product({ id: "dairy-amul-paneer", name: "Amul Paneer", brand: "Amul", unit: "200 g", price: 85, mrp: 95, photos: ["photo-1631452180519-c014fe946bc7", "photo-1486297678162-eb2a19b0a32d", "photo-1628088062854-d1870b4553da"] }),
  product({ id: "dairy-amul-ghee", name: "Amul Cow Ghee", brand: "Amul", unit: "500 ml", price: 325, mrp: 350, photos: ["photo-1474979266404-7eaacbcd87c5", "photo-1589985270826-4b7bb135bc9d", "photo-1628088062854-d1870b4553da"] }),
];

export const staplesProducts = [
  product({ id: "atta-aashirvaad-5", name: "Aashirvaad Shudh Whole Wheat Atta", brand: "Aashirvaad", unit: "5 kg", price: 248, mrp: 275, photos: ["photo-1574323347407-f5e1ad6d020b", "photo-1509440159596-0249088772ff", "photo-1586201375761-83865001e31c"] }),
  product({ id: "atta-aashirvaad-10", name: "Aashirvaad Atta", brand: "Aashirvaad", unit: "10 kg", price: 475, mrp: 520, photos: ["photo-1509440159596-0249088772ff", "photo-1574323347407-f5e1ad6d020b", "photo-1586201375761-83865001e31c"] }),
  product({ id: "atta-fortune", name: "Fortune Chakki Fresh Atta", brand: "Fortune", unit: "5 kg", price: 235, mrp: 260, photos: ["photo-1574323347407-f5e1ad6d020b", "photo-1586201375761-83865001e31c", "photo-1509440159596-0249088772ff"] }),
  product({ id: "atta-pillsbury", name: "Pillsbury Chakki Fresh Atta", brand: "Pillsbury", unit: "5 kg", price: 255, mrp: 280, photos: ["photo-1586201375761-83865001e31c", "photo-1574323347407-f5e1ad6d020b", "photo-1509440159596-0249088772ff"] }),
  product({ id: "atta-organic", name: "Organic Tattva Whole Wheat Atta", brand: "Organic Tattva", unit: "5 kg", price: 320, mrp: 360, photos: ["photo-1509440159596-0249088772ff", "photo-1574323347407-f5e1ad6d020b", "photo-1615485290382-441e4d049cb5"] }),

  product({ id: "rice-indiagate", name: "India Gate Classic Basmati Rice", brand: "India Gate", unit: "1 kg", price: 145, mrp: 165, photos: ["photo-1586201375761-83865001e31c", "photo-1536304993881-ff6e9eefa2a6", "photo-1516684669134-de6f7c473a2a"] }),
  product({ id: "rice-indiagate-5", name: "India Gate Feast Rozzana", brand: "India Gate", unit: "5 kg", price: 520, mrp: 580, photos: ["photo-1536304993881-ff6e9eefa2a6", "photo-1586201375761-83865001e31c", "photo-1516684669134-de6f7c473a2a"] }),
  product({ id: "rice-daawat", name: "Daawat Rozana Super Basmati", brand: "Daawat", unit: "1 kg", price: 125, mrp: 140, photos: ["photo-1516684669134-de6f7c473a2a", "photo-1586201375761-83865001e31c", "photo-1536304993881-ff6e9eefa2a6"] }),
  product({ id: "rice-kohinoor", name: "Kohinoor Super Basmati", brand: "Kohinoor", unit: "1 kg", price: 155, mrp: 175, photos: ["photo-1586201375761-83865001e31c", "photo-1516684669134-de6f7c473a2a", "photo-1536304993881-ff6e9eefa2a6"] }),
  product({ id: "rice-sona", name: "Sona Masoori Rice", brand: "Local", unit: "5 kg", price: 320, mrp: 360, photos: ["photo-1536304993881-ff6e9eefa2a6", "photo-1516684669134-de6f7c473a2a", "photo-1586201375761-83865001e31c"] }),

  product({ id: "dal-tata-toor", name: "Tata Sampann Toor Dal", brand: "Tata Sampann", unit: "1 kg", price: 168, mrp: 180, photos: ["photo-1596797038530-2c107229654b", "photo-1615485290382-441e4d049cb5", "photo-1512621776951-a57141f2eefd"] }),
  product({ id: "dal-fortune-chana", name: "Fortune Chana Dal", brand: "Fortune", unit: "500 g", price: 72, mrp: 80, photos: ["photo-1615485290382-441e4d049cb5", "photo-1596797038530-2c107229654b", "photo-1546069901-ba9599a7e63c"] }),
  product({ id: "dal-tata-moong", name: "Tata Sampann Moong Dal", brand: "Tata Sampann", unit: "1 kg", price: 155, mrp: 170, photos: ["photo-1596797038530-2c107229654b", "photo-1512621776951-a57141f2eefd", "photo-1615485290382-441e4d049cb5"] }),
  product({ id: "dal-tata-urad", name: "Tata Sampann Urad Dal", brand: "Tata Sampann", unit: "500 g", price: 95, mrp: 105, photos: ["photo-1615485290382-441e4d049cb5", "photo-1596797038530-2c107229654b", "photo-1512621776951-a57141f2eefd"] }),
  product({ id: "dal-organic-masoor", name: "Organic Masoor Dal", brand: "Organic", unit: "500 g", price: 85, mrp: 95, photos: ["photo-1512621776951-a57141f2eefd", "photo-1615485290382-441e4d049cb5", "photo-1596797038530-2c107229654b"] }),
  product({ id: "dal-rajma", name: "Organic Rajma", brand: "Organic", unit: "500 g", price: 110, mrp: 125, photos: ["photo-1546069901-ba9599a7e63c", "photo-1615485290382-441e4d049cb5", "photo-1512621776951-a57141f2eefd"] }),
  product({ id: "dal-kabuli", name: "Kabuli Chana", brand: "Local", unit: "500 g", price: 90, mrp: 100, photos: ["photo-1615485290382-441e4d049cb5", "photo-1546069901-ba9599a7e63c", "photo-1596797038530-2c107229654b"] }),
  product({ id: "oats-quaker", name: "Quaker Oats", brand: "Quaker", unit: "1 kg", price: 185, mrp: 210, photos: ["photo-1517673402038-1c2c0f0f0f0f", "photo-1574323347407-f5e1ad6d020b", "photo-1490645935967-10de6ba17061"] }),
];

export const masalaProducts = [
  product({ id: "masala-tata-salt", name: "Tata Salt", brand: "Tata", unit: "1 kg", price: 28, mrp: 28, photos: ["photo-1621939514649-cecb6959c1a0", "photo-1596040033229-a9821ebd058d", "photo-1506368083636-6defb67639a7"] }),
  product({ id: "masala-tata-salt-lite", name: "Tata Salt Lite", brand: "Tata", unit: "1 kg", price: 40, mrp: 45, photos: ["photo-1506368083636-6defb67639a7", "photo-1621939514649-cecb6959c1a0", "photo-1596040033229-a9821ebd058d"] }),
  product({ id: "oil-fortune-sunlite", name: "Fortune Sunlite Refined Sunflower Oil", brand: "Fortune", unit: "1 L", price: 142, mrp: 155, photos: ["photo-1474979266404-7eaacbcd87c5", "photo-1478144592103-25e218a04891", "photo-1606923829579-0cb981a83e2e"] }),
  product({ id: "oil-saffola-gold", name: "Saffola Gold Oil", brand: "Saffola", unit: "1 L", price: 175, mrp: 199, photos: ["photo-1478144592103-25e218a04891", "photo-1474979266404-7eaacbcd87c5", "photo-1606923829579-0cb981a83e2e"] }),
  product({ id: "oil-fortune-mustard", name: "Fortune Kachi Ghani Mustard Oil", brand: "Fortune", unit: "1 L", price: 165, mrp: 180, photos: ["photo-1606923829579-0cb981a83e2e", "photo-1474979266404-7eaacbcd87c5", "photo-1478144592103-25e218a04891"] }),

  product({ id: "masala-mdh-haldi", name: "MDH Haldi Powder", brand: "MDH", unit: "100 g", price: 42, mrp: 48, photos: ["photo-1596040033229-a9821ebd058d", "photo-1506368083636-6defb67639a7", "photo-1599909533936-b894b409bbc0"] }),
  product({ id: "masala-mdh-lalmirch", name: "MDH Lal Mirch Powder", brand: "MDH", unit: "100 g", price: 48, mrp: 55, photos: ["photo-1599909533936-b894b409bbc0", "photo-1596040033229-a9821ebd058d", "photo-1506368083636-6defb67639a7"] }),
  product({ id: "masala-mdh-garam", name: "MDH Garam Masala", brand: "MDH", unit: "100 g", price: 72, mrp: 80, photos: ["photo-1506368083636-6defb67639a7", "photo-1596040033229-a9821ebd058d", "photo-1599909533936-b894b409bbc0"] }),
  product({ id: "masala-mdh-chana", name: "MDH Chana Masala", brand: "MDH", unit: "100 g", price: 68, mrp: 75, photos: ["photo-1596040033229-a9821ebd058d", "photo-1599909533936-b894b409bbc0", "photo-1506368083636-6defb67639a7"] }),
  product({ id: "masala-mdh-kitchen", name: "MDH Kitchen King", brand: "MDH", unit: "100 g", price: 70, mrp: 78, photos: ["photo-1599909533936-b894b409bbc0", "photo-1506368083636-6defb67639a7", "photo-1596040033229-a9821ebd058d"] }),

  product({ id: "masala-everest-garam", name: "Everest Garam Masala", brand: "Everest", unit: "50 g", price: 62, mrp: 70, photos: ["photo-1596040033229-a9821ebd058d", "photo-1506368083636-6defb67639a7", "photo-1612927601601-982702fa963a"] }),
  product({ id: "masala-everest-tikka", name: "Everest Tandoori Chicken Masala", brand: "Everest", unit: "50 g", price: 58, mrp: 65, photos: ["photo-1612927601601-982702fa963a", "photo-1596040033229-a9821ebd058d", "photo-1599909533936-b894b409bbc0"] }),
  product({ id: "masala-everest-biryani", name: "Everest Biryani Masala", brand: "Everest", unit: "50 g", price: 60, mrp: 68, photos: ["photo-1506368083636-6defb67639a7", "photo-1612927601601-982702fa963a", "photo-1596040033229-a9821ebd058d"] }),
  product({ id: "masala-everest-sambar", name: "Everest Sambhar Masala", brand: "Everest", unit: "50 g", price: 45, mrp: 52, photos: ["photo-1599909533936-b894b409bbc0", "photo-1612927601601-982702fa963a", "photo-1506368083636-6defb67639a7"] }),
  product({ id: "masala-everest-pavbhaji", name: "Everest Pav Bhaji Masala", brand: "Everest", unit: "50 g", price: 48, mrp: 55, photos: ["photo-1612927601601-982702fa963a", "photo-1506368083636-6defb67639a7", "photo-1596040033229-a9821ebd058d"] }),

  product({ id: "masala-catch-chilli", name: "Catch Red Chilli Powder", brand: "Catch", unit: "100 g", price: 48, mrp: 55, photos: ["photo-1599909533936-b894b409bbc0", "photo-1596040033229-a9821ebd058d", "photo-1506368083636-6defb67639a7"] }),
  product({ id: "masala-catch-coriander", name: "Catch Coriander Powder", brand: "Catch", unit: "100 g", price: 40, mrp: 45, photos: ["photo-1506368083636-6defb67639a7", "photo-1599909533936-b894b409bbc0", "photo-1596040033229-a9821ebd058d"] }),
  product({ id: "masala-catch-cumin", name: "Catch Jeera Powder", brand: "Catch", unit: "100 g", price: 55, mrp: 62, photos: ["photo-1596040033229-a9821ebd058d", "photo-1506368083636-6defb67639a7", "photo-1612927601601-982702fa963a"] }),
  product({ id: "masala-maggi", name: "Maggi Masala-ae-Magic", brand: "Maggi", unit: "72 g", price: 55, mrp: 60, photos: ["photo-1612927601601-982702fa963a", "photo-1596040033229-a9821ebd058d", "photo-1506368083636-6defb67639a7"] }),
  product({ id: "masala-eastern-meat", name: "Eastern Meat Masala", brand: "Eastern", unit: "100 g", price: 58, mrp: 65, photos: ["photo-1599909533936-b894b409bbc0", "photo-1612927601601-982702fa963a", "photo-1596040033229-a9821ebd058d"] }),
  product({ id: "masala-shan-biryani", name: "Shan Bombay Biryani Mix", brand: "Shan", unit: "60 g", price: 55, mrp: 65, photos: ["photo-1506368083636-6defb67639a7", "photo-1599909533936-b894b409bbc0", "photo-1612927601601-982702fa963a"] }),
  product({ id: "masala-badshah-garam", name: "Badshah Garam Masala", brand: "Badshah", unit: "100 g", price: 65, mrp: 72, photos: ["photo-1596040033229-a9821ebd058d", "photo-1506368083636-6defb67639a7", "photo-1599909533936-b894b409bbc0"] }),
];
