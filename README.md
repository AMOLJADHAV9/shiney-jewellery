# Shiney Jewellery — Haute Joaillerie & Cinematic Storefront

An ultra-premium, cinematic jewellery e-commerce storefront inspired by high-end scroll-driven storytelling, tactile aesthetics, and modern shopping journeys.

---

## 🌟 Highlights & Features

- **Cinematic Homepage (`/`)**:
  - Full-screen dramatic hero (*"Find the Perfect Ring Make"*) with golden ambient lighting and conflict-free diamond credentials.
  - Infinite scroll luxury ticker (*"The Iconic Collection • Elegant and Everlasting • Complimentary Insured Delivery"*).
  - Dual editorial split highlight banners (*"Add These To Your Style Roster"* and *"Unique Engagement Rings"*).
  - Atelier story section (*"Jewellery From The World's Finest Designers"*).
  - Best Sellers & Trend Products with responsive interactive category tabs.
  - Quad editorial category row (*One-Of-A-Kinds, High Tide Looks, Chandelier Halos, The Iconic Starbursts*).
  - Pinned 4-phase master craftsmanship interactive showcase (*120 Hours of Master Artistry*).
  - Client testimonials with verified buyer ratings.
  - Comprehensive luxury footer with private salon register, store locations, and trust badges.

- **Collections & Showroom Catalog (`/shop`)**:
  - Showroom hero banner with breadcrumbs (`HOMEPAGE > SHOP`).
  - Search input with real-time filtering.
  - Categories list with live item counts.
  - Price range filter with min/max inputs and quick Apply filter action.
  - Carats filter (10KT, 14KT, 18KT, 22KT, 24KT).
  - Grid / List view mode switcher.
  - Active filter chips and quick reset.

- **Product Details Page (`/product/:slug`)**:
  - Vertical thumbnail strip gallery with interactive image switcher.
  - Verified rating stars, brand, and live stock indicator.
  - Variant selectors (Ring sizes with waitlist indicators, chain lengths).
  - Quantity stepper, **Add to cart**, and **Buy It Now** express action.
  - **Browse Wishlist** and Compare actions.
  - Free Shipping & Exchanges, secure insured transit, and 600,000+ happy patrons markers.
  - **Guarantee Safe & Secure Checkout** badges (Stripe, Visa, Apple Pay, PayPal).
  - Detailed Description & Reviews tabs with key benefits.
  - **Related products** 5-item showcase and newsletter subscribe strip.

- **Editorial Journal & Blog (`/blog`) & Article View (`/blog/:slug`)**:
  - Showroom banner with breadcrumbs (`HOMEPAGE > BLOG`).
  - 8 editorial articles matching the reference design:
    1. *Layering Necklaces Like a Pro* (Accessories)
    2. *Behind the Craft: Handmade Jewelry Love* (Diamonds)
    3. *From Classic to Modern: Our Top Picks* (Earrings)
    4. *Gift Ideas That Sparkle* (Gifts Set)
    5. *Timeless Pieces for Your Collection* (Necklaces & Pendants)
    6. *Mix and Match: Jewelry Styling Tips* (Pearls)
    7. *The Meaning Behind Birthstone Jewelry* (Rings)
    8. *Jewelry Care Tips You Should Know* (Wedding)
  - Category filter pills, read times, author bios, rich article typography, and related reads.

- **Shopping Bag & Slide-Over Drawer (`/cart`)**:
  - Slide-over drawer accessible from anywhere on the site.
  - Dedicated cart page with item table, thumbnail, variant details, quantity controls.
  - Real-time **Complimentary Insured Shipping progress bar** ($250 threshold).
  - Salon privilege promotional codes (`HAUTE10` for 10% off, `SHINEYVIP` for 15% off).
  - Subtotal, tax, shipping, and total calculation.

- **Prototype Insured Checkout (`/checkout`)**:
  - Prominent **Prototype Demonstration Mode** disclaimer banner.
  - Client delivery address form with validation.
  - Courier speed selector (Armoured Insured Standard vs Priority Overnight).
  - Simulated payment rails (Encrypted Mock Card, Private Wire Consultation).
  - Real-time order review panel.
  - Prototype order confirmation screen with generated order reference (e.g., `SH-2026-89412`).

- **Private Wishlist (`/wishlist`)**:
  - Dedicated view of all saved pieces with one-click "Move to Bag" or remove.

- **Atelier Story (`/about`) & Client Concierge (`/contact`)**:
  - Complete brand heritage, conflict-free diamond guarantee, and jewellery care guide.
  - Validated concierge inquiry form, private appointment reservation, and flagship salon directory (London Mayfair, Paris Place Vendôme, New York Madison Ave).

---

## 🛠️ Technology Stack

- **Framework**: React 19 + Vite 8 (TypeScript / JSX)
- **Styling**: Tailwind CSS v4 + `@tailwindcss/vite`
- **Typography**: Google Fonts (*Cormorant Garamond* display serif + *Plus Jakarta Sans*)
- **Routing**: `react-router-dom` v7
- **Motion**: `gsap` + `motion` (Framer Motion)
- **Icons**: `lucide-react`
- **Persistence**: React Context + `localStorage` for cart and wishlist

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🧭 Route Map

| Route | Page | Purpose |
| :--- | :--- | :--- |
| `/` | `HomePage` | Cinematic hero, editorial split banners, best sellers, craftsmanship story |
| `/shop` | `ShopPage` | Showroom catalog with search, category counts, price filters, carats |
| `/product/:slug` | `ProductDetailPage` | Vertical thumbnails, Buy It Now, checkout trust badges, related items |
| `/blog` | `BlogPage` | 8 editorial articles with category filters and newsletter subscribe |
| `/blog/:slug` | `BlogPostPage` | Full article view with author bio, tags, and related stories |
| `/cart` | `CartPage` | Dedicated bag view, free shipping progress bar, privilege codes |
| `/checkout` | `CheckoutPage` | 3-step prototype checkout with address validation and confirmation modal |
| `/wishlist` | `WishlistPage` | Saved private portfolio with move-to-bag actions |
| `/about` | `AboutPage` | Brand story, conflict-free diamond guarantee, care guidelines |
| `/faq` | `FAQPage` | Categorized accordion questions on commissions, insurance, care |
| `/account` | `AccountPage` | VIP patron profile, order tracking with courier status, addresses |
| `/contact` | `ContactPage` | Salon appointment booking, inquiry form, flagship locations |
| `/404` | `NotFoundPage` | Luxury Error 404 page ("The Vault is Silent") with quick links |

