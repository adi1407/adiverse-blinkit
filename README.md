# Blinkit Clone

A teach-as-we-build grocery delivery clone: **Expo (React Native)** app + **Node/Express** API.

Looks and feels like Blinkit — yellow header, green accents, 8‑minute delivery vibe — with real catalog data, cart, orders, print, and more.

```
blinkit-clone/
├── frontend/   # Expo app (phone UI)
└── backend/    # Express API (data + rules)
```

---

## Prerequisites

- Node.js 18+
- npm
- [Expo Go](https://expo.dev/go) on your phone (or an Android/iOS emulator)

---

## Quick start

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env   # PORT=5000
npm run dev            # or: npm start
```

Health check: [http://localhost:5000/api/health](http://localhost:5000/api/health)

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env
```

Edit `frontend/.env` if you use a **physical phone**:

```
EXPO_PUBLIC_API_URL=http://YOUR_PC_LAN_IP:5000
```

Example: `http://192.168.1.26:5000`  
(Find your IP with `ipconfig` on Windows — look for IPv4.)

Then:

```bash
npm start
```

Scan the QR with Expo Go. Keep the backend running.

| Device | API URL tip |
|--------|-------------|
| Real phone (Expo Go) | PC LAN IP in `.env` (same Wi‑Fi) |
| Android emulator | Often auto via `10.0.2.2`, or set in `.env` |
| Leave unset | App tries Expo’s host IP, then emulator fallbacks |

---

## What’s built

| Area | Features |
|------|----------|
| **Home** | Yellow header, search, categories, featured rows, recently viewed, splash |
| **Catalog** | 12 categories, mega snack/drink pack, pagination, brand chips + price sort |
| **Product** | Product detail page, similar items, ADD / qty |
| **Search** | Debounced live search |
| **Cart** | Shared context, AsyncStorage persist, bill, coupons, checkout |
| **Auth** | Guest login (name + phone), session on device |
| **Addresses** | Save / pick delivery address |
| **Orders** | Place order, history, live timeline, cancel while confirmed, rate after delivery, Order Again |
| **Print** | Pick docs/photos, quote, place print job, job list |
| **Wishlist** | Heart on cards / PDP, saved list, add all to cart |
| **UI** | Custom Blinkit tab bar (Lucide), floating cart bar, branded yellow icon/splash |

---

## App map (mental model)

```
App.js
  Auth + Address + Cart + Wishlist providers
  Animated splash (waits for hydrate)
    Navigation
      Tabs: Home · Order Again · Categories · Print
      Stack: Search, ProductDetail, Cart, Account,
             Orders, OrderDetail, Addresses,
             Wishlist, PrintJobs, Login, …
```

**Data flow**

```
Phone UI  --fetch-->  Express (/api/…)  -->  catalog.js / JSON stores
```

Orders and print jobs are saved in JSON files under `backend/src/data/` so they survive server restarts (learning-friendly “mini DB”).

---

## Main API routes

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/health` | Alive check |
| GET | `/api/home` | Home payload |
| GET | `/api/categories` | All categories |
| GET | `/api/categories/:id/products` | Products (`page`, `limit`, `q`, `sort`) |
| GET | `/api/search?q=` | Search |
| GET | `/api/products/:id` | Product detail + similar |
| POST | `/api/orders` | Place grocery order (`couponCode` optional) |
| GET | `/api/orders?phone=` | Order history |
| GET | `/api/orders/:id` | Track order |
| POST | `/api/orders/:id/cancel` | Cancel if still confirmed |
| POST | `/api/orders/:id/rate` | Rate delivered order (1–5 stars) |
| GET | `/api/orders/reorder?phone=` | Buy-again products |
| POST | `/api/print/quote` | Print price preview |
| POST | `/api/print/jobs` | Place print job |
| GET | `/api/print/jobs?phone=` | Print job list |
| POST | `/api/print/jobs/:id/cancel` | Cancel print job |

Demo coupons: `BLINKIT50`, `SAVE20`, `FREESHIP`, `WELCOME100`.

---

## Frontend layout

```
frontend/src/
  api/          # HTTP helpers (catalog, orders, print)
  components/   # ProductCard, tab bar, splash, …
  context/      # Cart, Auth, Address, Wishlist
  data/         # Local helpers (e.g. coupons)
  navigation/   # Tabs + stack
  screens/      # Full pages
  theme/        # Colors, spacing
  utils/        # Icons, order status, …
```

---

## Backend layout

```
backend/src/
  server.js
  routes/       # catalog, orders, print
  data/         # catalog, coupons, orders store, print store
scripts/
  buildMegaCatalog.js   # npm run catalog:build
```

---

## Teaching chunks (rough history)

1. Home shell + theme  
2. Bottom tabs  
3. Category → product list  
4. Cart context  
5. Wire Express catalog API  
6. Search  
7. Guest login  
8. Persisted login + orders  
9. Addresses  
10. JSON order store + pagination  
11. Order tracking timeline  
12. Cancel order  
13. Category filters / sort  
14. Product detail  
15. Cart persistence  
16. Checkout coupons  
17. Print tab  
18. Wishlist  
19. Project README  
20. Payment mock at checkout  
21. App icon / splash branding  
22. Rate delivered orders  
23. Recently viewed products  

---

## Notes / limits (on purpose)

- Login is **demo** (no real OTP).
- Payment is **mock** (UPI / card / wallet / COD — no real money moves).
- Print stores **file metadata only** (no upload to cloud).
- Order/print status advances on a **demo timer**, not real riders.
- Catalog images come from Unsplash / Open Food Facts style sources.
- Expo Go shows Expo’s splash first; our yellow animated splash runs after JS loads.

---

## Scripts cheat sheet

```bash
# Backend
cd backend && npm run dev
cd backend && npm run catalog:build

# Frontend
cd frontend && npm start
```

---

Built as a learning project: small chunks, real app patterns (providers, navigation, REST, persistence).
