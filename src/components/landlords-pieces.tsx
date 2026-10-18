"use client";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Add01Icon, Alert02Icon, ArrowUpRight01Icon, CheckmarkCircle02Icon, Clock01Icon, MinusSignCircleIcon, Upload04Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Choice } from "./choice";
import { Icon } from "./icon";
import { SetupCards } from "./setup-cards";
import { Count, exact } from "./tour-kit";
import { Column, SectionHead } from "./ui";
import { StartLink } from "./start-link";
import { PAGES } from "@/lib/pages";
import { cn } from "@/lib/utils";

/*
 * The For landlords page's own pieces:
 * - Certificates, home by home: the app's Documents → Compliance page (webapp app/(landlord)/documents/compliance),
 *   for four of the demo homes on 17 Oct 2026. "Health by property" picks the home, as it filters the page in the app,
 *   and its items show with the app's own labels, dates, reminder lines, health score and next step
 *   (domain/compliance.ts, features/compliance/rules.ts).
 * - Setting up: the getting-started cards (setup-cards.tsx) under this page's own heading.
 * - Free or Advanced: the plan for the number of homes you let, in plain words, and what reaches you from £1,000 of
 *   rent paid by bank. The full comparison is on Pricing.
 */

/* ---------- Certificates, home by home ---------- */

type State = "valid" | "expiring" | "expired" | "missing" | "na";
type Item = {
  label: string;
  /** The tenancy's tenants, for items that belong to a tenancy. */
  who?: string;
  state: State;
  /** Expiry for certificates, the deadline for one-off checks. */
  due?: string;
  done?: string;
  na?: string;
  /** Reminder days before expiry, or a fixed line for the one-off checks. */
  days?: number[];
  line?: string;
  last?: string;
  epc?: string;
  action?: string;
};
type Home = { title: string; town: string; items: Item[] };

const TODAY = "2026-10-17";
const fmt = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
const day = (iso: string) => fmt.format(new Date(`${iso}T00:00:00Z`));
const minus = (iso: string, days: number) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
};

const STATUS: Record<State, { label: string; icon: IconSvgElement; tone: string }> = {
  valid: { label: "Valid", icon: CheckmarkCircle02Icon, tone: "text-good" },
  expiring: { label: "Expiring", icon: Clock01Icon, tone: "text-warn" },
  expired: { label: "Expired", icon: Alert02Icon, tone: "text-bad" },
  missing: { label: "Missing", icon: Alert02Icon, tone: "text-bad" },
  na: { label: "Not applicable", icon: MinusSignCircleIcon, tone: "text-muted" },
};
const ORDER: State[] = ["expired", "missing", "expiring", "valid", "na"];

const gas = (due: string, extra: Partial<Item> = {}): Item => ({ label: "Gas safety record", state: "valid", due, days: [60, 30, 7], ...extra });
const eicr = (due: string): Item => ({ label: "EICR", state: "valid", due, days: [60, 30, 7] });
const epc = (due: string, rating?: string): Item => ({
  label: "EPC",
  state: "valid",
  due,
  days: [90, 60, 30],
  epc: rating ? (["D", "E", "F", "G"].includes(rating) ? `Rated ${rating}. Private rentals need at least C from 1 October 2030.` : `Rated ${rating}. Meets the C minimum due from 1 October 2030.`) : undefined,
});
const smoke = (who: string, done: string): Item => ({ label: "Smoke and CO alarm check", who, state: "valid", done });
const deposit = (who: string, done: string): Item => ({ label: "Deposit protection", who, state: "valid", done });
const noLicence: Item = { label: "HMO or selective licence", state: "na", na: "No licence recorded" };
const prs: Item = { label: "PRS Database registration", state: "missing", due: "2027-11-14", line: "Reminders when the database opens, then 60 and 30 days before the deadline", last: undefined, action: "Add PRS reference" };

