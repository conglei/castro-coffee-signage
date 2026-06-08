"use client";

// Tweak form controls — remote-control (D-pad) friendly.
//
// Every interactive control is ONE focusable row (tabIndex=0, data-twk-nav) so a
// TV remote can land on it with Up/Down (handled by TweaksPanel) and adjust it
// with Left/Right (handled here). Enter toggles/activates. Mouse clicks on the
// −/＋/‹/› affordances and chips still work, so it's usable both ways.

import { useRef, type ReactNode } from "react";

// Keeps the newest value in a ref (synced every render) so a burst of rapid
// key-repeat presses chains off the latest value instead of a stale prop —
// without waiting for React to re-render between presses.
function useLatest<T>(value: T) {
  const ref = useRef(value);
  ref.current = value;
  return ref;
}

export function TweakSection({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

export function TweakRow({
  label,
  value,
  children,
  inline = false,
}: {
  label: string;
  value?: ReactNode;
  children?: ReactNode;
  inline?: boolean;
}) {
  return (
    <div className={inline ? "twk-row twk-row-h" : "twk-row"}>
      <div className="twk-lbl">
        <span>{label}</span>
        {value != null && <span className="twk-val">{value}</span>}
      </div>
      {children}
    </div>
  );
}

// Round to the precision implied by `step` (avoids 0.1+0.2 float drift).
function snap(v: number, step: number) {
  const decimals = (String(step).split(".")[1] || "").length;
  return Number((Math.round(v / step) * step).toFixed(decimals));
}

// Stepper — replaces the drag-only slider. Left/Right (or −/＋) step the value.
export function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  onChange,
}: {
  label: string;
  value: number;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  onChange: (v: number) => void;
}) {
  const clamp = (v: number) => Math.min(max, Math.max(min, snap(v, step)));
  const vref = useLatest(value);
  const bump = (dir: number) => { const next = clamp(vref.current + dir * step); vref.current = next; onChange(next); };
  const pct = ((value - min) / (max - min)) * 100;

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { bump(-1); e.preventDefault(); }
    else if (e.key === "ArrowRight") { bump(1); e.preventDefault(); }
  };

  return (
    <TweakRow label={label} value={`${value}${unit}`}>
      <div className="twk-stepper" tabIndex={0} data-twk-nav role="slider"
        aria-label={label} aria-valuenow={value} aria-valuemin={min} aria-valuemax={max}
        onKeyDown={onKeyDown}>
        <button type="button" className="twk-step" tabIndex={-1} aria-hidden="true"
          onClick={() => bump(-1)} disabled={value <= min}>−</button>
        <div className="twk-stepbar"><i style={{ width: `${pct}%` }} /></div>
        <button type="button" className="twk-step" tabIndex={-1} aria-hidden="true"
          onClick={() => bump(1)} disabled={value >= max}>＋</button>
      </div>
    </TweakRow>
  );
}

export function TweakToggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { if (value) onChange(false); e.preventDefault(); }
    else if (e.key === "ArrowRight") { if (!value) onChange(true); e.preventDefault(); }
    else if (e.key === "Enter" || e.key === " ") { onChange(!value); e.preventDefault(); }
  };
  return (
    <div className="twk-row twk-row-h twk-nav" tabIndex={0} data-twk-nav
      role="switch" aria-checked={!!value} aria-label={label} onKeyDown={onKeyDown}
      onClick={() => onChange(!value)}>
      <div className="twk-lbl">
        <span>{label}</span>
      </div>
      <span className="twk-toggle" data-on={value ? "1" : "0"} aria-hidden="true">
        <i />
      </span>
    </div>
  );
}

type Option = string | { value: string; label: string };

const normOpts = (options: Option[]) =>
  options.map((o) => (typeof o === "object" ? o : { value: o, label: o }));

