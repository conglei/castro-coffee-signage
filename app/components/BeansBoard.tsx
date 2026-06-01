"use client";

// Castro Coffee Company — coffee beans board (right TV).
// Ported from the design handoff (beans-app.jsx). Auto-rotating "pages", one
// category shown large at a time. Final tweak values baked in; Tweaks panel removed.

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { BEANS, type Bean } from "../lib/beansData";
import { BrandArcs, Clock, boardVars, useFitToViewport, TYPE_PAIRS, type Theme } from "./boardChrome";
import { useTweaks } from "../lib/useTweaks";
import { TweaksPanel } from "./tweaks/TweaksPanel";
import { TweakSection, TweakRadio, TweakSelect, TweakSlider, TweakColor, TweakToggle } from "./tweaks/controls";
import { BoardSwitch } from "./BoardSwitch";

interface BeansTheme extends Theme {
  view: "paged" | "full";
  pageSecs: number;
  autoRotate: boolean;
}

// Final look chosen during the design session — used as the default/reset state.
const BEANS_DEFAULTS: BeansTheme = {
  view: "paged",
  pageSecs: 10,
  autoRotate: true,
  typePair: "playfair",
  accent: "#95652E",
  fsHeader: 1,
  fsItem: 1,
  fsLabel: 1,
  fsNote: 1,
  panel: true,
  clock: true,
  flourish: true,
  motion: true,
};

const price = (s: string) => {
  const n = parseFloat(s);
  return "$" + (Number.isInteger(n) ? n : n.toFixed(2));
};

interface Page {
  title: string;
  sub: string;
  groups: string[];
  cols?: number;
  showcase?: boolean;
}

// Rotating pages — one category group shown large at a time (balanced counts).
const PAGES: Page[] = [
  { title: "Blends & Organic", sub: "House, espresso & certified organic", groups: ["House & Medium Blends", "Espresso Blends", "Organic & Fair Trade"], cols: 2 },
  { title: "Single-Origin", sub: "From the world's great coffee regions", groups: ["Single-Origin"], cols: 2 },
  { title: "Dark Roasts", sub: "Bold, smoky & full-bodied", groups: ["Dark Roasts"], cols: 2 },
  { title: "Flavored", sub: "Naturally infused favorites", groups: ["Flavored"], cols: 2 },
  { title: "Decaf", sub: "Swiss Water process · all the flavor", groups: ["Decaf"], cols: 2 },
  { title: "Rare & Reserve", sub: "Limited lots · special order", groups: ["Rare & Reserve"], showcase: true },
];

// Full-list (dense) layout columns.
const COLUMNS: string[][] = [
  ["Single-Origin"],
  ["Dark Roasts"],
  ["Flavored", "Espresso Blends"],
  ["Decaf"],
  ["House & Medium Blends", "Organic & Fair Trade", "Rare & Reserve"],
];

const SECTION_NOTES: Record<string, string> = {
  "Espresso Blends": "Dark roast",
  "Organic & Fair Trade": "Certified",
  Decaf: "Swiss Water",
  "Rare & Reserve": "Special order · 1 lb",
};

/* ───────── rows ───────── */
function BeanRow({ item, featured, lead }: { item: Bean; featured?: boolean; lead?: boolean }) {
  return (
    <div className="brow">
      <span className={"dot " + item.r} title={item.r === "D" ? "Dark roast" : "Medium roast"} />
      <span className="bn">
        {item.n}
        {featured && item.b && <span className="tag">{item.b}</span>}
      </span>
      {(featured || lead) && <span className="leader" />}
      <span className="bp">{price(item.p)}</span>
    </div>
  );
}

