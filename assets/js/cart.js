/* ===========================================================================
   Cart & checkout page (B2C)
   =========================================================================== */

function render() {
  const main = document.getElementById("main");
  main.replaceChildren();

  const items = cartDetailed();
  const count = cartCount();

  main.append(el("h1", { style: "font-size:18px;font-weight:600;margin-bottom:1rem" },
    icon("ti-shopping-cart", "", ), " Shopping Cart",
    count > 0 ? el("span", { style: "font-size:13px;color:var(--muted);font-weight:400;margin-left:8px" },
      `(${count} item${count !== 1 ? "s" : ""})`) : null));
  main.querySelector("h1 .ti").style.color = "var(--blue)";

  if (items.length === 0) {
    main.append(el("div", { class: "card empty-state" },
      icon("ti-shopping-cart-off"),
      el("div", { style: "color:var(--muted);font-size:14px;margin-bottom:1rem" }, "Your cart is empty"),
      el("a", { class: "btn btn--primary", href: "shop.html" }, "Browse Products")));
    return;
  }

  /* line items */
  const lines = el("div", { style: "display:flex;flex-direction:column;gap:10px" },
    ...items.map((item) => {
      const cfg = CAT_CFG[item.cat];
      const thumb = el("div", { class: "cart-thumb", style: `background:${cfg.bg}` }, icon(item.icon));
      thumb.querySelector(".ti").style.color = cfg.color;
      return el("div", { class: "card cart-line" },
        thumb,
        el("div", { class: "info" },
          el("div", { class: "n" }, el("a", { href: `product.html?id=${item.id}` }, item.name)),
          el("div", { class: "e" }, money(item.b2c) + " each")),
        el("div", { class: "stepper" },
          el("button", { onclick: () => { setQty(item.id, item.qty - 1); render(); }, "aria-label": "Decrease quantity" }, "−"),
          el("span", { class: "q" }, item.qty),
          el("button", { onclick: () => { setQty(item.id, item.qty + 1); render(); }, "aria-label": "Increase quantity" }, "+")),
        el("div", { class: "line-total" }, money(item.b2c * item.qty)),
        el("button", { class: "remove-btn", onclick: () => { removeFromCart(item.id); render(); showToast("Item removed", "ti-trash"); }, "aria-label": "Remove " + item.name }, icon("ti-x")));
    }));

  /* summary */
  const subtotal = cartTotal();
  const shipping = subtotal >= FREE_SHIP_THRESHOLD ? 0 : SHIP_FLAT;
  const gst = subtotal * GST_RATE;
  const total = subtotal + shipping + gst;

  const summary = el("div", { class: "card" },
    el("div", { style: "font-weight:600;font-size:15px;margin-bottom:.9rem;border-bottom:.5px solid var(--line);padding-bottom:.65rem" }, "Order Summary"),
    summaryRow("Subtotal", money(subtotal)),
    summaryRow("Shipping", shipping === 0 ? "Free" : money(shipping), shipping === 0),
    summaryRow("GST (10%)", money(gst)),
    el("div", { class: "summary-total" }, "Total", el("span", { style: "color:var(--blue)" }, money(total))),
    subtotal < FREE_SHIP_THRESHOLD
      ? el("div", { class: "summary-note", style: "margin-top:0;margin-bottom:.9rem" }, icon("ti-truck"), ` Add ${money(FREE_SHIP_THRESHOLD - subtotal)} more for free delivery.`)
      : null,
    el("button", { class: "btn btn--teal btn--block", onclick: checkout }, icon("ti-credit-card"), "Checkout"),
    el("a", { class: "btn btn--block", href: "shop.html", style: "margin-top:9px;background:transparent;color:var(--muted);border:.5px solid var(--line-2)" }, "Continue Shopping"),
    el("div", { class: "summary-note" }, icon("ti-shield-check"), " Secure checkout · ACL compliant · Easy returns"));

  main.append(el("div", { class: "cart-grid" }, lines, summary));
}

function summaryRow(label, value, free) {
  return el("div", { class: "summary-row" },
    el("span", {}, label),
    el("span", { style: free ? "color:var(--green);font-weight:600" : "" }, value));
}

function checkout() {
  showToast("Order confirmed! Delivery in 2–3 business days.");
  clearCart();
  render();
}

document.addEventListener("DOMContentLoaded", render);
