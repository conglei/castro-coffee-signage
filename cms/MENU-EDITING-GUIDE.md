# Editing the Menus

There are **two** boards, each driven by its own Google Sheet:

| Board | Reads | Built from sheet by | Env var |
|---|---|---|---|
| Coffee Beans (right TV) | `app/lib/beans.json` | `scripts/build-menu.mjs` | `SHEET_CSV_URL` |
| Drinks (left TV) | `app/lib/drinks.json` | `scripts/build-drinks.mjs` | `DRINKS_SHEET_CSV_URL` |

Owners don't touch the JSON — they edit a Google Sheet and click one button:

```
Google Sheet  ──[ 🌐 Publish ]──▶  Vercel rebuild  ──▶  build scripts  ──▶  *.json  ──▶  live boards
 (owners edit)                                          (fetch the sheets)
```

One Vercel project builds both boards, so **a single rebuild refreshes both
menus** — the Publish button on either sheet picks up the latest of everything.
If an env var is unset, that build step is skipped and the committed JSON is used,
so nothing breaks before a sheet is connected.

---

## For owners — change a menu

1. Open the relevant Google Sheet (**Castro Coffee Beans** or **Castro Coffee Drinks**) — bookmark both.
2. Edit cells (mostly **prices** and **names**).
3. Click the **🌐 Website** menu → **Publish menu to website**.
4. Wait ~1 minute, then refresh the board.

Don't rename the header row. To hide/remove something, see each menu's notes below.

### Beans sheet columns

| Column | Edit it? | Notes |
|---|---|---|
| `section` | Yes | Heading it appears under |
| `available` | Yes | `yes` shows it, `no` hides it |
| `name` | Yes | Coffee name |
| `roast` | Yes | `Medium` or `Dark` |
| `origin` | Rarely | Country/region (blank for blends) |
| `badge` | Rarely | `Organic`, `Reserve`, `Rare`, or blank |
| `price` | Yes | Number only, e.g. `14.50` |

Bean sections: **House & Medium Blends, Single-Origin, Dark Roasts, Espresso
Blends, Flavored, Organic & Fair Trade, Decaf, Rare & Reserve.**

### Drinks sheet columns

The drinks board is laid out in 4 columns with different kinds of rows, so this
sheet has more columns. For everyday edits you'll only touch **`name`** and the
**`price1` / `price2` / `price3`** cells.

| Column | Edit it? | Notes |
|---|---|---|
| `col` | No | Which board column (A–D) |
| `section_id` | No | Internal id — leave alone |
| `section_title` | Rarely | The heading shown on the board |
| `section_note` | Rarely | Small note by the heading (e.g. "12 oz only") |
| `section_desc` | Rarely | Section blurb (used by Refreshers) |
| `featured` | No | Highlights a section |
| `section_sizes` | Rarely | Size headers, e.g. `12 oz\|16 oz\|20 oz` |
| `kind` | No | Row type (see below) — leave alone |
| `name` | Yes | Drink / flavor / add-on name |
| `desc` | Yes | Description (Refreshers) |
| `tag` | Rarely | Badge like `Rare` |
| `price1/2/3` | Yes | Prices, aligned to `size1/2/3` |
| `size1/2/3` | Rarely | Size labels for that row |

`kind` values: `item` (priced, one or more sizes), `single` (one price, e.g. the
Exotic pours), `desc` (description only), `uniform` (the shared Frappe price
row), `flavor` (a Frappe flavor), `addon` (e.g. "Add Espresso Shot").

Common drinks edits:
- **Change a price** → edit `price1/2/3` on that row.
- **Add a Frappe flavor** → copy a `flavor` row in the Frappes section, change the name.
- **Add a drink** → copy a row in the same section (same `col`, `section_id`, `kind`) and edit name/prices.

---

## For the developer — one-time setup

Do this once per sheet. Both sheets can share the **same Vercel deploy hook**.

1. **Create each sheet.** New Google Sheet ▸ File ▸ Import ▸ upload the seed
   (**`cms/sheet_seed.csv`** for beans, **`cms/drinks_sheet_seed.csv`** for drinks)
   ▸ *Replace current sheet*.
2. **Publish as CSV.** File ▸ Share ▸ Publish to web ▸ pick the sheet ▸ format
   **CSV** ▸ Publish. Copy each URL. Leave "automatically republish" on.
3. **Set env vars** (Vercel ▸ Settings ▸ Environment Variables, and `.env.local`
   for local dev):
   - `SHEET_CSV_URL` = beans CSV URL
   - `DRINKS_SHEET_CSV_URL` = drinks CSV URL
4. **Deploy hook.** Vercel ▸ Settings ▸ Git ▸ Deploy Hooks ▸ create one, copy URL.
5. **Publish button** (per sheet). Extensions ▸ Apps Script ▸ paste
   **`cms/apps-script.gs`** ▸ save ▸ run `setupDeployHook` once and paste the
   **same** hook URL. Reload the sheet.

Test locally any time:
- `SHEET_CSV_URL="…" npm run menu` → rewrites `app/lib/beans.json`
- `DRINKS_SHEET_CSV_URL="…" npm run drinks` → rewrites `app/lib/drinks.json`

Both run automatically via `prebuild` before `next build`.

## Safety notes
- Each build **fails loudly** if its sheet is unreachable or empty — it won't
  blank a screen.
- `beans.json` and `drinks.json` are committed, so the site builds with no sheets.
- Build scripts have **zero npm dependencies** (plain Node 18+).
- The drinks board's rotating "Featured today" ticker is hardcoded in
  `CoffeeBoard.tsx` (not in the sheet); edit it there if needed.

## Heads-up: two price sources (beans)
Bean prices live in both the beans sheet and Square (the register); they don't
sync. If you'd prefer one source of truth, `scripts/build-menu.mjs` can be
pointed at the Square Catalog API instead.
