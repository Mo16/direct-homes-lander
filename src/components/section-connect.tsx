"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { useAnimationFrame, useInView, useReducedMotion } from "motion/react";
import { siBarclays, siChase, siGooglesheets, siHsbc, siMonzo, siRevolut, siStarlingbank, siStripe } from "simple-icons";
import { LogoMark } from "./logo";
import { Column } from "./ui";

/*
 * What DirectHomes connects to, as an orbit: the DirectHomes mark sits on the horizon like a rising sun, and real
 * marks travel the arcs above it. Only what is true in v1 (spec section 11): rent runs on Stripe (Pay by Bank and Bacs
 * Direct Debit, paid out to the landlord's own bank), tenants pay from their own UK bank, and tax-year exports open in a
 * spreadsheet. Accounting integrations (Xero, QuickBooks) are roadmap, so they are not shown. Each mark is its
 * company's own (Simple Icons), drawn in one quiet tone; under the pointer it takes its brand colour and the orbit slows.
 */

/** The stage is drawn at this size and scaled to the column; on phones it stops shrinking and crops at the sides. */
const DW = 1200;
const DH = 540;
const CX = DW / 2;
const CY = DH - 44;
/** How far below the horizon a mark travels before it wraps round, so it always leaves and arrives under the fade. */
const DIP = 0.28;
const SPAN = Math.PI + DIP * 2;

type Mark = { name: string; path: string; hex: string };
const mark = (icon: { title: string; path: string; hex: string }, name = icon.title): Mark => ({ name, path: icon.path, hex: `#${icon.hex}` });

/** Each ring: its radius, how long one mark takes to cross the sky (seconds), which way it turns, and its marks. */
const RINGS: { r: number; secs: number; dir: 1 | -1; marks: Mark[] }[] = [
  { r: 180, secs: 54, dir: 1, marks: [mark(siStripe), mark(siGooglesheets)] },
  { r: 310, secs: 78, dir: -1, marks: [mark(siBarclays), mark(siMonzo), mark(siHsbc)] },
  { r: 440, secs: 100, dir: 1, marks: [mark(siStarlingbank, "Starling"), mark(siChase), mark(siRevolut)] },
];

/** Where a mark sits at time `t`: marks on a ring are spread evenly across its arc, offset by half a gap so they start balanced. */
function place(ring: (typeof RINGS)[number], i: number, t: number) {
  const n = ring.marks.length;
  const u = (((i + 0.5) / n + t / ring.secs) % 1 + 1) % 1;
  const a = ring.dir === 1 ? Math.PI + DIP - u * SPAN : -DIP + u * SPAN;
  return { x: CX + ring.r * Math.cos(a), y: CY - ring.r * Math.sin(a) };
}

const at = (p: { x: number; y: number }) => `translate(${p.x.toFixed(1)}px, ${p.y.toFixed(1)}px) translate(-50%, -50%)`;

const CAPTIONS = [
  { title: "Rent through Stripe", text: "Pay by Bank and Direct Debit run on Stripe, which pays the rent out to your own bank account." },
  { title: "The tenant’s own bank", text: "Pay by Bank opens their banking app to approve. Direct Debit is set up once and runs every month." },
  { title: "Your spreadsheet", text: "Each tax year downloads as files that open in Excel, Numbers or Google Sheets, ready for your accountant." },
];

