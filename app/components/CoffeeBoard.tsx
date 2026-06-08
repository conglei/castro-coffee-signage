"use client";

// Castro Coffee Company — drinks board (left TV).
// Ported from the design handoff (menu-app.jsx), with the final tweak values
// baked in and the design-time Tweaks panel removed.

import { useEffect, useRef, useState } from "react";
import { MENU, type Menu, type Section, type MenuItem } from "../lib/menuData";
import { BrandArcs, Clock, boardVars, useFitToViewport, TYPE_PAIRS, type Theme } from "./boardChrome";
import { useTweaks } from "../lib/useTweaks";
import { TweaksPanel } from "./tweaks/TweaksPanel";
import { TweakSection, TweakRadio, TweakSelect, TweakSlider, TweakColor, TweakToggle } from "./tweaks/controls";
import { BoardSwitch } from "./BoardSwitch";
import { RefreshButton } from "./RefreshButton";

interface DrinksTheme extends Theme {
  layout: "columns" | "featured" | "framed";
  ticker: boolean;
}

// Final look chosen during the design session — used as the default/reset state.
const DRINKS_DEFAULTS: DrinksTheme = {
  layout: "columns",
  typePair: "playfair",
  accent: "#95652E",
  fsHeader: 1,
  fsItem: 1,
  fsLabel: 1,
  fsNote: 1,
  panel: true,
  clock: true,
  ticker: true,
  flourish: true,
  motion: true,
};

const money = (n: number) => n.toFixed(2);

const FEATURES = [
  { name: "Kopi Luwak", note: "The world's rarest pour", price: "$39" },
  { name: "Caramel Macchiato", note: "Vanilla, espresso & caramel", price: "from $5.50" },
  { name: "Cold Brew", note: "Slow-steeped 18 hours", price: "from $5.00" },
  { name: "Iced Matcha Latte", note: "Stone-ground ceremonial", price: "from $5.75" },
  { name: "Geisha Esmeralda", note: "Floral, single origin", price: "$15" },
  { name: "Vietnamese Iced Coffee", note: "Sweet, bold, condensed milk", price: "from $5.75" },
];

function FeatureTicker({ rotate }: { rotate: boolean }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (!rotate) return;
    const id = setInterval(() => setI((p) => (p + 1) % FEATURES.length), 4400);
    return () => clearInterval(id);
  }, [rotate]);
  const f = FEATURES[i];
  return (
    <div className="ticker">
      <span className="tk-label">Featured today</span>
      <div className="tk-item" key={i}>
        <span className="tk-name">{f.name}</span>
        <span className="tk-sep">—</span>
        <span className="tk-note">{f.note}</span>
        <span className="tk-price">{f.price}</span>
      </div>
    </div>
  );
}

/* ───────── price helpers ───────── */
function AlignedHeader({ sizes }: { sizes: string[] }) {
  return (
    <div className="row head">
      <span className="nm" />
      <span className="prices" data-cols={sizes.length}>
        {sizes.map((s) => (
          <span key={s} className="ph">
            {s}
          </span>
        ))}
      </span>
    </div>
  );
}

function AlignedRow({ item, sizes }: { item: MenuItem; sizes: string[] }) {
  return (
    <div className="row">
      <span className="nm">{item.name}</span>
      <span className="prices" data-cols={sizes.length}>
        {sizes.map((s) => (
          <span key={s} className="pv">
            {money(item.prices![s])}
          </span>
        ))}
      </span>
    </div>
  );
}

function InlineRow({ item }: { item: MenuItem }) {
  // Item with its own (possibly unique) size set, shown as pairs.
  const entries = Object.entries(item.prices ?? {});
  return (
    <div className="row inline">
      <span className="nm">{item.name}</span>
      <span className="pairs">
        {entries.map(([s, p]) => (
          <span key={s} className="pair">
            <em>{s}</em>
            {money(p)}
          </span>
        ))}
      </span>
    </div>
  );
}

function LeaderRow({ item }: { item: MenuItem }) {
  return (
    <div className="row leader">
      <span className="nm">
        {item.name}
        {item.tag && <span className="tag">{item.tag}</span>}
      </span>
      <span className="solo">${money(item.price!)}</span>
    </div>
  );
}