const HOMES: Home[] = [
  {
    title: "26 Headingley Mount",
    town: "Leeds",
    items: [
      gas("2027-08-14"),
      eicr("2030-03-21"),
      epc("2033-07-05", "B"),
      { label: "HMO or selective licence", state: "valid", due: "2027-09-30", days: [90, 60, 30] },
      smoke("Freya Lindqvist and 3 others", "2026-09-29"),
      { label: "Deposit protection", who: "Freya Lindqvist and 3 others", state: "missing", due: "2026-10-29", line: "Reminders on days 20 and 28 after the deposit is received", action: "Upload deposit certificate" },
      prs,
    ],
  },
  {
    title: "15 St Leonard's Road",
    town: "Exeter",
    items: [
      gas("2026-10-26", { state: "expiring", last: "2026-09-26", action: "Upload new gas safety record" }),
      eicr("2028-02-02"),
      epc("2029-05-09", "D"),
      noLicence,
      smoke("Peter Lowe", "2024-11-04"),
      deposit("Peter Lowe", "2024-11-20"),
      prs,
    ],
  },
  {
    title: "Flat 2, 14 Royal York Crescent",
    town: "Bristol",
    items: [gas("2027-03-03"), eicr("2029-06-12"), epc("2031-01-20", "C"), noLicence, smoke("Nina Kowalski", "2025-09-01"), deposit("Nina Kowalski", "2025-08-18"), prs],
  },
  {
    title: "33 Pontcanna Street",
    town: "Cardiff",
    items: [gas("2027-02-11"), eicr("2030-04-30"), epc("2032-12-02"), noLicence, smoke("Rhys Morgan", "2025-10-05"), deposit("Rhys Morgan", "2025-10-24"), { label: "PRS Database registration", state: "na", na: "England only" }],
  },
];

/** The app's health score: valid counts fully, expiring half, expired and missing nothing. */
function health(h: Home) {
  const on = h.items.filter((i) => i.state !== "na");
  return Math.round((on.reduce((t, i) => t + (i.state === "valid" ? 1 : i.state === "expiring" ? 0.5 : 0), 0) / on.length) * 100);
}
const PORTFOLIO = Math.round(HOMES.reduce((t, h) => t + health(h), 0) / HOMES.length);
const count = (h: Home, ...s: State[]) => h.items.filter((i) => s.includes(i.state)).length;
const items = (n: number) => `${n} ${n === 1 ? "item" : "items"}`;

/** When an item is done or due, as the app words it (complianceWhen). */
function when(i: Item) {
  if (i.na) return i.na;
  if (i.done) return `Done ${day(i.done)}`;
  if (!i.due) return "No record yet";
  return i.days ? `Valid until ${day(i.due)}` : `Due by ${day(i.due)}`;
}

/** The reminder line under an item that is still waiting on something: the schedule, the last sent and the next. */
function reminders(i: Item) {
  if (!i.due || i.done || i.state === "na") return null;
  let next: string | undefined;
  let summary = i.line;
  if (i.days) {
    const d = [...i.days];
    summary = `Reminders ${d.slice(0, -1).join(", ")} and ${d.at(-1)} days before expiry`;
    next = d.map((n) => minus(i.due!, n)).find((on) => on > TODAY);
  } else if (i.label === "PRS Database registration") next = "2026-12-15";
  else if (i.label === "Deposit protection") next = [10, 2].map((n) => minus(i.due!, n)).find((on) => on > TODAY);
  return `${summary}${i.last ? `. Last sent ${day(i.last)}` : ""}${next ? `. Next ${day(next)}` : ""}`;
}

function Hatched({ value }: { value: number }) {
  return (
    <span className="hatch relative block h-3 w-full overflow-hidden rounded-[2px]">
      <span className="absolute inset-y-0 left-0 rounded-[2px] bg-accent-fill transition-[width] duration-500" style={{ width: `${value}%` }} />
    </span>
  );
}

