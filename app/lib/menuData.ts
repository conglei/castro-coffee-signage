// Castro Coffee Company — drinks menu data model
//
// The data itself lives in ./drinks.json so non-technical owners can edit it
// from a Google Sheet (see /cms). That JSON is regenerated at build time by
// scripts/build-drinks.mjs whenever DRINKS_SHEET_CSV_URL is set; otherwise the
// committed drinks.json is used as-is. This file only adds the TypeScript types.
//
// Item shapes (a single MenuItem may use any of these):
//   { name, prices: { "12 oz": 2.75, ... } }  -> multi-size row, aligned to section.sizes
//   { name, price: 39.00, tag? }               -> single price (+ optional badge)
//   { name, desc }                             -> descriptive (no price)

import menuJson from "./drinks.json";

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

// How a section's items are laid out. Either set explicitly from the sheet
// (`section_style` column) or inferred from the data shape (see inferVariant).
//   aligned — shared sizes shown as aligned price columns (most sections)
//   inline  — each item shows its own size/price pairs (mixed sizes, e.g. Matcha)
//   leader  — name … single price on the right (e.g. Exotic drip)
//   desc    — name + description, optional price (e.g. Refreshers)
//   flavors — one uniform price table shared by a list of flavor chips (Frappes)
export type SectionVariant = "aligned" | "inline" | "leader" | "desc" | "flavors";

export interface Section {
  id: string;
  title: string;
  note?: string;
  desc?: string;
  featured?: boolean;
  /** explicit render style; when omitted it's inferred from the data shape */
  variant?: SectionVariant;
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

export const MENU: Menu = menuJson as Menu;
