"use client";

import Link from "next/link";

// A discreet corner link to jump to the other menu board. Sits bottom-left
// (the Tweaks gear is bottom-right), low-opacity until hovered.
export function BoardSwitch({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="board-switch" aria-label={`Switch to ${label}`}>
      <span>{label}</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}
