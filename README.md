# FeboColour

FeboColour is a full ecommerce platform for hijabs and abayas (with a dedicated baby-girl
collection), built from scratch on Next.js for the Bangladeshi market: local payment
methods (bKash, Nagad, Rocket, Bank Transfer, Cash on Delivery), Steadfast Courier
delivery integration, and a custom-built admin panel — no third-party ecommerce platform.

See [`docs/requirements.md`](docs/requirements.md) for the original product brief and
[`docs/plan.md`](docs/plan.md) for the full architecture/schema/build-phasing plan this
was built against.

## Tech stack

- **Next.js 16** (App Router), React 19, TypeScript (strict)
- **PostgreSQL** via **Drizzle ORM** (`lib/db/schema/`, migrations in `lib/db/migrations/`)
- **Tailwind CSS v4**
- Hand-rolled session-cookie auth (`argon2id` password hashing), separate cookies/tables
  for customers and admins
- Fully dynamic product attribute/variant system (admin-defined attributes and values,
  not fixed color/size columns)
- **Nodemailer** for order emails, **Steadfast Courier API** for delivery, all Bangladeshi
  payment methods manual/instructions-based with admin verification

## Getting started

### Prerequisites

- Node.js
- A running PostgreSQL server

### Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env.local` and fill in real values (at minimum
   `DATABASE_URL`; SMTP and Steadfast credentials are optional locally — features
   degrade gracefully with a clear message when unset):

   ```bash
   cp .env.example .env.local
   ```

3. Create the database (matching whatever you put in `DATABASE_URL`), then run
   migrations:

   ```bash
   npm run db:migrate
   ```

4. Seed sample data (categories, products, banners, payment/shipping methods, and an
   admin user — email `admin@febocolour.com`, password `FeboAdmin123!`):

   ```bash
   npm run db:seed
   ```

5. Start the dev server:

   ```bash
   npm run dev
   ```

   Storefront at [http://localhost:3000](http://localhost:3000), admin at
   [http://localhost:3000/admin/login](http://localhost:3000/admin/login).

For local SMTP testing without real credentials, run a
[Maildev](https://github.com/maildev/maildev) catcher and point `SMTP_HOST`/`SMTP_PORT`
at it (see `.env.example`); the web UI is at http://localhost:1080.

## Scripts

| Command | Purpose |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build |
| `npm run start` | Start the production build |
| `npm run lint` | ESLint |
| `npm run db:generate` | Generate a Drizzle migration from schema changes |
| `npm run db:migrate` | Apply pending migrations |
| `npm run db:studio` | Drizzle Studio (DB browser) |
| `npm run db:seed` | Seed sample catalog/config/admin data |

## Project structure

- `app/` — App Router routes: `(storefront)/` public site, `admin/` custom admin panel,
  `api/` the few Route Handlers that need to be browser-reachable outside Server Actions
- `components/` — `storefront/`, `checkout/`, `account/`, `admin/`, `seo/`
- `lib/` — `db/` (schema + migrations), `auth/`, `services/` (business logic, shared by
  Server Actions), `actions/` (thin Server Action wrappers), `validation/` (Zod schemas),
  `email/`, `storage/` (local filesystem upload adapter), `seo/`

## Status

Phases 0–6 of the build plan are complete: catalog + storefront, cart/checkout, full
admin CRUD with auth, SEO/performance/accessibility polish, all Bangladeshi payment
methods with admin verification plus security hardening (rate limiting, login lockout,
input sanitization), and Steadfast Courier delivery integration.
