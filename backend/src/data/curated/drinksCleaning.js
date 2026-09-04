import { product } from "./helpers.js";

export const drinkProducts = [
  // Soft drinks
  product({ id: "drink-coke-750", name: "Coca-Cola", brand: "Coca-Cola", unit: "750 ml", price: 40, mrp: 40, photos: ["photo-1554866585-cd94860890b7", "photo-1629203851122-5034f691c73d", "photo-1622483767028-3f66f32aef97"] }),
  product({ id: "drink-coke-can", name: "Coca-Cola Can", brand: "Coca-Cola", unit: "300 ml", price: 35, mrp: 40, photos: ["photo-1629203851122-5034f691c73d", "photo-1554866585-cd94860890b7", "photo-1622483767028-3f66f32aef97"] }),
  product({ id: "drink-coke-zero", name: "Coca-Cola Zero Sugar", brand: "Coca-Cola", unit: "750 ml", price: 40, mrp: 40, photos: ["photo-1622483767028-3f66f32aef97", "photo-1554866585-cd94860890b7", "photo-1629203851122-5034f691c73d"] }),
  product({ id: "drink-pepsi-750", name: "Pepsi", brand: "Pepsi", unit: "750 ml", price: 40, mrp: 40, photos: ["photo-1629203851122-5034f691c73d", "photo-1625772299848-391b6a87d7b3", "photo-1554866585-cd94860890b7"] }),
  product({ id: "drink-pepsi-can", name: "Pepsi Can", brand: "Pepsi", unit: "300 ml", price: 35, mrp: 40, photos: ["photo-1625772299848-391b6a87d7b3", "photo-1629203851122-5034f691c73d", "photo-1554866585-cd94860890b7"] }),
  product({ id: "drink-pepsi-black", name: "Pepsi Black", brand: "Pepsi", unit: "250 ml", price: 30, mrp: 35, photos: ["photo-1554866585-cd94860890b7", "photo-1625772299848-391b6a87d7b3", "photo-1622483767028-3f66f32aef97"] }),
  product({ id: "drink-sprite-750", name: "Sprite", brand: "Sprite", unit: "750 ml", price: 40, mrp: 40, photos: ["photo-1625772299848-391b6a87d7b3", "photo-1523362628745-0c100150b504", "photo-1629203851122-5034f691c73d"] }),
  product({ id: "drink-fanta", name: "Fanta Orange", brand: "Fanta", unit: "750 ml", price: 40, mrp: 40, photos: ["photo-1621506289937-a8e4df240d0b", "photo-1625772299848-391b6a87d7b3", "photo-1600271886742-f049cd062f01"] }),
  product({ id: "drink-thums-up", name: "Thums Up", brand: "Thums Up", unit: "750 ml", price: 40, mrp: 40, photos: ["photo-1554866585-cd94860890b7", "photo-1622483767028-3f66f32aef97", "photo-1629203851122-5034f691c73d"] }),
  product({ id: "drink-mirinda", name: "Mirinda Orange", brand: "Mirinda", unit: "750 ml", price: 40, mrp: 40, photos: ["photo-1600271886742-f049cd062f01", "photo-1621506289937-a8e4df240d0b", "photo-1625772299848-391b6a87d7b3"] }),

  // Juices / soda
  product({ id: "drink-tropicana", name: "Tropicana Mixed Fruit", brand: "Tropicana", unit: "1 L", price: 110, mrp: 125, photos: ["photo-1600271886742-f049cd062f01", "photo-1621506289937-a8e4df240d0b", "photo-1523362628745-0c100150b504"] }),
  product({ id: "drink-real-orange", name: "Real Fruit Power Orange", brand: "Real", unit: "1 L", price: 95, mrp: 110, photos: ["photo-1621506289937-a8e4df240d0b", "photo-1600271886742-f049cd062f01", "photo-1523362628745-0c100150b504"] }),
  product({ id: "drink-kinley", name: "Kinley Soda", brand: "Kinley", unit: "750 ml", price: 20, mrp: 20, photos: ["photo-1523362628745-0c100150b504", "photo-1625772299848-391b6a87d7b3", "photo-1600271886742-f049cd062f01"] }),
  product({ id: "drink-bisleri", name: "Bisleri Packaged Water", brand: "Bisleri", unit: "1 L", price: 20, mrp: 20, photos: ["photo-1523362628745-0c100150b504", "photo-1548839140-29a749e1cf4d", "photo-1560026301-883759555278"] }),

  // Energy drinks
  product({ id: "energy-redbull", name: "Red Bull Energy Drink", brand: "Red Bull", unit: "250 ml", price: 125, mrp: 125, photos: ["photo-1613479020146-448cb276463e", "photo-1622543925864-4f72973368e9", "photo-1554866585-cd94860890b7"] }),
  product({ id: "energy-redbull-sugarfree", name: "Red Bull Sugar Free", brand: "Red Bull", unit: "250 ml", price: 125, mrp: 125, photos: ["photo-1622543925864-4f72973368e9", "photo-1613479020146-448cb276463e", "photo-1622483767028-3f66f32aef97"] }),
  product({ id: "energy-monster", name: "Monster Energy", brand: "Monster", unit: "350 ml", price: 125, mrp: 135, photos: ["photo-1622543925864-4f72973368e9", "photo-1613479020146-448cb276463e", "photo-1554866585-cd94860890b7"] }),
  product({ id: "energy-monster-ultra", name: "Monster Ultra White", brand: "Monster", unit: "350 ml", price: 125, mrp: 135, photos: ["photo-1613479020146-448cb276463e", "photo-1622543925864-4f72973368e9", "photo-1523362628745-0c100150b504"] }),
  product({ id: "energy-sting", name: "Sting Energy Drink", brand: "Sting", unit: "250 ml", price: 20, mrp: 20, photos: ["photo-1622543925864-4f72973368e9", "photo-1554866585-cd94860890b7", "photo-1613479020146-448cb276463e"] }),
  product({ id: "energy-charged", name: "Charged by Thums Up", brand: "Charged", unit: "250 ml", price: 50, mrp: 55, photos: ["photo-1554866585-cd94860890b7", "photo-1622543925864-4f72973368e9", "photo-1613479020146-448cb276463e"] }),

  // Protein drinks
  product({ id: "protein-muscleblaze", name: "MuscleBlaze Biozyme Whey Isolate Shake", brand: "MuscleBlaze", unit: "250 ml", price: 99, mrp: 120, photos: ["photo-1593095948071-474c5cc2989d", "photo-1579722820308-d74e57ce3e39", "photo-1550583724-b2692b85b150"] }),
  product({ id: "protein-optimum", name: "Optimum Nutrition Ready Protein", brand: "ON", unit: "330 ml", price: 149, mrp: 170, photos: ["photo-1579722820308-d74e57ce3e39", "photo-1593095948071-474c5cc2989d", "photo-1628088062854-d1870b4553da"] }),
  product({ id: "protein-yoga-bar", name: "Yoga Bar Protein Milkshake Chocolate", brand: "Yoga Bar", unit: "200 ml", price: 70, mrp: 80, photos: ["photo-1550583724-b2692b85b150", "photo-1593095948071-474c5cc2989d", "photo-1579722820308-d74e57ce3e39"] }),
  product({ id: "protein-raw-pressery", name: "Raw Pressery Protein Smoothie", brand: "Raw Pressery", unit: "200 ml", price: 90, mrp: 100, photos: ["photo-1628088062854-d1870b4553da", "photo-1600271886742-f049cd062f01", "photo-1593095948071-474c5cc2989d"] }),
  product({ id: "protein-amul-pro", name: "Amul Protein Buttermilk", brand: "Amul", unit: "200 ml", price: 25, mrp: 30, photos: ["photo-1563636619-e9143da7973b", "photo-1550583724-b2692b85b150", "photo-1579722820308-d74e57ce3e39"] }),
];