export function SectionConnect() {
  const frame = useRef<HTMLDivElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const items = useRef<(HTMLLIElement | null)[]>([]);
  const seen = useInView(stage, { margin: "100px" });
  const still = useReducedMotion();
  const [scale, setScale] = useState(1);

  // Scale the stage to the column, but never below 0.62 so the marks stay legible on phones (the sides crop instead).
  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(Math.min(1, Math.max(0.62, e.contentRect.width / DW))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // The orbit's own clock: it only runs while on screen, and eases down to a crawl under the pointer.
  const clock = useRef({ t: 0, pace: 1, slow: false });
  useAnimationFrame((_, delta) => {
    if (!seen || still) return;
    const c = clock.current;
    c.pace += ((c.slow ? 0.12 : 1) - c.pace) * Math.min(1, delta / 260);
    c.t += (Math.min(delta, 64) / 1000) * c.pace;
    let k = 0;
    for (const ring of RINGS) {
      ring.marks.forEach((_, i) => {
        const el = items.current[k++];
        if (el) el.style.transform = at(place(ring, i, c.t));
      });
    }
  });

  let k = 0;
  return (
    <section id="connect" aria-labelledby="connect-title" className="pt-24 sm:pt-32">
      <Column>
        <div className="mx-auto max-w-[60rem] text-center">
          <h2 id="connect-title" className="text-[clamp(28px,3.8vw,52px)] leading-[1.06] tracking-[-0.03em] text-ink">
            Connects to what you already use.
          </h2>
          <p className="mx-auto mt-4 max-w-[34rem] text-[17px] leading-[1.55] text-ink-2">Tenants pay from their own bank, Stripe pays you out to yours, and every tax year opens in your spreadsheet.</p>
        </div>

        {/* The orbit. Drawn at DW x DH and scaled; the frame crops its sides on narrow screens and fades them out. */}
        <div
          ref={frame}
          className="relative mt-6 overflow-hidden sm:mt-4 max-lg:[mask-image:linear-gradient(to_right,transparent,rgb(0_0_0/0.25)_4%,rgb(0_0_0/0.6)_9%,rgb(0_0_0/0.88)_14%,#000_19%,#000_81%,rgb(0_0_0/0.88)_86%,rgb(0_0_0/0.6)_91%,rgb(0_0_0/0.25)_96%,transparent)]"
          style={{ height: DH * scale }}
        >
          <div
            ref={stage}
            onPointerEnter={() => (clock.current.slow = true)}
            onPointerLeave={() => (clock.current.slow = false)}
            className="absolute top-0 left-1/2 origin-top"
            style={{ width: DW, height: DH, transform: `translateX(-50%) scale(${scale})` }}
          >
            {/* Rings and marks fade into the page at the horizon, so marks rise out of it and sink back in. */}
            <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,#000_48%,rgb(0_0_0/0.9)_58%,rgb(0_0_0/0.74)_66%,rgb(0_0_0/0.54)_73%,rgb(0_0_0/0.34)_79%,rgb(0_0_0/0.2)_84%,rgb(0_0_0/0.1)_88%,rgb(0_0_0/0.04)_92%,rgb(0_0_0/0.01)_96%,transparent))]">
              <svg aria-hidden viewBox={`0 0 ${DW} ${DH}`} width={DW} height={DH} className="absolute inset-0 overflow-visible">
                {[...RINGS].reverse().map((ring) => (
                  <circle key={ring.r} cx={CX} cy={CY} r={ring.r} className="fill-white/15 max-lg:fill-transparent" stroke="rgb(20 20 20 / 0.09)" strokeWidth={1.25} />
                ))}
              </svg>

              <ul aria-label="Works with" className="absolute inset-0">
                {RINGS.map((ring) =>
                  ring.marks.map((m, i) => {
                    const n = k++;
                    return (
                      <li
                        key={m.name}
                        ref={(el) => {
                          items.current[n] = el;
                        }}
                        className="group absolute top-0 left-0 flex w-24 flex-col items-center gap-2 will-change-transform"
                        style={{ transform: at(place(ring, i, 0)) }}
                      >
                        <svg viewBox="0 0 24 24" aria-hidden className="size-9 fill-ink-2 transition-[fill] duration-300 group-hover:fill-[var(--brand)]" style={{ "--brand": m.hex } as React.CSSProperties}>
                          <path d={m.path} />
                        </svg>
                        <span className="text-[14px] leading-none whitespace-nowrap text-muted transition-colors duration-300 group-hover:text-ink">{m.name}</span>
                      </li>
                    );
                  }),
                )}
              </ul>
            </div>

            {/* The sun on the horizon: DirectHomes itself, outside the fade so it stays whole. */}
            <div className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center" style={{ left: CX, top: CY - 18 }}>
              <LogoMark className="size-14 text-ink" />
              <span className="sr-only">DirectHomes</span>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-6 grid max-w-[72rem] gap-x-10 gap-y-6 text-center sm:mt-8 lg:grid-cols-3">
          {CAPTIONS.map((c) => (
            <div key={c.title} className="px-1">
              <p className="text-[17px] text-ink">{c.title}</p>
              <p className="mx-auto mt-1.5 max-w-[24rem] text-[15px] leading-[1.5] text-ink-2">{c.text}</p>
            </div>
          ))}
        </div>
      </Column>
    </section>
  );
}
