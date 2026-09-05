# Blinkit Ops Admin

Vite + React portal for festivals, hero banners, and product overrides.

## Run

1. Start backend: `cd backend && npm run dev`
2. Start admin: `cd admin && npm run dev` → http://localhost:5173

## Login

- Email: `admin@blinkit.local`
- Password: `admin123`

Override via backend `.env`: `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_TOKEN_SECRET`.

API calls proxy `/api` → `http://localhost:5000`.
