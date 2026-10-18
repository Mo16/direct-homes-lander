"use client";

import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, animate, motion, useInView, useReducedMotion } from "motion/react";
import {
  Add01Icon,
  Alert02Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  BankIcon,
  Building03Icon,
  BubbleChatEditIcon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  CreditCardIcon,
  DashboardSquare01Icon,
  File02Icon,
  FilterHorizontalIcon,
  HandshakeIcon,
  KanbanIcon,
  Loading03Icon,
  Message01Icon,
  Notification03Icon,
  PieChart01Icon,
  Search01Icon,
  Tick02Icon,
  UserGroupIcon,
  Wallet01Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "./icon";
import { LogoMark } from "./logo";
import { Column } from "./ui";
import { cn } from "@/lib/utils";

/*
 * "Stop chasing rent. It just turns up." Both sides of one real payment, drawn as faithful copies of the web app
 * (the user asked for an accurate depiction, 15 Oct 2026): the landlord's Rent page as it renders at 1280px for the
 * demo workspace, and Nina Kowalski's tenant screens at 390px (Rent, Pay rent, the payment status page), with the
 * app's own copy, figures and the notification it sends ("Nina Kowalski paid £3,185.00"). The scene sits on the user's
 * own photograph of a Georgian terrace under a blue sky (the same world as the hero, a different view) and both
 * windows run off its foot. On a loop while it is on screen, Nina pays everything due by bank and the landlord's page updates.
 * It renders in its finished state, so it reads with no motion at all; with reduced motion it stays there.
 */

/* ---------- The story ---------- */

type Step = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
// 0 rent page · 1 pointer to Pay now · 2 tap · 3 Pay rent form · 4 it scrolls to the button · 5 pointer to Pay · 6 tap, starting · 7 processing · 8 received, landlord told · 9 hold
const TIMES = [0, 1300, 2500, 3100, 4500, 5500, 6700, 7300, 9300, 10800];
const LOOP = 15500;
const DONE: Step = 9;


const money = (pence: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 }).format(pence / 100);
const short = (pence: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(pence / 100);

const PAID = 318500;
const DUE_MONTH = 1681500;

/* ---------- Shared pieces, as the app draws them ---------- */

type Tone = "good" | "warn" | "bad" | "info" | "neutral";
const TONE: Record<Tone, [string, IconSvgElement]> = {
  good: ["text-good", CheckmarkCircle02Icon],
  warn: ["text-warn", Clock01Icon],
  bad: ["text-bad", Alert02Icon],
  info: ["text-info", Loading03Icon],
  neutral: ["text-ink-2", Clock01Icon],
};

function Status({ tone, label }: { tone: Tone; label: string }) {
  const [cls, icon] = TONE[tone];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[13.5px] whitespace-nowrap", cls)}>
      <Icon icon={icon} size={16} />
      <span>{label}</span>
    </span>
  );
}

function IconSquare({ icon, className }: { icon: IconSvgElement; className?: string }) {
  return (
    <span className={cn("inline-flex size-11 shrink-0 items-center justify-center rounded-control bg-surface text-ink", className)}>
      <Icon icon={icon} size={20} />
    </span>
  );
}

function Progress({ value, max }: { value: number; max: number }) {
  return (
    <div className="hatch relative h-3 w-full overflow-hidden rounded-[2px]">
      <div className="absolute inset-y-0 left-0 rounded-[2px] bg-accent-fill transition-[width] duration-700" style={{ width: `${(value / max) * 100}%`, minWidth: 6 }} />
    </div>
  );
}

