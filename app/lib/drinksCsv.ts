// Castro Coffee Company — drinks CSV → Menu transform (runtime copy).
//
// This is the TypeScript twin of scripts/build-drinks.mjs. The build script
// bakes drinks.json at build time; this module lets the live /api/refresh route
// produce the exact same Menu shape from the same CSV on demand.
//
// ⚠️  Keep this in sync with scripts/build-drinks.mjs — both parse the identical
//     sheet schema (col, section_id, …, kind, name, …, size1/price1…size3/price3)
//     and must emit the same JSON, or the live refresh will differ from the build.

import type { Menu, Section, MenuItem, AddOn, SectionVariant } from "./menuData";

type Row = Record<string, string>;

/** Detects when a "CSV" fetch actually returned a Google HTML error/login page. */
export function looksLikeHtml(text: string): boolean {
  return /^\s*</.test(text) || /<!doctype html|<html/i.test(text.slice(0, 200));
}

// --- tiny RFC-4180 CSV parser (quotes, commas, newlines in fields) ---
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = "", q = false;
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (q) {
      if (c === '"') { if (text[i + 1] === '"') { field += '"'; i++; } else q = false; }
      else field += c;
    } else if (c === '"') q = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const truthy = (v: string | undefined) =>
  ["yes", "true", "1", "x", "y"].includes(String(v || "").trim().toLowerCase());

const num = (v: string | undefined): number | undefined => {
  const n = Number(String(v).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) ? n : undefined;
};

function rowsToObjects(rows: string[][]): Row[] {
  const header = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1)
    .filter((r) => r.some((c) => String(c).trim() !== ""))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

function pairs(o: Row): Record<string, number> {
  const out: Record<string, number> = {};
  for (const i of [1, 2, 3]) {
    const label = o[`size${i}`];
    const price = num(o[`price${i}`]);
    if (label && price != null) out[label] = price;
  }
  return out;
}

// Allowed explicit render styles (sheet `section_style` column). Anything else
// is ignored so the renderer falls back to inferring the style from the data.
const VARIANTS = new Set<SectionVariant>(["aligned", "inline", "leader", "desc", "flavors"]);

// Build a regular item from a row, keeping every field it actually has — shape-
// driven, not kind-driven, so a description row can also carry a price. size/
// price pairs win over a single price1 when both are present.
function buildItem(r: Row): MenuItem {
  const item: MenuItem = { name: r.name };
  if (r.desc) item.desc = r.desc;
  if (r.tag) item.tag = r.tag;
  const pr = pairs(r);
  if (Object.keys(pr).length) item.prices = pr;
  else { const p = num(r.price1); if (p != null) item.price = p; }
  return item;
}

const SHOP_NAME = "Castro Coffee Company";

/**
 * Parse the published drinks-sheet CSV text into the Menu shape.
 * Throws if the text isn't a valid CSV with the required `section_id` column,
 * so a Google HTML error page can never silently produce an empty menu.
 */
export function parseDrinksCsv(text: string): Menu {
  if (looksLikeHtml(text)) {
    throw new Error("Drinks source returned HTML, not CSV (sheet not published / wrong URL).");
  }
  const rows = parseCSV(text);
  const header = (rows[0] || []).map((h) => h.trim().toLowerCase());
  if (!header.includes("section_id")) {
    throw new Error(`Drinks CSV missing required 'section_id' column (got: ${header.join(", ") || "none"}).`);
  }
  const objects = rowsToObjects(rows);
  if (objects.length === 0) throw new Error("Drinks CSV is empty.");

  // Group rows by section, preserving first-seen order, tracking which column.
  const sectionsById = new Map<string, { col: string; rows: Row[] }>();
  for (const o of objects) {
    const id = o.section_id;
    if (!id) continue;
    if (!sectionsById.has(id)) sectionsById.set(id, { col: (o.col || "A").toUpperCase(), rows: [] });
    sectionsById.get(id)!.rows.push(o);
  }

  const menu: Menu = { shopName: SHOP_NAME, colA: [], colB: [], colC: [], colD: [] };

  for (const [id, { col, rows }] of sectionsById) {
    const meta = rows[0];
    const section: Section = { id, title: meta.section_title || id };
    if (meta.section_note) section.note = meta.section_note;
    if (meta.section_desc) section.desc = meta.section_desc;
    if (truthy(meta.featured)) section.featured = true;
    const style = (meta.section_style || "").trim().toLowerCase() as SectionVariant;
    if (VARIANTS.has(style)) section.variant = style;
    if (meta.section_sizes) section.sizes = meta.section_sizes.split("|").map((s) => s.trim()).filter(Boolean);

    const items: MenuItem[] = [];
    const addOns: AddOn[] = [];
    const flavors: string[] = [];
    let uniform: Record<string, number> | null = null;

    for (const r of rows) {
      switch ((r.kind || "item").toLowerCase()) {
        case "uniform": uniform = pairs(r); break;
        case "flavor": if (r.name) flavors.push(r.name); break;
        case "addon": { const p = num(r.price1); if (r.name && p != null) addOns.push({ name: r.name, price: p }); break; }
        // item / single / desc — all regular items, captured by data shape.
        default: if (r.name) items.push(buildItem(r));
      }
    }

    if (uniform) section.uniform = uniform;
    if (flavors.length) section.flavors = flavors;
    if (items.length) section.items = items;
    if (addOns.length) section.addOns = addOns;

    const key = ("col" + col) as keyof Menu;
    const bucket = (menu[key] as Section[]) || menu.colA;
    bucket.push(section);
  }

  return menu;
}