// Cycler — replaces the native dropdown. Left/Right (or ‹ ›) wrap through options.
export function TweakSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
}) {
  const opts = normOpts(options);
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const iref = useLatest(idx);
  const step = (dir: number) => {
    const ni = (iref.current + dir + opts.length) % opts.length;
    iref.current = ni;
    onChange(opts[ni].value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { step(-1); e.preventDefault(); }
    else if (e.key === "ArrowRight" || e.key === "Enter") { step(1); e.preventDefault(); }
  };

  return (
    <TweakRow label={label}>
      <div className="twk-cycler" tabIndex={0} data-twk-nav role="listbox"
        aria-label={label} onKeyDown={onKeyDown}>
        <button type="button" className="twk-cyc-arrow" tabIndex={-1} aria-hidden="true"
          onClick={() => step(-1)}>‹</button>
        <span className="twk-cyc-val">{opts[idx]?.label}</span>
        <button type="button" className="twk-cyc-arrow" tabIndex={-1} aria-hidden="true"
          onClick={() => step(1)}>›</button>
      </div>
    </TweakRow>
  );
}

// Segmented control for 2–3 short options; falls back to the cycler when the
// labels are too long to fit. Left/Right move the selection; segments click too.
export function TweakRadio({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
}) {
  const labelLen = (o: Option) => String(typeof o === "object" ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= (({ 2: 16, 3: 10 } as Record<number, number>)[options.length] ?? 0);
  if (!fitsAsSegments) {
    return <TweakSelect label={label} value={value} options={options} onChange={onChange} />;
  }

  const opts = normOpts(options);
  const idx = Math.max(0, opts.findIndex((o) => o.value === value));
  const n = opts.length;
  const iref = useLatest(idx);
  const step = (dir: number) => {
    const ni = Math.min(n - 1, Math.max(0, iref.current + dir));
    iref.current = ni;
    onChange(opts[ni].value);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { step(-1); e.preventDefault(); }
    else if (e.key === "ArrowRight") { step(1); e.preventDefault(); }
  };

  return (
    <TweakRow label={label}>
      <div className="twk-seg" tabIndex={0} data-twk-nav role="radiogroup"
        aria-label={label} onKeyDown={onKeyDown}>
        <div
          className="twk-seg-thumb"
          style={{
            left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
            width: `calc((100% - 4px) / ${n})`,
          }}
        />
        {opts.map((o) => (
          <button key={o.value} type="button" tabIndex={-1} role="radio"
            aria-checked={o.value === value} onClick={() => onChange(o.value)}>
            {o.label}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

function isLight(hex: string) {
  const h = String(hex).replace("#", "");
  const x = h.length === 3 ? h.replace(/./g, (c) => c + c) : h.padEnd(6, "0");
  const num = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(num)) return true;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}

function Check({ light }: { light: boolean }) {
  return (
    <svg viewBox="0 0 14 14" aria-hidden="true">
      <path
        d="M3 7.2 5.8 10 11 4.2"
        fill="none"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke={light ? "rgba(0,0,0,.78)" : "#fff"}
      />
    </svg>
  );
}

// Curated color picker — one swatch per option. Left/Right move the selection.
export function TweakColor({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  const cur = String(value).toLowerCase();
  const idx = Math.max(0, options.findIndex((o) => String(o).toLowerCase() === cur));
  const iref = useLatest(idx);
  const step = (dir: number) => {
    const ni = (iref.current + dir + options.length) % options.length;
    iref.current = ni;
    onChange(options[ni]);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") { step(-1); e.preventDefault(); }
    else if (e.key === "ArrowRight") { step(1); e.preventDefault(); }
  };

  return (
    <TweakRow label={label}>
      <div className="twk-chips" tabIndex={0} data-twk-nav role="radiogroup"
        aria-label={label} onKeyDown={onKeyDown}>
        {options.map((o, i) => {
          const on = String(o).toLowerCase() === cur;
          return (
            <button
              key={i}
              type="button"
              tabIndex={-1}
              className="twk-chip"
              role="radio"
              aria-checked={on}
              data-on={on ? "1" : "0"}
              aria-label={o}
              title={o}
              style={{ background: o }}
              onClick={() => onChange(o)}
            >
              {on && <Check light={isLight(o)} />}
            </button>
          );
        })}
      </div>
    </TweakRow>
  );
}

export function TweakButton({
  label,
  onClick,
  secondary = false,
}: {
  label: string;
  onClick: () => void;
  secondary?: boolean;
}) {
  return (
    <button type="button" data-twk-nav className={secondary ? "twk-btn secondary" : "twk-btn"} onClick={onClick}>
      {label}
    </button>
  );
}