/** The app's HatchedBarChart: six months of rent collected against due, this month lit with its percentage. */
function BarChart({ pct }: { pct: number }) {
  const shares = [0.86, 0.84, 0.88, 0.8, 0.78, pct / 100];
  const w = 250;
  const plot = 98;
  const slot = w / 6;
  const bar = Math.min(30, slot * 0.58);
  const totalH = plot * 0.86;
  return (
    <figure className="mx-auto mt-auto w-full max-w-[220px] pt-2">
      <svg viewBox={`0 0 ${w} 128`} className="w-full">
        <defs>
          <pattern id="scene-hatch" width="4" height="6" patternUnits="userSpaceOnUse">
            <line x1="1" y1="0" x2="1" y2="6" stroke="var(--color-accent-hatch)" strokeWidth="1.4" />
          </pattern>
        </defs>
        {shares.map((share, i) => {
          const x = i * slot + (slot - bar) / 2;
          const last = i === 5;
          const vh = Math.max(8, totalH * share);
          return (
            <g key={i}>
              <rect x={x} y={30 + plot - totalH} width={bar} height={totalH} rx={3} fill="url(#scene-hatch)" />
              <rect x={x} y={30 + plot - vh} width={bar} height={vh} rx={3} fill={last ? "var(--color-accent-fill)" : "var(--color-sunken)"} className="transition-[y,height] duration-700" />
              {last ? (
                <g transform={`translate(${x + bar / 2}, ${30 + plot - totalH - 14})`}>
                  <rect x={-22} y={-10} width={44} height={20} rx={3} fill="var(--color-ink)" />
                  <text textAnchor="middle" dominantBaseline="central" y={0.5} fontSize="11" fill="#fff" className="tabular">
                    {pct}%
                  </text>
                </g>
              ) : null}
            </g>
          );
        })}
      </svg>
      <div className="mt-1.5 grid grid-cols-6 text-center text-[11.5px] text-muted">
        {["May", "Jun", "Jul", "Aug", "Sept", "Oct"].map((m) => (
          <span key={m}>{m}</span>
        ))}
      </div>
    </figure>
  );
}

/** A pound figure that counts to its new value, so the eye sees it change. */
function Count({ pence }: { pence: number }) {
  const node = useRef<HTMLSpanElement>(null);
  const shown = useRef(pence);
  const [first] = useState(pence);
  useEffect(() => {
    const el = node.current;
    if (!el || shown.current === pence) return;
    const run = animate(shown.current, pence, { duration: 0.9, ease: [0.2, 0.8, 0.2, 1], onUpdate: (v) => ((shown.current = v), (el.textContent = short(Math.round(v)))) });
    return () => run.stop();
  }, [pence]);
  return <span ref={node}>{short(first)}</span>;
}

function StatCard({ label, value, context, lit, children }: { label: string; value: number; context?: string; lit?: boolean; children?: ReactNode }) {
  return (
    <div className={cn("panel relative flex min-h-[132px] flex-col p-5 transition-colors duration-500", lit && "bg-white")}>
      <p className="pr-12 text-[13.5px] text-muted">{label}</p>
      <p className="mt-2 text-[40px] leading-none font-light tracking-[-0.02em] text-ink tabular">
        <Count pence={value} />
      </p>
      {context ? <p className="mt-2 text-[13px] text-ink-2">{context}</p> : null}
      {children}
      <IconSquare icon={ArrowUpRight01Icon} className="absolute top-4 right-4" />
    </div>
  );
}

/* ---------- The landlord's Rent page ---------- */

const RAIL: IconSvgElement[] = [DashboardSquare01Icon, KanbanIcon, Building03Icon, Wallet01Icon, Wrench01Icon, File02Icon, Message01Icon, HandshakeIcon, PieChart01Icon, UserGroupIcon, CreditCardIcon];

const CHARGES = [
  { due: "15 Nov 2026", title: "Flat 2", who: "Nina Kowalski", covers: "15 Nov to 14 Dec", amount: 129500 },
  { due: "15 Nov 2026", title: "Room 2, Lavender Grove HMO", who: "Ana Souza", covers: "15 Nov to 14 Dec", amount: 89500 },
  { due: "5 Nov 2026", title: "33 Pontcanna Street", who: "Rhys Morgan", covers: "5 Nov to 4 Dec", amount: 105000 },
  { due: "1 Nov 2026", title: "8 Cotham Vale", who: "Grace Adebayo, Liam Connor · Auto-pay", covers: "1 Nov to 30 Nov", amount: 172500 },
];
const COLS = "grid-cols-[120px_minmax(0,1fr)_110px_110px_130px]";

