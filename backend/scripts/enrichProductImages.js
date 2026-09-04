/**
 * Build high-quality per-SKU image overrides.
 * Priority: Wikimedia pack → Open Food Facts India/World pack → unique Unsplash heroes
 *
 * Run: npm run catalog:images
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { getAllProducts } from "../src/data/catalog.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT = path.join(__dirname, "../src/data/curated/imageOverrides.json");

const u = (id, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=90`;

/** Large unique hero pools — each product gets a dedicated primary index. */
const POOLS = {
  chips: [
    "photo-1566478989037-eec175614204",
    "photo-1621447504864-d8686e126901",
    "photo-1599490659213-e2b9527bd087",
    "photo-1613919113640-25732ec5e61f",
    "photo-1621939514649-cecb6959c1a0",
    "photo-1578849278619-e73505e9610f",
    "photo-1585647347483-22b66260dfff",
    "photo-1505686994434-e3cc5abf1330",
    "photo-1601050690597-df0568f70950",
    "photo-1512621776951-a57141f2eefd",
    "photo-1546069901-ba9599a7e63c",
    "photo-1490645935967-10de6ba17061",
    "photo-1564759298141-cef86f51d4d0",
    "photo-1551024601-bec78aea704b",
    "photo-1481391032119-d89fee407e44",
  ],
  milk: [
    "photo-1563636619-e9143da7973b",
    "photo-1550583724-b2692b85b150",
    "photo-1571212515416-fef01fc43637",
    "photo-1628088062854-d1870b4553da",
  ],
  eggs: [
    "photo-1582722872445-44dc5f7e3c8f",
    "photo-1482049016688-2d3e1b311543",
    "photo-1506976785307-45a436d8ce0a",
    "photo-1498654200943-275ca707bbb8",
  ],
  bread: [
    "photo-1509440159596-0249088772ff",
    "photo-1549931319-a545dcf3bc73",
    "photo-1586444248902-2f64eddc13df",
    "photo-1555507036-ab1f4038808a",
    "photo-1608198093002-ad4e005484ec",
  ],
  dairy: [
    "photo-1589985270826-4b7bb135bc9d",
    "photo-1486297678162-eb2a19b0a32d",
    "photo-1631452180519-c014fe946bc7",
    "photo-1474979266404-7eaacbcd87c5",
    "photo-1628088062854-d1870b4553da",
  ],
  staples: [
    "photo-1574323347407-f5e1ad6d020b",
    "photo-1586201375761-83865001e31c",
    "photo-1536304993881-ff6e9eefa2a6",
    "photo-1516684669134-de6f7c473a2a",
    "photo-1596797038530-2c107229654b",
    "photo-1615485290382-441e4d049cb5",
    "photo-1512621776951-a57141f2eefd",
    "photo-1546069901-ba9599a7e63c",
  ],
  spice: [
    "photo-1596040033229-a9821ebd058d",
    "photo-1506368083636-6defb67639a7",
    "photo-1599909533936-b894b409bbc0",
    "photo-1612927601601-982702fa963a",
  ],
  oil: [
    "photo-1474979266404-7eaacbcd87c5",
    "photo-1478144592103-25e218a04891",
    "photo-1606923829579-0cb981a83e2e",
  ],
  soda: [
    "photo-1554866585-cd94860890b7",
    "photo-1629203851122-5034f691c73d",
    "photo-1622483767028-3f66f32aef97",
    "photo-1625772299848-391b6a87d7b3",
    "photo-1600271886742-f049cd062f01",
    "photo-1621506289937-a8e4df240d0b",
    "photo-1523362628745-0c100150b504",
    "photo-1548839140-29a749e1cf4d",
  ],
  energy: [
    "photo-1613479020146-448cb276463e",
    "photo-1622543925864-4f72973368e9",
    "photo-1554866585-cd94860890b7",
  ],
  protein: [
    "photo-1593095948071-474c5cc2989d",
    "photo-1579722820308-d74e57ce3e39",
    "photo-1550583724-b2692b85b150",
  ],
  biscuit: [
    "photo-1558961363-fa8fdf82db35",
    "photo-1499636136210-6f4ee915583e",
    "photo-1486427944299-d1955d23e34d",
    "photo-1606313564200-e75d5e30476c",
    "photo-1606312619070-d48b4c652a52",
    "photo-1578985545062-69928b1d9587",
    "photo-1464349095431-e9a21285b5f3",
  ],
  veg: [
    "photo-1518977822534-7049a61ee0c2",
    "photo-1592924357228-91a4daadcfea",
    "photo-1518977676601-b53f82aba655",
    "photo-1449300079323-98d43db8b1c0",
    "photo-1598170845058-32b9d6a5da37",
    "photo-1570197788417-0e723334cb37",
    "photo-1576045057995-568f588f82fb",
    "photo-1563565375-f3fdfdbefa83",
    "photo-1599909533936-b894b409bbc0",
    "photo-1506368083636-6defb67639a7",
    "photo-1540420773420-3366772f4999",
    "photo-1498837167922-ddd27525d352",
    "photo-1512621776951-a57141f2eefd",
    "photo-1464965911861-746a04d465b0",
    "photo-1542838132-92c53300491e",
  ],
  fruit: [
    "photo-1560806887-1e4cd0b6cbd6",
    "photo-1571771894821-ce9b6c11b08e",
    "photo-1547514701-42782126124d",
    "photo-1553279768-865429fa0078",
    "photo-1619566636858-adf3ef46400b",
    "photo-1582979512210-99b6a53386f9",
  ],
  meat: [
    "photo-1604503468506-a8da13d82713",
    "photo-1604908176997-125f25cc6f3d",
    "photo-1587593810167-a84920ea0781",
    "photo-1529692236671-f1f6cf9683ba",
    "photo-1603048297172-c92544798d5a",
  ],
  fish: [
    "photo-1519708227418-c8fd9a32b7a2",
    "photo-1565680018434-b513d5e5fd47",
  ],
  clean: [
    "photo-1563453392212-326f5e854473",
    "photo-1610557892470-55d9e80c0bce",
    "photo-1585421514738-01798b92221c",
    "photo-1581578731548-c64695cc6952",
    "photo-1527515637462-cff97a8fd3f8",
    "photo-1583947215259-38e31be8751f",
    "photo-1631730486572-226b1e21f3d1",
    "photo-1607619056574-7b8d3ee536b2",
    "photo-1558618666-fcd25c85f82e",
  ],
  personal: [
    "photo-1556228720-195a672e8a03",
    "photo-1571781926291-c77dfdaabba9",
    "photo-1598440947619-2c35fc9aa908",
    "photo-1556228578-0d85b1a4d571",
    "photo-1522335789203-aabd1fc54bc9",
    "photo-1535585209827-a15fcdbc4c2d",
    "photo-1559591937-abc3a2bc4d0d",
    "photo-1584305574647-0cc949a2bb9f",
    "photo-1621607512214-68297480165e",
  ],
  baby: [
    "photo-1515488042361-ee00e0ddd4e4",
    "photo-1519689680058-324335c77eba",
    "photo-1555252333-9f8e92e65df9",
    "photo-1556228578-0d85b1a4d571",
    "photo-1583947215259-38e31be8751f",
  ],
  pet: [
    "photo-1587300003388-59208cc962cb",
    "photo-1548199973-03cce0bbc87b",
    "photo-1514888286974-6c03e2ca1dba",
    "photo-1574158622682-e40e69881006",
    "photo-1530281700549-e82e7bf110d6",
    "photo-1583511655857-d19b40a7a54e",
  ],
  stationery: [
    "photo-1455390582262-044cdead277a",
    "photo-1471107340929-a87cd0f5b5f3",
    "photo-1586281380349-632531db7ed4",
    "photo-1517842645767-c639042777db",
    "photo-1434030216411-0b793f4b4173",
    "photo-1503676260728-1c00da094a0b",
  ],
  battery: [
    "photo-1597872200969-2b65d56bd16b",
    "photo-1611532736597-de2d4265fba3",
    "photo-1558618666-fcd25c85f82e",
  ],
  bulb: [
    "photo-1513506003901-1e6a229e2d15",
    "photo-1565814329452-e1efa11c5b89",
    "photo-1507473885765-e6ed057f782c",
    "photo-1558618666-fcd25c85f82e",
  ],
  coin: [
    "photo-1610375461246-83df859d849d",
    "photo-1580519542036-c47de6196ba5",
  ],
};

