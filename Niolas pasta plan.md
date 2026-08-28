# Niola's Pasta — Website Build Plan

Domain: niolaspasta.com
Business: Niola's Pasta (aka MyPastaByNiola)
Location: Uniosun second gate, opposite VIP Lodge, Okebaale, Osogbo

---

## 1. Tech stack

| Layer | Choice | Why |
|---|---|---|
| Framework | Next.js 14+ (App Router) | SSR/SSG for SEO, fast, you already know it |
| Language | TypeScript | Type-safe menu/order data |
| Database | Supabase (Postgres) | You already use it, built-in auth for admin, realtime for order status |
| Styling | Tailwind CSS | Fast to build, easy to theme with the color palette below |
| Payments | Paystack | Confirmed, she has an account |
| Owner email notifications | Resend | Simple transactional email API |
| Owner SMS notifications (optional) | Termii | Nigerian SMS delivery |
| Image hosting | Supabase Storage (or Cloudinary if menu photos are heavy) | Next/Image optimization either way |
| Hosting | Vercel | Native Next.js support, fast edge delivery, free tier is enough at this scale |
| Admin auth | Supabase Auth (email + password, single owner account) | No need for roles/multi-user yet |

No user accounts for customers. Guest checkout + order-token tracking only (see Section 6).

---

## 2. Brand identity

**Logo:** provided by Niola — use as-is, don't recolor it.

**Color palette** (locked in, from her AI-generated direction — architecture/UX decisions are still ours, only the palette was inherited):

| Role | Hex | Usage |
|---|---|---|
| Background | `#FFF7EF` (warm cream) | Page background, navbar |
| Primary / dark sections | `#5A0B04` (deep burgundy) | Header, hero section, footer, strong CTAs |
| Accent | `#AF2602` (burnt orange/red) | Buttons, hover states, active nav item, "Add to cart" |
| Highlight | `#FF9A5A` (warm peach) | Sparingly — badges, small accents, price tags |
| Body text | `#2B1713` (dark brown) | Primary text color instead of pure black — warmer, on-brand |

Combination: Cream background → burgundy sections → burnt-orange buttons → peach highlights. Do not go full red/white — it reads generic fast-food rather than a proper food brand.

**Typography:** one clean sans-serif for UI (e.g. Inter or similar via next/font), optionally a warm serif/display font for headings/logo area to add personality — decide once building starts, not a blocker.

---

## 3. Site structure / pages

```
/                     Homepage (hero + menu + about teaser + policy modal)
/menu                 Full menu (same content as homepage menu section, canonical page for SEO)
/product/[slug]       Individual menu item page
/cart                 Cart drawer (component, not a full page — see Section 5)
/checkout             Checkout form + Paystack payment
/order-confirmation/[token]   Post-payment confirmation + WhatsApp deep link
/track/[token]        Order status tracking (public, token-gated)
/about                About Niola's Pasta
/policy               Full policy page
/contact              Contact info + socials
/admin                Admin login
/admin/dashboard      Admin panel (orders, menu management)
```

---

## 4. Homepage layout

**Hero section — 2 columns:**
- Left: headline, one-line tagline, single CTA button ("Order now" → scrolls to menu)
- Right: choose one of two options —
  - **Option A (simpler, ship faster):** one strong static hero photo or a tight 2x2 grid of dishes
  - **Option B (more premium, more build time):** circular rotating gallery — 4-5 dish photos arranged in a ring, front image scales up and centers, auto-rotates every ~2 seconds, pauses on hover, with manual prev/next arrows or dots for people who don't want to wait
  - Recommendation: build Option A first, ship it, swap in Option B later if there's time — don't let it block launch.

**Policy modal:** shows once per session (cookie/localStorage-based, not every page load) on first visit. Summarized policy + "I understand" button before they can interact with the rest of the site. Full policy always available at `/policy`.

**Menu section (below hero):** all items shown, grouped by category, no pagination or "load more". Order: Big Plate → Budget Plate → Small Plate → Combo → Sides → Extras.

**About teaser:** short blurb + "Read more" linking to `/about`.

**Footer:** working hours, phone numbers, socials, policy link, delivery disclaimer note.

---

## 5. Menu, cart & product pages

**Product card (grid view):** photo, name, price, one-line description, "View" / "Add to cart" button. Hover on photo = subtle zoom (CSS `scale(1.05)` transition, not jarring).

**Product page (`/product/[slug]`):**
- Large photo with hover-zoom
- Full (expanded) description
- Variant selection where applicable (sausage vs plantain)
- Extras/add-ons selection inline (extra chicken, extra plantain, etc.)
- Quantity selector + Add to cart
- Related products (other items in same category, or a suggested drink/side — "Complete your meal")
- Reviews section — Reviews will be auto-accepted and go live immediately without admin moderation.

**Cart:** slide-out drawer, not a separate page — keeps people browsing without losing context. Shows line items, quantities, extras, subtotal. No delivery fee shown here or anywhere in checkout (see Section 7).

---

## 6. Order flow (no delivery fee online)

