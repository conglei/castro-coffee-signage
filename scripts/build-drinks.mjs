#!/usr/bin/env node
/**
 * scripts/build-drinks.mjs
 * -----------------------------------------------------------------------------
 * Regenerates app/lib/drinks.json (the drinks board data) from a published
 * Google Sheet (CSV), so owners can edit drink names/prices in a spreadsheet.
 *
 * Runs as part of "prebuild" (before `next build`). If DRINKS_SHEET_CSV_URL is
 * UNSET it does nothing and the committed app/lib/drinks.json is used as-is, so
 * builds never fail just because the env var is missing.
 *
 *   ENV:
 *     DRINKS_SHEET_CSV_URL   Published-to-web CSV link of the drinks sheet, OR
 *                            a local file path (e.g. ./cms/drinks_sheet_seed.csv)
 *                            to build from a committed CSV instead of the sheet.
 *     DRINKS_OUT_PATH        Optional. Default: ./app/lib/drinks.json
 *
 * Sheet = one tab, one row per item/flavor/add-on. Columns (header row):
 *   col, section_id, section_title, section_note, section_desc, featured,
 *   section_sizes, kind, name, desc, tag, size1, price1, size2, price2,
 *   size3, price3
 *
 *   kind:
 *     item    -> priced item; size/price pairs (aligned or inline)
 *     single  -> single-price item (uses price1; optional tag)
 *     desc    -> description-only item (name + desc)
 *     uniform -> Frappe-style uniform price row (size/price pairs, no name)
 *     flavor  -> Frappe flavor (name only)
 *     addon   -> add-on (name + price1)
 *
 * No external dependencies — plain Node 18+ (built-in fetch).
 * -----------------------------------------------------------------------------
 */

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

async function loadEnvLocal() {
  if (process.env.DRINKS_SHEET_CSV_URL) return;
  try {
    const txt = await readFile(resolve("./.env.local"), "utf8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch { /* no .env.local — fine */ }
}
await loadEnvLocal();

const SHEET_CSV_URL = process.env.DRINKS_SHEET_CSV_URL;
const OUT_PATH = resolve(process.env.DRINKS_OUT_PATH || "./app/lib/drinks.json");
const SHOP_NAME = "Castro Coffee Company";

// --- tiny RFC-4180 CSV parser ---
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", q = false;
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

const truthy = (v) => ["yes", "true", "1", "x", "y"].includes(String(v || "").trim().toLowerCase());
const num = (v) => { const n = Number(String(v).replace(/[^0-9.]/g, "")); return Number.isFinite(n) ? n : undefined; };

function rowsToObjects(rows) {
  const header = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1)
    .filter((r) => r.some((c) => String(c).trim() !== ""))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

function pairs(o) {
  // returns { label: number } from size1/price1..size3/price3
  const out = {};
  for (const i of [1, 2, 3]) {
    const label = o[`size${i}`];
    const price = num(o[`price${i}`]);
    if (label && price != null) out[label] = price;
  }
  return out;
}

async function main() {
  if (!SHEET_CSV_URL) {
    console.log("[build-drinks] DRINKS_SHEET_CSV_URL not set — keeping committed app/lib/drinks.json.");
    return;
  }

  // Source can be an http(s) URL (published Google Sheet) or a local CSV path.
  let text;
  if (/^https?:\/\//i.test(SHEET_CSV_URL)) {
    const res = await fetch(SHEET_CSV_URL, { redirect: "follow" });
    if (!res.ok) throw new Error(`Failed to fetch drinks sheet: ${res.status} ${res.statusText}`);
    text = await res.text();
  } else {
    text = await readFile(resolve(SHEET_CSV_URL), "utf8");
  }

  // Guard: a Google Sheet that isn't published/shared, or a wrong URL, returns
  // an HTML page instead of CSV. Detect that and refuse to overwrite the menu.
  if (/^\s*</.test(text) || /<!doctype html|<html/i.test(text.slice(0, 200))) {
    throw new Error(
      "Drinks source returned HTML, not CSV. Check that DRINKS_SHEET_CSV_URL is a " +
      "published CSV link (…/export?format=csv&gid=…) and the sheet is shared publicly."
    );
  }

  const rows = parseCSV(text);
  const header = (rows[0] || []).map((h) => h.trim().toLowerCase());
  if (!header.includes("section_id")) {
    throw new Error(
      `Drinks source is missing the required 'section_id' column (got headers: ${header.join(", ") || "none"}). ` +
      "Refusing to overwrite a good menu."
    );
  }

  const objects = rowsToObjects(rows);
  if (objects.length === 0) throw new Error("Drinks sheet is empty — refusing to overwrite a good menu.");

  // Group rows by section, preserving first-seen order, tracking which column.
  const sectionsById = new Map(); // id -> { col, rows: [] }
  for (const o of objects) {
    const id = o.section_id;
    if (!id) continue;
    if (!sectionsById.has(id)) sectionsById.set(id, { col: (o.col || "A").toUpperCase(), rows: [] });
    sectionsById.get(id).rows.push(o);
  }

  const menu = { shopName: SHOP_NAME, colA: [], colB: [], colC: [], colD: [] };

  for (const [id, { col, rows }] of sectionsById) {
    const meta = rows[0];
    const section = { id, title: meta.section_title || id };
    if (meta.section_note) section.note = meta.section_note;
    if (meta.section_desc) section.desc = meta.section_desc;
    if (truthy(meta.featured)) section.featured = true;
    if (meta.section_sizes) section.sizes = meta.section_sizes.split("|").map((s) => s.trim()).filter(Boolean);

    const items = [];
    const addOns = [];
    const flavors = [];
    let uniform = null;

    for (const r of rows) {
      switch ((r.kind || "item").toLowerCase()) {
        case "uniform": uniform = pairs(r); break;
        case "flavor": if (r.name) flavors.push(r.name); break;
        case "addon": { const p = num(r.price1); if (r.name && p != null) addOns.push({ name: r.name, price: p }); break; }
        case "desc": if (r.name) items.push({ name: r.name, ...(r.desc ? { desc: r.desc } : {}) }); break;
        case "single": { const p = num(r.price1); if (r.name && p != null) items.push({ name: r.name, price: p, ...(r.tag ? { tag: r.tag } : {}) }); break; }
        default: { const pr = pairs(r); if (r.name && Object.keys(pr).length) items.push({ name: r.name, prices: pr }); }
      }
    }

    if (uniform) section.uniform = uniform;
    if (flavors.length) section.flavors = flavors;
    if (items.length) section.items = items;
    if (addOns.length) section.addOns = addOns;

    const key = "col" + col;
    (menu[key] || menu.colA).push(section);
  }

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(menu, null, 2) + "\n");

  const counts = ["colA", "colB", "colC", "colD"].map((c) => `${c}:${menu[c].length}`).join("  ");
  console.log(`[build-drinks] ✓ Wrote ${OUT_PATH} — ${counts}`);
}

main().catch((err) => { console.error("[build-drinks] FAILED:", err.message); process.exit(1); });