/* ───────── paged view ───────── */
function PageContent({ page }: { page: Page }) {
  if (page.showcase) {
    const items = page.groups.flatMap((g) => BEANS[g] || []);
    return (
      <div className="showcase">
        {items.map((it, i) => (
          <div className="show-item" key={i}>
            <span className={"dot " + it.r} style={{ width: "26px", height: "26px", alignSelf: "center" }} />
            <div className="si-main">
              <span className="si-name">{it.n.replace(" ( Special Order )", "")}</span>
              {it.o && <span className="si-orig">{it.o}</span>}
            </div>
            {it.b && <span className="tag si-badge">{it.b}</span>}
            <span className="si-price">{price(it.p)}</span>
          </div>
        ))}
      </div>
    );
  }
  const multi = page.groups.length > 1;
  return (
    <div className="page-body">
      <div className="page-grid paged" style={{ columnCount: page.cols || 2 }}>
        {page.groups.map((g) => (
          <Fragment key={g}>
            {multi && <div className="glabel">{g}</div>}
            {(BEANS[g] || []).map((it, i) => (
              <BeanRow key={g + i} item={it} lead />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function PagedView({ idx }: { idx: number }) {
  const page = PAGES[idx];
  const count = page.groups.reduce((n, g) => n + (BEANS[g] || []).length, 0);
  return (
    <div className="pages">
      <div className="page" key={idx}>
        <div className="page-head">
          <h2 className="page-title">{page.title}</h2>
          <span className="page-sub">{page.sub}</span>
          <span className="page-count">{count} · 1 lb bags</span>
        </div>
        <PageContent page={page} />
      </div>
    </div>
  );
}

function Pager({ idx, go }: { idx: number; go: (i: number) => void }) {
  return (
    <div className="pager">
      {PAGES.map((p, i) => (
        <span key={i} className={"pdot" + (i === idx ? " on" : "")} onClick={() => go(i)} style={{ cursor: "pointer" }} />
      ))}
      <span className="pcat">{PAGES[idx].title}</span>
      <div className="pbar" key={idx}>
        <i />
      </div>
    </div>
  );
}

/* ───────── full (dense) view ───────── */
function BeanSection({ name, featured }: { name: string; featured?: boolean }) {
  const items = BEANS[name] || [];
  return (
    <section className={"sec" + (featured ? " featured" : "")} data-id={name}>
      <header className="sec-h">
        <h2>{name}</h2>
        {SECTION_NOTES[name] && <span className="note">{SECTION_NOTES[name]}</span>}
      </header>
      <div className="items">
        {items.map((it, i) => (
          <BeanRow key={i} item={it} featured={featured} />
        ))}
      </div>
    </section>
  );
}

/* ───────── board ───────── */
function Board({ t }: { t: BeansTheme }) {
  const boardRef = useRef<HTMLDivElement>(null);
  const [idx, setIdx] = useState(0);
  useFitToViewport(boardRef);

  // Auto-rotate pages.
  useEffect(() => {
    if (t.view !== "paged" || !t.autoRotate) return;
    const id = setTimeout(() => setIdx((p) => (p + 1) % PAGES.length), (t.pageSecs || 10) * 1000);
    return () => clearTimeout(id);
  }, [idx, t.view, t.autoRotate, t.pageSecs]);

  const paged = t.view === "paged";
  const style = { ...boardVars(t), "--page-dur": (t.pageSecs || 10) + "s" } as CSSProperties;

  return (
    <div
      ref={boardRef}
      id="board"
      className={`lay-columns ${t.panel ? "panel-on" : ""} ${t.motion ? "motion-on anim-on" : ""} ${
        paged && t.autoRotate ? "rotating" : ""
      }`}
      style={style}
    >
      <img className="bg" src="/assets/bg.png" alt="" />
      {t.panel && <div className="paper" />}
      {t.flourish && <BrandArcs />}
      {t.motion && <div className="sweep" />}
      <div className="inner">
        <header className="masthead">
          <div className="legend">
            <span className="lg">
              <span className="dot M" />
              Medium
            </span>
            <span className="lg">
              <span className="dot D" />
              Dark
            </span>
          </div>
          <div className="steam" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </div>
          <img className="logo" src="/assets/logo.webp" alt="Castro Coffee Company" />
          <div className="tagline">
            <span className="tx">Coffee Beans · By the Pound</span>
          </div>
          {t.clock && <Clock />}
        </header>

        {paged ? (
          <>
            <PagedView idx={idx} />
            <Pager idx={idx} go={setIdx} />
          </>
        ) : (
          <div className="grid beans">
            {COLUMNS.map((group, ci) => (
              <div className="col" key={ci}>
                {group.map((name) => (
                  <BeanSection key={name} name={name} featured={name === "Rare & Reserve"} />
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const ACCENTS = ["#95652E", "#5A3A22", "#A0451F", "#6E5A2B"];

export default function BeansBoard() {
  const [t, setTweak] = useTweaks(BEANS_DEFAULTS, "castro.beans");
  return (
    <div id="stage">
      <Board t={t} />
      <BoardSwitch href="/" label="Drinks Menu" />
      <TweaksPanel onReset={() => setTweak(BEANS_DEFAULTS)}>
        <TweakSection label="Display" />
        <TweakRadio
          label="View"
          value={t.view}
          options={["paged", "full"]}
          onChange={(v) => setTweak("view", v as BeansTheme["view"])}
        />
        <TweakToggle label="Auto-rotate" value={t.autoRotate} onChange={(v) => setTweak("autoRotate", v)} />
        <TweakSlider label="Seconds / page" value={t.pageSecs} min={5} max={20} step={1} onChange={(v) => setTweak("pageSecs", v)} />
        <TweakSection label="Typography" />
        <TweakSelect
          label="Type pairing"
          value={t.typePair}
          options={Object.keys(TYPE_PAIRS).map((k) => ({ value: k, label: TYPE_PAIRS[k as keyof typeof TYPE_PAIRS].label }))}
          onChange={(v) => setTweak("typePair", v as BeansTheme["typePair"])}
        />
        <TweakSection label="Text sizes" />
        <TweakSlider label="Headers" value={t.fsHeader} min={0.7} max={1.4} step={0.02} onChange={(v) => setTweak("fsHeader", v)} />
        <TweakSlider label="Items" value={t.fsItem} min={0.7} max={1.4} step={0.02} onChange={(v) => setTweak("fsItem", v)} />
        <TweakSlider label="Labels" value={t.fsLabel} min={0.7} max={1.4} step={0.02} onChange={(v) => setTweak("fsLabel", v)} />
        <TweakSlider label="Notes" value={t.fsNote} min={0.7} max={1.4} step={0.02} onChange={(v) => setTweak("fsNote", v)} />
        <TweakSection label="Accent" />
        <TweakColor label="Accent tone" value={t.accent} options={ACCENTS} onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Finish" />
        <TweakToggle label="Paper wash" value={t.panel} onChange={(v) => setTweak("panel", v)} />
        <TweakToggle label="Live clock" value={t.clock} onChange={(v) => setTweak("clock", v)} />
        <TweakToggle label="Flourishes" value={t.flourish} onChange={(v) => setTweak("flourish", v)} />
        <TweakToggle label="Ambient motion" value={t.motion} onChange={(v) => setTweak("motion", v)} />
      </TweaksPanel>
    </div>
  );
}
