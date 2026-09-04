/** Shared curated catalog helpers */

const HQ_POOL = [
  "photo-1563636619-e9143da7973b",
  "photo-1509440159596-0249088772ff",
  "photo-1582722872445-44dc5f7e3c8f",
  "photo-1589985270826-4b7bb135bc9d",
  "photo-1628088062854-d1870b4553da",
  "photo-1486297678162-eb2a19b0a32d",
  "photo-1518977822534-7049a61ee0c2",
  "photo-1592924357228-91a4daadcfea",
  "photo-1571771894821-ce9b6c11b08e",
  "photo-1518977676601-b53f82aba655",
  "photo-1449300079323-98d43db8b1c0",
  "photo-1560806887-1e4cd0b6cbd6",
  "photo-1598170845058-32b9d6a5da37",
  "photo-1570197788417-0e723334cb37",
  "photo-1574323347407-f5e1ad6d020b",
  "photo-1586201375761-83865001e31c",
  "photo-1596797038530-2c107229654b",
  "photo-1615485290382-441e4d049cb5",
  "photo-1474979266404-7eaacbcd87c5",
  "photo-1621939514649-cecb6959c1a0",
  "photo-1596040033229-a9821ebd058d",
  "photo-1612927601601-982702fa963a",
  "photo-1558961363-fa8fdf82db35",
  "photo-1499636136210-6f4ee915583e",
  "photo-1486427944299-d1955d23e34d",
  "photo-1606313564200-e75d5e30476c",
  "photo-1606312619070-d48b4c652a52",
  "photo-1604503468506-a8da13d82713",
  "photo-1519708227418-c8fd9a32b7a2",
  "photo-1603048297172-c92544798d5a",
  "photo-1529692236671-f1f6cf9683ba",
  "photo-1565680018434-b513d5e5fd47",
  "photo-1554866585-cd94860890b7",
  "photo-1600271886742-f049cd062f01",
  "photo-1523362628745-0c100150b504",
  "photo-1621506289937-a8e4df240d0b",
  "photo-1625772299848-391b6a87d7b3",
  "photo-1613479020146-448cb276463e",
  "photo-1566478989037-eec175614204",
  "photo-1599490659213-e2b9527bd087",
  "photo-1601050690597-df0568f70950",
  "photo-1613919113640-25732ec5e61f",
  "photo-1578849278619-e73505e9610f",
  "photo-1584305574647-0cc949a2bb9f",
  "photo-1559591937-abc3a2bc4d0d",
  "photo-1535585209827-a15fcdbc4c2d",
  "photo-1556228578-0d85b1a4d571",
  "photo-1621607512214-68297480165e",
  "photo-1563453392212-326f5e854473",
  "photo-1610557892470-55d9e80c0bce",
  "photo-1585421514738-01798b92221c",
  "photo-1581578731548-c64695cc6952",
  "photo-1515488042361-ee00e0ddd4e4",
  "photo-1587300003388-59208cc962cb",
  "photo-1574158622682-e40e69881006",
  "photo-1548199973-03cce0bbc87b",
  "photo-1512621776951-a57141f2eefd",
  "photo-1546069901-ba9599a7e63c",
  "photo-1490645935967-10de6ba17061",
  "photo-1455390582262-044cdead277a",
  "photo-1471107340929-a87cd0f5b5f3",
  "photo-1586281380349-632531db7ed4",
  "photo-1517842645767-c639042777db",
  "photo-1513506003901-1e6a229e2d15",
  "photo-1565814329452-e1efa11c5b89",
  "photo-1558618666-fcd25c85f82e",
  "photo-1610375461246-83df859d849d",
  "photo-1580519542036-c47de6196ba5",
  "photo-1597872200969-2b65d56bd16b",
  "photo-1611532736597-de2d4265fba3",
  "photo-1583947215259-38e31be8751f",
  "photo-1579722820308-d74e57ce3e39",
  "photo-1593095948071-474c5cc2989d",
  "photo-1622543925864-4f72973368e9",
  "photo-1629203851122-5034f691c73d",
  "photo-1622483767028-3f66f32aef97",
  "photo-1549931319-a545dcf3bc73",
  "photo-1586444248902-2f64eddc13df",
  "photo-1576045057995-568f588f82fb",
  "photo-1563565375-f3fdfdbefa83",
  "photo-1547514701-42782126124d",
  "photo-1553279768-865429fa0078",
  "photo-1578985545062-69928b1d9587",
  "photo-1507473885765-e6ed057f782c",
  "photo-1514888286974-6c03e2ca1dba",
  "photo-1530281700549-e82e7bf110d6",
];

export const img = (photoId, w = 800) =>
  `https://images.unsplash.com/${photoId}?auto=format&fit=crop&w=${w}&q=85`;

function hashId(id) {
  let h = 0;
  const s = String(id || "");
  for (let i = 0; i < s.length; i += 1) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

function isLikelyValidPhoto(id) {
  if (!id || typeof id !== "string") return false;
  if (id.includes("f0f0") || id.includes("0f0f0")) return false;
  return /^photo-[a-zA-Z0-9-]+$/.test(id) && id.length > 20;
}

function resolvePhotoIds(photos, productId) {
  const cleaned = (photos || []).filter(isLikelyValidPhoto);
  const out = [...cleaned];
  const start = hashId(productId) % HQ_POOL.length;
  let i = 0;
  while (out.length < 3 && i < HQ_POOL.length) {
    const candidate = HQ_POOL[(start + i * 7) % HQ_POOL.length];
    if (!out.includes(candidate)) out.push(candidate);
    i += 1;
  }
  return out.slice(0, 3);
}

/**
 * @param {{ id: string, name: string, brand?: string, unit: string, price: number, mrp?: number, photos?: string[] }} spec
 */
export function product(spec) {
  const photoIds = resolvePhotoIds(spec.photos, spec.id);
  const images = photoIds.map((id) => img(id));

  return {
    id: spec.id,
    name: spec.name,
    brand: spec.brand || "",
    unit: spec.unit,
    price: spec.price,
    mrp: spec.mrp ?? spec.price,
    images,
    image: images[0] || "",
  };
}

export function normalizeProduct(raw) {
  if (!raw?.id) return null;
  const fromImages = Array.isArray(raw.images)
    ? raw.images.filter(Boolean)
    : [];
  let images =
    fromImages.length > 0
      ? fromImages.slice(0, 3)
      : raw.image
        ? [raw.image]
        : [];

  if (images.length < 2) {
    const extras = resolvePhotoIds([], raw.id).map((id) => img(id));
    images = [...new Set([...images, ...extras])].slice(0, 3);
  }

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
