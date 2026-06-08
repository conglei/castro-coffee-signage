// GET /api/refresh?board=drinks|beans — re-read a live Google Sheet on demand.
//
// Powers the "Refresh" button on both boards. Safe to expose publicly because:
//   • read-only — it never writes a file, DB, or git; worst case it re-reads
//     the already-public published sheet.
//   • cached — the upstream Google fetch is cached for REVALIDATE_SECONDS, so
//     N clicks collapse into ~1 fetch per window (protects us from Google
//     throttling and keeps function cost negligible even under spam).
//   • non-destructive — on any failure it falls back to the committed menu, so
//     a flaky sheet can never blank the board.

import { type NextRequest, NextResponse } from "next/server";
import { parseDrinksCsv } from "../../lib/drinksCsv";
import { parseBeansCsv } from "../../lib/beansCsv";
import { MENU } from "../../lib/menuData";
import { BEANS_MENU } from "../../lib/beansData";

const REVALIDATE_SECONDS = 60;

// Cache this GET handler's upstream fetch for REVALIDATE_SECONDS (see route docs).
export const revalidate = 60;

const BOARDS = {
  drinks: { env: "DRINKS_SHEET_CSV_URL", parse: parseDrinksCsv, committed: () => MENU },
  beans: { env: "SHEET_CSV_URL", parse: parseBeansCsv, committed: () => BEANS_MENU },
} as const;

export async function GET(req: NextRequest) {
  const board = req.nextUrl.searchParams.get("board") === "beans" ? "beans" : "drinks";
  const cfg = BOARDS[board];
  const url = process.env[cfg.env];

  // No live URL configured (or it's a local seed path used only at build time):
  // just return the committed menu that was baked in at build.
  if (!url || !/^https?:\/\//i.test(url)) {
    return NextResponse.json(
      { menu: cfg.committed(), source: "committed", board, fetchedAt: Date.now() },
      { headers: { "Cache-Control": "no-store" } },
    );
  }

  try {
    const res = await fetch(url, { redirect: "follow", next: { revalidate: REVALIDATE_SECONDS } });
    if (!res.ok) throw new Error(`Sheet fetch failed: ${res.status} ${res.statusText}`);
    const menu = cfg.parse(await res.text());
    return NextResponse.json(
      { menu, source: "sheet", board, fetchedAt: Date.now() },
      {
        headers: {
          // CDN-level cache as a second layer in front of the data cache.
          "Cache-Control": `public, s-maxage=${REVALIDATE_SECONDS}, stale-while-revalidate=300`,
        },
      },
    );
  } catch (err) {
    // Never break the board: fall back to the committed menu and report it.
    return NextResponse.json(
      { menu: cfg.committed(), source: "fallback", board, error: (err as Error).message, fetchedAt: Date.now() },
      { headers: { "Cache-Control": "no-store" } },
    );
  }
}
