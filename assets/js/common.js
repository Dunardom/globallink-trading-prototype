/* ===========================================================================
   GlobalLink Trading Co. — shared runtime
   DOM helper, persistent cart store, header / footer / toast rendering.
   Loaded on every page (after data.js).
   =========================================================================== */

/* ----------------------------- DOM helper ------------------------------- */
/* Tiny hyperscript-style builder so page code stays declarative, similar to
   the React.createElement() calls in the original prototype. */
function el(tag, attrs, ...children) {
  const node = document.createElement(tag);
  if (attrs) {
    for (const key in attrs) {
      const val = attrs[key];
      if (val == null || val === false) continue;
      if (key === "class") node.className = val;
      else if (key === "html") node.innerHTML = val;
      else if (key === "dataset") Object.assign(node.dataset, val);
      else if (key.startsWith("on") && typeof val === "function") {
        node.addEventListener(key.slice(2).toLowerCase(), val);
      } else if (val === true) node.setAttribute(key, "");
      else node.setAttribute(key, val);
    }
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    node.append(child.nodeType ? child : document.createTextNode(String(child)));
  }
  return node;
}

/* Tabler icon <i> element */
const icon = (name, cls) => el("i", { class: "ti " + name + (cls ? " " + cls : ""), "aria-hidden": "true" });

/* Money formatting with thousands separators */
const money = (n) => "$" + Number(n).toLocaleString("en-AU", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const GST_RATE = 0.10;
const FREE_SHIP_THRESHOLD = 75;
const SHIP_FLAT = 8.95;

/* ----------------------------- Cart store ------------------------------- */
/* Persisted to localStorage so the cart survives navigation between the
   separate pages of the site. Stored as a compact [{id, qty}] list. */
const CART_KEY = "gl_cart_v1";

function getCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
  updateCartBadge();
}
/* Cart lines joined with live product data */
function cartDetailed() {
  return getCart()
    .map((line) => { const p = getProduct(line.id); return p ? { ...p, qty: line.qty } : null; })
    .filter(Boolean);
}
function addToCart(id, qty = 1) {
  const cart = getCart();
  const existing = cart.find((i) => i.id === id);
  if (existing) existing.qty += qty;
  else cart.push({ id, qty });
  saveCart(cart);
}
function setQty(id, qty) {
  let cart = getCart();
  if (qty < 1) cart = cart.filter((i) => i.id !== id);
  else cart = cart.map((i) => (i.id === id ? { ...i, qty } : i));
  saveCart(cart);
}
function removeFromCart(id) { saveCart(getCart().filter((i) => i.id !== id)); }
function clearCart() { saveCart([]); }
const cartCount = () => getCart().reduce((s, i) => s + i.qty, 0);
const cartTotal = () => cartDetailed().reduce((s, i) => s + i.b2c * i.qty, 0);

/* --------------------------- Header & footer ---------------------------- */
const NAV_ITEMS = [
  { page: "home", label: "Home", href: "index.html" },
  { page: "shop", label: "Shop", href: "shop.html" },
  { page: "b2b",  label: "B2B Portal", href: "b2b.html" },
];

function renderHeader() {
  const host = document.getElementById("site-header");
  if (!host) return;
  const active = document.body.dataset.page;

  const brand = el("a", { class: "brand", href: "index.html", "aria-label": "GlobalLink Trading Co. home" },
    icon("ti-world"),
    el("span", { class: "brand-name" }, "GlobalLink"),
    el("span", { class: "brand-sub" }, "Trading Co."),
    el("span", { class: "brand-tag" }, "Prototype v1.0"),
  );

  const links = NAV_ITEMS.map((item) =>
    el("a", { class: "nav-link" + (active === item.page ? " active" : ""), href: item.href }, item.label),
  );

  const cartLink = el("a", {
    class: "nav-cart" + (active === "cart" ? " active" : ""),
    href: "cart.html", "aria-label": "View cart",
  }, icon("ti-shopping-cart"), el("span", { id: "cart-badge", class: "cart-badge", hidden: true }, "0"));

  host.append(el("nav", { class: "nav", "aria-label": "Primary" }, brand, el("div", { class: "nav-links" }, ...links, cartLink)));
  updateCartBadge();
}

function updateCartBadge() {
  const badge = document.getElementById("cart-badge");
  if (!badge) return;
  const n = cartCount();
  badge.textContent = n;
  badge.hidden = n === 0;
}

function renderFooter() {
  const host = document.getElementById("site-footer");
  if (!host) return;
  const col = (title, links) =>
    el("div", {}, el("h4", {}, title), ...links.map(([label, href]) => el("a", { class: "f-link", href }, label)));

  host.append(
    el("div", { class: "footer-inner" },
      el("div", {},
        el("div", { class: "brand", style: "margin-bottom:.75rem" },
          icon("ti-world"), el("span", { class: "brand-name" }, "GlobalLink"), el("span", { class: "brand-sub" }, "Trading Co.")),
        el("p", { class: "f-desc" }, "Australia's smart sourcing partner — quality imported electronics, homewares, personal care and stationery delivered to retailers and consumers at wholesale prices."),
        el("p", { class: "f-desc", style: "margin-top:.75rem" }, icon("ti-map-pin"), " Western Sydney, NSW · 2–3 day Australia-wide delivery"),
      ),
      col("Shop", [["All Products", "shop.html"], ["Electronics", "shop.html?cat=electronics"], ["Kitchenware", "shop.html?cat=kitchenware"], ["Personal Care", "shop.html?cat=personalcare"], ["Stationery", "shop.html?cat=stationery"]]),
      col("Business", [["B2B Portal", "b2b.html"], ["Wholesale Pricing", "b2b.html"], ["Your Cart", "cart.html"], ["How It Works", "index.html#how"]]),
    ),
    el("div", { class: "footer-bottom" }, "© 2025 GlobalLink Trading Co. — interactive prototype, MIT512 Final Assessment. ACL compliant · ABN 00 000 000 000."),
  );
}

/* -------------------------------- Toast --------------------------------- */
function showToast(message, iconName = "ti-check") {
  let root = document.getElementById("toast-root");
  if (!root) {
    root = el("div", { id: "toast-root", class: "toast-root", "aria-live": "polite" });
    document.body.append(root);
  }
  const t = el("div", { class: "toast", role: "status" }, icon(iconName), message);
  root.append(t);
  setTimeout(() => { t.style.opacity = "0"; t.style.transition = "opacity .3s"; setTimeout(() => t.remove(), 300); }, 2800);
}

/* Read a query-string parameter */
const qs = (key) => new URLSearchParams(location.search).get(key);

/* ------------------------------- Bootstrap ------------------------------ */
document.addEventListener("DOMContentLoaded", () => {
  renderHeader();
  renderFooter();
});
/* Keep the cart badge in sync if another tab changes the cart */
window.addEventListener("storage", (e) => { if (e.key === CART_KEY) updateCartBadge(); });
