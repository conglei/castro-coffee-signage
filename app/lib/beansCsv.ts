// Castro Coffee Company — beans CSV → BeansMenu transform (runtime copy).
//
// TypeScript twin of scripts/build-menu.mjs, used by the live /api/refresh route
// (?board=beans) so the Refresh button on the beans board can re-read the sheet.
//
// ⚠️  Keep this in sync with scripts/build-menu.mjs — both parse the same sheet
//     schema (section, available, name, roast|roast_level, origin, badge, price)
//     and must emit the same JSON shape.

import type { BeansMenu, BeanSection, Bean } from "./beansData";

type Row = Record<string, string>;

const STORE = "Castro Coffee Company";
const MENU = "Coffee Beans (1 lb bags)";

const SECTION_ORDER = [
  "House & Medium Blends",
  "Single-Origin",
  "Dark Roasts",
  "Espresso Blends",
  "Flavored",
  "Organic & Fair Trade",
  "Decaf",
  "Rare & Reserve",
];

export function looksLikeHtml(text: string): boolean {
  return /^\s*</.test(text) || /<!doctype html|<html/i.test(text.slice(0, 200));
}

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

function rowsToObjects(rows: string[][]): Row[] {
  const header = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1)
    .filter((r) => r.some((c) => String(c).trim() !== ""))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

function normalizePrice(p: string): string {
  const n = Number(String(p).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n.toFixed(2) : "";
}

const normalizeRoast = (r: string): Bean["roast"] => (/dark/i.test(r) ? "Dark" : "Medium");

function toItem(o: Row): Bean {
  const item: Bean = { name: o.name, roast: normalizeRoast(o.roast || o.roast_level), price: normalizePrice(o.price) };
  if (o.origin) item.origin = o.origin;
  if (o.badge) item.badge = o.badge;
  return item;
}

/** Parse the published beans-sheet CSV into BeansMenu; throws on non-CSV/empty. */
export function parseBeansCsv(text: string): BeansMenu {
  if (looksLikeHtml(text)) {
    throw new Error("Beans source returned HTML, not CSV (sheet not published / wrong URL).");
  }
  const rows = parseCSV(text);
  const header = (rows[0] || []).map((h) => h.trim().toLowerCase());
  if (!header.includes("name")) {
    throw new Error(`Beans CSV missing required 'name' column (got: ${header.join(", ") || "none"}).`);
  }

  const objects = rowsToObjects(rows);
  const available = objects.filter((o) => o.name && truthy(o.available));
  if (available.length === 0) throw new Error("Beans CSV produced 0 available beans.");

  const bySection = new Map<string, Bean[]>();
  for (const o of available) {
    const s = o.section || "Other";
    if (!bySection.has(s)) bySection.set(s, []);
    bySection.get(s)!.push(toItem(o));
  }

  const ordered = [
    ...SECTION_ORDER.filter((s) => bySection.has(s)),
    ...[...bySection.keys()].filter((s) => !SECTION_ORDER.includes(s)),
  ];

  const sections: BeanSection[] = ordered.map((s) => ({ name: s, items: bySection.get(s)! }));
  return { store: STORE, menu: MENU, sections };
}