1. Customer builds cart → checkout
2. Checkout form: name, phone, delivery address, optional email — guest only, no account
3. Clear on-screen note: **"Delivery fee is not included and will be paid directly to the rider on delivery."**
4. Payment: Paystack, food subtotal only
5. Paystack webhook (server-side, not client redirect) confirms payment → order written to Supabase with a unique order token (e.g. `NP-2847`)
6. Order status starts at **Pending Confirmation**
7. Customer sees confirmation page: order summary, tracking link (`/track/[token]`), and an optional `wa.me` deep link pre-filled with the order summary so they can message the owner directly if they want
8. Owner is notified independently of what the customer does — email (Resend) fires automatically off the webhook, optionally SMS (Termii) too. This is the source of truth, not WhatsApp.
9. Owner calls the customer to confirm order + address, gives a verbal rough delivery estimate at this point (not shown on-site)
10. Owner books a rider herself (Gokada/dispatch/etc.) — outside the site entirely
11. Owner updates order status in admin panel: Pending Confirmation → Preparing → Out for Delivery → Delivered
12. Customer's `/track/[token]` page reflects each status update
13. Customer pays the rider directly for delivery on arrival

No zone list, no flat rate, no distance calculation anywhere in the codebase. The order token is the only thing gating access to `/track/[token]` — no login needed, same principle as a password-reset link.

---

## 7. Order status pipeline

```
Pending Confirmation → Preparing → Out for Delivery → Delivered
```
(Add a `Cancelled` state too, since her cancellation policy allows cancelling before prep starts.)

Each status change updates the `orders` table and reflects live (or on refresh) on `/track/[token]`.

---

## 8. Admin panel (`/admin`)

Single owner login via Supabase Auth (email + password). No roles/staff logins for v1.

**Dashboard capabilities:**
- View all incoming orders, filterable by status
- Update order status (the pipeline above)
- Add / edit / remove menu items — name, price, description, photo, category, variants, extras
- Toggle an item "sold out" (hides "Add to cart", shows badge)
- View daily/weekly order totals (simple count + revenue sum, no need for elaborate analytics in v1)
- Manage reviews (delete inappropriate reviews if necessary)

---

## 9. Notifications

| Event | Channel | Recipient |
|---|---|---|
| New paid order | Email (Resend) | MyPasta.ng@gmail.com |
| New paid order (optional) | SMS (Termii) | 07030462283 |
| Order confirmation | On-screen + optional WhatsApp deep link | Customer |
| Status updates | Live on `/track/[token]` | Customer |

WhatsApp number for the customer-facing deep link: 07030462283 (or whichever she confirms is her active WhatsApp).

---

## 10. SEO strategy — two separate systems

### A. On-site / technical SEO (controls how the website itself ranks and displays)
- Proper `<title>` and meta description per page, unique per product page
- Open Graph + Twitter Card tags (image, title, description) for link previews on social
- `sitemap.xml` and `robots.txt`, auto-generated via Next.js
- Fast load times — Next/Image for all photos (lazy-load, responsive sizes, WebP), avoid render-blocking scripts
- Clean semantic URLs (`/product/chicken-pasta`, not query-string IDs)
- Mobile-first responsive layout, SSL (automatic on Vercel)
- Schema.org structured data:
  - `LocalBusiness` / `Restaurant` schema on homepage — name, address, phone, hours, price range
  - `Product` schema per menu item — name, price, image, description
  - `Review` / `AggregateRating` schema if on-site reviews are built — this is what can produce star-snippets under **her website's own link** in Google search results (separate from Google Maps stars, see below)

### B. Local / Google Business SEO (controls Google Maps presence, "near me" search, star ratings in the local pack)
- This is **not controlled by the website at all** — it runs entirely through a **Google Business Profile** (free, separate from the site)
- Set up (or confirm existing) profile with exact business name, address, phone, hours, category ("Pasta restaurant" / "Meal delivery")
- **NAP consistency is critical for local SEO**: Name, Address, Phone must be identical across the website, Google Business Profile, Instagram, Facebook, TikTok — any mismatch weakens local ranking
- Drive customers to leave Google reviews post-delivery (e.g. a link in the order confirmation email/WhatsApp message: "Loved it? Rate us on Google")
- On-site reviews and Google reviews are two separate systems — reviews left on the website do NOT feed into Google's Maps star rating. They only affect the site's own search snippet (see Schema note above).

---

## 11. Policies (live at `/policy`, summarized in the on-load modal)

Full text she provided, structured under these headers:

1. Order Confirmation
2. Payment Policy
3. Delivery Policy
4. Delivery Waiting Policy (10-minute rider wait rule)
5. Cancellation Policy
6. Refund & Replacement Policy
7. Pickup Policy
8. Allergen Policy
9. Food Safety
10. Customer Conduct

No minimum order value.

---

## 12. Business info (reference)

