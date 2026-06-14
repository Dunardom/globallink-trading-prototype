/* ===========================================================================
   Product detail page  (product.html?id=N)
   =========================================================================== */

function render() {
  const main = document.getElementById("main");
  main.replaceChildren();

  const p = getProduct(qs("id"));
  if (!p) {
    main.append(el("div", { class: "card empty-state" },
      icon("ti-mood-empty"),
      el("div", { style: "color:var(--muted);margin-bottom:1rem" }, "Sorry, that product could not be found."),
      el("a", { class: "btn btn--primary", href: "shop.html" }, "Back to Shop")));
    return;
  }

  const cfg = CAT_CFG[p.cat];
  const margin = ((p.b2c - p.b2b) / p.b2c * 100).toFixed(0);
  let qty = 1;

  document.title = `${p.name} — GlobalLink Trading Co.`;

  const breadcrumb = el("nav", { class: "breadcrumb", "aria-label": "Breadcrumb" },
    el("a", { href: "index.html" }, "Home"), " / ",
    el("a", { href: `shop.html?cat=${p.cat}` }, cfg.label), " / ",
    el("span", {}, p.name));

  const thumb = el("div", { class: "card pd-thumb", style: `background:${cfg.bg}` }, icon(p.icon));
  thumb.querySelector(".ti").style.color = cfg.color;

  const qtyLabel = el("span", { class: "q", "aria-live": "polite" }, String(qty));
  const setQ = (n) => { qty = Math.max(1, n); qtyLabel.textContent = qty; };

  const details = el("div", {},
    el("span", { class: "badge", style: `background:${cfg.bg};color:${cfg.color}` }, cfg.label),
    el("h1", { class: "pd-title" }, p.name),
    el("p", { style: "color:var(--muted);font-size:14px;margin:0" }, p.desc),
    el("div", { class: "pd-price-row" },
      el("span", { class: "pd-price" }, money(p.b2c)),
      el("span", { style: "color:var(--muted);font-size:13px" }, "RRP incl. GST")),
    el("ul", { class: "pd-specs" },
      specRow("Wholesale (B2B) price", money(p.b2b)),
      specRow("Retailer margin", el("strong", { style: "color:var(--green)" }, "~" + margin + "%")),
      specRow("Minimum order qty (B2B)", p.moq + " units"),
      specRow("In stock", el("span", { class: "badge " + (p.stock > 100 ? "badge--teal" : ""), style: p.stock > 100 ? "" : "background:var(--bg-gold);color:var(--gold)" }, p.stock + " units")),
      specRow("Category", cfg.label)),
    el("div", { class: "qty-row" },
      el("div", { class: "stepper" },
        el("button", { onclick: () => setQ(qty - 1), "aria-label": "Decrease quantity" }, "−"),
        qtyLabel,
        el("button", { onclick: () => setQ(qty + 1), "aria-label": "Increase quantity" }, "+")),
      el("button", { class: "btn btn--teal", onclick: () => { addToCart(p.id, qty); showToast(`Added ${qty}× ${p.name}`); } },
        icon("ti-shopping-cart-plus"), "Add to Cart")),
    el("div", { style: "display:flex;gap:10px;flex-wrap:wrap" },
      el("a", { class: "btn btn--outline", href: "shop.html?cat=" + p.cat }, icon("ti-arrow-left"), "Back to " + cfg.label),
      el("a", { class: "btn btn--primary", href: "cart.html" }, icon("ti-shopping-cart"), "Go to Cart")),
    el("div", { class: "summary-note" }, icon("ti-shield-check"), " Secure checkout · ACL compliant · 2–3 day Australia-wide delivery · Easy returns"),
  );

  main.append(breadcrumb, el("div", { class: "pd-grid" }, thumb, details), related(p));
}

function specRow(k, v) {
  return el("li", {}, el("span", { class: "k" }, k), el("span", {}, v));
}

function related(p) {
  const items = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id).slice(0, 4);
  if (!items.length) return null;
  const cards = items.map((x) => {
    const cfg = CAT_CFG[x.cat];
    const t = el("a", { class: "product-thumb", href: `product.html?id=${x.id}`, style: `background:${cfg.bg};height:90px` }, icon(x.icon));
    t.querySelector(".ti").style.color = cfg.color;
    return el("article", { class: "card product-card" }, t,
      el("div", { class: "product-name" }, el("a", { href: `product.html?id=${x.id}` }, x.name)),
      el("div", { class: "product-meta" }, el("span", { class: "price", style: "font-size:14px" }, money(x.b2c)),
        el("a", { class: "btn btn--sm btn--outline", href: `product.html?id=${x.id}` }, "View")));
  });
  return el("section", { style: "margin-top:2rem" },
    el("h2", { class: "section-title section-title--left" }, "More in " + CAT_CFG[p.cat].label),
    el("div", { class: "grid grid--products" }, ...cards));
}

document.addEventListener("DOMContentLoaded", render);
