// GET /api/refresh?board=drinks|beans — re-read a live Google Sheet on demand.
//
// Powers the "Refresh" button on both boards. Designed so an explicit click
// returns FRESH data in a single click (no stale-while-revalidate surprises),
// while still protecting Google from spam:
//   • response is no-store — never cached by the browser or Vercel's CDN, so
//     every click actually reaches this function (the old s-maxage header was
//     why production kept serving an old snapshot).
//   • a short in-memory throttle re-fetches a given sheet at most once per
//     THROTTLE_MS; within that window clicks get the last fetched result.
//     After the window a click does a blocking fresh fetch and returns the new
//     menu immediately.
//   • read-only and non-destructive — on any error it falls back to the last
//     good result (or the committed menu), so a flaky sheet never blanks a board.
//
// Note: the throttle map lives in module memory, so it's per warm server
// instance. On a cold start it's empty (one extra fetch) — harmless, still
// ≤ 1 fetch per THROTTLE_MS per instance.

import { type NextRequest, NextResponse } from "next/server";
import { parseDrinksCsv } from "../../lib/drinksCsv";
import { parseBeansCsv } from "../../lib/beansCsv";
import { MENU } from "../../lib/menuData";
import { BEANS_MENU } from "../../lib/beansData";

// Always run the handler; we manage caching ourselves (no ISR / Data Cache).
export const dynamic = "force-dynamic";

const THROTTLE_MS = 10_000;

const BOARDS = {
  drinks: { env: "DRINKS_SHEET_CSV_URL", parse: parseDrinksCsv, committed: () => MENU },
  beans: { env: "SHEET_CSV_URL", parse: parseBeansCsv, committed: () => BEANS_MENU },
} as const;

type CacheEntry = { at: number; menu: unknown };
const cache: Record<string, CacheEntry | undefined> = {};

const json = (body: unknown) =>
  NextResponse.json(body, { headers: { "Cache-Control": "no-store" } });

export async function GET(req: NextRequest) {
  const board = req.nextUrl.searchParams.get("board") === "beans" ? "beans" : "drinks";
  const cfg = BOARDS[board];
  const url = process.env[cfg.env];
  const now = Date.now();

  // Throttle: within the window, return the last fetched result (spam protection).
  const hit = cache[board];
  if (hit && now - hit.at < THROTTLE_MS) {
    return json({ menu: hit.menu, source: "cache", board, fetchedAt: hit.at });
  }

  // No live URL configured (or it's a local seed path used only at build time).
  if (!url || !/^https?:\/\//i.test(url)) {
    return json({ menu: cfg.committed(), source: "committed", board, fetchedAt: now });
  }

  try {
    const res = await fetch(url, { redirect: "follow", cache: "no-store" });
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status} ${res.statusText}`);
    const menu = cfg.parse(await res.text());
    cache[board] = { at: now, menu };
    return json({ menu, source: "sheet", board, fetchedAt: now });
  } catch (err) {
    // Never break the board: fall back to the last good result, else committed.
    const fallback = hit?.menu ?? cfg.committed();
    return json({ menu: fallback, source: "fallback", board, error: (err as Error).message, fetchedAt: now });
  }
}
