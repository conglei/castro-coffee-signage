// Castro Coffee Company — drinks menu data model
// Ported from the Claude Design handoff (menu-data.js).
//
// Item shapes (a single MenuItem may use any of these):
//   { name, prices: { "12 oz": 2.75, ... } }  -> multi-size row, aligned to section.sizes
//   { name, price: 39.00, tag? }               -> single price (+ optional badge)
//   { name, desc }                             -> descriptive (no price)

export interface MenuItem {
  name: string;
  prices?: Record<string, number>;
  price?: number;
  tag?: string;
  desc?: string;
}

export interface AddOn {
  name: string;
  price: number;
}

export interface Section {
  id: string;
  title: string;
  note?: string;
  desc?: string;
  featured?: boolean;
  sizes?: string[];
  items?: MenuItem[];
  /** uniform price table shared by all `flavors` (e.g. Frappes) */
  uniform?: Record<string, number>;
  flavors?: string[];
  addOns?: AddOn[];
}

export interface Menu {
  shopName: string;
  colA: Section[];
  colB: Section[];
  colC: Section[];
  colD: Section[];
}

export const MENU: Menu = {
  shopName: "Castro Coffee Company",
  // ── Column A ──────────────────────────────────────────
  colA: [
    {
      id: "fresh",
      title: "Fresh Brewed Coffee",
      sizes: ["12 oz", "16 oz", "20 oz"],
      items: [
        { name: "Drip Coffee", prices: { "12 oz": 2.75, "16 oz": 3.0, "20 oz": 3.5 } },
        { name: "Custom Hand Made Coffee", prices: { "12 oz": 4.0, "16 oz": 4.5, "20 oz": 5.0 } },
      ],
      addOns: [{ name: "Add Espresso Shot", price: 1.0 }],
    },
    {
      id: "turkish",
      title: "Turkish Coffee",
      sizes: ["8 oz"],
      items: [{ name: "Turkish Coffee", prices: { "8 oz": 5.0 } }],
    },
    {
      id: "exotic",
      title: "Exotic Hand Made Drip",
      note: "12 oz only",
      featured: true,
      items: [
        { name: "Kopi Luwak", price: 39.0, tag: "Rare" },
        { name: "Geisha Esmeralda", price: 15.0 },
        { name: "Jamaican Blue Mountain", price: 10.0 },
        { name: "Hawaiian Fancy Kona", price: 9.0 },
        { name: "Honey Processed Coffee", price: 5.0 },
      ],
    },
  ],
  // ── Column B — Espresso ───────────────────────────────
  colB: [
    {
      id: "espresso-classics",
      title: "Espresso Classics",
      sizes: ["Single", "Double"],
      items: [
        { name: "Espresso", prices: { Single: 3.25, Double: 3.75 } },
        { name: "Espresso Macchiato", prices: { Single: 3.75, Double: 4.25 } },
        { name: "Cafe Africano", prices: { Single: 4.25, Double: 4.75 } },
        { name: "Cafe Americano", prices: { Single: 4.25, Double: 4.75 } },
      ],
    },
    {
      id: "hot-espresso",
      title: "Hot Espresso Drinks",
      sizes: ["12 oz", "16 oz", "20 oz"],
      items: [
        { name: "Cafe Latte", prices: { "12 oz": 5.25, "16 oz": 5.75, "20 oz": 6.25 } },
        { name: "Cappuccino", prices: { "12 oz": 5.25, "16 oz": 5.75, "20 oz": 6.25 } },
        { name: "Cafe Mocha", prices: { "12 oz": 5.75, "16 oz": 6.25, "20 oz": 6.75 } },
        { name: "Cafe Breve", prices: { "12 oz": 5.25, "16 oz": 5.75, "20 oz": 6.25 } },
        { name: "Cafe Au Lait", prices: { "12 oz": 4.0, "16 oz": 4.75, "20 oz": 5.0 } },
        { name: "White Satin Mocha", prices: { "12 oz": 5.5, "16 oz": 6.0, "20 oz": 6.5 } },
        { name: "Caramel Macchiato", prices: { "12 oz": 5.5, "16 oz": 6.0, "20 oz": 6.5 } },
        { name: "Chai", prices: { "12 oz": 5.5, "16 oz": 6.0, "20 oz": 6.5 } },
        { name: "Dirty Chai", prices: { "12 oz": 6.5, "16 oz": 7.0, "20 oz": 7.5 } },
      ],
    },
  ],
  // ── Column C — Iced & Frappes ─────────────────────────
  colC: [
    {
      id: "iced",
      title: "Iced Drinks",
      sizes: ["16 oz", "20 oz", "24 oz"],
      items: [
        { name: "Iced Coffee", prices: { "16 oz": 4.95, "20 oz": 5.45, "24 oz": 5.75 } },
        { name: "Iced Cafe Latte", prices: { "16 oz": 6.25, "20 oz": 6.75, "24 oz": 7.25 } },
        { name: "Iced Cafe Mocha", prices: { "16 oz": 6.75, "20 oz": 7.25, "24 oz": 7.75 } },
        { name: "Iced Caramel Macchiato", prices: { "16 oz": 6.25, "20 oz": 6.75, "24 oz": 7.75 } },
        { name: "Iced White Mocha", prices: { "16 oz": 6.25, "20 oz": 6.75, "24 oz": 7.75 } },
      ],
    },
    {
      id: "iced-espresso",
      title: "Iced Espresso",
      sizes: ["Single", "Double"],
      items: [{ name: "Espresso", prices: { Single: 5.0, Double: 5.5 } }],
    },
    {
      id: "frappes",
      title: "Frappes",
      sizes: ["16 oz", "20 oz", "24 oz"],
      uniform: { "16 oz": 6.25, "20 oz": 6.75, "24 oz": 7.25 },
      flavors: ["Mocha Bean", "Vanilla", "Caramel", "Raspberry", "Banana", "Coconut", "Chai"],
    },
  ],
  // ── Column D — Specials ───────────────────────────────
  colD: [
    {
      id: "cold-brew",
      title: "Cold Brew",
      sizes: ["18 oz", "20 oz", "24 oz"],
      items: [{ name: "Cold Brew", prices: { "18 oz": 5.0, "20 oz": 5.5, "24 oz": 6.25 } }],
    },
    {
      id: "matcha",
      title: "Matcha Latte",
      items: [
        { name: "Hot Matcha Latte", prices: { "12 oz": 5.0, "16 oz": 5.5, "20 oz": 6.0 } },
        { name: "Iced Matcha Latte", prices: { "18 oz": 5.75, "20 oz": 6.25, "24 oz": 6.75 } },
      ],
    },
    {
      id: "vietnamese",
      title: "Vietnamese Iced Coffee",
      sizes: ["18 oz", "20 oz", "24 oz"],
      items: [{ name: "Vietnamese Iced Coffee", prices: { "18 oz": 5.75, "20 oz": 6.25, "24 oz": 6.75 } }],
    },
    {
      id: "hot-chocolate",
      title: "Hot Chocolate",
      sizes: ["12 oz", "16 oz", "20 oz"],
      items: [{ name: "Hot Chocolate", prices: { "12 oz": 4.75, "16 oz": 5.25, "20 oz": 5.75 } }],
    },
    {
      id: "refreshers",
      title: "Refreshers",
      desc: "Made with green coffee extract — a natural source of energy.",
      items: [
        { name: "Strawberry Acai", desc: "Ripe strawberry flavor with a boost of acai berries" },
        { name: "Watermelon Cucumber Mint", desc: "Crisp cucumber, sweet watermelon, a hint of mint" },
      ],
    },
  ],
};
