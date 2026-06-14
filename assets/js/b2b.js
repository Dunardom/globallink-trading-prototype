/* ===========================================================================
   B2B wholesale portal
   Login state is kept in sessionStorage so the dashboard survives a refresh
   but resets in a new session. Tabs: Dashboard, Pricing, Orders, Place Order.
   =========================================================================== */

const B2B_KEY = "gl_b2b_session";
let activeTab = "dashboard";
let b2bEmail = "buyer@retailstore.com.au";
let orderProductId = 1;
let orderQty = 12;
let orderPlaced = false;

const isLoggedIn = () => sessionStorage.getItem(B2B_KEY) === "1";
const login = () => { sessionStorage.setItem(B2B_KEY, "1"); render(); };
const logout = () => { sessionStorage.removeItem(B2B_KEY); activeTab = "dashboard"; render(); };

function render() {
  const main = document.getElementById("main");
  main.replaceChildren();
  isLoggedIn() ? renderDashboard(main) : renderLogin(main);
}

/* ------------------------------- Login ---------------------------------- */
function renderLogin(main) {
  const perks = [
    ["ti-coin", "Trade Pricing", "2.2× landed cost"],
    ["ti-truck", "Fast Dispatch", "Next business day"],
    ["ti-headset", "Account Mgr", "Dedicated support"],
  ];

  const emailInput = el("input", { value: b2bEmail, type: "email", "aria-label": "Business email",
    oninput: (e) => { b2bEmail = e.target.value; } });

  const box = el("div", { class: "login-box" },
    el("div", { style: "text-align:center;margin-bottom:1.5rem" },
      el("div", { class: "icon-circle", style: "width:52px;height:52px;background:var(--bg-teal);margin-bottom:.75rem" }, icon("ti-building-store", "", )),
      el("h1", { style: "font-size:20px;font-weight:600;margin:0 0 .4rem" }, "B2B Wholesale Portal"),
      el("p", { style: "color:var(--muted);font-size:13px;margin:0" }, "Trade account access — wholesale pricing, bulk ordering, dedicated support")),
    el("form", { class: "card", onsubmit: (e) => { e.preventDefault(); login(); } },
      field("Business Email", "ti-mail", emailInput),
      field("Password", "ti-lock", el("input", { type: "password", value: "password", "aria-label": "Password" })),
      el("button", { type: "submit", class: "btn btn--teal btn--block" }, icon("ti-login"), "Sign In to Wholesale Portal"),
      el("div", { style: "text-align:center;margin-top:.9rem;font-size:12px;color:var(--muted)" }, "No account? ",
        el("a", { href: "#", style: "color:var(--blue)", onclick: (e) => { e.preventDefault(); showToast("Application submitted! We'll contact you within 1 business day."); } }, "Apply for B2B access →"))),
    el("div", { class: "grid", style: "grid-template-columns:1fr 1fr 1fr;margin-top:1.25rem" },
      ...perks.map(([ic, t, d]) => el("div", { class: "perk" }, icon(ic), el("div", { class: "t" }, t), el("div", { class: "d" }, d)))));

  box.querySelector(".icon-circle .ti").style.color = "var(--teal)";
  main.append(el("div", { class: "login-wrap" }, box));
}

function field(label, ic, input) {
  return el("div", { class: "field" },
    el("label", {}, label),
    el("div", { class: "field-input" }, icon(ic), input));
}