// scrub bad ids
for (const key of Object.keys(POOLS)) {
  POOLS[key] = POOLS[key].filter(
    (id) => id && !id.includes("f0f0") && id.length > 22
  );
}

const WIKI = {
  "drink-coke-750": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Coca-Cola_lata.jpg/960px-Coca-Cola_lata.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Coca_Cola_Flasche_-_Full.jpg/480px-Coca_Cola_Flasche_-_Full.jpg",
  ],
  "drink-coke-can": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Coca-Cola_lata.jpg/960px-Coca-Cola_lata.jpg",
  ],
  "drink-coke-zero": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Coca-Cola_lata.jpg/800px-Coca-Cola_lata.jpg",
  ],
  "chip-lays-classic": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Potato_Chips%2C_Lays_and_Kurkure.jpg/800px-Potato_Chips%2C_Lays_and_Kurkure.jpg",
  ],
  "chip-kurkure-masala": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Potato_Chips%2C_Lays_and_Kurkure.jpg/800px-Potato_Chips%2C_Lays_and_Kurkure.jpg",
  ],
  "drink-sprite-750": [
    "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Sprite_Logo.svg/512px-Sprite_Logo.svg.png",
  ],
};

/** Exact produce heroes — one strong photo per SKU. */
const PRODUCE_HERO = {
  "veg-onion": ["photo-1518977822534-7049a61ee0c2", "photo-1508747703725-719777637510"],
  "veg-tomato": ["photo-1592924357228-91a4daadcfea", "photo-1546470427-e212b7d31075"],
  "veg-potato": ["photo-1518977676601-b53f82aba655", "photo-1590165482129-1b8b27698780"],
  "veg-banana": ["photo-1571771894821-ce9b6c11b08e", "photo-1603833665858-e61d17a86224"],
  "veg-cucumber": ["photo-1449300079323-98d43db8b1c0", "photo-1563565375-f3fdfdbefa83"],
  "veg-apple": ["photo-1560806887-1e4cd0b6cbd6", "photo-1568702846914-96b305d2aaeb"],
  "veg-carrot": ["photo-1598170845058-32b9d6a5da37", "photo-1540420773420-3366772f4999"],
  "veg-lemon": ["photo-1570197788417-0e723334cb37", "photo-1590502593747-42a996133562"],
  "veg-spinach": ["photo-1576045057995-568f588f82fb", "photo-1540420773420-3366772f4999"],
  "veg-capsicum": ["photo-1563565375-f3fdfdbefa83", "photo-1592924357228-91a4daadcfea"],
  "veg-ginger": ["photo-1615485290382-441e4d049cb5", "photo-1599909533936-b894b409bbc0"],
  "veg-garlic": ["photo-1506368083636-6defb67639a7", "photo-1518977822534-7049a61ee0c2"],
  "veg-orange": ["photo-1547514701-42782126124d", "photo-1582979512210-99b6a53386f9"],
  "veg-mango": ["photo-1553279768-865429fa0078", "photo-1601493700631-2b16ec4b28d0"],
  "veg-cauliflower": ["photo-1512621776951-a57141f2eefd", "photo-1498837167922-ddd27525d352"],
};

