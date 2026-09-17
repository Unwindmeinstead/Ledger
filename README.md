# Ledger

A mobile-first PWA for tracking Facebook Marketplace (and other) buys, sells, and flips — profit, ROI, days-to-sell, and category breakdowns, all stored locally on your device.

## Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Recharts for the profit trend chart
- No backend — data lives in `localStorage` on the device

## Local development
```bash
npm install
npm run dev
```

## Deploy
Deployed on Vercel. Push to `main` and Vercel will build and deploy automatically.

## Install on iPhone
Open the deployed URL in Safari → Share → **Add to Home Screen**. It runs full-screen like a native app and works offline after the first load.

## Data
Everything is stored only in the browser's `localStorage` — nothing is sent to a server. Use **More → Export as JSON** to back up your data, and **Import from JSON** to restore it (including on a new device).
