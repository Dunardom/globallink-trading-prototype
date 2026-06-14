# GlobalLink Trading Co. — Interactive Prototype

A multi-page e-commerce prototype for a fictional Australian wholesale import &
distribution business, built for the **MIT512 Final Assessment**.

It demonstrates both a **B2C storefront** (browse, product detail, cart,
checkout) and a **B2B wholesale portal** (login, dashboard, tiered pricing,
order history, bulk order placement).

> Rebuilt from the original single-file React prototype into an optimised,
> dependency-free multi-page site (plain HTML + CSS + vanilla JS) so it loads
> instantly and deploys cleanly to GitHub Pages.

## Live demo

Once GitHub Pages is enabled (Settings → Pages → Branch: `main`, folder `/root`):

```
https://<your-username>.github.io/globallink-trading-prototype/
```

## Pages

| Page | File | Purpose |
| --- | --- | --- |
| Home | `index.html` | Hero, value props, category navigation, "how it works", CTA |
| Shop | `shop.html` | Product catalogue with category filtering (`?cat=`) |
| Product | `product.html?id=N` | Product detail, pricing, specs, related items |
| Cart | `cart.html` | Cart line items, quantity stepper, GST/shipping summary, checkout |
| B2B Portal | `b2b.html` | Login → dashboard, pricing tiers, order history, place order |

## Features

- **Persistent cart** — saved to `localStorage`, shared across every page and
  synced live between browser tabs.
- **Real URL state** — category filters and product pages are linkable URLs.
- **B2B session** — login state held in `sessionStorage`; tabbed dashboard.
- **Pricing logic** — B2C RRP, B2B wholesale price, retailer margin, MOQ,
  GST (10%) and free-shipping threshold ($75) all computed from one data set.
- **Responsive & accessible** — semantic landmarks, skip link, focus styles,
  `aria` labels, keyboard-friendly controls.
- **Zero build step / no framework** — only two CDN assets (Inter font and
  Tabler Icons). Open `index.html` and it runs.

## Project structure

```
globallink-trading-prototype/
├── index.html          # Home
├── shop.html           # Catalogue
├── product.html        # Product detail
├── cart.html           # Cart & checkout
├── b2b.html            # B2B portal
├── assets/
│   ├── css/styles.css  # Design system (all styling)
│   └── js/
│       ├── data.js     # Products, categories, orders, tiers
│       ├── common.js   # DOM helper, cart store, header/footer/toast
│       ├── home.js
│       ├── shop.js
│       ├── product.js
│       ├── cart.js
│       └── b2b.js
├── .nojekyll           # Serve asset folders untouched on GitHub Pages
└── README.md
```

## Run locally

No tooling required — just open `index.html` in a browser. To avoid any
file:// quirks you can serve it instead:

```bash
python -m http.server 8000
# then visit http://localhost:8000
```

## Demo B2B credentials

Any email + password works — click **Sign In** (e.g. `buyer@retailstore.com.au`).

---

*Prototype only. Pricing, inventory, accounts and orders are illustrative.*
