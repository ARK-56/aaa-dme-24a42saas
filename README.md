# AAA DME — Next.js

Storefront and admin dashboard for AAA DME Healthcare, rebuilt on Next.js 15
(App Router, TypeScript, React 19) from the static theme in [`theme/`](theme/).

## Getting started

```bash
npm install
```

Copy the environment template and fill it in:

```bash
cp .env.local.example .env.local
```

| Variable | Purpose |
| --- | --- |
| `REDIS_URL` | Connection string for the JSON document store behind `/api/db/*` |
| `RESEND_API_KEY` | Server-side key for sending signup verification codes |
| `RESEND_FROM_EMAIL` | Sender address; the domain must be verified in Resend |
| `NEXT_PUBLIC_EMAILJS_PUBLIC_KEY` | EmailJS browser key (public by design) |
| `NEXT_PUBLIC_EMAILJS_SERVICE_ID` | EmailJS service |
| `NEXT_PUBLIC_EMAILJS_CONTACT_TEMPLATE_ID` | Template for the contact + footer CTA forms |
| `NEXT_PUBLIC_EMAILJS_REQUEST_TEMPLATE_ID` | Template for the medical intake modal |

Then:

```bash
npm run dev
```

Other scripts: `npm run build`, `npm start`, `npm run lint`, `npm run typecheck`.

## Security notes — read before going live

These carry over from the original codebase and are **not** fixed by the port:

- **Rotate the Redis and Resend credentials.** Both were hardcoded in plain text
  in `theme/server.js`. They now live in `.env.local` (gitignored), but the old
  values should be considered compromised.
- **`/api/db/*` is unauthenticated.** Any visitor can read or overwrite every
  collection, including `users.json`. It needs an auth check before deployment.
- **Passwords are stored in plain text** in `users.json`, and login is verified
  in the browser. Replace this with a real session-based auth flow and hashed
  credentials before handling patient accounts.
- **The admin gate is client-side only.** `/admin-panel` checks the session in
  `localStorage`, so it keeps honest users out but stops no one determined.

## Architecture

```
src/
  app/
    (site)/            Public pages; layout adds Header + Footer
    admin-panel/       Admin dashboard; layout loads admin-panel.css
    api/db/[file]/     Redis-backed JSON store (allowlisted collections)
    api/send-verification/  Signup codes via Resend
  components/          Route views and shared UI, grouped by feature
  context/             UiProvider → StoreProvider → AuthProvider → RequestModalProvider
  hooks/useSlider.ts   Shared carousel behaviour
  lib/                 Types, seed catalog, storage keys, routes, email
  styles/              style.css and admin-panel.css, taken from the theme
```

### Data flow

`StoreProvider` replaces the theme's `data-store.js`. On mount it warms state
from `localStorage`, then pulls authoritative copies from `/api/db/*`. Writes go
to state, the local cache, and the server together. localStorage keys are
unchanged from the theme, so an existing browser session carries over.

If Redis is unreachable the API returns 503 quickly and the app falls back to the
catalog in `src/data/products.json` — the storefront stays browsable, exactly as
the theme behaved when its server was down.

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

Kept as reference only — it is excluded from the build, lint, and typecheck. Its
`style.css` and `admin-panel.css` were copied to `src/styles/` (with the five
relative `url()` paths rewritten to `/assets/...`), and its images and video to
`public/assets/`. Its vanilla JS engines have all been rewritten in React and are
no longer used. Delete the folder once you are satisfied with the port.

## Known gaps

- The seeded `admin@example.com` / `admin123` account from the theme still works.
- The privacy and terms pages still carry the template's placeholder copy
  (it references "Greenstorm" and an unrelated contact address). Both render from
  `src/components/legal/LegalDocument.tsx`.
- Uploaded prescription files are read client-side and only a "file attached"
  flag is stored; the file itself is never persisted.