function cleanPhotoId(id) {
  return id && !String(id).includes("f0f0") && String(id).length > 22;
}

function poolFor(product) {
  const n = `${product.name} ${product.brand}`.toLowerCase();
  if (/chip|lay|doritos|kurkure|pringles|bingo|nacho|popcorn|uncle chip|yoga bar|protein chip|open secret|hippie|wafer/.test(n))
    return POOLS.chips;
  if (/bhujia|namkeen|mixture|sev|haldiram|bikaji|balaji/.test(n)) return POOLS.chips;
  if (/milk/.test(n)) return POOLS.milk;
  if (/egg/.test(n)) return POOLS.eggs;
  if (/bread|pav/.test(n)) return POOLS.bread;
  if (/butter|cheese|curd|paneer|ghee/.test(n)) return POOLS.dairy;
  if (/oil|sunflower|mustard|saffola/.test(n)) return POOLS.oil;
  if (/atta|rice|dal|oats|rajma|chana/.test(n)) return POOLS.staples;
  if (/masala|haldi|mirch|salt|jeera|spice|mdh|everest|catch|maggi masala|shan|badshah|eastern/.test(n))
    return POOLS.spice;
  if (/red bull|monster|sting|charged|energy/.test(n)) return POOLS.energy;
  if (/protein|whey|muscle|shake/.test(n)) return POOLS.protein;
  if (/coca|pepsi|sprite|fanta|thums|mirinda|soda|cola|juice|tropicana|kinley|bisleri|water/.test(n))
    return POOLS.soda;
  if (/biscuit|oreo|parle|marie|bourbon|cookie|cake|good day|hide|fantasy|jim jam|monaco/.test(n))
    return POOLS.biscuit;
  if (/apple|banana|mango|orange|fruit/.test(n)) return POOLS.fruit;
  if (/onion|tomato|potato|carrot|veg|spinach|capsicum|garlic|ginger|lemon|cucumber|cauliflower|palak/.test(n))
    return POOLS.veg;
  if (/fish|prawn|rohu/.test(n)) return POOLS.fish;
  if (/chicken|mutton|meat|keema/.test(n)) return POOLS.meat;
  if (/vim|surf|harpic|lizol|broom|phenyl|tissue|dettol|colin|clean|garbage|scotch/.test(n))
    return POOLS.clean;
  if (/dove|colgate|shampoo|nivea|gillette|soap|lotion|toothpaste|vaseline|pepsodent|clinic|lifebuoy/.test(n))
    return POOLS.personal;
  if (/pampers|huggies|baby|cerelac|johnson|wipes|himalaya baby/.test(n)) return POOLS.baby;
  if (/pedigree|whiskas|pet|dog|cat|litter|collar/.test(n)) return POOLS.pet;
  if (/pen|pilot|parker|cello|reynolds|highlighter|stapler|scissors|fevi|notebook|classmate|navneet|a4|jk|paper/.test(n))
    return POOLS.stationery;
  if (/battery|duracell|eveready|energizer|panasonic|cr2032/.test(n)) return POOLS.battery;
  if (/bulb|led|philips|syska|havells|lamp|extension|holder|batten/.test(n)) return POOLS.bulb;
  if (/coin|silver|lakshmi|ganesha|festive|mmtc|gold/.test(n)) return POOLS.coin;
  return POOLS.veg;
}

