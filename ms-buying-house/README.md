# M&S Buying House

Marketing site for **M&S Buying House** — an apparel sourcing partner in Dhaka
connecting global buyers with vetted Bangladeshi garment factories.

Built with **Next.js 15 (App Router)**, **React 19**, **Tailwind CSS v4** and
TypeScript. Designed to deploy on **Vercel** with zero configuration.

## Quick start

```bash
npm install
cp .env.example .env.local   # optional — the site runs without it
npm run dev                  # http://localhost:3000
```

Other scripts:

```bash
npm run build       # production build
npm run start       # serve the production build
npm run typecheck   # tsc --noEmit
```

## Deploying to Vercel

1. Push this directory to its own GitHub repository.
2. In Vercel, **Add New → Project** and import the repository.
3. Framework preset is detected as Next.js — no build settings to change.
4. Add the environment variables below, then **Deploy**.

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recommended | Canonical URLs, `sitemap.xml`, Open Graph tags. |
| `RESEND_API_KEY` | Optional | Emails contact-form enquiries via [Resend](https://resend.com). |
| `CONTACT_TO_EMAIL` | Optional | Inbox that receives enquiries. |
| `CONTACT_FROM_EMAIL` | Optional | Verified sender address. |

Without the mail variables the contact form still works — submissions are
validated and written to the server log, so nothing is lost while the mail
provider is being set up.

## Editing the content

All copy lives in `src/content/` — no need to touch the components:

| File | Contains |
| --- | --- |
| `site.ts` | Brand name, contact details, address, headline stats, nav, export markets |
| `services.ts` | The six service offerings and their bullet points |
| `products.ts` | Product categories, example items and minimum order quantities |
| `process.ts` | The six-stage programme timeline and the certification list |
| `faqs.ts` | Frequently asked questions |

> **Before going live:** `site.ts` ships with placeholder contact details and
> illustrative statistics, each marked with a `TODO`. Replace them with your
> real, verifiable figures.

## Adding photography

The design deliberately uses gradients, a woven-texture pattern and typography
instead of stock imagery, so it looks finished without placeholder photos. To
add real photography, drop files into `public/` and swap the decorative blocks
(the elements using `bg-weave` / gradient tones) for `next/image`:

```tsx
import Image from "next/image";

<Image src="/images/knitwear.jpg" alt="Knitwear production line" fill
       className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
```

## Structure

```
src/
  app/            Routes — /, /services, /products, /compliance,
                  /sustainability, /about, /faq, /contact, /api/contact
  components/     Header, footer, hero, cards, form, icons
  content/        All editable copy and data
  lib/            Small helpers
```

## Notes

- Light, fast by default: no animation library, no icon package, no UI kit.
  Scroll reveals use one `IntersectionObserver`; icons are inline SVG.
- Accessibility: skip link, keyboard-navigable disclosure FAQ, visible focus
  rings, and reduced-motion support.
- SEO: per-page metadata, `sitemap.xml`, `robots.txt`, and Organization +
  FAQPage structured data.
