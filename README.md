# បន្លា · Bonla

A Khmer durian store for tree-ripened **Kampot durian** (ទុរេនកំពត). Bilingual Khmer / English, built with plain HTML, CSS and JavaScript: no framework, no build step, no dependencies.

**Live:** https://tmeta-sudo.github.io/bonla/

ហាងទុរេនខ្មែរ សម្រាប់ទុរេនកំពតទុំលើដើម។ គាំទ្រភាសាខ្មែរ និងអង់គ្លេសពេញលេញ ដោយប្រើពុម្ពអក្សរ Kantumruy Pro។

## Before you take real orders

Open `assets/js/data.js` and set at least one order channel in `config`:

| Setting | What it does |
| --- | --- |
| `telegram` | Your Telegram username (no @). Checkout opens a chat with you with the order already typed. A Telegram button also appears in the header. |
| `phone` | Your phone number. Shown under Contact; if there is no Telegram, checkout opens an SMS with the order. |
| `products[].price` | Price in riel (per kg for whole fruit, per box for treats). Current prices are placeholders. |
| `zones`, `when` | Delivery areas, fees, times and delivery-time choices. |
| `season` | Harvest months (0 off, 1 early/late, 2 peak). Whole fruit shows "Pre-order" outside the season. |

Both channels are empty right now, so all Telegram and phone links are hidden and checkout copies the order message instead. Push to `main` and the site redeploys automatically.

## How ordering works (app screens)

On phones the store works like an app, with a bottom bar: **Home · Orders · Basket · More**.

1. **Product page**: tap any durian to see a large photo, stock status (in stock or pre-order, based on the season), quantity, description, taste profile, how to store it and similar products.
2. **Basket**: quantities, remove, delivery area, name and phone, address, optional "attach my location" (adds a Google Maps link), delivery time and total.
3. **Checkout** sends the order through your channel (it is also copied to the clipboard) and saves it on the customer's device with an order number like `BL-1103-4821`.
4. **Order details** shows the steps: order prepared, sent to the shop, shop weighs it and sends KHQR, delivered. The customer can send it again or reorder in one tap.

## Features

- **Full Khmer**: Kantumruy Pro (300–700 + italic), Khmer-tuned line heights, Khmer numerals (០១២៣…) for prices, counts and dates when Khmer is selected. KM / EN switch is remembered.
- **Real photography** with responsive WebP (`srcset`), lazy loading and fixed dimensions (no layout shift). Phones only download the small sizes (about 40–120 KB each).
- **Flavor finder**: sweetness, aroma and texture sliders rank the varieties live.
- **Khmer harvest calendar** with the current month marked.
- **Culture**: the Durian Roundabout in Kampot, sharing durian, tree-ripening, and a "choose like a market seller" guide.
- **SEO ready**: Open Graph tags, `Store` structured data, sitemap, robots.txt, 404 page.
- **Phone-first navigation**: an app-style bottom tab bar (Home, Varieties, Taste, Season, Basket) that highlights the section you are in, a header that hides while you scroll down, and swipeable product and culture rows.
- **Motion**: staggered scroll reveals, photo shimmer and fade-in, the product photo growing into its page, the photo flying into the basket with a small burst and phone vibration, ripples on press, count-up prices, a live season countdown, and a gentle hero glow with drifting pollen. Everything is turned off for people who choose reduced motion.
- **Light / dark mode**: follows the phone or computer setting by default; the header button switches it and the choice is remembered.
- **Smooth and accessible**: CSS scroll-driven reveals, View Transitions, `<dialog>` basket with focus handling, visible focus states, `prefers-reduced-motion` support.

## Photos

The photos come from **Wikimedia Commons** under CC BY / CC BY-SA licenses (one is public domain). They are credited in the site footer under "Photo credits" and in `data.js → credits`. Keep the credits while you use them.

The variety photos are representative, not photos of that exact variety. For a real shop, replace them with your own photos: save each as `assets/photos/<name>-480.webp` and `<name>-900.webp`, set the product's `photo` and `ratio`, and remove its credit line.

## Project structure

```
index.html                 page markup (Khmer is the source text)
404.html
assets/css/styles.css      design tokens + all styles
assets/js/data.js          shop config, products, prices, English strings, photo credits
assets/js/app.js           i18n, finder, season calendar, basket, Telegram order
assets/photos/             WebP photos (2 sizes each)
.github/workflows/pages.yml  GitHub Pages deploy
```

## Run locally

```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## License

Code: MIT (see `LICENSE`). Photos: their own licenses, listed in the footer and in `data.js`.