const usedPrimaries = new Set();

function uniqueHeroes(product, count = 3) {
  if (PRODUCE_HERO[product.id]) {
    return PRODUCE_HERO[product.id].filter(cleanPhotoId).map((id) => u(id)).slice(0, count);
  }

  const pool = poolFor(product).filter(cleanPhotoId);
  const h = [...String(product.id)].reduce((a, c) => a + c.charCodeAt(0), 0);
  const out = [];
  for (let i = 0; i < pool.length && out.length < count; i += 1) {
    const id = pool[(h + i * 5) % pool.length];
    const url = u(id);
    if (!out.includes(url) && (out.length > 0 || !usedPrimaries.has(url))) {
      out.push(url);
      if (out.length === 1) usedPrimaries.add(url);
    }
  }
  // fill if short
  for (const id of pool) {
    if (out.length >= count) break;
    const url = u(id);
    if (!out.includes(url)) out.push(url);
  }
  return out.slice(0, count);
}

async function searchOff(host, query) {
  const url =
    `${host}/cgi/search.pl?` +
    new URLSearchParams({
      search_terms: query,
      search_simple: "1",
      action: "process",
      json: "1",
      page_size: "12",
      fields:
        "code,product_name,brands,image_front_url,image_url,image_ingredients_url,image_nutrition_url",
    });
  const res = await fetch(url, {
    headers: {
      "User-Agent": "BlinkitClone/1.0 (learning; image enrichment)",
    },
  });
  if (!res.ok) return [];
  const data = await res.json();
  return Array.isArray(data.products) ? data.products : [];
}

