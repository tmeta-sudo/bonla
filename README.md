# បន្លា · Bonla

A Khmer durian store for tree-ripened **Kampot durian** (ទុរេនកំពត). Bilingual Khmer / English, built with plain HTML, CSS and JavaScript: no framework, no build step, no dependencies.

**Live:** https://tmeta-sudo.github.io/bonla/

ហាងទុរេនខ្មែរ សម្រាប់ទុរេនកំពតទុំលើដើម។ គាំទ្រភាសាខ្មែរ និងអង់គ្លេសពេញលេញ ដោយប្រើពុម្ពអក្សរ Kantumruy Pro។

## Before you take real orders

Open `assets/js/data.js` and set:

| Setting | What it does |
| --- | --- |
| `config.telegram` | Your Telegram username (no @). The order button opens a chat with you, with the order prefilled. |
| `config.phone` | Shown in the Contact block, tappable on phones. |
| `products[].price` | Price in riel (per kg for whole fruit, per box for treats). The current prices are placeholders. |
| `zones` | Delivery areas, fees and delivery times. |
| `season` | Harvest months (0 off, 1 early/late, 2 peak). |

Push to `main` and the site redeploys automatically.

## How ordering works

1. The customer adds durian to the basket and picks a delivery area and time.
2. **Send order on Telegram** opens a chat with your account with the full order already typed (it is also copied to the clipboard, in case their Telegram app ignores the prefill).
3. You weigh the fruit and reply with the exact price and a KHQR code.

The basket and form are saved in the customer's browser, so a refresh doesn't lose their order.

## Features

- **Full Khmer**: Kantumruy Pro (300–700 + italic), Khmer-tuned line heights, Khmer numerals (០១២៣…) for prices, counts and dates when Khmer is selected. KM / EN switch is remembered.
- **Real photography** with responsive WebP (`srcset`), lazy loading and fixed dimensions (no layout shift). Phones only download the small sizes (about 40–120 KB each).
- **Flavor finder**: sweetness, aroma and texture sliders rank the varieties live.
- **Khmer harvest calendar** with the current month marked.
- **Culture**: the Durian Roundabout in Kampot, sharing durian, tree-ripening, and a "choose like a market seller" guide.
- **SEO ready**: Open Graph tags, `Store` structured data, sitemap, robots.txt, 404 page.
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
