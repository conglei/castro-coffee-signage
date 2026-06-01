"use client";

import { useEffect, useState, type RefObject, type CSSProperties } from "react";

// Serif type pairings used across both boards (display + body fonts).
export const TYPE_PAIRS = {
  playfair: { display: "'Playfair Display', serif", body: "'EB Garamond', serif", label: "Playfair · Garamond" },
  cormorant: { display: "'Cormorant Garamond', serif", body: "'Spectral', serif", label: "Cormorant · Spectral" },
  dmserif: { display: "'DM Serif Display', serif", body: "'Lora', serif", label: "DM Serif · Lora" },
} as const;

export type TypePairKey = keyof typeof TYPE_PAIRS;

// Shared theme knobs baked into both signage boards (final values chosen in the
// design session). Kept as data so they're trivial to retune later.
export interface Theme {
  typePair: TypePairKey;
  accent: string;
  fsHeader: number;
  fsItem: number;
  fsLabel: number;
  fsNote: number;
  panel: boolean;
  clock: boolean;
  flourish: boolean;
  motion: boolean;
}

// Build the CSS custom-property style object applied to #board.
export function boardVars(t: Theme): CSSProperties {
  const tp = TYPE_PAIRS[t.typePair] ?? TYPE_PAIRS.playfair;
  return {
    "--accent": t.accent,
    "--font-display": tp.display,
    "--font-body": tp.body,
    "--fs-header": t.fsHeader,
    "--fs-item": t.fsItem,
    "--fs-label": t.fsLabel,
    "--fs-note": t.fsNote,
  } as CSSProperties;
}

// The board is a fixed 3840×2160 canvas; scale it to fill the viewport while
// keeping the aspect ratio (letterboxed on non-16:9 screens).
export function useFitToViewport(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const fit = () => {
      const el = ref.current;
      if (!el) return;
      const s = Math.min(window.innerWidth / 3840, window.innerHeight / 2160);
      el.style.transform = `translate(-50%, -50%) scale(${s})`;
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [ref]);
}

// Live clock + "Open" status. Starts blank so the server-rendered HTML and the
// first client paint match (the real time fills in after mount — no hydration
// mismatch), then updates every second.
export function Clock() {
  const [now, setNow] = useState<Date | null>(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  const time = now ? now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }) : "";
  const day = now ? now.toLocaleDateString([], { weekday: "long" }) : "";
  return (
    <div className="clock">
      <div className="ct">
        <b>{time}</b>
        <em>{day}</em>
      </div>
      <span className="status">
        <span className="dot" />
        Open
      </span>
    </div>
  );
}

// Faint concentric-arc brand watermark echoing the logo's curves.
export function BrandArcs() {
  return (
    <svg className="brand-arcs" viewBox="0 0 400 400" aria-hidden="true" fill="none" stroke="currentColor">
      <path d="M261.3 251.4 A80 80 0 1 0 261.3 148.6" strokeWidth="14" />
      <path d="M299.6 283.6 A130 130 0 1 0 299.6 116.4" strokeWidth="14" />
      <path d="M337.9 315.7 A180 180 0 1 0 337.9 84.3" strokeWidth="14" />
    </svg>
  );
}