function LandlordRent({ step }: { step: Step }) {
  const told = step >= 8;
  // The notification is open for a moment, then it opens the payment itself.
  const opened = step === 9;
  const processing = step === 7;
  const received = 938000 + (told ? PAID : 0);
  const overdue = told ? 254500 : 443500;
  const inProgress = 172500 + (processing ? PAID : 0);
  const pct = Math.round((received / DUE_MONTH) * 100);

  return (
    <div className="relative h-full w-[1040px] overflow-hidden rounded-[12px] bg-canvas px-8 pt-4">
      {/* The logo over the rail, and the rail of every destination with Rent lit. */}
      <LogoMark className="absolute top-[22px] left-8 size-9 text-ink" />
      <div className="absolute top-[104px] left-8 flex w-11 flex-col gap-0.5 rounded-[8px] bg-panel">
        {RAIL.map((icon, i) => (
          <span key={i} className={cn("relative flex h-10 items-center justify-center rounded-[6px]", i === 3 ? "bg-ink text-white" : "text-ink-2")}>
            <Icon icon={icon} size={19} />
            {i === 6 ? <span className="absolute top-0 right-1 inline-flex size-4 items-center justify-center rounded-full bg-ink text-[10px] leading-none text-white ring-2 ring-panel-solid">1</span> : null}
          </span>
        ))}
      </div>

      <div className="ml-[72px]">
        {/* The page header: the title on the header's own row, its controls overhanging it on the right. */}
        <div className="relative">
          <h3 className="pt-1 text-[42px] leading-13 tracking-[-0.025em] text-ink">
            Rent
            <span className="mx-3 text-faint">&mdash;</span>
            October 2026
          </h3>
          <p className="mt-0.5 max-w-[480px] text-[15px] leading-snug text-muted">Every charge, payment and payout across your tenancies, worked out from one ledger.</p>
          <div className="absolute top-0 right-0 flex items-center gap-3">
            <span className="flex h-12 w-[250px] items-center gap-2.5 rounded-control bg-surface px-4 text-[14.5px] text-muted">
              <Icon icon={Search01Icon} size={18} />
              Search
              <span className="ml-auto rounded-[3px] bg-sunken px-1.5 py-0.5 text-[11px] text-ink-2">⌘K</span>
            </span>
            <span className="flex h-12 items-center gap-1 rounded-control bg-surface pl-1">
              <span className="flex h-10 w-11 items-center justify-center text-ink">
                <Icon icon={BubbleChatEditIcon} size={20} />
              </span>
              <span className={cn("relative flex h-10 w-11 items-center justify-center rounded-[4px] text-ink transition-colors", told && "bg-sunken")}>
                <Icon icon={Notification03Icon} size={20} />
                <span className={cn("absolute top-1 left-[27px] inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10.5px] leading-none text-white ring-2 tabular", told ? "ring-sunken" : "ring-surface")}>
                  {told ? 8 : 7}
                </span>
              </span>
              <Image src="/hero/sam.jpg" alt="" width={96} height={96} className="size-12 rounded-control object-cover" />
            </span>
          </div>
          <div className="absolute top-[60px] right-0 flex items-center gap-2">
            <IconSquare icon={Search01Icon} className="size-12" />
            <IconSquare icon={FilterHorizontalIcon} className="size-12" />
            <IconSquare icon={Calendar03Icon} className="size-12" />
            <span className="flex h-12 items-center gap-2 rounded-control bg-ink px-6 text-[15px] text-white">
              <Icon icon={Add01Icon} size={18} /> Record payment
            </span>
          </div>
        </div>


        <div className="mt-[30px] mb-2 flex w-fit gap-1 rounded-[6px] bg-panel p-1">
          {["Charges", "Payments", "Reported", "Payouts", "Statements"].map((t, i) => (
            <span key={t} className={cn("inline-flex h-9 items-center gap-2 rounded-[4px] px-4 text-[14px]", i === 0 ? "bg-ink text-white" : "text-ink-2")}>
              {t}
              {t === "Reported" ? <span className="text-[12.5px] text-muted tabular">1</span> : null}
            </span>
          ))}
        </div>

        <div className="mb-2 grid grid-cols-2 gap-2">
          <StatCard label="Received this month" value={received} lit={step === 8} context="Online and recorded payments since 1 October">
            <div className="mt-auto pt-4">
              <Progress value={received} max={DUE_MONTH} />
            </div>
            <p className="mt-2 text-[12.5px] text-muted tabular">of {short(DUE_MONTH)} due this month</p>
          </StatCard>
          <StatCard label="Overdue" value={overdue} lit={step === 8} context={`Across ${told ? 2 : 3} tenancies`} />
          <StatCard label="In progress" value={inProgress} lit={step === 7} context="Direct Debits and bank payments on their way" />
          <div className="panel relative flex min-h-[132px] flex-col p-5">
            <p className="pr-12 text-[13.5px] text-muted">Collected against due</p>
            <p className="mt-1.5 text-[13px] text-ink-2 tabular">
              {pct}% of {short(DUE_MONTH)} due in October
            </p>
            <IconSquare icon={ArrowUpRight01Icon} className="absolute top-4 right-4" />
            <BarChart pct={pct} />
          </div>
        </div>

        <div className="mb-2 flex items-center gap-3 rounded-[6px] bg-warn-soft px-4 py-3.5 text-[14px] text-warn">
          <Icon icon={Alert02Icon} size={19} />
          <span className="flex-1 leading-snug">
            <span className="block font-medium">1 payment reported by tenants</span>
            <span className="block opacity-90">Confirm each one to add it to the ledger, or tell the tenant why not.</span>
          </span>
          <span className="rounded-[4px] bg-ink px-3.5 py-2 text-[13px] text-white">Review</span>
        </div>

        <div className="panel p-6">
          <div className="mb-3 flex items-baseline justify-between px-1 text-[13.5px]">
            <p className="text-muted">162 charges in the last year and next month</p>
            <p className="text-ink-2 tabular">{money(2182204 - (told ? PAID : 0))} outstanding of £204,772.04</p>
          </div>
          <div className={cn("grid gap-x-3 px-3 pb-3 text-[13px] text-muted", COLS)}>
            <span>Due</span>
            <span>Tenancy</span>
            <span className="text-right">Amount</span>
            <span className="text-right">Outstanding</span>
            <span>Status</span>
          </div>
          {CHARGES.map((c) => (
            <div key={c.title + c.due} className={cn("grid items-center gap-x-3 px-3 py-3.5", COLS)}>
              <span className="text-[15px] text-ink tabular">{c.due}</span>
              <span className="min-w-0">
                <span className="block truncate text-[14.5px] text-ink">{c.title}</span>
                <span className="block truncate text-[12.5px] text-muted">{c.who}</span>
              </span>
              <span className="text-right text-[14.5px] text-ink tabular">{money(c.amount)}</span>
              <span className="text-right text-[14.5px] text-ink tabular">{money(c.amount)}</span>
              <Status tone="neutral" label="Upcoming" />
            </div>
          ))}
        </div>
      </div>

      {/* The bell's popover, open as the payment's notification arrives, until the notification is clicked. */}
      <div
        className={cn(
          "absolute top-[72px] right-[86px] w-[380px] rounded-[8px] bg-panel-solid p-3 shadow-float transition-[opacity,translate] duration-300",
          told && !opened ? "translate-y-0 opacity-100" : "-translate-y-1 opacity-0",
        )}
      >
        <div className="mb-2 flex items-center justify-between px-2 pt-1">
          <p className="text-[16px] text-ink">Notifications</p>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[13px] text-ink-2">
            <Icon icon={Tick02Icon} size={15} /> Mark all read
          </span>
        </div>
        <ul className="flex flex-col gap-1.5">
          {[
            ["Nina Kowalski paid £3,185.00", "Pay by Bank for Flat 2.", "Just now"],
            ["Emergency repair reported", "No heating or hot water in the house at Room 5, Lavender Grove HMO.", "7 days ago"],
            ["Nina Kowalski says they paid £595.00", "Bank transfer on 6 Oct 2026 for Flat 2. Confirm it to add it to the ledger.", "8 days ago"],
          ].map(([title, body, when]) => (
            <li key={title} className="flex flex-col gap-0.5 rounded-tile bg-surface px-4 py-3">
              <span className="flex items-start justify-between gap-3">
                <span className="text-[14px] leading-snug text-ink">{title}</span>
                <span className="mt-1.5 size-2 shrink-0 rounded-full bg-down" />
              </span>
              <span className="line-clamp-2 text-[13px] leading-snug text-muted">{body}</span>
              <span className="text-[12px] text-faint">{when}</span>
            </li>
          ))}
        </ul>
        <p className="mt-2 flex items-center justify-center gap-1.5 py-2.5 text-[13.5px] text-ink-2">
          See all notifications <Icon icon={ArrowRight01Icon} size={15} />
        </p>
      </div>

      {/* The payment, opened from its notification: the landlord's big moment, with the fees as the Payments tab shows them. */}
      <div
        className={cn(
          "absolute top-[132px] right-8 w-[440px] rounded-[10px] bg-panel-solid p-7 shadow-float transition-[opacity,translate] duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)]",
          opened ? "translate-x-0 opacity-100" : "translate-x-6 opacity-0",
        )}
      >
        <div className="flex items-start justify-between">
          <Icon icon={CheckmarkCircle02Icon} size={44} strokeWidth={1.25} className="text-good" />
          <span className="text-[13px] text-muted">Receipt 32</span>
        </div>
        <p className="mt-5 text-[15px] text-ink-2">Payment received</p>
        <p className="mt-1.5 text-[56px] leading-none font-light tracking-[-0.02em] text-ink tabular">£3,185.00</p>
        <p className="mt-3 flex items-center gap-2.5 text-[15px] text-ink">
          <Image src="/hero/nina.jpg" alt="" width={56} height={56} className="size-7 rounded-[4px] object-cover" />
          Nina Kowalski · Flat 2
        </p>
        <dl className="mt-5 flex flex-col gap-1">
          {[
            ["Method", "Pay by Bank"],
            ["Received", "14 Oct 2026"],
            ["Stripe fee", "£5.00"],
            ["DirectHomes fee", "£0.00"],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between rounded-tile bg-surface px-4 py-2.5 text-[14px]">
              <dt className="text-muted">{k}</dt>
              <dd className="text-ink tabular">{v}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between rounded-tile bg-surface px-4 py-3 text-[15px]">
            <dt className="text-ink">Net to you</dt>
            <dd className="flex items-center gap-3 text-ink tabular">
              £3,180.00 <Status tone="good" label="Received" />
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

/* ---------- Nina's phone ---------- */

function TenantHeader() {
  return (
    <div className="flex items-center justify-between">
      <LogoMark className="size-10 text-ink" />
      <span className="flex h-12 items-center gap-1 rounded-control bg-surface pl-1">
        <span className="relative flex h-10 w-11 items-center justify-center text-ink">
          <Icon icon={Notification03Icon} size={20} />
          <span className="absolute top-1 left-[27px] inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10.5px] leading-none text-white ring-2 ring-surface">1</span>
        </span>
        <Image src="/hero/nina.jpg" alt="" width={96} height={96} className="size-12 rounded-control object-cover" />
      </span>
    </div>
  );
}

const panel = "panel p-5";
const button = "flex h-12 w-full items-center justify-center rounded-control text-[15px] transition-[background-color,scale] duration-150";

function TenantRent({ pressing }: { pressing: boolean }) {
  return (
    <>
      <h3 className="text-[32px] leading-[1.08] tracking-[-0.025em] text-ink">Rent</h3>
      <p className="mt-1.5 text-[15px] leading-snug text-muted">Flat 2 · paid to Whitfield Property Group</p>
      <div className={cn(panel, "mt-2 flex flex-col gap-5")}>
        <div className="flex flex-col gap-1">
          <p className="text-[13.5px] text-muted">Overdue</p>
          <p className="text-[44px] leading-none font-light text-ink tabular">£3,185.00</p>
          <p className="mt-1.5 text-[14px] text-ink-2">Next: £1,295.00 on 15 Nov 2026.</p>
        </div>
        <div className="flex flex-col gap-2">
          <span data-target="pay-now" className={cn(button, "bg-ink text-white", pressing && "scale-[0.98] bg-ink-hover")}>Pay now</span>
          <span className={cn(button, "bg-surface text-ink")}>Tell us you paid another way</span>
        </div>
      </div>
      <div className="panel mt-2 flex items-center gap-4 p-5">
        <span className="min-w-0 flex-1">
          <span className="block text-[13.5px] text-muted">Auto-pay by Direct Debit</span>
          <span className="mt-1 block text-[16px] text-ink">Never miss a payment</span>
        </span>
        <span className="text-[14px] text-ink-2">Set up</span>
        <Icon icon={ArrowRight01Icon} size={16} className="text-faint" />
      </div>
      <div className={cn(panel, "mt-2")}>
        <p className="text-[18px] text-ink">Payments you told us about</p>
        <div className="mt-3 rounded-tile bg-surface px-4 py-3">
          <p className="text-[14.5px] text-ink">£595.00 · Bank transfer</p>
          <p className="text-[12.5px] text-muted">Paid 6 Oct 2026</p>
          <span className="mt-1.5 block">
            <Status tone="warn" label="Waiting for your landlord" />
          </span>
        </div>
      </div>
    </>
  );
}

const METHODS: { icon: IconSvgElement; title: string; detail: string; on: boolean }[] = [
  { icon: BankIcon, title: "Pay by Bank", detail: "Approve it in your banking app. Confirmed straight away. Free for you.", on: true },
  { icon: CreditCardIcon, title: "Debit or credit card", detail: "Free for you. Costs your landlord more, so Pay by Bank is better if you can.", on: false },
];

function TenantPay({ starting }: { starting: boolean }) {
  return (
    <>
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-[32px] leading-[1.08] tracking-[-0.025em] text-ink">Pay rent</h3>
          <p className="mt-1.5 text-[15px] leading-snug text-muted">Flat 2 · to Whitfield Property Group</p>
        </div>
        <span className="flex h-10 items-center gap-1.5 rounded-control bg-surface px-4 text-[14px] text-ink">
          <Icon icon={ArrowLeft01Icon} size={16} /> Back
        </span>
      </div>
      <div className={cn(panel, "mt-3 flex flex-col gap-5")}>
        <div className="flex flex-col gap-3">
          <div>
            <p className="mb-1.5 text-[13.5px] text-ink-2">Amount</p>
            <p className="flex h-12 items-center gap-2 rounded-field bg-surface px-4 text-[16px] text-ink tabular">
              <span className="text-muted">£</span>3185.00
            </p>
            <p className="mt-1.5 text-[12.5px] leading-snug text-muted">From £10.00 up to £3,185.00. You can pay up to 7 days before rent is due.</p>
          </div>
          <span className="inline-flex h-10 w-fit items-center gap-2 rounded-control bg-ink px-4 text-[14px] text-white">
            Everything due <span className="tabular opacity-80">£3,185.00</span>
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <p className="mb-1 px-1 text-[13px] text-ink-2">How to pay</p>
          {METHODS.map((m) => (
            <div key={m.title} className={cn("flex items-start gap-3.5 rounded-tile px-4 py-3.5", m.on ? "bg-accent-soft" : "bg-surface")}>
              <Icon icon={m.icon} size={20} className="mt-0.5 text-ink-2" />
              <span className="min-w-0 flex-1">
                <span className="block text-[15px] text-ink">{m.title}</span>
                <span className="mt-0.5 block text-[13px] leading-snug text-muted">{m.detail}</span>
              </span>
              <span className={cn("mt-1 inline-flex size-5 shrink-0 items-center justify-center rounded-full", m.on ? "bg-ink" : "bg-sunken")}>{m.on ? <span className="size-2 rounded-full bg-white" /> : null}</span>
            </div>
          ))}
        </div>
        <span data-target="pay" className={cn(button, "bg-ink text-white", starting && "bg-ink-hover")}>{starting ? "Starting payment…" : "Pay £3,185.00"}</span>
      </div>
    </>
  );
}

function TenantStatus({ received }: { received: boolean }) {
  return (
    <div className="panel mt-1 flex flex-col items-center px-6 py-10 text-center">
      <Icon icon={received ? CheckmarkCircle02Icon : Loading03Icon} size={40} strokeWidth={1.25} className={received ? "text-good" : "animate-spin text-info [animation-duration:2s]"} />
      <h3 className="mt-4 text-[28px] leading-tight tracking-[-0.025em] text-ink">{received ? "Payment received" : "Payment processing"}</h3>
      <p className="mt-2 text-[40px] leading-none font-light text-ink tabular">£3,185.00</p>
      <p className="mt-3 text-[14px] text-muted">Pay by Bank · started 14 Oct 2026, 18:42</p>
      <div className="mt-4">{received ? <Status tone="good" label="Paid" /> : <Status tone="info" label="Processing" />}</div>
      <p className="mt-4 max-w-sm text-[14.5px] leading-relaxed text-ink-2">
        {received ? "Your landlord has been told. Receipt 32 is in your email and below." : "Your bank has approved it. We are waiting for confirmation, which usually takes seconds. This page updates by itself."}
      </p>
      <div className="mt-6 flex w-full flex-col gap-2">
        {received ? <span className={cn(button, "bg-ink text-white")}>View receipt</span> : null}
        <span className={cn(button, "bg-surface text-ink")}>Back to rent</span>
      </div>
    </div>
  );
}

function TenantPhone({ step }: { step: Step }) {
  const paying = step >= 3 && step <= 6;
  const scrolled = step >= 4 && step <= 6;
  return (
    <div className="h-full w-[390px] overflow-hidden rounded-[34px] bg-canvas px-4 pt-4">
      {/* The page scrolls under the header, as it does on a phone, to bring the Pay button into view. */}
      <div className={cn("transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)]", scrolled ? "-translate-y-[240px]" : "translate-y-0", !paying && "duration-0")}>
        <TenantHeader />
        {/* Each screen slides in from the right as the last one leaves, like a page change in the app. */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step <= 2 ? "rent" : paying ? "pay" : "status"}
            className="mt-6"
            initial={{ x: 48, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -32, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
          >
            {step <= 2 ? <TenantRent pressing={step === 2} /> : paying ? <TenantPay starting={step === 6} /> : <TenantStatus received={step >= 8} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ---------- The two boxes ---------- */

/**
 * The left box is the wider one (three fifths) and sets the row's height from its drawing; the right box stretches to
 * that height and its drawing, fitted to its width, is cut off at the foot.
 */
const LEFT = { w: 1120, h: 820 };
const RIGHT = { w: 640, h: 900 };
const PHONE = { x: (RIGHT.w - 390) / 2, y: 72 };

/** The button the pointer is on at each step; it rests off to the side of the phone otherwise. */
const TARGET: Partial<Record<Step, string>> = { 1: "pay-now", 2: "pay-now", 5: "pay", 6: "pay" };
const REST: [number, number] = [PHONE.x + 330, PHONE.y + 500];

/** A drawn pointer (not the system one), travelling to the button and pressing it. Its tip sits at (7, 4) of its box. */
function Pointer({ at, pressing, tap }: { at: [number, number] | null; pressing: boolean; tap: number | null }) {
  const [x, y] = at ?? REST;
  return (
    <>
    {/* The tap: a ring that spreads from the pointer's tip and fades, replayed on each press. */}
    {tap !== null && at ? <span key={tap} className="absolute top-0 left-0 size-14 animate-tap rounded-full bg-ink/25" style={{ translate: `${x - 28}px ${y - 28}px` }} /> : null}
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className={cn(
        "absolute top-0 left-0 size-9 origin-[7px_4px] drop-shadow-[0_2px_2px_rgb(20_20_20/0.3)] transition-[translate,opacity,scale] duration-[1000ms] ease-[cubic-bezier(0.45,0,0.25,1)]",
        at ? "opacity-100" : "opacity-0",
        pressing && "scale-85",
      )}
      style={{ translate: `${x - 7}px ${y - 4}px` }}
    >
      <path d="M5 3l14 7.5-6.2 1.6L9.9 18z" fill="#141414" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
    </svg>
    </>
  );
}

/** Fits a fixed-size drawing to the width it is given, the way a screenshot would scale. */
function useFit(width: number) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / width);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [width]);
  return [box, scale] as const;
}

/**
 * One box: the photograph behind (the two boxes show its two ends, so together they read as one street), and a
 * window drawn at its design size, scaled to the box's width and cut off at its foot. `stretch` boxes take their
 * height from the row (a set shape when they stack on small screens), so the drawing adds no height of its own.
 */
function Box({ size, photo, stretch, canvas, dim, children }: { size: { w: number; h: number }; photo: string; stretch?: boolean; canvas?: React.Ref<HTMLDivElement>; dim?: boolean; children: ReactNode }) {
  const [box, scale] = useFit(size.w);
  return (
    <div ref={box} className={cn("relative isolate overflow-hidden rounded-panel bg-[#4f86d6]", stretch && "aspect-[10/11] lg:aspect-auto lg:h-full")}>
      <Image src="/hero/terrace-row.jpg" alt="" fill sizes="(min-width: 1024px) 60vw, 100vw" className={cn("-z-10 object-cover", photo)} />
      <div
        ref={canvas}
        aria-hidden
        inert
        style={{ width: size.w, height: size.h, ...(scale === null ? {} : { zoom: scale }) }}
        className={cn("pointer-events-none overflow-hidden select-none", stretch ? "absolute top-0 left-0" : "relative", scale === null && "[zoom:0.33] sm:[zoom:0.55] lg:[zoom:0.52] xl:[zoom:0.68]")}
      >
        {children}
      </div>
      {/* While the story is on the other side, this box steps back so the eye goes where things are happening. */}
      <div aria-hidden className={cn("pointer-events-none absolute inset-0 bg-canvas transition-opacity duration-700", dim ? "opacity-45" : "opacity-0")} />
    </div>
  );
}

const CAPTIONS = [
  ["For you", "Rent lands in your bank, your Rent page updates and you're told the moment it arrives."],
  ["For your tenants", "Pay by bank in a tap, see every receipt, report a repair. Always free."],
];

export function SectionTwoSides() {
  const scene = useRef<HTMLDivElement>(null);
  const seen = useInView(scene, { amount: 0.3 });
  const still = useReducedMotion();
  const [step, setStep] = useState<Step>(DONE);
  const phoneCanvas = useRef<HTMLDivElement>(null);
  const [aim, setAim] = useState<[number, number] | null>(null);

  // Aim the pointer at the real button on the phone: its centre, measured, in the box's own (unscaled) units.
  useLayoutEffect(() => {
    const name = TARGET[step];
    const root = phoneCanvas.current;
    const el = name && root ? root.querySelector(`[data-target="${name}"]`) : null;
    if (!el || !root) return setAim(null);
    const a = root.getBoundingClientRect();
    const k = a.width / RIGHT.w;
    const b = el.getBoundingClientRect();
    setAim([(b.left + b.width * 0.8 - a.left) / k, (b.top + b.height * 0.55 - a.top) / k]);
  }, [step]);

  // The loop runs only while the boxes are on screen, from the start of the story each time.
  useEffect(() => {
    if (!seen || still) return;
    const timers: number[] = [];
    const play = () => {
      TIMES.forEach((t, i) => timers.push(window.setTimeout(() => setStep(i as Step), t)));
      timers.push(window.setTimeout(play, LOOP));
    };
    play();
    return () => {
      timers.forEach(clearTimeout);
      setStep(DONE);
    };
  }, [seen, still]);

  const playing = seen && !still;
  const windowShadow = "shadow-[0_1px_2px_rgb(20_20_20/0.12),0_30px_50px_-30px_rgb(30_28_40/0.55)]";

  return (
    <section aria-labelledby="sides-title" className="pt-16 sm:pt-24">
      <Column>
        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] xl:items-start">
          <h2 id="sides-title" className="text-[clamp(25px,3.8vw,52px)] leading-[1.06] tracking-[-0.03em] text-ink">
            Stop chasing rent.
            <br />
            It just turns up.
          </h2>
          <p className="max-w-[40rem] text-[17px] leading-[1.55] text-ink-2 xl:pt-2">
            Your tenant pays in one tap from their phone. You get told the moment it lands. No reminders to send, no awkward calls, no bank statements to check.
          </p>
        </div>

        {/* Two boxes side by side, each with its caption under it; boxes and captions share one grid so both rows line up. */}
        <div ref={scene} className="mt-10 grid grid-cols-[minmax(0,1fr)] gap-2 lg:mt-14 lg:grid-flow-col lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:grid-rows-[auto_auto]">
          <Box size={LEFT} photo="object-[0%_100%]" dim={playing && step < 7}>
            <div className={cn("absolute top-[72px] left-[40px] h-[960px] rounded-[12px]", windowShadow)}>
              <LandlordRent step={step} />
            </div>
          </Box>
          <div className="mb-8 px-1 pt-4 lg:mb-0 lg:pt-6">
            <p className="text-[17px] text-ink">{CAPTIONS[0][0]}</p>
            <p className="mt-1.5 max-w-[30rem] text-[15px] leading-[1.5] text-ink-2">{CAPTIONS[0][1]}</p>
          </div>
          <Box size={RIGHT} photo="object-[100%_100%]" stretch canvas={phoneCanvas} dim={playing && step >= 8}>
            <div className="absolute h-[844px] rounded-[34px] shadow-[0_1px_2px_rgb(20_20_20/0.14),0_34px_56px_-30px_rgb(30_28_40/0.65)]" style={{ top: PHONE.y, left: PHONE.x }}>
              <TenantPhone step={step} />
            </div>
            <Pointer at={aim} pressing={step === 2 || step === 6} tap={step === 2 || step === 6 ? step : null} />
          </Box>
          <div className="px-1 pt-4 lg:pt-6">
            <p className="text-[17px] text-ink">{CAPTIONS[1][0]}</p>
            <p className="mt-1.5 max-w-[30rem] text-[15px] leading-[1.5] text-ink-2">{CAPTIONS[1][1]}</p>
          </div>
        </div>
        <p className="sr-only">
          Nina Kowalski pays the £3,185.00 she owes from her phone with Pay by Bank. Her screen shows the payment received, and on the landlord&rsquo;s Rent page the notification arrives, received this month rises to £12,565 and overdue drops to £2,545.
        </p>
      </Column>
    </section>
  );
}