function DescRow({ item }: { item: MenuItem }) {
  return (
    <div className="row desc-row">
      <span className="nm">{item.name}</span>
      {item.desc && <span className="sub">{item.desc}</span>}
    </div>
  );
}

/* ───────── section renderer ───────── */
function SectionView({ s }: { s: Section }) {
  const featured = s.featured;
  let body: React.ReactNode;

  if (s.flavors && s.uniform) {
    const sizes = s.sizes ?? [];
    const uniform = s.uniform;
    body = (
      <>
        <div className="row head">
          <span className="nm">All flavors</span>
          <span className="prices">
            {sizes.map((z) => (
              <span key={z} className="ph">
                {z}
              </span>
            ))}
          </span>
        </div>
        <div className="row uniform">
          <span className="nm muted-it">Choose your flavor</span>
          <span className="prices">
            {sizes.map((z) => (
              <span key={z} className="pv">
                {money(uniform[z])}
              </span>
            ))}
          </span>
        </div>
        <div className="flavors">
          {s.flavors.map((f) => (
            <span key={f} className="flv">
              {f}
            </span>
          ))}
        </div>
      </>
    );
  } else if (s.id === "exotic") {
    body = <div className="items">{(s.items ?? []).map((it) => <LeaderRow key={it.name} item={it} />)}</div>;
  } else if (s.id === "refreshers") {
    body = (
      <div className="items">
        {s.desc && <p className="sec-desc">{s.desc}</p>}
        {(s.items ?? []).map((it) => (
          <DescRow key={it.name} item={it} />
        ))}
      </div>
    );
  } else if (s.sizes && (s.items ?? []).every((it) => it.prices && s.sizes!.every((z) => it.prices![z] != null))) {
    // Uniform aligned columns.
    const sizes = s.sizes;
    body = (
      <div className="items">
        <AlignedHeader sizes={sizes} />
        {(s.items ?? []).map((it) => (
          <AlignedRow key={it.name} item={it} sizes={sizes} />
        ))}
      </div>
    );
  } else {
    // Inline pairs (mixed sizes, e.g. Matcha).
    body = <div className="items">{(s.items ?? []).map((it) => <InlineRow key={it.name} item={it} />)}</div>;
  }

  return (
    <section className={"sec" + (featured ? " featured" : "")} data-id={s.id}>
      <header className="sec-h">
        <h2>{s.title}</h2>
        {s.note && <span className="note">{s.note}</span>}
      </header>
      {body}
      {s.addOns && (
        <div className="addons">
          {s.addOns.map((a) => (
            <span key={a.name} className="addon">
              {a.name} <strong>+${money(a.price)}</strong>
            </span>
          ))}
        </div>
      )}
    </section>
  );
}

/* ───────── columns ───────── */
const COLS = ["colA", "colB", "colC", "colD"] as const;

