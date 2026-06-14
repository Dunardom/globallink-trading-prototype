/* ===========================================================================
   Shop / catalogue page
   Category filter is driven by the ?cat= query string so it is a real,
   linkable URL state (home category cards deep-link straight into a filter).
   =========================================================================== */

let activeCat = qs("cat") && CAT_CFG[qs("cat")] ? qs("cat") : "all";

function productCard(p) {
  const cfg = CAT_CFG[p.cat];
  const inCart = getCart().find((i) => i.id === p.id);

  const thumb = el("a", { class: "product-thumb", href: `product.html?id=${p.id}`, style: `background:${cfg.bg}`, "aria-label": p.name },
    icon(p.icon), el("span", { class: "cat-chip", style: `color:${cfg.color}` }, cfg.label));
  thumb.querySelector(".ti").style.color = cfg.color;

  const addBtn = el("button", {
    class: "add-btn",
    style: `background:${inCart ? "var(--teal)" : "var(--blue)"}`,
    onclick: () => { addToCart(p.id); render(); showToast("Added: " + p.name); },
  }, icon(inCart ? "ti-check" : "ti-shopping-cart-plus"), inCart ? `In cart (${inCart.qty})` : "Add to Cart");

  return el("article", { class: "card product-card" },
    thumb,
    el("div", { class: "product-name" }, el("a", { href: `product.html?id=${p.id}` }, p.name)),
    el("div", { class: "product-desc" }, p.desc),
    el("div", { class: "product-meta" },
      el("div", {},
        el("span", { class: "price" }, money(p.b2c)),
        el("div", { class: "price-b2b" }, "B2B: " + money(p.b2b))),
      el("span", { class: "stock " + (p.stock > 100 ? "stock--in" : "stock--low") }, p.stock > 100 ? "In Stock" : p.stock + " left")),
    addBtn,
  );
}

function render() {
  const main = document.getElementById("main");
  main.querySelectorAll(":scope > *:not(.sr-only)").forEach((n) => n.remove());

  const filtered = activeCat === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.cat === activeCat);

  /* heading + filter pills */
  const pills = [el("button", { class: "pill" + (activeCat === "all" ? " active" : ""), onclick: () => setCat("all") }, "All")];
  for (const [key, cfg] of Object.entries(CAT_CFG)) {
    pills.push(el("button", { class: "pill" + (activeCat === key ? " active" : ""), onclick: () => setCat(key) }, cfg.label));
  }

  const head = el("div", { class: "shop-head" },
    el("div", {},
      el("h1", {}, activeCat === "all" ? "Product Catalogue" : CAT_CFG[activeCat].label),
      el("div", { class: "sub" }, `${filtered.length} products · Free delivery on orders over $75`)),
    el("div", { class: "filters", role: "group", "aria-label": "Filter by category" }, ...pills));

  const grid = el("div", { class: "grid grid--products" }, ...filtered.map(productCard));

  main.append(head, grid);

  /* sticky cart summary bar */
  const count = cartCount();
  if (count > 0) {
    main.append(el("div", { class: "shop-cart-bar" },
      el("span", {}, icon("ti-shopping-cart"), ` ${count} item${count !== 1 ? "s" : ""} in cart — `,
        el("strong", { style: "color:var(--gold)" }, money(cartTotal()))),
      el("a", { class: "btn btn--gold", href: "cart.html" }, "View Cart ", icon("ti-arrow-right"))));
  }
}

function setCat(cat) {
  activeCat = cat;
  const url = cat === "all" ? "shop.html" : `shop.html?cat=${cat}`;
  history.replaceState(null, "", url);
  render();
}

document.addEventListener("DOMContentLoaded", render);
