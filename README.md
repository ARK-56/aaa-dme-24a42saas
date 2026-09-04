# AAA DME — Next.js

Storefront and admin dashboard for AAA DME Healthcare, rebuilt on Next.js 15
(App Router, TypeScript, React 19) from the static theme in [`theme/`](theme/),
with Supabase (Postgres, Auth, Storage) behind it.

## Getting started

```bash
npm install
cp .env.local.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL, from Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Anon key — safe to expose; RLS decides what it can actually do |
| `NEXT_PUBLIC_SITE_URL` | Public origin for canonical and Open Graph URLs |
| `NEXT_PUBLIC_EMAILJS_*` | Contact form, footer CTA and intake modal delivery |

```bash
npm run dev
```

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`.

Without Supabase configured the app still builds and runs: the storefront serves
the seed catalogue in `src/data/`, and anything requiring an account is disabled.

## Database

Apply the migrations in `supabase/migrations/` — `supabase db push`, or paste
them into the SQL editor in order:

1. **`0001_initial_schema.sql`** — tables, row level security, the `place_order`
   function, and the private `prescriptions` storage bucket.
2. **`0002_seed_catalogue.sql`** — the 26 products. Idempotent, and product ids
   are preserved so existing `/product/<id>` links keep working.

### Making the first admin

`is_admin` defaults to false and cannot be granted from the UI, by design.
Register normally, then in the SQL editor:

```sql
update public.profiles set is_admin = true where email = 'you@example.com';
```

### Why it is shaped this way

The previous build kept each collection as a **single JSON blob** in Redis, so
placing an order meant reading the whole array, appending, and writing it back.
Two simultaneous checkouts overwrote each other and an order was silently lost.
Rows make that impossible.

`place_order()` does voucher redemption, inventory decrement and the order insert
in one transaction, locking the voucher row so a code cannot be redeemed twice,
and taking the price from the product row so the browser cannot dictate what is
charged. There is deliberately **no insert policy on `orders`** — the RPC is the
only way in.

Every table has RLS: a patient reads only their own orders, requests and codes,
while issuing a code and changing a request's status are staff-only.

## Security notes — read before going live

Fixed by the Supabase migration:

- Passwords are now hashed and verified by Supabase Auth, not compared in the
  browser against a plaintext store.
- The admin gate is a database policy, not a `localStorage` check.
- The unauthenticated `/api/db/*` endpoint — which let any visitor read or
  overwrite every collection — is gone.
- Prescription uploads are stored in a private bucket instead of being read in
  the browser and discarded.

Still outstanding:

- **HIPAA.** The intake form collects dates of birth, Medicare IDs and
  prescriptions. Supabase supports HIPAA only on the Team plan with a signed BAA
  and the paid HIPAA add-on, with projects marked High Compliance and MFA
  enforced. Free and Pro do not qualify at any configuration.
- **Rotate the old credentials.** The Redis URL and Resend key were hardcoded in
  `theme/server.js`; treat both as compromised.
- Neither legal document has been reviewed by an attorney.

## Architecture

```
src/
  app/
    (site)/            Public pages; layout adds Header + Footer
    admin-panel/       Admin dashboard; layout loads admin-panel.css
  components/          Route views and shared UI, grouped by feature
  context/             UiProvider → StoreProvider → AuthProvider → RequestModalProvider
  data/                Seed catalogue and per-product editorial copy
  hooks/useSlider.ts   Shared carousel behaviour
  lib/supabase/        Browser and server clients, row types, row↔UI mappers
  middleware.ts        Refreshes the auth session on each request
  styles/              style.css and admin-panel.css, taken from the theme
supabase/migrations/   Schema and catalogue seed
```

### Data flow

`StoreProvider` queries Supabase directly. The catalogue is public; orders,
requests and vouchers are scoped by RLS, so the client sends no user id filter —
an anonymous visitor simply receives nothing. The cart stays in `localStorage`:
it holds no PHI and needs no account.

`src/data/productContent.ts` holds the long-form product copy. It is kept out of
the database on purpose, so editing a product in the admin panel cannot wipe it.

### Route map

| Theme page | Route |
| --- | --- |
| `index.html` | `/` |
| `about.html` | `/about` |
| `shop.html` | `/shop` |
| `product-detail.html?id=…` | `/product/[id]` |
| `contact.html` | `/contact` |
| `blogs.html` | `/blogs` |
| `blog-1…4.html` | `/blogs/[slug]` |
| `cart.html` | `/cart` |
| `checkout.html` | `/checkout` |
| `order-form.html` | `/order-form` |
| `order-track.html?orderId=…` | `/order-track` |
| `privacy-policy.html` | `/privacy-policy` |
| `terms-conditions.html` | `/terms-conditions` |
| `admin-panel.html` | `/admin-panel` |

Blog slugs: `cpap-supplies-covered`, `wheelchair-fast`,
`portable-oxygen-concentrators-2025`, `what-makes-aaa-dme-different`.

### The `theme/` directory

Reference only — excluded from the build, lint, typecheck, and from git. Its
`style.css` and `admin-panel.css` were copied to `src/styles/` (with the five
relative `url()` paths rewritten to `/assets/...`), and its images and video to
`public/assets/`. Its vanilla JS engines have all been rewritten in React.
It still contains hardcoded credentials, so do not commit it.

## Known gaps

- The four homepage and About testimonials are invented quotes attributed to
  named clinicians, inherited from the theme. They are flagged in code and must
  be replaced with real, permissioned quotes before launch.
- The terms page and privacy policy are drafts written against the real service,
  but no attorney has reviewed them.
- The two videos in `public/assets/images/videos/` are 66 MB and 56 MB, over
  GitHub's recommended file size. Consider Git LFS or a CDN.