/* Featured layout: exotic band across top, rest in 4 balanced columns. */
function FeaturedLayout({ menu }: { menu: Menu }) {
  const byId: Record<string, Section> = {};
  COLS.forEach((c) => menu[c].forEach((s) => (byId[s.id] = s)));
  const exotic = byId["exotic"];
  const cols: Section[][] = [
    [byId["fresh"], byId["turkish"], byId["hot-chocolate"]],
    menu.colB,
    menu.colC,
    [byId["cold-brew"], byId["matcha"], byId["vietnamese"], byId["refreshers"]],
  ];
  return (
    <>
      <div className="exotic-band">
        <div className="eb-head">
          <h2>Exotic Hand Made Drip</h2>
          <span className="note">12 oz only · single origin</span>
        </div>
        <div className="eb-items">
          {(exotic.items ?? []).map((it) => (
            <div className="eb-item" key={it.name}>
              <span className="nm">
                {it.name}
                {it.tag && <span className="tag">{it.tag}</span>}
              </span>
              <span className="solo">${money(it.price!)}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="grid grid-3plus">
        {cols.map((group, i) => (
          <div className="col" key={i}>
            {group.map((s) => (
              <SectionView key={s.id} s={s} />
            ))}
          </div>
        ))}
      </div>
    </>
  );
}

function Board({ t, menu }: { t: DrinksTheme; menu: Menu }) {
  const boardRef = useRef<HTMLDivElement>(null);
  useFitToViewport(boardRef);

  return (
    <div
      ref={boardRef}
      id="board"
      className={`lay-${t.layout} ${t.panel ? "panel-on" : ""} ${t.motion ? "motion-on" : ""}`}
      style={boardVars(t)}
    >
      <img className="bg" src="/assets/bg.png" alt="" />
      {t.panel && <div className="paper" />}
      {t.flourish && <BrandArcs />}
      {t.motion && <div className="sweep" />}
      <div className="inner">
        <header className="masthead">
          <div className="steam" aria-hidden="true">
            <i></i>
            <i></i>
            <i></i>
            <i></i>
          </div>
          <img className="logo" src="/assets/logo.webp" alt="Castro Coffee Company" />
          <div className="tagline">
            <span className="tx">Fresh Brewed · Espresso · Specialties</span>
          </div>
          {t.clock && <Clock />}
        </header>

        {t.layout === "featured" ? (
          <FeaturedLayout menu={menu} />
        ) : (
          <div className="grid">
            {COLS.map((c) => (
              <div className="col" key={c}>
                {menu[c].map((s) => (
                  <SectionView key={s.id} s={s} />
                ))}
              </div>
            ))}
          </div>
        )}
        {t.ticker && <FeatureTicker rotate={t.motion} />}
      </div>
    </div>
  );
}

const ACCENTS = ["#95652E", "#5A3A22", "#A0451F", "#6E5A2B"];

export default function CoffeeBoard() {
  const [t, setTweak] = useTweaks(DRINKS_DEFAULTS, "castro.drinks");
  const [menu, setMenu] = useState<Menu>(MENU);
  return (
    <div id="stage">
      <Board t={t} menu={menu} />
      <RefreshButton<Menu> board="drinks" onData={setMenu} />
      <BoardSwitch href="/beans" label="Coffee Beans" />
      <TweaksPanel onReset={() => setTweak(DRINKS_DEFAULTS)}>
        <TweakSection label="Layout direction" />
        <TweakRadio
          label="Arrangement"
          value={t.layout}
          options={["columns", "featured", "framed"]}
          onChange={(v) => setTweak("layout", v as DrinksTheme["layout"])}
        />
        <TweakSection label="Typography" />
        <TweakSelect
          label="Type pairing"
          value={t.typePair}
          options={Object.keys(TYPE_PAIRS).map((k) => ({ value: k, label: TYPE_PAIRS[k as keyof typeof TYPE_PAIRS].label }))}
          onChange={(v) => setTweak("typePair", v as DrinksTheme["typePair"])}
        />
        <TweakSection label="Text sizes" />
        <TweakSlider label="Headers" value={t.fsHeader} min={0.7} max={1.35} step={0.02} onChange={(v) => setTweak("fsHeader", v)} />
        <TweakSlider label="Items" value={t.fsItem} min={0.7} max={1.35} step={0.02} onChange={(v) => setTweak("fsItem", v)} />
        <TweakSlider label="Labels" value={t.fsLabel} min={0.7} max={1.35} step={0.02} onChange={(v) => setTweak("fsLabel", v)} />
        <TweakSlider label="Notes" value={t.fsNote} min={0.7} max={1.35} step={0.02} onChange={(v) => setTweak("fsNote", v)} />
        <TweakSection label="Accent" />
        <TweakColor label="Accent tone" value={t.accent} options={ACCENTS} onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Finish" />
        <TweakToggle label="Paper wash" value={t.panel} onChange={(v) => setTweak("panel", v)} />
        <TweakToggle label="Live clock" value={t.clock} onChange={(v) => setTweak("clock", v)} />
        <TweakToggle label="Featured ticker" value={t.ticker} onChange={(v) => setTweak("ticker", v)} />
        <TweakToggle label="Flourishes" value={t.flourish} onChange={(v) => setTweak("flourish", v)} />
        <TweakToggle label="Ambient motion" value={t.motion} onChange={(v) => setTweak("motion", v)} />
      </TweaksPanel>
    </div>
  );
}
