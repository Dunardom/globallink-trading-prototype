/* ===========================================================================
   Home page
   =========================================================================== */

const VALUES = [
  { icon: "ti-currency-dollar", color: "#1375B7", bg: "#E3F2FD", title: "Affordability", desc: "20–35% below domestic wholesale — direct manufacturer pricing." },
  { icon: "ti-package",         color: "#0FA3B1", bg: "#E1F5EE", title: "Accessibility", desc: "Min. 12 units per SKU. No container-load quantities required." },
  { icon: "ti-truck-delivery",  color: "#7C3AED", bg: "#EDE9FE", title: "Reliability",   desc: "Sydney warehouse — 2–3 day delivery. No 6-week overseas waits." },
  { icon: "ti-headset",         color: "#E8A020", bg: "#FEF3CD", title: "Support",        desc: "Dedicated B2B account manager and transparent returns policy." },
];

const STATS = [
  ["200+", "SKUs at launch"], ["2–3 days", "domestic delivery"],
  ["20–35%", "below wholesale"], ["MOQ 12", "units minimum"],
];

const STEPS = [
  ["ti-world", "Source", "Direct CN/VN manufacturers"],
  ["ti-ship", "Import", "Customs clearance, Port Botany"],
  ["ti-building-warehouse", "Warehouse", "200sqm, Western Sydney"],
  ["ti-click", "Order", "B2C store or B2B portal"],
  ["ti-truck-delivery", "Deliver", "2–3 days, Australia-wide"],
];

function buildHome() {
  const main = document.getElementById("main");

  /* Hero */
  const hero = el("section", { class: "hero" },
    el("div", {},
      el("span", { class: "hero-flag" }, icon("ti-map-pin"), "Sydney, NSW · 2–3 day Australia-wide delivery")),
    el("h1", {}, "Australia's Smart Sourcing Partner"),
    el("p", {}, "Quality imported goods — electronics, homewares, personal care, stationery — delivered to Australian retailers and consumers at wholesale prices."),
    el("div", { class: "hero-actions" },
      el("a", { class: "btn btn--teal", href: "shop.html" }, icon("ti-shopping-bag"), "Shop Now (B2C)"),
      el("a", { class: "btn btn--ghost-light", href: "b2b.html" }, icon("ti-building-store"), "Wholesale Login (B2B)")),
  );

  /* Stat bar */
  const statbar = el("section", { class: "statbar" },
    ...STATS.map(([n, l]) => el("div", { class: "stat" },
      el("div", { class: "stat-n" }, n), el("div", { class: "stat-l" }, l))));

  /* Why GlobalLink */
  const values = el("div", { class: "grid grid--auto-180", style: "margin-bottom:2rem" },
    ...VALUES.map((v) => el("div", { class: "card value-card" },
      el("div", { class: "icon-circle icon-circle--44", style: `background:${v.bg}` }, icon(v.icon, "", )),
      el("div", { class: "v-title" }, v.title),
      el("div", { class: "v-desc" }, v.desc),
    )));
  // colour the value icons
  values.querySelectorAll(".value-card").forEach((card, i) => {
    card.querySelector(".ti").style.color = VALUES[i].color;
    card.querySelector(".ti").style.fontSize = "20px";
  });

  /* Categories */
  const cats = el("div", { class: "grid grid--auto-180", style: "margin-bottom:2rem" },
    ...Object.entries(CAT_CFG).map(([key, cfg]) => {
      const count = PRODUCTS.filter((p) => p.cat === key).length;
      const card = el("a", { class: "cat-card", href: `shop.html?cat=${key}`, style: `background:${cfg.bg}` },
        icon(cfg.icon),
        el("div", { class: "c-label" }, cfg.label),
        el("div", { class: "c-count" }, count + " products"),
        el("div", { class: "c-browse" }, "Browse ", icon("ti-arrow-right")),
      );
      card.querySelector(".ti").style.color = cfg.color;
      card.querySelector(".c-browse").style.color = cfg.color;
      return card;
    }));

  /* How it works */
  const how = el("div", { class: "card", id: "how", style: "margin-bottom:1.5rem" },
    el("h2", { class: "section-title section-title--left", style: "margin-bottom:1rem" }, "How it works"),
    el("div", { class: "grid grid--auto-120" },
      ...STEPS.map(([ic, label, desc]) => el("div", { class: "step" },
        el("div", { class: "icon-circle icon-circle--34" }, icon(ic)),
        el("div", { class: "s-label" }, label),
        el("div", { class: "s-desc" }, desc),
      ))));

  /* CTA */
  const cta = el("div", { class: "cta-band" },
    el("div", {},
      el("div", { class: "c-h" }, "Are you a retailer or reseller?"),
      el("div", { class: "c-p" }, "Apply for a B2B wholesale account — trade pricing and volume tiers.")),
    el("a", { class: "btn btn--navy", href: "b2b.html" }, "Apply for B2B Access ", icon("ti-arrow-right")));

  const body = el("div", { class: "container" },
    el("h2", { class: "section-title" }, "Why retailers choose GlobalLink"),
    values,
    el("h2", { class: "section-title" }, "Browse by category"),
    cats, how, cta,
  );

  main.append(hero, statbar, body);
}

buildHome();
