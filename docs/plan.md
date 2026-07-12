# FeboColour — v1 Architecture & Build Plan

## Context

`/home/nahid/dev-dir/febocolour.com` currently contains only `docs/requirements.md` and `assets/febo-logo.png` — this is a from-scratch build of a new ecommerce store for hijabs/abayas (special focus on baby girl hijabs), per the attached architecture prompt. The business is small today but the traffic pattern is distinctive: almost everyone arrives already interested, via Facebook/Messenger/WhatsApp, so the whole system is optimized around a fast, trustworthy, low-friction path from "sees a product on Facebook" to "order placed." The requirements doc asks for a full production-grade design (schema, API, admin, SEO, performance, security, future roadmap) while explicitly warning not to over-engineer v1.

Three decisions were already made with the user before this plan: **locally-hosted Postgres** (not a managed DB service), a **custom-built minimal admin panel embedded in the same Next.js app** (not Medusa/Payload), and **localhost-only for now** (production will later deploy to the user's own "Epic Control Panel," to be set up in a future session). Investigating the machine turned up a relevant fact: a Postgres 18 container (`postgresql`, port 5432, user `alice`) is already running locally alongside pgAdmin and what appears to be the user's ECP container — the user confirmed we should create a new database on that existing server rather than standing up a dedicated one.

The remaining implementation-level decisions (ORM, auth approach, styling, image storage, rendering strategy) were designed via a Plan sub-agent and reviewed; they're recorded below as fixed choices, each with its one-line reasoning, so we build with a consistent, opinionated stack rather than re-deciding per file.

---

## 0. Key technical decisions (fixed, with reasoning)

| Area | Choice | Why |
|---|---|---|
| Framework | **Next.js 16 (App Router), React 19, TypeScript strict** | Matches the requirements doc's explicit "Next.js and related necessary things"; App Router gives per-route rendering control (SSG/ISR/SSR) needed for the SEO/perf targets. |
| Database | **PostgreSQL**, reusing the existing local Docker container (`postgresql`, port 5432, user `alice`); new database `febocolour` | Already running locally; avoids a second DB server to remember to start. |
| ORM | **Drizzle ORM + drizzle-kit + `pg` pool** | App runs as a long-lived Node process (not edge/serverless), so a persistent pool fits; no codegen binary, schema is plain TS, SQL-close query builder suits hand-written admin dashboard aggregates. Lighter dependency footprint than Prisma. |
| Auth | **Hand-rolled session-cookie auth** (random token → sha256-hashed in DB, httpOnly/Secure cookie, `argon2id` password hashing via `@node-rs/argon2`) — no Auth.js/NextAuth | v1 only needs credential login for two separate actor types (customers, admins); Auth.js's OAuth/adapter machinery adds nothing here. Fully-owned code is easy for a small team to audit, and keeps customer/admin sessions cleanly separate (different cookies, tables, lifetimes). |
| Styling | **Tailwind CSS v4** + a small local `components/ui/` set (Radix primitives only where real accessible behavior is needed: dialog, dropdown, select) | Utility CSS purges to a tiny stylesheet; copied-in components (not an npm UI kit) keep client JS minimal and let styling match the pink/magenta/purple brand precisely. |
| Validation | **Zod**, shared across Server Actions, Route Handlers, and `react-hook-form` | One schema per entity, reused everywhere it's validated. |
| Carousels | **`embla-carousel-react`** (~5KB) for Categories Slider / Reviews / Instagram Gallery | Small footprint vs. Swiper, fits "tiny JS bundle." |
| Rich text | Product description stored as **sanitized HTML** (`sanitize-html` on write) from a lightweight admin editor (Tiptap) | Avoids stored-XSS from admin-authored content while keeping formatting. |
| Image/video storage | **Local filesystem** under `public/uploads/{products,categories,banners}/…`, accessed only through `lib/storage/` (`saveFile`/`getUrl`/`deleteFile`); DB stores relative keys, never paths/URLs | Works with Next's built-in `<Image>` optimizer with zero custom loader; swapping to S3-compatible storage later is a new adapter behind the same interface, no schema change. |
| Email | **Nodemailer** over SMTP, credentials from env vars (`SMTP_HOST/PORT/USER/PASS/FROM_EMAIL/FROM_NAME`), plain server-side HTML template functions (no React-Email or other templating dependency) | Order confirmation (customer) + new-order alert (admin) are the only v1 emails; a hand-written template keeps the dependency list minimal. Credentials live in env, not DB, since they're secrets, not admin-editable content. |
| Payments (v1 scope) | **Bangladesh-only**: Cash on Delivery, bKash, Nagad, Rocket, Bank Transfer — all manual/instructions-based in v1 (customer enters transaction ID, admin verifies) | Matches the actual market (no Stripe/PayPal — the store doesn't sell internationally); manual entry needs no gateway integration or PCI scope for v1. |
| Product variants | **Fully dynamic attribute system** (admin-defined attributes like Color/Size/Age/Material + values, assigned per product, combined into variants) — no fixed `color`/`size`/`age` columns | A hijab range and a future accessories line won't share the same variant dimensions; hardcoding columns would break the moment a new attribute (e.g. "Material") is needed. This is the same model WooCommerce/Shopify use. |
| Hosting posture | Standard `next build && next start` Node process; no Vercel-only APIs, no edge-only primitives beyond a thin `middleware.ts` cookie check | Keeps us deployment-target-agnostic until ECP deployment is scoped later. |

**Rendering strategy per route:**

| Route | Strategy |
|---|---|
| Homepage | ISR, `revalidateTag('homepage')` busted on banner/product writes |
| Category pages | ISR, `revalidateTag('category:{slug}')` |
| Product pages | ISR, `generateStaticParams` for top sellers, `revalidateTag('product:{slug}')` for the rest |
| Cart / Checkout | `force-dynamic`, cookie-scoped, Server Actions |
| Account | `force-dynamic`, auth-gated |
| Admin | `force-dynamic`, auth-gated throughout |
| `/api/*` | Route Handlers, Node runtime; short `s-maxage` only on public read endpoints |

---

## 1. Folder structure

```
febocolour.com/
  app/
    (storefront)/
      layout.tsx                # Header + Footer chrome
      page.tsx                  # Homepage, sections in required order
      category/[slug]/page.tsx
      product/[slug]/page.tsx
      search/page.tsx
      cart/page.tsx
      checkout/page.tsx
      checkout/confirmation/[orderNumber]/page.tsx
      privacy-policy/ terms/ shipping-policy/ return-policy/ about/ contact/  (page.tsx each)
    (account)/
      account/layout.tsx        # auth guard
      account/page.tsx  orders/page.tsx  orders/[orderNumber]/page.tsx
      account/addresses/page.tsx  profile/page.tsx
      account/login/page.tsx  register/page.tsx
    admin/
      layout.tsx                # admin auth guard + sidebar shell
      login/page.tsx
      page.tsx                  # dashboard
      products/  attributes/  categories/  inventory/  orders/  customers/
      reviews/  banners/  shipping/  payments/  social-links/  settings/  audit-logs/
    api/
      products/  categories/  search/  cart/  checkout/
      orders/[orderNumber]/
      auth/customer/{login,register,logout}/
      sitemap.xml/  robots.txt/
      webhooks/[provider]/       # placeholder for future gateways
    layout.tsx                   # root layout, fonts, default metadata
    middleware.ts
  components/
    ui/                          # button, input, badge, dialog, select, sheet...
    storefront/                  # Header, Footer, HeroBanner, CategoriesSlider,
                                  # BestSellers, NewArrivals, FeaturedCollection,
                                  # WhyChooseUs, PartnerLogos, ReviewsCarousel,
                                  # InstagramGallery, MessengerButton, WhatsAppButton,
                                  # MiniCart, SearchBox, ProductCard
    checkout/  account/
    admin/                        # DataTable, ImageUploader, ProductForm, DashboardWidgets
  lib/
    db/
      client.ts                  # pg pool + drizzle instance
      schema/                    # products.ts categories.ts orders.ts customers.ts ...
      migrations/                # drizzle-kit output
    auth/
      session.ts password.ts guards.ts   # requireCustomer(), requireAdmin()
    services/                    # business logic — shared by Server Actions & Route Handlers
      products.ts catalog.ts cart.ts checkout.ts orders.ts inventory.ts customers.ts
      payments/                  # PaymentProvider interface + cod.ts, bkash.ts, nagad.ts, rocket.ts, bankTransfer.ts
      admin/
    validation/                  # zod schemas: checkout.ts product.ts auth.ts ...
    storage/                     # local-fs adapter behind saveFile/getUrl/deleteFile
    seo/                         # jsonld builders: product, breadcrumb, organization, faq
    email/
      client.ts                  # nodemailer transport from SMTP env vars
      templates/                 # order-confirmation.ts, admin-new-order.ts
    rate-limit.ts  audit.ts
  public/
    uploads/{products,categories,banners}/  fonts/  icons/
  scripts/
    seed.ts
  drizzle.config.ts
  .env.local                     # DATABASE_URL etc. — gitignored
```

---

## 2. Database schema (PostgreSQL, database `febocolour`)

**Identity / auth**
- `customers`: id, email (unique, nullable — guest orders don't create one), phone, password_hash (nullable), full_name, email_verified_at, created_at, updated_at
- `customer_sessions`: id, customer_id fk, token_hash, user_agent, ip, expires_at, created_at
- `admin_users`: id, email (unique), password_hash, full_name, role enum('super_admin','manager','staff'), is_active, created_at, updated_at
- `admin_sessions`: id, admin_user_id fk, token_hash, user_agent, ip, expires_at, created_at
- `addresses`: id, customer_id fk, label, full_name, phone, address_line, city, area, postal_code, country default 'BD', is_default, created_at, updated_at

**Catalog**
- `categories`: id, parent_id fk→categories.id (nullable), name, slug (unique), description, image, sort_order, is_active, seo_title, seo_description, created_at, updated_at
- `products`: id, category_id fk, name, slug (unique), sku, short_description, description (sanitized html), specifications (jsonb), size_chart (jsonb | image key), product_kind enum('physical','digital','bundle','gift_card') default 'physical' (placeholder only), regular_price numeric, sale_price numeric (nullable), sale_starts_at, sale_ends_at, stock_quantity int, stock_status enum('in_stock','out_of_stock','backorder'), is_featured bool, is_best_seller bool, is_active bool, rating_avg numeric default 0, rating_count int default 0, seo_title, seo_description, og_image, created_at, updated_at
- `product_images`: id, product_id fk, storage_key, alt_text, sort_order, is_primary, created_at
- `product_videos`: id, product_id fk, storage_key_or_url, thumbnail_key, sort_order, created_at

**Dynamic product variants** (no hardcoded color/size/age columns — admin defines attributes and values, same model as WooCommerce/Shopify):
- `attributes`: id, name (e.g. "Color", "Size", "Age Range", "Material"), slug (unique), input_type enum('select','color_swatch') default 'select', sort_order, created_at — globally admin-managed, reusable across products
- `attribute_values`: id, attribute_id fk, value (e.g. "Baby Pink"), slug, swatch_hex (nullable, used when input_type = 'color_swatch'), sort_order — unique (attribute_id, slug)
- `product_attributes`: id, product_id fk, attribute_id fk, sort_order — which attributes *this* product varies by, and the order to render selectors; unique (product_id, attribute_id)
- `product_variants`: id, product_id fk, sku (unique), price_override numeric (nullable, falls back to product price), stock_quantity int, stock_status enum, image_id fk→product_images.id (nullable), is_active, created_at, updated_at
- `product_variant_values`: id, variant_id fk, attribute_value_id fk — the specific combination (e.g. this variant = Baby Pink × 6-12 Months); unique (variant_id, attribute_value_id); app-level validation ensures a variant has at most one value per attribute

A product with no rows in `product_attributes`/`product_variants` simply has no variant selector — the base `products` row (price/stock/SKU) is used directly, so simple products stay simple.

**Cart**
- `carts`: id, cart_token (unique, hash of cookie value), customer_id fk (nullable, set on login/merge), created_at, updated_at
- `cart_items`: id, cart_id fk, product_id fk, variant_id fk (nullable), quantity, created_at, updated_at

**Orders**
- `orders`: id, order_number (unique, `FC-000123`), customer_id fk (nullable = guest), shipping_full_name, shipping_phone, shipping_address_line, shipping_city, shipping_area, shipping_postal_code, notes, shipping_method_id fk, shipping_cost numeric, payment_method_id fk, payment_status enum('pending','awaiting_verification','paid','failed','refunded'), order_status enum('pending','processing','shipped','delivered','cancelled','returned'), subtotal numeric, discount_total numeric default 0, coupon_code varchar (nullable, unused), total numeric, currency char(3) default 'BDT', placed_at, created_at, updated_at
- `order_items`: id, order_id fk, product_id fk, variant_id fk (nullable), product_name_snapshot, variant_label_snapshot (e.g. "Baby Pink / 6-12 Months", built by joining `product_variant_values` → `attribute_values` at order time), sku_snapshot, unit_price, quantity, line_total
- `order_payment_details`: id, order_id fk, payment_method_code, sender_number, transaction_id, amount, submitted_at, verified_by_admin_id fk (nullable), verified_at (nullable) — manual bKash/bank-transfer entry + admin verification

**Admin-managed config**
- `payment_method_configs`: id, code, name, instructions, account_details (jsonb), is_active, requires_manual_verification bool, sort_order, created_at, updated_at
- `shipping_method_configs`: id, code, name, description, rate_type enum('flat','free','manual'), flat_rate numeric (nullable), is_active, sort_order, created_at, updated_at
- `homepage_banners`: id, title, subtitle, image, mobile_image, cta_label, cta_url, secondary_cta_label, secondary_cta_url, sort_order, is_active, starts_at, ends_at, created_at, updated_at
- `social_links`: id, platform, url, is_active, sort_order
- `site_settings`: id, key (unique), value (jsonb), updated_at — phone number, WhatsApp/Messenger links, default meta, currency, free-shipping threshold, etc.

**Future-schema-ready, no UI in v1**
- `reviews`: id, product_id fk, customer_id fk (nullable), guest_name, rating smallint, title, body, is_approved bool default false, created_at, updated_at

**Cross-cutting**
- `audit_logs`: id, admin_user_id fk (nullable), action, entity_type, entity_id, changes (jsonb before/after), ip_address, user_agent, created_at

Single `category_id` per product (not many-to-many) — matches "simple parent/child," extendable to a join table later without breaking anything.

---

## 3. API / route design

- `lib/services/*` is the single source of truth for business logic (`createOrder`, `addCartItem`, `getProductBySlug`, dashboard aggregates). Server Actions and Route Handlers are thin wrappers — no duplicated logic.
- **Server Actions**: all web-only mutating interactions — cart add/update/remove, checkout submission, account forms, all admin CRUD forms. Get Next's built-in same-origin/CSRF protection for free.
- **Route Handlers (`app/api/**`)**: the stable JSON contract for future native mobile apps and any AJAX widgets — product/category browsing, search, cart, checkout, customer auth, order lookup. Additive-only once mobile depends on them.
- Admin CRUD stays server-rendered pages + Server Actions only in v1 (no public `/api/admin/*`), minimizing attack surface; a future admin API layer would reuse the same `lib/services/admin/*`.
- **Payments abstraction**: `lib/services/payments/` defines a `PaymentProvider` interface (`code`, `initiate(order)`, optional `verify/webhook`). v1 ships `cod`, `bkash`, `nagad`, `rocket`, `bankTransfer` — all manual/instructions-based (customer submits a transaction ID, admin verifies against `order_payment_details`). If a real-time Bangladeshi gateway is added later (SSLCommerz, or direct bKash/Nagad/Rocket merchant APIs), it's a new class implementing the same interface + a `payment_method_configs` row + a handler under `app/api/webhooks/[provider]/route.ts`; checkout flow itself doesn't change. No international gateways (Stripe/PayPal) — out of scope, this store doesn't sell internationally.
- **Order emails**: `lib/services/checkout.ts` calls `lib/email/` at the end of a successful `placeOrder` — one email to the customer (order confirmation) and one to the store's notification address (new-order alert), both via `lib/email/client.ts` (Nodemailer + SMTP env vars). Failure to send email never fails the order — it's logged, not thrown.
- `middleware.ts` (Edge runtime) only does a cheap cookie-presence redirect for `/admin/*` and `/account/*`; real session validation (DB lookup, role check) happens in each protected `layout.tsx` via `lib/auth/guards.ts` (Node runtime, can hit Postgres).

---

## 4. Page/route map

- **Storefront homepage**, in the required order: Header (sticky, in layout) → Hero Banner → Categories Slider → Best Selling Products → New Arrivals → Featured Collection → Why Choose FeboColour → Our Official Hijab Partner → Customer Reviews Carousel → Instagram Gallery → Messenger button → WhatsApp floating button → Footer (in layout).
- **Checkout flow**: `/cart` → `/checkout` (single page: contact + address + shipping method + payment method + notes + order summary, guest or logged-in) → Server Action `placeOrder` → redirect to `/checkout/confirmation/[orderNumber]`. No gateway redirect needed in v1 (all payment methods manual); the abstraction leaves room for a `/checkout/payment/[orderNumber]` step once a real gateway is added.
- **Account**: login/register, orders list + detail, addresses, profile. No wishlist page in v1.
- **Admin**: login, dashboard (today's orders, revenue, best sellers, low stock, recent orders via SQL aggregates), Products (image/video upload + dynamic variant builder: pick attributes → generate/edit variant combinations), Attributes (manage global attributes & values used by the variant builder), Categories, Inventory, Orders (status + manual payment verification), Customers, Reviews (moderation only), Homepage Banners, Shipping, Payments, Social Links, Settings (incl. SMTP sender name/notification email, store contact info), Audit Logs (read-only).

---

## 5. Build phasing (incremental, verify at each step)

**Phase 0 — Scaffold & infra.** `create-next-app` (TS strict, App Router, Tailwind v4), ESLint/Prettier, brand tokens in `tailwind.config` sampled from `assets/febo-logo.png` (pink→magenta gradient primary, purple secondary), self-hosted fonts, favicon, static Header/Footer shell. Create database `febocolour` on the existing local `postgresql` Docker container; `.env.local` with `DATABASE_URL`; Drizzle wired with a health-check query.
*Verify:* `next dev` runs, blank branded homepage renders, DB connects.

**Phase 1 — Schema + storefront read-only.** Full Drizzle schema/migrations for catalog + config tables, `scripts/seed.ts` with sample hijab products/categories/banners, homepage sections wired to real data, category and product pages, basic search (`ILIKE`, `tsvector` noted as later upgrade), `sitemap.xml`/`robots.txt`, JSON-LD (Product/Breadcrumb/Organization/FAQ), meta/OG/Twitter tags.
*Verify:* full catalog browsable, structured data passes Rich Results Test, Lighthouse 90+.

**Phase 2 — Cart + Checkout (COD only).** `carts`/`cart_items`, cart cookie/session logic, mini cart + cart page (qty update, shipping estimate), single-page guest checkout, `placeOrder` Server Action writing `orders`/`order_items`/`order_payment_details`, stock decrement, COD + the three shipping methods active, bare read-only `/admin/orders` view to confirm data lands correctly. Wire up `lib/email/` (SMTP env vars, order-confirmation + admin-new-order templates) and trigger both on successful `placeOrder`.
*Verify:* place a real order end-to-end, inspect DB rows, confirm stock and order-number generation, confirm both emails arrive (test SMTP account is fine for localhost).

**Phase 3 — Admin CRUD (full) + auth.** `admin_users`/`admin_sessions`, login, guards, dashboard widgets, full CRUD for Products/Categories/Inventory/Orders/Customers/Reviews/Banners/Shipping/Payments/Social Links/Settings, audit logging on every mutation, customer login/register for `/account`.
*Verify:* create a product in admin → appears live on storefront via `revalidateTag`; move an order through pending → processing → delivered.

**Phase 4 — SEO/perf/structured-data polish.** Sitemap completeness with lastmod, dynamic OG images for products, bundle-size trim (`next build --analyze`, convert unneeded client components to server components), accessibility pass (axe), cache-header tuning on `/api/*` and ISR windows, image format/size audit.
*Verify:* Lighthouse/PageSpeed 95+ mobile on homepage/category/product/cart.

**Phase 5 — Remaining payment options + security hardening.** bKash / Nagad / Rocket / Bank Transfer checkout forms (transaction-id capture) wired to the Phase-3 admin verification flow, rate limiting on login/checkout/search (in-process for v1, Redis noted as future multi-instance upgrade), CSRF check on browser-reachable Route Handlers (Server Actions already covered), `sanitize-html` on rich-text admin input, login lockout after repeated failures.
*Verify:* security checklist walkthrough; rate limiting triggers; all admin mutations show up in `audit_logs`.

**Phase 6 (post-v1) — Steadfast Courier integration.** Once "Outside City" volume justifies it: a `steadfast` shipping provider module (API credentials in env vars, order creation + tracking status pull), `orders.courier_tracking_id` column, admin UI to push a confirmed order to Steadfast and display tracking status. Deliberately kept out of v1 — `shipping_method_configs` already has a `code`/`rate_type` design that this slots into without touching the checkout flow.

---

## 6. Future roadmap: accounted for vs. simply not precluded

**Accounted for now (additive later, no destructive migration):** coupons (`orders.coupon_code`/`discount_total` already exist), reviews & ratings (table + `rating_avg`/`rating_count` already exist), real-time Bangladeshi payment gateways — SSLCommerz or direct bKash/Nagad/Rocket merchant APIs (interface + config table + webhook placeholder already in place, Phase 5 ships the manual/instructions version first), Steadfast Courier (Phase 6 above — `shipping_method_configs` already generic enough to slot it in), wishlist (trivial additive join table), mobile apps (the `/api/*` JSON contract is built for this purpose), digital downloads/bundles/gift cards (`product_kind` placeholder exists; supporting tables intentionally not built until needed), new product attributes (Material, Pattern, Fabric, etc. — just new `attributes`/`attribute_values` rows, no schema change, since variants are already dynamic).

**Not precluded, but nothing built now:** loyalty points, affiliate/referrals, blog, AI chatbot/recommendations, live inventory sync, analytics, notifications, PWA, marketplace support.

**Flagged caveat:** multi-language and multi-currency are the least future-proofed parts of this schema (plain-text columns, single `numeric` price + `currency` field) — if either is likely within the next year, worth revisiting before Phase 1; otherwise fine as-is since only English/BDT is needed today.

---

## Verification approach

Each phase ends with a concrete, runnable check (listed above) rather than a single end-of-project test pass — e.g. Phase 2 isn't "done" until an order placed through the real UI shows correct rows in `orders`/`order_items`/`order_payment_details` and decremented stock in Postgres. Phase 4 is verified with actual Lighthouse/PageSpeed runs against the local dev build, not assumed from code review.

## Critical files to create first
- `lib/db/schema/index.ts` — schema source of truth
- `lib/auth/session.ts` — session primitives reused by both customer and admin guards
- `lib/services/checkout.ts` — core order-creation logic, reused by Server Action and future `/api/checkout`
- `app/(storefront)/page.tsx` — homepage section composition
- `app/admin/layout.tsx` — admin auth guard + shell