export const cleaningProducts = [
  product({ id: "clean-vim-gel", name: "Vim Dishwash Gel Lemon", brand: "Vim", unit: "500 ml", price: 105, mrp: 120, photos: ["photo-1563453392212-326f5e854473", "photo-1581578731548-c64695cc6952", "photo-1585421514738-01798b92221c"] }),
  product({ id: "clean-surf-excel", name: "Surf Excel Easy Wash", brand: "Surf Excel", unit: "1 kg", price: 145, mrp: 165, photos: ["photo-1610557892470-55d9e80c0bce", "photo-1563453392212-326f5e854473", "photo-1581578731548-c64695cc6952"] }),
  product({ id: "clean-harpic", name: "Harpic Power Plus Toilet Cleaner", brand: "Harpic", unit: "500 ml", price: 98, mrp: 110, photos: ["photo-1585421514738-01798b92221c", "photo-1581578731548-c64695cc6952", "photo-1563453392212-326f5e854473"] }),
  product({ id: "clean-lizol", name: "Lizol Disinfectant Floor Cleaner", brand: "Lizol", unit: "500 ml", price: 95, mrp: 108, photos: ["photo-1581578731548-c64695cc6952", "photo-1585421514738-01798b92221c", "photo-1610557892470-55d9e80c0bce"] }),
  product({ id: "clean-scotch", name: "Scotch-Brite Scrub Pad", brand: "Scotch-Brite", unit: "1 pc", price: 35, mrp: 40, photos: ["photo-1563453392212-326f5e854473", "photo-1610557892470-55d9e80c0bce", "photo-1585421514738-01798b92221c"] }),
  product({ id: "clean-garbage", name: "Garbage Bags Medium", brand: "Local", unit: "30 pcs", price: 70, mrp: 85, photos: ["photo-1610557892470-55d9e80c0bce", "photo-1581578731548-c64695cc6952", "photo-1563453392212-326f5e854473"] }),
  product({ id: "clean-broom", name: "Soft Grass Broom", brand: "Local", unit: "1 pc", price: 120, mrp: 140, photos: ["photo-1581578731548-c64695cc6952", "photo-1558618666-fcd25c85f82e", "photo-1610557892470-55d9e80c0bce"] }),
  product({ id: "clean-broom-hard", name: "Hard Floor Broom", brand: "Local", unit: "1 pc", price: 99, mrp: 120, photos: ["photo-1558618666-fcd25c85f82e", "photo-1581578731548-c64695cc6952", "photo-1563453392212-326f5e854473"] }),
  product({ id: "clean-phenyl-white", name: "White Phenyl Disinfectant", brand: "Local", unit: "1 L", price: 85, mrp: 95, photos: ["photo-1585421514738-01798b92221c", "photo-1581578731548-c64695cc6952", "photo-1527515637462-cff97a8fd3f8"] }),
  product({ id: "clean-phenyl-black", name: "Black Phenyl", brand: "Local", unit: "1 L", price: 75, mrp: 85, photos: ["photo-1527515637462-cff97a8fd3f8", "photo-1585421514738-01798b92221c", "photo-1581578731548-c64695cc6952"] }),
  product({ id: "clean-tissues-box", name: "Soft Facial Tissues Box", brand: "Premier", unit: "100 pulls", price: 90, mrp: 110, photos: ["photo-1583947215259-38e31be8751f", "photo-1631730486572-226b1e21f3d1", "photo-1607619056574-7b8d3ee536b2"] }),
  product({ id: "clean-tissues-roll", name: "Toilet Tissue Rolls", brand: "Premier", unit: "4 rolls", price: 120, mrp: 140, photos: ["photo-1631730486572-226b1e21f3d1", "photo-1583947215259-38e31be8751f", "photo-1607619056574-7b8d3ee536b2"] }),
  product({ id: "clean-kitchen-towel", name: "Kitchen Towel Roll", brand: "Premier", unit: "2 rolls", price: 110, mrp: 130, photos: ["photo-1607619056574-7b8d3ee536b2", "photo-1631730486572-226b1e21f3d1", "photo-1583947215259-38e31be8751f"] }),
  product({ id: "clean-dettol-surface", name: "Dettol Surface Cleaner", brand: "Dettol", unit: "500 ml", price: 115, mrp: 130, photos: ["photo-1581578731548-c64695cc6952", "photo-1527515637462-cff97a8fd3f8", "photo-1585421514738-01798b92221c"] }),
  product({ id: "clean-colin", name: "Colin Glass Cleaner", brand: "Colin", unit: "500 ml", price: 95, mrp: 110, photos: ["photo-1527515637462-cff97a8fd3f8", "photo-1563453392212-326f5e854473", "photo-1581578731548-c64695cc6952"] }),
];
