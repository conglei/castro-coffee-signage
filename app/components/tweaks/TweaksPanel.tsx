"use client";

// Floating Tweaks panel — ported from the design handoff (tweaks-panel.jsx).
// The original talked to the Claude Design host over postMessage to open/close
// and persist; standalone, it manages its own open state (a corner button or
// the `t` key) and persistence is handled by useTweaks (localStorage).

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { TweakButton } from "./controls";
import "./tweaks.css";

const PAD = 16;

export function TweaksPanel({
  title = "Tweaks",
  children,
  onReset,
}: {
  title?: string;
  children: ReactNode;
  onReset?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const dragRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef({ x: PAD, y: PAD });

  const clampToViewport = useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth;
    const h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right = offsetRef.current.x + "px";
    panel.style.bottom = offsetRef.current.y + "px";
  }, []);

  useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", clampToViewport);
      return () => window.removeEventListener("resize", clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  // `t` toggles the panel (ignored while typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "t" && e.key !== "T") return;
      const el = e.target as HTMLElement | null;
      if (el && /^(INPUT|SELECT|TEXTAREA)$/.test(el.tagName)) return;
      setOpen((o) => !o);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onDragStart = (e: React.MouseEvent) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX;
    const sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = (ev: MouseEvent) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  if (!open) {
    return (
      <button
        type="button"
        className="twk-fab"
        aria-label="Open tweaks (press t)"
        title="Tweaks (t)"
        onClick={() => setOpen(true)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6" />
        </svg>
      </button>
    );
  }

  return (
    <div
      ref={dragRef}
      className="twk-panel"
      style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}
    >
      <div className="twk-hd" onMouseDown={onDragStart}>
        <b>{title}</b>
        <button
          className="twk-x"
          aria-label="Close tweaks"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={() => setOpen(false)}
        >
          ✕
        </button>
      </div>
      <div className="twk-body">
        {children}
        {onReset && (
          <div className="twk-foot">
            <TweakButton label="Reset to defaults" secondary onClick={onReset} />
          </div>
        )}
      </div>
    </div>
  );
}
