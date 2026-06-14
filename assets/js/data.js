/* ===========================================================================
   GlobalLink Trading Co. — shared data
   (catalogue, category config and demo order history)
   =========================================================================== */

const PRODUCTS = [
  { id: 1,  name: "USB-C Fast Charge Cable 3-Pack", cat: "electronics", icon: "ti-plug",                    b2c: 14.99, b2b: 9.90,  moq: 12, stock: 342, desc: "Braided 1m, 20W fast charge, nylon sleeve" },
  { id: 2,  name: "20,000mAh Power Bank",           cat: "electronics", icon: "ti-battery-charging",        b2c: 39.99, b2b: 26.40, moq: 6,  stock: 156, desc: "Dual USB-A + USB-C, LED indicator, travel-safe" },
  { id: 3,  name: "Wireless Earbuds Pro",           cat: "electronics", icon: "ti-headphones",              b2c: 49.99, b2b: 33.00, moq: 6,  stock: 98,  desc: "ANC, 24hr battery, Bluetooth 5.3" },
  { id: 4,  name: "Adjustable Phone Stand",         cat: "electronics", icon: "ti-device-mobile",           b2c: 12.99, b2b: 8.58,  moq: 24, stock: 480, desc: "Aluminium, 360° rotation, universal" },
  { id: 5,  name: "Stackable Container Set 6pc",    cat: "kitchenware", icon: "ti-box",                     b2c: 29.99, b2b: 19.80, moq: 12, stock: 210, desc: "BPA-free, airtight, microwave safe" },
  { id: 6,  name: "Non-Stick Frying Pan 28cm",      cat: "kitchenware", icon: "ti-tools-kitchen-2",         b2c: 34.99, b2b: 23.10, moq: 6,  stock: 124, desc: "Granite coating, induction compatible" },
  { id: 7,  name: "Bamboo Utensil Set 5pc",         cat: "kitchenware", icon: "ti-leaf",                    b2c: 19.99, b2b: 13.20, moq: 24, stock: 380, desc: "Spatula, spoon, ladle, tongs, whisk" },
  { id: 8,  name: "Stainless Knife Set + Block",    cat: "kitchenware", icon: "ti-cut",                     b2c: 44.99, b2b: 29.70, moq: 6,  stock: 67,  desc: "5-piece stainless steel, wooden block" },
  { id: 9,  name: "Electric Face Cleanser Brush",   cat: "personalcare", icon: "ti-sparkles",              b2c: 32.99, b2b: 21.78, moq: 12, stock: 145, desc: "3 speeds, waterproof IPX7, USB-C" },
  { id: 10, name: "Ionic Hair Dryer 2000W",         cat: "personalcare", icon: "ti-wind",                  b2c: 42.99, b2b: 28.38, moq: 6,  stock: 89,  desc: "3 heat + 2 speed, cool shot, diffuser" },
  { id: 11, name: "Precision Beard Trimmer",        cat: "personalcare", icon: "ti-adjustments-horizontal",b2c: 27.99, b2b: 18.48, moq: 12, stock: 203, desc: "20 length settings, 90-min, USB-C" },
  { id: 12, name: "Jade Gua Sha Set 3pc",           cat: "personalcare", icon: "ti-heart",                 b2c: 18.99, b2b: 12.54, moq: 24, stock: 310, desc: "Face + body stones, gift pouch" },
  { id: 13, name: "A5 Hardcover Notebook",          cat: "stationery",  icon: "ti-notebook",               b2c: 14.99, b2b: 9.90,  moq: 24, stock: 520, desc: "200 pages, dotted grid, pen loop" },
  { id: 14, name: "Mesh Desk Organiser Set 4pc",    cat: "stationery",  icon: "ti-layout-grid",            b2c: 24.99, b2b: 16.50, moq: 12, stock: 175, desc: "Metal mesh: pen holder, tray, rack" },
  { id: 15, name: "Premium Gel Pen Pack 20pc",      cat: "stationery",  icon: "ti-pencil",                 b2c: 12.99, b2b: 8.58,  moq: 48, stock: 890, desc: "0.5mm, quick-dry, assorted colours" },
  { id: 16, name: "Bubble Mailer Pack 50pc",        cat: "stationery",  icon: "ti-package",                b2c: 22.99, b2b: 15.18, moq: 12, stock: 445, desc: "180×260mm, self-seal, gold padded" },
];

const CAT_CFG = {
  electronics:  { label: "Electronics",   icon: "ti-device-mobile",     color: "#1375B7", bg: "#E3F2FD" },
  kitchenware:  { label: "Kitchenware",   icon: "ti-tools-kitchen-2",   color: "#0FA3B1", bg: "#E1F5EE" },
  personalcare: { label: "Personal Care", icon: "ti-sparkles",          color: "#7C3AED", bg: "#EDE9FE" },
  stationery:   { label: "Stationery",    icon: "ti-pencil",            color: "#E8A020", bg: "#FEF3CD" },
};

const ORDERS = [
  { id: "GL-2025-003", date: "5 Jun 2025",  product: "Stackable Container Set 6pc",    qty: 60,  total: "$1,188.00", status: "In Transit" },
  { id: "GL-2024-089", date: "28 May 2025", product: "USB-C Fast Charge Cable 3-Pack", qty: 120, total: "$1,188.00", status: "Delivered" },
  { id: "GL-2024-076", date: "12 May 2025", product: "A5 Hardcover Notebook",          qty: 240, total: "$2,376.00", status: "Delivered" },
  { id: "GL-2024-062", date: "29 Apr 2025", product: "Wireless Earbuds Pro",           qty: 48,  total: "$1,584.00", status: "Delivered" },
];

const TIERS = [
  { tier: "Bronze",   spend: "$0–$5K",     disc: "2.4× cost", moq: "MOQ 12" },
  { tier: "Silver",   spend: "$5K–$20K",   disc: "2.2× cost", moq: "MOQ 6", current: true },
  { tier: "Gold",     spend: "$20K–$50K",  disc: "2.0× cost", moq: "MOQ 6" },
  { tier: "Platinum", spend: "$50K+",           disc: "1.8× cost", moq: "MOQ 3" },
];

const getProduct = (id) => PRODUCTS.find((p) => p.id === Number(id));
