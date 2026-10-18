"use client";

import Image from "next/image";
import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import {
  Add01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  Building03Icon,
  BubbleChatEditIcon,
  CreditCardIcon,
  DashboardSquare01Icon,
  File02Icon,
  HandshakeIcon,
  HelpCircleIcon,
  KanbanIcon,
  Message01Icon,
  Notification01Icon,
  PieChart01Icon,
  Search01Icon,
  Settings02Icon,
  UserGroupIcon,
  Wallet01Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "./icon";
import { LogoMark } from "./logo";
import { cn } from "@/lib/utils";

/*
 * The product shot: the web app's Home screen for its demo landlord, rebuilt as real UI rather than a picture so it
 * stays sharp at any size. It is only a picture of the app, though: nothing in it responds to the pointer or the
 * keyboard (the user asked for that, 15 Oct 2026), and its only motion is the chart's columns rising and the sheets behind it dropping away once the page scrolls. It is drawn at one fixed size, 1280
 * wide, and scaled to fit like a screenshot would be. Phones get the same whole desktop screen, shrunk (the user asked, 15 Oct 2026),
 * rather than a tall narrow cut of it.
 */

const WIDE = 1280;

const pounds = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
const exact = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 });
const money = (pence: number) => pounds.format(pence / 100);

type Month = { short: string; long: string; note?: string; income: number; expenses: number; overdue: number };

/** A year of the demo account, in pence: what came in, what went out, and rent from that month still owed. */
const MONTHS: Month[] = [
  { short: "Nov", long: "November 2025", note: "2025", income: 1450000, expenses: 40000, overdue: 0 },
  { short: "Dec", long: "December 2025", income: 1452000, expenses: 300000, overdue: 0 },
  { short: "Jan", long: "January 2026", note: "2026", income: 1640000, expenses: 260000, overdue: 0 },
  { short: "Feb", long: "February 2026", income: 1640000, expenses: 180000, overdue: 0 },
  { short: "Mar", long: "March 2026", income: 1645000, expenses: 60000, overdue: 0 },
  { short: "Apr", long: "April 2026", income: 1560000, expenses: 200000, overdue: 0 },
  { short: "May", long: "May 2026", income: 1652000, expenses: 100000, overdue: 0 },
  { short: "Jun", long: "June 2026", income: 1370000, expenses: 170000, overdue: 0 },
  { short: "Jul", long: "July 2026", income: 1770000, expenses: 160000, overdue: 0 },
  { short: "Aug", long: "August 2026", income: 1540000, expenses: 70000, overdue: 82000 },
  { short: "Sept", long: "September 2026", income: 1400000, expenses: 90000, overdue: 189000 },
  { short: "Oct", long: "October 2026", note: "so far", income: 938000, expenses: 30000, overdue: 0 },
];

const RAIL: IconSvgElement[][] = [
  [DashboardSquare01Icon, KanbanIcon, Building03Icon, Wallet01Icon, Wrench01Icon, File02Icon, Message01Icon, HandshakeIcon, PieChart01Icon, UserGroupIcon, CreditCardIcon],
  [Settings02Icon, HelpCircleIcon],
];
const RAIL_NAMES = [
  ["Home", "Tasks", "Properties", "Rent", "Repairs", "Documents", "Messages", "Help & Services", "Finance", "Team", "Billing"],
  ["Settings", "Support"],
];

type Row = { title: string; who?: string; when?: string; detail?: string; amount?: number; urgent?: boolean; emergency?: boolean };
const ATTENTION: { label: string; urgent: number; rows: Row[] }[] = [
  { label: "Repairs", urgent: 1, rows: [{ title: "No heating or hot water in the house", who: "Lavender Grove HMO", when: "Emergency, response overdue", emergency: true }] },
  {
    label: "Rent",
    urgent: 2,
    rows: [
      { title: "Flat 2", who: "Nina Kowalski", when: "60 days overdue", amount: 189000, urgent: true },
      { title: "Room 3, Lavender Grove HMO", who: "Kwame Asante", when: "24 days overdue", amount: 82000, urgent: true },
      { title: "Payment from Nina Kowalski", detail: "Confirm it to add it to the ledger", amount: 59500 },
      { title: "Flat 2", who: "Nina", when: "due 15 Oct 2026", amount: 129500 },
      { title: "Room 2, Lavender Grove HMO", who: "Ana", when: "due 15 Oct 2026", amount: 89500 },
      { title: "5 Thornhill Road", who: "Dan", when: "due 17 Oct 2026", amount: 85000 },
    ],
  },
  {
    label: "Maintenance",
    urgent: 1,
    rows: [
      { title: "Gas safety check", who: "15 St Leonard's Road", when: "due in 9 days", urgent: true },
      { title: "Clear the gutters", who: "9 Widcombe Parade", when: "due 30 Oct 2026" },
    ],
  },
];

