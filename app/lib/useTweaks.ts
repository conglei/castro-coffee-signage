"use client";

import { useCallback, useEffect, useState } from "react";

export type SetTweak<T> = {
  <K extends keyof T>(key: K, value: T[K]): void;
  (edits: Partial<T>): void;
};

// Live tweak state, persisted to localStorage so a shop owner's adjustments
// survive reloads on the TV. Initial render uses `defaults` (matching the
// server-rendered HTML); any persisted overrides are applied after mount to
// avoid a hydration mismatch.
export function useTweaks<T extends object>(
  defaults: T,
  storageKey: string,
): [T, SetTweak<T>] {
  const [values, setValues] = useState<T>(defaults);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setValues((prev) => ({ ...prev, ...(JSON.parse(raw) as Partial<T>) }));
    } catch {
      /* ignore unreadable/invalid storage */
    }
  }, [storageKey]);

  const setTweak = useCallback(
    (keyOrEdits: keyof T | Partial<T>, value?: unknown) => {
      setValues((prev) => {
        const edits =
          typeof keyOrEdits === "object" && keyOrEdits !== null
            ? keyOrEdits
            : ({ [keyOrEdits as keyof T]: value } as Partial<T>);
        const next = { ...prev, ...edits };
        try {
          localStorage.setItem(storageKey, JSON.stringify(next));
        } catch {
          /* storage may be unavailable (private mode) — keep state in memory */
        }
        return next;
      });
    },
    [storageKey],
  ) as SetTweak<T>;

  return [values, setTweak];
}