/* ----------------------------- Dashboard -------------------------------- */
function renderDashboard(main) {
  const wrap = el("div", { class: "container" });

  wrap.append(el("div", { class: "dash-head" },
    el("div", {},
      el("h1", {}, icon("ti-building-store", ""), " Wholesale Dashboard"),
      el("div", { class: "sub" }, "Welcome back, ", el("strong", {}, "Retail Store Pty Ltd"),
        " · Account: ", el("span", { style: "color:var(--teal);font-weight:600" }, "GL-B2B-0047"))),
    el("div", { style: "display:flex;gap:8px;align-items:center" },
      el("span", { class: "badge badge--teal" }, "Silver Account"),
      el("button", { class: "btn btn--sm", style: "background:transparent;border:1px solid var(--line-2);color:var(--muted)", onclick: logout }, icon("ti-logout"), "Sign Out"))));
  wrap.querySelector(".dash-head h1 .ti").style.color = "var(--teal)";

  const tabs = [["dashboard", "Dashboard"], ["pricing", "Pricing & Tiers"], ["orders", "Order History"], ["place", "Place Order"]];
  wrap.append(el("div", { class: "tabs", role: "tablist" },
    ...tabs.map(([t, l]) => el("button", { class: "tab" + (activeTab === t ? " active" : ""), role: "tab",
      "aria-selected": activeTab === t ? "true" : "false",
      onclick: () => { activeTab = t; render(); } }, l))));

  if (activeTab === "dashboard") wrap.append(tabDashboard());
  else if (activeTab === "pricing") wrap.append(tabPricing());
  else if (activeTab === "orders") wrap.append(tabOrders());
  else if (activeTab === "place") wrap.append(tabPlace());

  main.append(wrap);
}

function tabDashboard() {
  const kpis = [
    { icon: "ti-receipt", label: "Orders YTD", val: "13", color: "#1375B7", bg: "#E3F2FD" },
    { icon: "ti-coin", label: "Total Spend YTD", val: "$18,240", color: "#0FA3B1", bg: "#E1F5EE" },
    { icon: "ti-star", label: "Account Tier", val: "Silver", color: "#E8A020", bg: "#FEF3CD" },
    { icon: "ti-discount", label: "Trade Multiplier", val: "2.2×", color: "#7C3AED", bg: "#EDE9FE" },
  ];
  const kpiGrid = el("div", { class: "grid grid--auto-150", style: "margin-bottom:1.25rem" },
    ...kpis.map((m) => {
      const card = el("div", { class: "card kpi" },
        el("div", { class: "row" },
          el("div", { class: "icon-circle", style: `width:32px;height:32px;background:${m.bg}` }, icon(m.icon)),
          el("div", { class: "label" }, m.label)),
        el("div", { class: "val" }, m.val));
      card.querySelector(".ti").style.color = m.color;
      return card;
    }));

  /* account manager */
  const contacts = [["ti-mail", "sarah.kim@globallink.com.au"], ["ti-phone", "0412 345 678"], ["ti-clock", "Mon–Fri, 8am–6pm AEST"]];
  const am = el("div", { class: "card" },
    el("div", { style: "font-weight:600;margin-bottom:.9rem" }, "Account Manager"),
    el("div", { style: "display:flex;gap:12px;align-items:flex-start" },
      el("div", { class: "am-avatar" }, "SK"),
      el("div", {},
        el("div", { style: "font-weight:600;font-size:14px" }, "Sarah Kim"),
        el("div", { style: "font-size:12px;color:var(--muted);margin-bottom:8px" }, "B2B Accounts — Sydney Metro"),
        ...contacts.map(([ic, v]) => el("div", { class: "contact-row" }, icon(ic), v)),
        el("button", { class: "btn btn--outline btn--sm", style: "margin-top:9px", onclick: () => showToast("Message sent to Sarah. Reply within 4 business hours.") }, icon("ti-message"), "Send Message"))));

  /* recent activity */
  const acts = [
    { ico: "ti-circle-check", col: "#0F6E56", bg: "#E1F5EE", msg: "Order GL-2025-003 dispatched", t: "Today, 9:14am" },
    { ico: "ti-truck-delivery", col: "#1375B7", bg: "#E3F2FD", msg: "GL-2024-089 delivered", t: "3 Jun" },
    { ico: "ti-user-check", col: "#0FA3B1", bg: "#E1F5EE", msg: "Silver tier renewed", t: "1 Jun" },
    { ico: "ti-tag", col: "#E8A020", bg: "#FEF3CD", msg: "22 new SKUs added to catalogue", t: "28 May" },
  ];
  const activity = el("div", { class: "card" },
    el("div", { style: "font-weight:600;margin-bottom:.9rem" }, "Recent Activity"),
    el("div", { style: "display:flex;flex-direction:column;gap:12px" },
      ...acts.map((a) => {
        const row = el("div", { class: "activity" },
          el("div", { class: "dot", style: `background:${a.bg}` }, icon(a.ico)),
          el("div", { style: "flex:1" }, el("div", { class: "msg" }, a.msg), el("div", { class: "time" }, a.t)));
        row.querySelector(".ti").style.color = a.col;
        return row;
      })));

  return el("div", {}, kpiGrid, el("div", { class: "grid grid--2" }, am, activity));
}

