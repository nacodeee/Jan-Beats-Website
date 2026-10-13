# JAN — Beat Store

Dark, responsive bilingual (ES/EN) React + Vite storefront starter for JAN.

## Included
- Responsive dark urban landing page
- ES/EN toggle
- Beat catalog with search, genre filters and price sorting
- License selector, cart drawer and subtotal calculation
- Contact form that opens the visitor's email app
- License comparison section and mobile navigation

## Important: this is a starter, not a production-ready payment system
The sample beats and prices are placeholders. Preview buttons are UI-only until you add your own preview audio files. The contact form uses `mailto:`. Checkout is intentionally disabled. No real payment, secure downloads, database, admin dashboard, or license document generation is configured yet.

## Run locally
Install Node.js LTS, then from this folder:
```bash
npm install
npm run dev
```
Open the local URL Vite prints (usually http://localhost:5173).

## Build
```bash
npm run build
npm run preview
```
The production output is in `dist/`.

## Add your audio previews
Put preview MP3s in `public/beats/` and update the `beats` array and `play()` function in `src/main.jsx` to point to those files. Keep previews watermarked/low quality if desired; do not put paid full-resolution files in public folders.

## Before accepting sales
1. Add a backend and database to store products, orders and licenses.
2. Configure Stripe Checkout (or PayPal) on the server. Never put secret keys in frontend code.
3. Verify payment webhooks server-side before marking orders paid.
4. Store full-quality downloads in private object storage and issue expiring download links after verified payment.
5. Add real license agreements per license type and make the buyer accept them.
6. Configure email delivery, order receipts, refund/customer support, and anti-abuse controls.
7. Replace placeholder email and social links.
8. For Spain/EU, get appropriate legal/accounting advice and publish applicable seller identity, terms, privacy/cookie information, refund terms and tax/VAT details before launch.

## Deploy on Vercel
1. Push this project to a GitHub repository.
2. Sign in to Vercel and import the repository.
3. Vercel should detect Vite automatically; build command `npm run build`, output directory `dist`.
4. Deploy. Add a custom domain in Vercel project settings if you own one.

Official deployment guide: https://vite.dev/guide/static-deploy.html
