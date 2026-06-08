"use client";

// Discreet "Refresh" control shared by both signage boards. Calls
// /api/refresh?board=… (read-only, server-cached) and hands the fresh menu back
// to the board, which live-swaps it into view. Falls back silently to the last
// good menu on any error (the route returns it), and debounces rapid clicks.

import { useCallback, useState } from "react";

type RefreshState = "idle" | "loading" | "ok" | "error";

export function RefreshButton<T>({
  board = "drinks",
  onData,
}: {
  board?: "drinks" | "beans";
  onData: (menu: T) => void;
}) {
  const [state, setState] = useState<RefreshState>("idle");

  const refresh = useCallback(async () => {
    setState("loading");
    try {
      const res = await fetch(`/api/refresh?board=${board}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as { menu: T };
      if (data?.menu) onData(data.menu);
      setState("ok");
    } catch {
      setState("error");
    } finally {
      // Settle the status chip back to idle after a moment (also a light debounce).
      setTimeout(() => setState("idle"), 2500);
    }
  }, [board, onData]);

  const label =
    state === "loading" ? "Refreshing…" :
    state === "ok" ? "Updated ✓" :
    state === "error" ? "Failed — retry" : "Refresh menu";

  return (
    <button
      type="button"
      className={`refresh-btn ${state}`}
      onClick={refresh}
      disabled={state === "loading"}
      aria-label="Refresh the menu from the spreadsheet"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={state === "loading" ? "spin" : ""}>
        <path d="M21 12a9 9 0 1 1-2.64-6.36M21 3v6h-6" />
      </svg>
      <span>{label}</span>
    </button>
  );
}