function tabPricing() {
  const tierGrid = el("div", { class: "grid grid--auto-170", style: "margin-bottom:1.25rem" },
    ...TIERS.map((t) => el("div", { class: "card tier-card" + (t.current ? " current" : "") },
      el("div", { style: "display:flex;align-items:center;justify-content:space-between;margin-bottom:.6rem" },
        el("div", { class: "t-name" }, t.tier),
        t.current ? el("span", { class: "badge badge--teal" }, "Yours") : null),
      el("div", { class: "t-spend" }, t.spend),
      el("div", { class: "t-disc" }, t.disc),
      el("div", { class: "t-moq" }, t.moq))));

  const headers = ["Product", "Category", "Your B2B Price", "RRP", "MOQ", "Your Margin"];
  const rows = PRODUCTS.slice(0, 8).map((p) => {
    const cfg = CAT_CFG[p.cat];
    const margin = ((p.b2c - p.b2b) / p.b2c * 100).toFixed(0);
    return el("tr", {},
      el("td", { style: "font-weight:600" }, p.name),
      el("td", {}, el("span", { class: "badge", style: `background:${cfg.bg};color:${cfg.color}` }, cfg.label)),
      el("td", { style: "font-weight:600;color:var(--teal)" }, money(p.b2b)),
      el("td", { style: "color:var(--muted)" }, money(p.b2c)),
      el("td", { style: "color:var(--muted)" }, p.moq),
      el("td", {}, el("span", { style: "color:var(--green);font-weight:600" }, margin + "%")));
  });

  const table = el("div", { class: "card" },
    el("div", { style: "font-weight:600;margin-bottom:.9rem" }, "Your Silver wholesale price list"),
    el("div", { class: "table-scroll" },
      el("table", { class: "price-table" },
        el("thead", {}, el("tr", {}, ...headers.map((h) => el("th", {}, h)))),
        el("tbody", {}, ...rows))));

  return el("div", {}, tierGrid, table);
}

function tabOrders() {
  return el("div", { class: "card" },
    el("div", { style: "font-weight:600;margin-bottom:.9rem" }, "Order history"),
    el("div", { style: "display:flex;flex-direction:column;gap:10px" },
      ...ORDERS.map((o) => el("div", { class: "order-row" },
        el("div", { class: "oid" }, el("div", { class: "id" }, o.id), el("div", { class: "date" }, o.date)),
        el("div", { class: "oprod" }, o.product),
        el("div", { style: "font-size:12px;color:var(--muted)" }, "×" + o.qty),
        el("div", { style: "font-weight:600;font-size:13px" }, o.total),
        el("span", { class: "badge " + (o.status === "Delivered" ? "badge--teal" : "badge--blue") }, o.status),
        el("button", { class: "btn btn--sm", style: "background:transparent;border:1px solid var(--line-2);color:var(--muted)",
          onclick: () => showToast("Invoice for " + o.id + " downloaded.", "ti-download") }, icon("ti-download"), "Invoice")))));
}