- **Address:** Uniosun second gate, opposite VIP Lodge, Okebaale, Osogbo
- **Phone:** 0703 046 2283 / 0811 303 7582
- **Working hours:** Monday–Friday 9:00 AM–9:00 PM, Saturday & Sunday 10:00 AM–9:00 PM
- **Order notification email:** MyPasta.ng@gmail.com
- **SMS alerts:** 0703 046 2283
- **Customer WhatsApp:** 0703 046 2283
- **Instagram:** [@mypastabyniola](https://www.instagram.com/mypastabyniola)
- **Facebook:** [Niola's Pasta](https://www.facebook.com/share/1BxBDjubvq/)
- **TikTok:** [Niola's Pasta](https://vm.tiktok.com/ZS9kphQGQBAP5-mYq6M/)

---

## 13. Menu (expanded descriptions)

Original descriptions were solid but a little short for product pages — expanded slightly below for warmth and detail while keeping every fact she gave. Use the shorter original lines on menu grid cards if space is tight, and the longer versions on individual product pages.

### 🍝 Big Plate

**Chicken Pasta — ₦2,800**
Flavour-packed stir-fried pasta tossed with juicy, well-seasoned peppered chicken and a colourful mix of fresh veggies. Every forkful brings that smoky, peppery kick balanced with the comfort of perfectly cooked pasta — a firm favourite for anyone who wants a satisfying, no-fuss plate.

**Chicken & Sausage Pasta — ₦3,200**
Our signature stir-fried pasta loaded with juicy peppered chicken, savoury sliced sausage, and fresh veggies. The sausage adds a rich, slightly smoky depth that pairs perfectly with the peppery chicken — a heartier plate for when you want a little extra.

**Chicken & Plantain Pasta — ₦3,200**
Stir-fried pasta with tender peppered chicken, sweet fried plantain, and fresh veggies. The natural sweetness of the plantain plays beautifully against the spice of the chicken — a sweet-and-savoury combo that keeps people coming back.

**Sardine Special Pasta — ₦4,500**
Our most loaded plate — rich, flavourful pasta packed with sardine and juicy peppered chicken, fresh veggies, and your choice of plantain or sausage on the side. Deeply satisfying and built for a proper appetite.

### 🍳 Budget Plate

**Egg Pasta — ₦2,600**
Tasty stir-fried pasta with well-seasoned egg, your choice of sausage or plantain, and fresh veggies. Simple, filling, and easy on the pocket without skimping on flavour.

### 🍝 Small Plate

**Chicken & Sausage Pasta (Small) — ₦2,700**
The same flavour-packed combo of juicy peppered chicken, savoury sausage, and fresh veggies — just right-sized for a lighter appetite or a quick bite.

**Chicken & Plantain Pasta (Small) — ₦2,700**
Peppered chicken, sweet plantain, and fresh veggies in a smaller portion — perfect when you want the full flavour without the big plate.

### 🥤 Combo

**Pasta Combo — ₦3,700**
A flavour-packed plate of stir-fried pasta with juicy peppered chicken, your choice of sausage or plantain, fresh veggies, and a chilled Coke or Fanta on the side. A complete meal in one order.
*Drink choice: Coke or Fanta.*

### 🥗 Sides

**Salad — ₦1,000**
Fresh, crisp salad — a light, refreshing side to any plate.

**Coleslaw — ₦500**
Creamy, crunchy coleslaw made to complement the richness of the pasta.

### ➕ Extras

- Extra Pasta — ₦300
- Extra Chicken — ₦1,300
- Extra Plantain — ₦500
- Extra Sausage — ₦500
- Extra Egg — ₦500
- Extra Veggies — FREE

*Ordering note: where applicable, customers can choose between sausage or plantain.*

---

## 14. Database schema (Supabase Postgres — high level)

```
menu_items
  id, slug, name, description, short_description, price, category,
  image_url, is_sold_out, variants (jsonb), extras (jsonb), created_at

orders
  id, order_token, customer_name, customer_phone, customer_email,
  delivery_address, items (jsonb: item_id, qty, variant, extras, price_at_order),
  subtotal, paystack_reference, payment_status, order_status,
  created_at, updated_at

reviews
  id, menu_item_id, customer_name, rating, comment, created_at

admin_users
  handled entirely by Supabase Auth, single account
```

---

## 15. Build order (suggested sequence)

1. Next.js project scaffold + Tailwind + color theme setup
2. Supabase project + schema (menu_items, orders, reviews)
3. Menu data entry (once photos are received) + homepage + menu grid
4. Product pages (variants, extras, related items)
5. Cart drawer + checkout form
6. Paystack integration + webhook → order creation
7. Order confirmation page + WhatsApp deep link
8. Order tracking page (`/track/[token]`)
9. Admin panel (auth, order management, menu management)
10. Policy page + on-load modal
11. About / Contact pages
12. Reviews (auto-accepted without moderation)
13. SEO pass — meta tags, schema markup, sitemap, OG images
14. Notification wiring — Resend email, optional Termii SMS
15. QA pass with Paystack test keys end-to-end
16. Switch to live keys once she completes Paystack KYC, launch

---

## 16. Outstanding items (waiting on her)

- [x] Reviews: Open and auto-accepted without admin review.
- [ ] Menu photos + logo file (Drive folder)
- [ ] Paystack test API keys (public + secret)
- [ ] Confirm which of her two numbers is the active WhatsApp for the deep link
- [ ] Confirm hero style: static photo(s) vs circular rotating gallery