# Castro Coffee Company — Digital Menu

Two digital-signage menu boards for Castro Coffee Company, built to run on a pair
of 65" 4K TVs mounted side by side. Built with **Next.js 16 (App Router) + React 19**
and exported as a fully static site, so it drops straight onto Vercel (or any
static host) with no server runtime.

Recreated from a [Claude Design](https://claude.ai/design) handoff bundle.

## The two screens

| Route    | Screen          | What it shows |
| -------- | --------------- | ------------- |
| `/`      | **Left TV**     | **Drinks menu** — a single static 4K board: fresh brewed, espresso, iced, frappes, specials, plus a featured "Exotic Hand Made Drip" box and a rotating "Featured today" ticker. |
| `/beans` | **Right TV**    | **Coffee beans** (105 single-origin / blends / decaf, by the pound) — an auto-rotating board that cycles through 6 large, legible category pages every 10s. |

Both boards share one visual system: the roasted-bean background, a soft feathered
cream wash that lifts the text, a centered logo masthead, a live clock + "Open"
status, a bronze accent (`#95652E`), and subtle ambient motion (steam, a slow warm
light sweep, gentle fade-ins).

Each board is a fixed **3840×2160** canvas that scales with JS to fill whatever
viewport it's shown in, preserving the 16:9 aspect — so it fills a 4K TV exactly
and still previews correctly in a laptop browser window.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000  (/ = drinks, /beans = beans)
```

## Build & deploy

```bash
npm run build        # static export → ./out
npm run serve        # preview the exported ./out locally
```

`next.config.ts` sets `output: "export"`, so `npm run build` writes a static site
to `./out`.

**Deploy to Vercel:** push this repo to GitHub and import it at
[vercel.com/new](https://vercel.com/new) — Vercel auto-detects Next.js and serves
`/` and `/beans`. (Or `npm i -g vercel && vercel` from this directory.) No
environment variables or backend needed.

Point the left TV's browser at the deployment root and the right TV at `/beans`.

## Project layout

```
app/
  layout.tsx              # root layout + Google Fonts (Playfair, EB Garamond, …)
  board.css               # all board styles (ported verbatim from the design)
  page.tsx                # "/"      → renders CoffeeBoard (drinks)
  beans/page.tsx          # "/beans" → renders BeansBoard
  components/
    boardChrome.tsx       # shared: fit-to-viewport hook, Clock, brand arcs, theme vars
    CoffeeBoard.tsx       # drinks board
    BeansBoard.tsx        # beans board (paged + auto-rotate)
  lib/
    menuData.ts           # drinks menu data (MENU)
    beansData.ts          # 105 beans (BEANS_MENU + BEANS lookup)
public/assets/            # bg.png (bean background), logo.webp
```

## Tweaks panel (live, on-screen tuning)

Each board has the design tool's **Tweaks panel** built in, so the look can be
tuned right on the TV with no code:

- Open it with the **gear button** in the bottom-right corner, or press **`t`**.
- **Drinks:** layout (columns / featured / framed), type pairing, four independent
  text-size sliders (Headers / Items / Labels / Notes), accent tone, and finish
  toggles (paper wash, live clock, featured ticker, flourishes, ambient motion).
- **Beans:** view (paged / full list), auto-rotate, seconds-per-page, type pairing,
  the same four text-size sliders, accent tone, and finish toggles.
- Changes **persist per board** in the browser's `localStorage` (so they survive a
  TV reload), and **Reset to defaults** restores the shipped look.

Each board's default/reset values are the `DRINKS_DEFAULTS` / `BEANS_DEFAULTS`
constants at the top of its component.

## Editing content

- **Drinks / prices** → `app/lib/menuData.ts`
- **Beans / prices** → `app/lib/beansData.ts`
- **Page grouping & rotation** → `PAGES` and `BEANS_DEFAULTS.pageSecs` in `app/components/BeansBoard.tsx`
- **Default look** → `DRINKS_DEFAULTS` / `BEANS_DEFAULTS` (or just use the Tweaks panel)
