# MarketHub — Multi-Vendor E-Commerce Marketplace

A Next.js + TypeScript marketplace starter using PostgreSQL/Prisma, Firebase integration points, Razorpay integration points, OpenStreetMap/Leaflet and PWA manifest support.

## Current implementation status

This repository is a **working application scaffold / MVP foundation**, not a production-ready marketplace yet.

Implemented:
- Responsive marketplace landing page and product catalogue backed by PostgreSQL when configured, with demo fallback products.
- Product detail route.
- Vendor application form and pending vendor record creation.
- Vendor and admin dashboard preview pages.
- Prisma schema for marketplace identity, vendors, products, orders, payments, ledger and refunds.
- Product listing API.
- Razorpay order-creation example, payment signature verification and webhook signature validation.
- OpenStreetMap/Leaflet location picker demo.
- Firebase client initialization.
- PWA web manifest.

Not yet production-enabled:
- Real Firebase login/session exchange and authorization.
- Complete cart, checkout and transactional order creation.
- Payment/order state persistence and idempotent webhook event processing.
- Razorpay Route linked-account onboarding, transfers, reversals and reconciliation.
- COD fulfilment/cash collection operations.
- Admin CRUD and approval workflows.
- Complete vendor product and order management.
- Production service worker, push subscription flow and offline cache policy.
- Shipping provider integration, GST/tax rules, returns and invoice generation.

The demo role cookie is only a UI preview mechanism. It is not authentication and must never be used to protect production data. The order API intentionally returns HTTP 501 until a trusted server-side session and transactional checkout are implemented.

## Stack

- Next.js App Router, React, TypeScript
- PostgreSQL + Prisma
- Firebase client SDK / Firebase Admin integration point
- Razorpay Node SDK
- OpenStreetMap + Leaflet
- Zod validation

## Run locally

1. Install Node.js LTS and PostgreSQL.
2. Copy `.env.example` to `.env.local` and configure `DATABASE_URL`.
3. Install packages:

   ```bash
   npm install
   ```

4. Generate Prisma client and create database tables:

   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. Seed one demo vendor and product:

   ```bash
   npm run db:seed
   ```

6. Start development:

   ```bash
   npm run dev
   ```

Open http://localhost:3000.

## Preview routes

- `/` — storefront
- `/products` — catalogue
- `/products/[id]` — product detail
- `/vendor/register` — vendor application
- `/login` — demo portal selector (not production auth)
- `/vendor/dashboard` — vendor preview
- `/admin/dashboard` — admin preview
- `/location-demo` — Leaflet location picker
- `/api/products` — product listing endpoint

## Important production requirements

- Implement Firebase ID-token verification on the server and exchange it for secure, HTTP-only sessions.
- Derive customer identity from the verified session, never from request JSON.
- Calculate prices, discounts, commissions, tax and shipping on the server.
- Use database transactions for order creation, inventory reservation and ledger writes.
- Verify Razorpay signatures and webhooks; persist event IDs and process them idempotently.
- Do not trigger vendor payouts from unverified browser events.
- Configure Razorpay Route only after account/product approval.
- Keep KYC documents private and use server-authorized access.
- Use a production tile provider or self-host map tiles for traffic beyond public OSM tile policy.
- Configure a real service worker and test install/offline behavior.
- Add rate limits, audit logs, backups, monitoring and deployment secrets.

## PWA

`src/app/manifest.ts` provides the web app manifest. Add branded `public/icons/icon-192.png` and `public/icons/icon-512.png`. A production service worker and push subscription implementation still need to be configured. Never cache authenticated pages, checkout or payment data.

## Environment

See `.env.example`. Never commit real secrets. Firebase Admin and Razorpay secret credentials must only be used on the server.

## Project estimate reference

The proposed development with an estimated 8–10 week delivery timeline. Hosting, domain, third-party transaction fees, paid Firebase usage, map provider fees, shipping charges and external provider approvals are separate.

#Folder Architecture
## 📁 Project Folder Structure

```text
multivendor-marketplace/
│
├── public/
│   ├── icons/
│   ├── images/
│   ├── manifest.json
│   ├── favicon.ico
│   └── offline.html
│
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── seed.ts
│
├── src/
│   │
│   ├── app/
│   │   │
│   │   ├── (store)/
│   │   │   ├── page.tsx
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── vendors/
│   │   │   ├── cart/
│   │   │   ├── checkout/
│   │   │   ├── wishlist/
│   │   │   └── orders/
│   │   │
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── forgot-password/
│   │   │   └── verify/
│   │   │
│   │   ├── vendor/
│   │   │   ├── dashboard/
│   │   │   ├── onboarding/
│   │   │   ├── kyc/
│   │   │   ├── products/
│   │   │   ├── inventory/
│   │   │   ├── orders/
│   │   │   ├── earnings/
│   │   │   ├── settlements/
│   │   │   └── settings/
│   │   │
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── vendors/
│   │   │   ├── customers/
│   │   │   ├── products/
│   │   │   ├── categories/
│   │   │   ├── orders/
│   │   │   ├── payments/
│   │   │   ├── commissions/
│   │   │   ├── refunds/
│   │   │   ├── settlements/
│   │   │   ├── reports/
│   │   │   └── settings/
│   │   │
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   ├── products/
│   │   │   ├── vendors/
│   │   │   ├── orders/
│   │   │   ├── inventory/
│   │   │   ├── payments/
│   │   │   │   ├── create-order/
│   │   │   │   ├── verify/
│   │   │   │   └── webhook/
│   │   │   ├── razorpay/
│   │   │   │   ├── linked-accounts/
│   │   │   │   ├── transfers/
│   │   │   │   └── refunds/
│   │   │   ├── notifications/
│   │   │   └── locations/
│   │   │
│   │   ├── layout.tsx
│   │   ├── globals.css
│   │   ├── manifest.ts
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   ├── storefront/
│   │   ├── vendor/
│   │   ├── admin/
│   │   ├── checkout/
│   │   ├── maps/
│   │   └── pwa/
│   │
│   ├── features/
│   │   ├── authentication/
│   │   ├── products/
│   │   ├── vendors/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── payments/
│   │   ├── commissions/
│   │   ├── inventory/
│   │   ├── shipping/
│   │   └── notifications/
│   │
│   ├── lib/
│   │   ├── validations/
│   │   ├── prisma.ts
│   │   ├── firebase-admin.ts
│   │   ├── firebase-client.ts
│   │   ├── razorpay.ts
│   │   ├── maps.ts
│   │   ├── auth.ts
│   │   ├── permissions.ts
│   │   └── utils.ts
│   │
│   ├── services/
│   │   ├── order.service.ts
│   │   ├── vendor.service.ts
│   │   ├── payment.service.ts
│   │   ├── commission.service.ts
│   │   ├── settlement.service.ts
│   │   ├── inventory.service.ts
│   │   └── notification.service.ts
│   │
│   ├── hooks/
│   ├── types/
│   ├── constants/
│   └── middleware.ts
│
├── .env.example
├── .gitignore
├── next.config.ts
├── package.json
├── tsconfig.json
└── README.md
```