const PROPERTIES: { name: string; photo: string; share: string; flags?: string }[] = [
  { name: "Lavender Grove HMO", photo: "clapton", share: "4 of 5 let", flags: "£820 overdue · Emergency repair" },
  { name: "Flat 2", photo: "bristol-caledonia", share: "Let", flags: "£1,890 overdue" },
  { name: "2F1, 18 Marchmont Road", photo: "edinburgh-tenement", share: "Let" },
  { name: "5 Thornhill Road", photo: "huddersfield", share: "Vacant" },
  { name: "9 Widcombe Parade", photo: "bath-lower-bristol", share: "Let" },
  { name: "15 St Leonard's Road", photo: "exeter-semi", share: "Let" },
  { name: "26 Headingley Mount", photo: "leeds-semi", share: "Let" },
  { name: "33 Pontcanna Street", photo: "cardiff-zinc", share: "Let" },
  { name: "48 Auckland Road", photo: "norwood", share: "Let" },
  { name: "Cotham Vale", photo: "bristol-eldon", share: "Let" },
];

/** The square arrow in a card's corner. In the app it opens the page behind the card; here it is only drawn. */
function CornerArrow({ className }: { className?: string }) {
  return (
    <span className={cn("absolute flex size-11 items-center justify-center rounded-control bg-surface text-ink", className)}>
      <Icon icon={ArrowUpRight01Icon} size={20} />
    </span>
  );
}

function Name({ tone, hangs, className, children }: { tone: string; hangs?: boolean; className?: string; children: ReactNode }) {
  return (
    <span className={cn("flex items-baseline gap-[7px] text-[14px]", className)}>
      <span className={cn("h-2.5 w-2 shrink-0", hangs ? "rounded-b-[2px]" : "rounded-t-[2px]", tone)} />
      {children}
    </span>
  );
}

/** Home's money chart: money in rising from a centre line, money out hanging under it, overdue rent in orange on top. */
function MoneyPanel() {
  const current = MONTHS.length - 1;
  const income = MONTHS.reduce((t, m) => t + m.income, 0);
  const expenses = MONTHS.reduce((t, m) => t + m.expenses, 0);
  const overdue = MONTHS.reduce((t, m) => t + m.overdue, 0);
  const above = Math.max(...MONTHS.map((m) => m.income + m.overdue));
  const below = Math.max(...MONTHS.map((m) => m.expenses));
  const peak = MONTHS.reduce((best, m, i) => (m.income > MONTHS[best].income ? i : best), 0);

  return (
    <section className="relative flex h-full min-w-0 flex-col py-5 pr-5">
      <p className="pr-14 text-[13px] text-muted">Last 12 months</p>
      <CornerArrow className="top-4 right-5" />

      <div className="mt-6 flex items-end gap-x-14 whitespace-nowrap text-ink tabular">
        <p className="flex flex-col gap-2.5">
          <span className="text-[46px] leading-none font-light">{money(income - expenses)}</span>
          <span className="text-[13px] leading-tight text-ink-2">Net</span>
        </p>
        <div className="grid grid-cols-[auto_auto_14px] items-baseline gap-x-[22px] gap-y-2 text-[15px] leading-tight">
          <Name tone="bg-accent-fill" className="text-ink-2">
            Income
          </Name>
          <span className="text-right">{money(income)}</span>
          <span />
          <Name tone="bg-accent-strong" hangs className="text-ink-2">
            Expenses
          </Name>
          <span className="text-right">{money(expenses)}</span>
          <span />
          <Name tone="bg-down" className="text-bad">
            Overdue
          </Name>
          <span className="text-right text-bad">{money(overdue)}</span>
          <Icon icon={ArrowRight01Icon} size={14} className="relative top-[2.5px] -mt-[3px] -ml-3.5 text-bad" />
        </div>
      </div>

      <figure className="mt-7 flex min-h-0 flex-1 flex-col [--gap:5px]">
        <ul className="flex min-h-40 flex-1 gap-(--gap) pt-6">
          {MONTHS.map((m, i) => {
            const up = m.income + m.overdue;
            const delay = { animationDelay: `${300 + i * 40}ms` };
            return (
              <li key={m.long} className="flex min-w-0 flex-1">
                <span className="flex h-full w-full flex-col gap-(--gap)">
                  <span className="flex min-h-0 basis-0 flex-col justify-end" style={{ flexGrow: above }}>
                    <span className="flex h-full animate-col-rise flex-col justify-end" style={delay}>
                      <span className="relative min-h-[3px] shrink-0" style={{ height: `${(up / above) * 100}%` }}>
                        {i === peak || i === current ? <span className="absolute bottom-full left-1/2 mb-1.5 -translate-x-1/2 text-[11.5px] leading-none whitespace-nowrap text-ink-2 tabular">{money(m.income)}</span> : null}
                        <span className="flex h-full flex-col gap-[2px] overflow-hidden rounded-t-[12px]">
                          {m.overdue > 0 ? <span className="min-h-[4px] shrink-0 bg-down" style={{ height: `${(m.overdue / up) * 100}%` }} /> : null}
                          <span className="min-h-0 flex-1 bg-accent-fill" />
                        </span>
                      </span>
                    </span>
                  </span>
                  <span className="flex min-h-0 basis-0 flex-col" style={{ flexGrow: below }}>
                    <span className="h-full animate-col-rise" style={delay}>
                      <span className="block min-h-[3px] rounded-b-[12px] bg-accent-strong" style={{ height: `${(m.expenses / below) * 100}%` }} />
                    </span>
                  </span>
                </span>
              </li>
            );
          })}
        </ul>
        <div className="mt-2.5 flex gap-(--gap) text-center text-[11.5px] leading-tight">
          {MONTHS.map((m, i) => (
            <span key={m.long} className={cn("flex min-w-0 flex-1 flex-col items-center", i === current ? "text-ink" : "text-muted")}>
              <span>{m.short}</span>
              <span className="mt-0.5 h-[1.25em] text-[11px] whitespace-nowrap text-muted">{m.note ?? ""}</span>
            </span>
          ))}
        </div>
      </figure>
    </section>
  );
}