function tabPlace() {
  if (orderPlaced) {
    const p = getProduct(orderProductId);
    return el("div", { class: "place-form" },
      el("div", { class: "card order-success" },
        el("div", { class: "success-ring" }, icon("ti-circle-check")),
        el("div", { style: "font-weight:600;font-size:17px;margin-bottom:7px" }, "Order placed successfully!"),
        el("div", { style: "color:var(--muted);font-size:13px;margin-bottom:1.25rem;line-height:1.7" },
          "Your order of ", el("strong", {}, `${orderQty}× ${p.name}`), " has been received.", el("br"),
          "Total: ", el("strong", {}, money(p.b2b * orderQty) + " + GST"), el("br"),
          "Expected dispatch: next business day."),
        el("div", { style: "background:var(--light);border-radius:8px;padding:.65rem;font-size:12px;color:var(--muted);margin-bottom:1.25rem" },
          "Reference: ", el("strong", { style: "color:var(--text)" }, "GL-2025-00" + Math.floor(Math.random() * 9 + 4))),
        el("button", { class: "btn btn--teal", onclick: () => { orderPlaced = false; render(); } }, "Place Another Order")));
  }

  const p = getProduct(orderProductId);
  const cfg = CAT_CFG[p.cat];
  const margin = ((p.b2c - p.b2b) / p.b2c * 100).toFixed(0);

  /* product select grouped by category */
  const select = el("select", { class: "input", "aria-label": "Select product",
    onchange: (e) => { orderProductId = Number(e.target.value); orderQty = getProduct(orderProductId).moq; render(); } },
    ...Object.entries(CAT_CFG).map(([catKey, catVal]) =>
      el("optgroup", { label: catVal.label },
        ...PRODUCTS.filter((x) => x.cat === catKey).map((x) =>
          el("option", { value: x.id, selected: x.id === orderProductId ? true : false }, `${x.name} — ${money(x.b2b)}/unit`)))));

  const preview = el("div", { class: "order-preview" },
    el("div", { class: "head" },
      el("div", { class: "ic", style: `background:${cfg.bg}` }, icon(p.icon)),
      el("div", {}, el("div", { style: "font-weight:600;font-size:13px" }, p.name),
        el("div", { style: "font-size:11px;color:var(--muted)" }, p.desc))),
    el("div", { class: "grid", style: "grid-template-columns:1fr 1fr 1fr;gap:10px" },
      ...[["B2B Price", money(p.b2b)], ["Min. Order", p.moq + " units"], ["In Stock", p.stock + " units"]].map(([l, v]) =>
        el("div", { style: "text-align:center" }, el("div", { style: "font-size:10px;color:var(--muted)" }, l),
          el("div", { style: "font-weight:600;font-size:13px" }, v)))));
  preview.querySelector(".ic .ti").style.color = cfg.color;

  const qtyInput = el("input", { class: "input-num", type: "number", min: p.moq, step: p.moq, value: orderQty,
    "aria-label": "Quantity",
    oninput: (e) => { orderQty = Math.max(p.moq, parseInt(e.target.value) || p.moq); updateTotals(); } });

  const totalsEl = el("div", { class: "order-totals" });
  function totalsContent() {
    return [
      el("div", {},
        el("div", { style: "font-size:11px;color:var(--muted)" }, "Order total (ex GST)"),
        el("div", { style: "font-size:20px;font-weight:600" }, money(p.b2b * orderQty)),
        el("div", { style: "font-size:10px;color:var(--muted)" }, `${orderQty} units × ${money(p.b2b)}`)),
      el("div", { style: "text-align:right" },
        el("div", { style: "font-size:11px;color:var(--muted)" }, "Your margin"),
        el("div", { style: "font-size:17px;font-weight:600;color:var(--green)" }, "~" + margin + "%"),
        el("div", { style: "font-size:10px;color:var(--muted)" }, "vs " + money(p.b2c) + " RRP")),
    ];
  }
  function updateTotals() { totalsEl.replaceChildren(...totalsContent()); }
  updateTotals();

  return el("div", { class: "place-form" },
    el("div", { class: "card" },
      el("div", { style: "font-weight:600;font-size:15px;margin-bottom:1.1rem" }, "Place Wholesale Order"),
      el("div", { class: "field" }, el("label", {}, "Select Product"), select),
      preview,
      el("div", { class: "field" }, el("label", {}, `Quantity (min. ${p.moq} units)`), qtyInput),
      totalsEl,
      el("button", { class: "btn btn--teal btn--block",
        onclick: () => {
          if (orderQty < p.moq) { showToast("Min. order is " + p.moq + " units", "ti-alert-triangle"); return; }
          orderPlaced = true; render();
        } }, icon("ti-shopping-cart-plus"), "Confirm Wholesale Order — " + money(p.b2b * orderQty))));
}

document.addEventListener("DOMContentLoaded", render);
