#!/usr/bin/env node
/**
 * scripts/build-menu.mjs
 * -----------------------------------------------------------------------------
 * Regenerates app/lib/beans.json from a published Google Sheet (CSV) so the
 * shop owners can edit prices/names/availability in a spreadsheet and have the
 * signage pick them up on the next build.
 *
 * Runs as the "prebuild" step (see package.json), i.e. before `next build`.
 *
 *   ENV:
 *     SHEET_CSV_URL   Published-to-web CSV link of the Google Sheet.
 *                     (Sheet ▸ File ▸ Share ▸ Publish to web ▸ CSV)
 *                     If UNSET, this script does nothing and the committed
 *                     app/lib/beans.json is used as-is — so local builds and
 *                     deploys never fail just because the env var is missing.
 *     OUT_PATH        Optional. Default: ./app/lib/beans.json
 *
 * Sheet columns (header row, any order). Both schemas are accepted:
 *     section, available, name, roast (or roast_level), origin, badge, price
 *   Extra columns (type, is_*, grind_options, square_token, id, …) are ignored.
 *
 * No external dependencies — plain Node 18+ (built-in fetch).
 * -----------------------------------------------------------------------------
 */

import { writeFile, mkdir, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

// Plain `node` (the prebuild step) doesn't auto-load .env.local the way Next
// does, so do a minimal load here for local development. Real environment
// variables (e.g. set in the Vercel dashboard) always take precedence.
async function loadEnvLocal() {
  if (process.env.SHEET_CSV_URL) return;
  try {
    const txt = await readFile(resolve("./.env.local"), "utf8");
    for (const line of txt.split("\n")) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch { /* no .env.local — fine */ }
}
await loadEnvLocal();

const SHEET_CSV_URL = process.env.SHEET_CSV_URL;
const OUT_PATH = resolve(process.env.OUT_PATH || "./app/lib/beans.json");

const STORE = "Castro Coffee Company";
const MENU = "Coffee Beans (1 lb bags)";

// Section display order. Anything not listed is appended in first-seen order.
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

// --- tiny RFC-4180 CSV parser (handles quotes, commas, newlines in fields) ---
function parseCSV(text) {
  const rows = [];
  let row = [], field = "", inQuotes = false;
  text = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ",") { row.push(field); field = ""; }
    else if (c === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += c;
  }
  if (field.length || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const truthy = (v) =>
  ["yes", "true", "1", "x", "y"].includes(String(v || "").trim().toLowerCase());

function rowsToObjects(rows) {
  const header = rows[0].map((h) => h.trim().toLowerCase());
  return rows.slice(1)
    .filter((r) => r.some((c) => c.trim() !== ""))
    .map((r) => Object.fromEntries(header.map((h, i) => [h, (r[i] ?? "").trim()])));
}

function normalizePrice(p) {
  const n = Number(String(p).replace(/[^0-9.]/g, ""));
  return Number.isFinite(n) && n > 0 ? n.toFixed(2) : "";
}

function normalizeRoast(r) {
  return /dark/i.test(r) ? "Dark" : "Medium";
}

function toItem(o) {
  const item = { name: o.name, roast: normalizeRoast(o.roast || o.roast_level), price: normalizePrice(o.price) };
  if (o.origin) item.origin = o.origin;     // keep field order: origin then badge
  if (o.badge) item.badge = o.badge;
  return item;
}

async function main() {
  if (!SHEET_CSV_URL) {
    console.log("[build-menu] SHEET_CSV_URL not set — keeping committed app/lib/beans.json.");
    return;
  }

  const res = await fetch(SHEET_CSV_URL, { redirect: "follow" });
  if (!res.ok) throw new Error(`Failed to fetch sheet: ${res.status} ${res.statusText}`);
  const objects = rowsToObjects(parseCSV(await res.text()));

  const available = objects.filter((o) => o.name && truthy(o.available));
  if (available.length === 0) {
    throw new Error("Sheet produced 0 available beans — refusing to overwrite a good menu with an empty one.");
  }

  const bySection = new Map();
  for (const o of available) {
    const s = o.section || "Other";
    if (!bySection.has(s)) bySection.set(s, []);
    bySection.get(s).push(toItem(o));
  }

  const ordered = [
    ...SECTION_ORDER.filter((s) => bySection.has(s)),
    ...[...bySection.keys()].filter((s) => !SECTION_ORDER.includes(s)),
  ];

  const out = {
    store: STORE,
    menu: MENU,
    sections: ordered.map((s) => ({ name: s, items: bySection.get(s) })),
  };

  await mkdir(dirname(OUT_PATH), { recursive: true });
  await writeFile(OUT_PATH, JSON.stringify(out, null, 2) + "\n");

  console.log(`[build-menu] ✓ Wrote ${OUT_PATH} — ${available.length} beans across ${ordered.length} sections:`);
  for (const s of ordered) console.log(`             ${s.padEnd(24)} ${bySection.get(s).length}`);
}

main().catch((err) => {
  console.error("[build-menu] FAILED:", err.message);
  process.exit(1);
});