export function SectionCertificates() {
  const [pick, setPick] = useState(0);
  const still = useReducedMotion();
  const home = HOMES[pick];
  const shown = [...home.items].sort((a, b) => ORDER.indexOf(a.state) - ORDER.indexOf(b.state));

  return (
    <section id="certificates" aria-labelledby="certificates-title" className="scroll-mt-16 pt-24 sm:scroll-mt-20 sm:pt-32">
      <Column>
        <SectionHead
          id="certificates-title"
          title={
            <>
              Every certificate,
              <br />
              home by home.
            </>
          }
          text="Each home gets its own checklist from its nation, its gas supply and its licence. You’re reminded well before anything runs out, and the home that needs you most sits at the top."
        />

        <div className="brand-wash mt-10 rounded-panel p-2 sm:p-6 lg:mt-14 lg:p-10">
          {/* The app's Compliance page, for the four homes. */}
          <div className="rounded-[10px] bg-canvas p-2 text-ink shadow-[0_1px_2px_rgb(20_20_20/0.1),0_24px_40px_-28px_rgb(30_28_40/0.5)]">
            <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3 px-3 pt-3 pb-4 sm:px-4 sm:pt-4">
              <div>
                <p className="text-[24px] leading-tight sm:text-[28px]">
                  Documents<span className="mx-2.5 text-faint">&mdash;</span>Compliance
                </p>
                <p className="mt-1 max-w-[36rem] text-[13.5px] leading-snug text-muted">Suggested documents only. DirectHomes does not give legal advice and cannot guarantee compliance.</p>
              </div>
              <span aria-hidden className="inline-flex h-10 items-center gap-2 rounded-control bg-ink px-4 text-[14px] text-white">
                <Icon icon={Add01Icon} size={17} />
                Upload document
              </span>
            </div>

            <div className="grid gap-2 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              {/* Health by property: the control. Each home filters the page, as it does in the app. */}
              <div className="flex flex-col gap-2 lg:sticky lg:top-24 lg:self-start">
              <div className="panel p-4 sm:p-5">
                <div className="rounded-tile bg-surface p-4">
                  <p className="text-[13px] text-muted">Portfolio health</p>
                  <p className="mt-1.5 text-[34px] leading-none font-light tabular">{PORTFOLIO}%</p>
                  <p className="mt-1.5 text-[12.5px] text-muted">Valid counts fully, expiring half</p>
                  <span className="mt-3 block">
                    <Hatched value={PORTFOLIO} />
                  </span>
                </div>
              </div>
              <div className="panel p-4 sm:p-5">
                <p className="text-[17px] leading-tight">Health by property</p>
                <p className="mt-1 text-[13px] text-muted">Lowest first.</p>
                <div role="radiogroup" aria-label="Show a property's items" className="mt-4 flex flex-col gap-2">
                  {HOMES.map((h, i) => {
                    const fix = count(h, "expired", "missing");
                    const soon = count(h, "expiring");
                    const on = i === pick;
                    return (
                      <button
                        key={h.title}
                        type="button"
                        role="radio"
                        aria-checked={on}
                        onClick={() => setPick(i)}
                        className={cn("flex flex-col gap-2.5 rounded-tile px-4 py-3 text-left transition-colors duration-300", on ? "bg-accent-soft" : "bg-surface hover:bg-lift")}
                      >
                        <span className="flex items-baseline justify-between gap-3">
                          <span className="min-w-0 truncate text-[14.5px] text-ink">{h.title}</span>
                          <span className="shrink-0 text-[14px] text-ink tabular">{health(h)}%</span>
                        </span>
                        <Hatched value={health(h)} />
                        <span className="text-[12.5px] text-muted">
                          {h.town} · {fix ? `${items(fix)} to fix` : soon ? `${items(soon)} expiring` : "Up to date"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
              </div>

              {/* The picked home's items, most urgent first. */}
              <div aria-live="polite" className="panel min-h-[560px] p-4 sm:p-5">
                <div className="flex items-baseline justify-between gap-3 px-1">
                  <p className="min-w-0 text-[15px]">
                    {home.title}
                    <span className="text-muted">, {home.town}</span>
                  </p>
                  <span className="shrink-0 text-[13px] text-muted tabular">{health(home)}% health</span>
                </div>
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.ul
                    key={home.title}
                    initial={still ? false : { y: 8 }}
                    animate={{ y: 0 }}
                    exit={still ? undefined : { opacity: 0, transition: { duration: 0.12 } }}
                    transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
                    className="mt-3 flex flex-col gap-1.5"
                  >
                    {shown.map((it) => {
                      const s = STATUS[it.state];
                      const r = reminders(it);
                      return (
                        <li key={it.label} className="flex flex-col gap-2.5 rounded-tile bg-surface px-4 py-3 sm:flex-row sm:items-center sm:gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-[14.5px] text-ink">
                              {it.label}
                              {it.who ? <span className="text-muted"> · {it.who}</span> : null}
                            </p>
                            <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{when(it)}</p>
                            {r ? <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{r}</p> : null}
                            {it.epc ? <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{it.epc}</p> : null}
                          </div>
                          <div className="flex shrink-0 flex-wrap items-center gap-x-3 gap-y-2 sm:flex-col sm:items-end">
                            <span className={cn("inline-flex items-center gap-1.5 text-[13.5px] whitespace-nowrap", s.tone)}>
                              <Icon icon={s.icon} size={16} />
                              {s.label}
                            </span>
                            {it.action ? (
                              <span aria-hidden className="inline-flex h-8 items-center gap-1.5 rounded-control bg-white px-3 text-[13px] whitespace-nowrap text-ink">
                                <Icon icon={it.label === "PRS Database registration" ? Add01Icon : Upload04Icon} size={15} />
                                {it.action}
                              </span>
                            ) : null}
                          </div>
                        </li>
                      );
                    })}
                  </motion.ul>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 px-1 text-[13px] leading-[1.55] text-muted">
          Checklists are written for England in full. Homes in Wales, Scotland and Northern Ireland get the general tracker. The PRS Database opens by region from 15 December 2026.
        </p>
      </Column>
    </section>
  );
}

/* ---------- Setting up ---------- */

export function SectionLandlordSetup() {
  return (
    <section aria-labelledby="setup-title" className="pt-24 sm:pt-32">
      <Column>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-end lg:gap-16">
          <h2 id="setup-title" className="text-[clamp(28px,3.8vw,52px)] leading-[1.06] tracking-[-0.03em] text-ink">
            Your first home,
            <br />
            set up in one sitting.
          </h2>
          <div className="lg:pb-1">
            <p className="text-[17px] leading-[1.55] text-ink-2">Find it by postcode, set the rent and invite your tenants. Photos and documents can come later.</p>
            <StartLink arrow={17} className="group mt-5 inline-flex h-11 items-center gap-2 rounded-control bg-ink pr-4 pl-5 text-[15px] text-white transition-colors hover:bg-ink-hover" />
          </div>
        </div>
        <div className="mt-10 lg:mt-14">
          <SetupCards />
        </div>
      </Column>
    </section>
  );
}

/* ---------- Free or Advanced ---------- */

type Size = "one" | "few" | "many";
const SIZES = [
  { value: "one", label: "One home" },
  { value: "few", label: "Two to ten" },
  { value: "many", label: "More than ten" },
] as const;

const RENT = 100000;
const STRIPE_PAY_BY_BANK = 500;

const PLAN: Record<Size, { name: string; price: string; per: string; homes: string; fee: string; staff: string; bps: number; words: string }> = {
  one: {
    name: "Free",
    price: "£0",
    per: "for ever",
    homes: "1",
    fee: "5% of rent paid online",
    staff: "Just you",
    bps: 500,
    words: "One home is free, with everything the app does: rent, repairs, certificates, messages, documents and the books. You only pay when rent is paid online.",
  },
  few: {
    name: "Advanced",
    price: "£29.99",
    per: "a month, or £299.99 a year",
    homes: "Up to 10",
    fee: "5% of rent paid online",
    staff: "Just you",
    bps: 500,
    words: "The same app for up to ten homes. Paying yearly saves £59.89. The fee on rent paid online stays the same as Free.",
  },
  many: {
    name: "Professional",
    price: "£99.99",
    per: "a month, or £1,100 a year",
    homes: "Unlimited",
    fee: "None",
    staff: "25 seats, with roles",
    bps: 0,
    words: "Unlimited homes, staff with their own sign-in, and no DirectHomes fee on rent at all. Built for teams.",
  },
};

function Line({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3">
      <span className="text-[14px] text-ink-2">{label}</span>
      <span className="text-right text-[15px] text-ink tabular">{children}</span>
    </div>
  );
}

export function SectionPlainPlans() {
  const [size, setSize] = useState<Size>("one");
  const p = PLAN[size];
  const net = RENT - STRIPE_PAY_BY_BANK - (RENT * p.bps) / 10000;

  return (
    <section id="plans" aria-labelledby="plans-title" className="pt-24 sm:pt-32">
      <Column>
        <SectionHead
          id="plans-title"
          title={
            <>
              One home is free.
              <br />
              Up to ten on Advanced.
            </>
          }
          text="Every plan has the same features. What changes is how many homes you let, the fee on rent paid online, and whether staff can sign in."
        />

        <div className="brand-wash brand-wash-2 mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 rounded-panel p-2 sm:p-8 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-12 lg:p-12">
          <div className="flex flex-col px-3 pt-4 sm:px-0 sm:pt-0">
            <p className="text-[15px] text-ink">How many homes do you let?</p>
            <Choice label="How many homes do you let?" options={SIZES} value={size} onChange={setSize} className="mt-3 w-full sm:w-auto sm:self-start" />
            <p aria-live="polite" className="mt-8 max-w-[30rem] text-[18px] leading-[1.5] text-ink lg:mt-auto">
              {p.words}
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={PAGES.pricing.href} className="group inline-flex h-11 items-center gap-2 rounded-control bg-surface pr-4 pl-5 text-[15px] text-ink transition-colors hover:bg-white">
                See pricing
                <Icon icon={ArrowUpRight01Icon} size={17} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              {size === "many" ? (
                <Link href={PAGES.managers.href} className="group inline-flex h-11 items-center gap-2 rounded-control px-3 text-[15px] text-ink-2 transition-colors hover:text-ink">
                  For property managers
                  <Icon icon={ArrowUpRight01Icon} size={17} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              ) : null}
            </div>
          </div>

          {/* The plan for that many homes. */}
          <div aria-live="polite" className="rounded-[10px] bg-canvas p-6 text-ink shadow-[0_1px_2px_rgb(20_20_20/0.1),0_24px_40px_-28px_rgb(30_28_40/0.5)] sm:p-8">
            <p className="text-[22px] leading-tight">{p.name}</p>
            <p className="mt-4 flex flex-wrap items-baseline gap-x-2.5 gap-y-1">
              <span className="text-[52px] leading-none font-light tracking-[-0.02em] tabular">{p.price}</span>
              <span className="text-[14px] text-muted">{p.per}</span>
            </p>
            <div className="mt-6 border-t border-ink/10 pt-2">
              <Line label="Properties">{p.homes}</Line>
              <Line label="DirectHomes fee">{p.fee}</Line>
              <Line label="Staff">{p.staff}</Line>
              <Line label="Rent you record yourself">No fee</Line>
            </div>
            <div className="mt-4 rounded-tile bg-surface p-5">
              <p className="text-[13.5px] text-ink-2">From £1,000 of rent paid by bank, after Stripe&rsquo;s £5 and any DirectHomes fee</p>
              <p className="mt-2 text-[34px] leading-none font-light tabular">
                <Count value={net} format={exact} />
                <span className="ml-2 text-[14px] text-muted">reaches you</span>
              </p>
            </div>
          </div>
        </div>
        <p className="mt-4 px-1 text-[13px] leading-[1.55] text-muted">Your tenants never pay a fee. Prices, fees and VAT are still being finalised before launch.</p>
      </Column>
    </section>
  );
}
