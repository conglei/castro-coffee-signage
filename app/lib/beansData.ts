// Castro Coffee Company — coffee beans data (1 lb bags)
//
// The data itself lives in ./beans.json so non-technical owners can edit it
// from a Google Sheet (see /cms). That JSON is regenerated at build time by
// scripts/build-menu.mjs whenever SHEET_CSV_URL is set; otherwise the committed
// beans.json is used as-is. This file only adds the TypeScript types and a
// convenience lookup on top of it.
//
// Lean schema — the signage only needs name, roast, origin, badge, and price.

import beansJson from "./beans.json";

export interface Bean {
  name: string;
  roast: "Medium" | "Dark";
  /** country/region of origin — omitted for blends */
  origin?: string;
  /** display badge for premium lots: "Organic" | "Reserve" | "Rare" */
  badge?: string;
  /** price in USD for a 1 lb bag */
  price: string;
}

export interface BeanSection {
  name: string;
  items: Bean[];
}

export interface BeansMenu {
  store: string;
  menu: string;
  sections: BeanSection[];
}

export const BEANS_MENU: BeansMenu = beansJson as BeansMenu;

// Convenience lookup by section name (insertion order is preserved).
export const BEANS: Record<string, Bean[]> = Object.fromEntries(
  BEANS_MENU.sections.map((s) => [s.name, s.items]),
);