function scoreHit(hit, product) {
  const front = hit.image_front_url || hit.image_url;
  if (!front) return -1;
  let score = 5;
  const name = String(hit.product_name || "").toLowerCase();
  const brands = String(hit.brands || "").toLowerCase();
  const brand = String(product.brand || "").toLowerCase();
  if (brand && brands.includes(brand.split(/\s+/)[0])) score += 8;
  for (const token of String(product.name)
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length > 3)
    .slice(0, 4)) {
    if (name.includes(token)) score += 3;
  }
  if (hit.image_front_url) score += 6;
  if (/openfoodfacts\.org/.test(front)) score += 2;
  return score;
}

function offImages(hit) {
  return [
    hit.image_front_url,
    hit.image_ingredients_url,
    hit.image_nutrition_url,
    hit.image_url,
  ]
    .filter(Boolean)
    .map((url) => url.replace(/\.\d+\.jpg$/, ".400.jpg"));
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function searchQueries(product) {
  const brand = String(product.brand || "").trim();
  const name = String(product.name || "").trim();
  const short = name.split(/\s+/).slice(0, 4).join(" ");
  const qs = [];
  if (brand && short) qs.push(`${brand} ${short}`);
  if (brand) qs.push(brand);
  qs.push(short);
  return [...new Set(qs.filter(Boolean))];
}

async function fetchBestOff(product) {
  const skip = ["c1", "c6", "c13", "c14", "c15", "c16"].includes(
    product.categoryId
  );
  if (skip) return [];

  for (const host of [
    "https://in.openfoodfacts.org",
    "https://world.openfoodfacts.org",
  ]) {
    for (const q of searchQueries(product)) {
      try {
        const hits = await searchOff(host, q);
        const best = hits
          .map((h) => ({ h, s: scoreHit(h, product) }))
          .filter((x) => x.s >= 10)
          .sort((a, b) => b.s - a.s)[0];
        if (best) return offImages(best.h);
      } catch {
        // continue
      }
      await sleep(280);
    }
  }
  return [];
}

async function main() {
  // Avoid applying old overrides while building (catalog imports overrides)
  // Soft: getAllProducts already may include old overrides — use raw ids from overrides keys + catalog
  const products = getAllProducts();
  console.log(`Building HQ images for ${products.length} products…`);
  const overrides = {};

  for (let i = 0; i < products.length; i += 1) {
    const p = products[i];
    process.stdout.write(`[${i + 1}/${products.length}] ${p.name}… `);

    const wiki = WIKI[p.id] || [];
    const heroes = uniqueHeroes(p, 3);
    let pack = [];
    try {
      pack = await fetchBestOff(p);
    } catch {
      pack = [];
    }

    const images = [];
    for (const url of [...wiki, ...pack, ...heroes]) {
      if (url && !images.includes(url)) images.push(url);
      if (images.length >= 3) break;
    }

    const source = pack.length
      ? "openfoodfacts+hero"
      : wiki.length
        ? "wikimedia+hero"
        : "hero";

    overrides[p.id] = {
      images: images.slice(0, 3),
      image: images[0],
      source,
    };
    console.log(source, images.length);
  }

  fs.writeFileSync(
    OUT,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: Object.keys(overrides).length,
        products: overrides,
      },
      null,
      2
    )
  );
  console.log(`Wrote ${OUT}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