const sub = "text-[12.5px] leading-[18px]";

/** Home's attention card: what needs the landlord, by kind of work, with the emergency filled in orange. */
function AttentionPanel() {
  const count = ATTENTION.reduce((t, g) => t + g.rows.length, 0);
  const urgent = ATTENTION.reduce((t, g) => t + g.urgent, 0);
  return (
    <section className="attention-wash relative flex h-full min-h-0 flex-col rounded-panel p-5">
      <div className="flex h-9 items-center gap-3 pr-12">
        <p className="text-[34px] leading-none font-light text-ink">{count}</p>
        <div>
          <p className="text-[13.5px] leading-[18px] text-ink-2">Needs attention</p>
          <p className="text-[13px] leading-[18px] text-urgent">{urgent} urgent</p>
        </div>
      </div>
      <CornerArrow className="top-4 right-4 bg-white/30" />
      <div className="mt-4 flex min-h-0 flex-1 flex-col gap-1 overflow-hidden pb-4 [mask-image:linear-gradient(to_bottom,#000_calc(100%-18px),transparent)]">
        {ATTENTION.map((g) => (
          <div key={g.label} className="shrink-0 rounded-[6px] bg-white/30 p-1 pt-2.5">
            <div className="flex items-baseline justify-between gap-3 px-2.5 pb-1">
              <p className="text-[14.5px] leading-5 font-medium text-ink">{g.label}</p>
              {g.urgent > 0 ? <p className="text-[12.5px] leading-[18px] text-urgent">{g.urgent} urgent</p> : null}
            </div>
            <ol className="flex flex-col">
              {g.rows.map((r) => (
                <li key={`${r.title}${r.when}`} className={cn("flex items-center gap-3 rounded-[4px] px-2.5", r.emergency ? "bg-down py-2" : "py-1.5")}>
                  <span className="min-w-0 flex-1">
                    <span className={cn("block truncate text-[14px] leading-5 text-ink", r.emergency && "font-medium")}>{r.title}</span>
                    {r.emergency ? (
                      <>
                        <span className={cn("block truncate text-ink/80", sub)}>{r.who}</span>
                        <span className={cn("block truncate text-ink", sub)}>{r.when}</span>
                      </>
                    ) : r.who ? (
                      <span className={cn("flex overflow-hidden whitespace-pre text-ink-2", sub)}>
                        <span className="truncate">{r.who}</span>
                        <span className="shrink-0"> · </span>
                        <span className={cn("shrink-0", r.urgent && "text-urgent")}>{r.when}</span>
                      </span>
                    ) : (
                      <span className={cn("block truncate text-ink-2", sub)}>{r.detail}</span>
                    )}
                  </span>
                  {r.amount ? <span className="shrink-0 text-[13.5px] text-ink tabular">{exact.format(r.amount / 100)}</span> : null}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    </section>
  );
}

/** Home's properties: how much is let over a ticked gauge, then every property with its photo. */
function PortfolioPanel() {
  return (
    <section className="panel relative flex h-full min-h-0 flex-col p-2 pt-[18px] pb-0">
      <div className="px-2 pb-3.5">
        <p className="pr-12 text-[13.5px] leading-[18px] text-muted">Properties</p>
        <CornerArrow className="top-3 right-3" />
        <p className="mt-3 text-[13px] leading-7 text-ink-2 tabular">
          <span className="text-[28px] font-light text-ink">12</span> of 14 units let
        </p>
        <div className="hatch relative mt-2 h-2.5 w-full overflow-hidden rounded-[2px]">
          <div className="absolute inset-y-0 left-0 w-[85.7%] rounded-[2px] bg-accent-fill" />
        </div>
      </div>
      <ul className="flex min-h-0 flex-1 flex-col gap-px overflow-hidden pb-4 [mask-image:linear-gradient(to_bottom,#000_calc(100%-18px),transparent)]">
        {PROPERTIES.map((p) => (
          <li key={p.name} className="grid min-h-9 shrink-0 grid-cols-[28px_minmax(0,1fr)_auto] content-center items-center gap-x-2.5 py-1 pr-2.5 pl-1">
            <span className={cn("size-7 overflow-hidden rounded-[4px] bg-sunken", p.flags && "row-span-2")}>
              <Image src={`/hero/${p.photo}.jpg`} alt="" width={56} height={56} className="size-7 object-cover" />
            </span>
            <span className="truncate text-[13.5px] leading-[18px] text-ink">{p.name}</span>
            <span className={cn("text-[12.5px] leading-[18px] whitespace-nowrap", p.share === "Vacant" ? "text-ink" : "text-muted")}>{p.share}</span>
            {p.flags ? <span className="col-span-2 col-start-2 truncate text-[12.5px] leading-[17px] text-bad">{p.flags}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The rail: every destination as an icon, Home lit in ink. */
function Rail() {
  return (
    <div className="flex h-full w-11 shrink-0 flex-col gap-2">
      {RAIL.map((strip, s) => (
        <ul key={s} className={cn("flex flex-col gap-0.5 rounded-[8px] bg-panel", s === 1 && "mt-auto")}>
          {strip.map((icon, i) => (
            <li key={RAIL_NAMES[s][i]} className="relative">
              <span className={cn("flex h-11 items-center justify-center rounded-[6px]", s === 0 && i === 0 ? "bg-ink text-white" : "text-ink-2")}>
                <Icon icon={icon} size={19} />
              </span>
              {s === 0 && i === 6 ? <span className="absolute top-1 right-1 inline-flex size-4 items-center justify-center rounded-full bg-ink text-[10px] leading-none text-white ring-2 ring-[#f3f3f3]">1</span> : null}
            </li>
          ))}
        </ul>
      ))}
    </div>
  );
}

/** The app's Home screen at its design size. */
function HomeScreen() {
  return (
    <div className="w-[1280px] bg-canvas px-8 pt-4 pb-6 text-ink">
      {/* Header: the logo hangs over the rail's column, search sits in the middle, the account tray closes the row. */}
      <div className="relative flex h-12 items-center">
        <span className="flex items-center gap-2.5">
          <LogoMark className="size-9" />
          <span className="text-[20px] tracking-[-0.015em]">DirectHomes</span>
        </span>
        <span className="absolute left-1/2 flex h-12 w-[480px] -translate-x-1/2 items-center gap-2.5 rounded-control bg-surface px-4 text-[15px] text-muted">
          <Icon icon={Search01Icon} size={18} />
          Search
          <span className="ml-auto rounded-[3px] bg-sunken px-1.5 py-0.5 text-[11px] text-ink-2">⌘K</span>
        </span>
        <span className="ml-auto flex h-12 items-center gap-1 rounded-control bg-surface pl-1">
          <span className="flex h-10 w-11 items-center justify-center text-ink-2">
            <Icon icon={BubbleChatEditIcon} size={19} />
          </span>
          <span className="relative flex h-10 w-11 items-center justify-center text-ink-2">
            <Icon icon={Notification01Icon} size={19} />
            <span className="absolute top-1 right-1.5 inline-flex size-4 items-center justify-center rounded-full bg-ink text-[10px] leading-none text-white ring-2 ring-surface">7</span>
          </span>
          <Image src="/hero/sam.jpg" alt="" width={96} height={96} className="size-12 rounded-control object-cover" />
        </span>
      </div>

      <div className="mt-10 flex gap-7">
        <Rail />
        <div className="flex min-w-0 flex-1 flex-col">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-[44px] leading-none tracking-[-0.02em]">Good evening, Sam</p>
              <p className="mt-3 text-[15px] text-muted">
                Wednesday 14 October · Whitfield Property Group
              </p>
            </div>
            <span className="flex items-center gap-2">
              <span className="relative flex size-[52px] items-center justify-center rounded-control bg-surface">
                <Icon icon={Message01Icon} size={20} />
                <span className="absolute -top-1.5 -right-1.5 inline-flex size-5 items-center justify-center rounded-full bg-ink text-[11px] leading-none text-white ring-2 ring-canvas">1</span>
              </span>
              <span className="flex h-[52px] items-center gap-2 rounded-control bg-ink px-6 text-[16px] text-white">
                <Icon icon={Add01Icon} size={18} />
                Add
              </span>
            </span>
          </div>
          <div className="mt-6 grid h-[520px] grid-cols-[minmax(0,1fr)_346px_296px] gap-2">
            <div className="min-w-0">
              <MoneyPanel />
            </div>
            <AttentionPanel />
            <div className="min-h-0">
              <PortfolioPanel />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * The window the screen sits in, scaled to fill the width it is given, so its edges line up with the headline. The scale is measured
 * after mount; until then CSS steps by breakpoint keep it close, so nothing jumps far and nothing is hidden meanwhile.
 */
export function AppWindow({ className }: { className?: string }) {
  const frame = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);

  useLayoutEffect(() => {
    const el = frame.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1.1, el.clientWidth / WIDE));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div ref={frame} className={cn("w-full", className)}>
      <div
        aria-hidden
        inert
        // Zoom shrinks the corners too, so they are drawn larger to stay 10px on screen.
        style={scale === null ? undefined : { zoom: scale, borderRadius: 10 / scale }}
        className={cn(
          "pointer-events-none mx-auto w-fit overflow-hidden rounded-[10px] select-none",
          // The window's edge: no outline, a tight shadow cast down from one light, tinted with the ink.
          "shadow-[0_1px_2px_rgb(20_20_20/0.10),0_22px_40px_-24px_rgb(28_26_60/0.45)]",
          scale === null && "[zoom:0.27] min-[480px]:[zoom:0.34] sm:[zoom:0.44] md:[zoom:0.54] lg:[zoom:0.72] xl:[zoom:0.9] min-[1440px]:[zoom:1]",
        )}
      >
        <HomeScreen />
      </div>
    </div>
  );
}

/*
 * Two glass sheets stacked behind the window, each narrower and a short step higher, like more screens waiting behind
 * this one. Only their top strip shows above the window. They live outside the window's own box because that box is
 * masked to fade out, and a mask stops a backdrop blur from seeing the photograph. The hero places this box flush
 * with the window's top edge and the same width; sizes are in cqw, so 1cqw is 12.8px of the 1280-wide screen.
 *
 * The first bit of scroll sets them off: the top (back) one drops behind the window, and once it has gone the front
 * one follows. They run on their own clock, not with the scroll. Back at the top they rise again, front one first.
 */
const SHEETS = [
  { inset: "8.125cqw", rise: "2.8125cqw", first: true, glass: "bg-white/20" },
  { inset: "4.0625cqw", rise: "1.40625cqw", first: false, glass: "bg-white/35" },
];

export function WindowSheets({ className }: { className?: string }) {
  const still = useReducedMotion();
  const { scrollY } = useScroll();
  const [tucked, setTucked] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => setTucked(v > 12));
  const step = { duration: 0.28, ease: [0.32, 0.72, 0, 1] as const };

  return (
    <div aria-hidden className={cn("pointer-events-none relative [container-type:inline-size]", className)}>
      {SHEETS.map((g) => (
        <motion.div
          key={g.inset}
          initial={false}
          animate={{ y: tucked && !still ? g.rise : "0cqw" }}
          transition={{ ...step, delay: g.first === tucked ? 0 : step.duration }}
          style={{ left: g.inset, right: g.inset, top: `calc(${g.rise} * -1)` }}
          className={cn(
            "absolute h-[5cqw] rounded-t-[10px] backdrop-blur-[14px] backdrop-saturate-150",
            // A clear glass lip: the top edge catches the light, the sides carry a faint stroke of the same white.
            "shadow-[inset_0_1px_0_rgb(255_255_255/0.75),inset_1px_0_0_rgb(255_255_255/0.22),inset_-1px_0_0_rgb(255_255_255/0.22)]",
            g.glass,
          )}
        />
      ))}
    </div>
  );
}

