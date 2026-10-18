"use client";

import { useState } from "react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { Choice } from "./choice";
import { Icon } from "./icon";
import { Column } from "./ui";
import { cn } from "@/lib/utils";

/*
 * The Pricing page's own piece: changing plan, drawn as the web app's plan change dialog (webapp
 * features/billing/components/plan-change-dialog.tsx), with its wording and amounts worked out the way
 * features/billing/preview.ts and lib/billing/rules.ts work them out. The workspace is on Advanced, paying monthly,
 * on 17 Oct 2026, with its period running 1 Oct to 1 Nov: 15 of 31 days left.
 */

type Move = "upgrade" | "annual" | "free";

const MOVES = [
  { value: "upgrade", label: "Upgrade" },
  { value: "annual", label: "Pay yearly" },
  { value: "free", label: "Move to Free" },
] as const;

/** Advanced and Professional, as the app seeds them, in pence. */
const ADVANCED = { month: 2999, year: 29999 };
const PROFESSIONAL_MONTH = 9999;
/** What is left of the period, as Stripe prorates it: 15 of 31 days. */
const LEFT = 15 / 31;
const credit = Math.round(ADVANCED.month * LEFT);
const upgradeCharge = Math.round(PROFESSIONAL_MONTH * LEFT) - credit;
const annualCharge = ADVANCED.year - credit;

const money = (pence: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 }).format(pence / 100);

const HOMES = [
  { title: "Flat 2, 14 Royal York Crescent", place: "Bristol BS8 4JX", keep: true },
  { title: "8 Cotham Vale", place: "Bristol BS6 6HR", keep: false },
  { title: "26 Headingley Mount", place: "Leeds LS6 3EL", keep: false },
];

const DIALOG: Record<Move, { title: string; summary: string[]; confirm: string; tone: "ink" | "danger"; picker?: boolean }> = {
  upgrade: {
    title: "Upgrade to Professional",
    summary: [`You pay ${money(upgradeCharge)} today for the rest of this period (prorated), and the new limits apply straight away.`, `Then ${money(PROFESSIONAL_MONTH)} a month from 1 Nov 2026.`],
    confirm: `Pay ${money(upgradeCharge)} and upgrade`,
    tone: "ink",
  },
  annual: {
    title: "Switch to annual billing",
    summary: [`You pay ${money(annualCharge)} today: ${money(ADVANCED.year)} for the year, less ${money(credit)} for the unused part of your current period.`, `Then ${money(ADVANCED.year)} a year from 17 Oct 2027.`],
    confirm: `Pay ${money(annualCharge)} and switch`,
    tone: "ink",
  },
  free: {
    title: "Cancel Advanced",
    summary: [
      "Nothing changes until 1 Nov 2026. Then you move to Free.",
      "Free includes 1 active property. Choose which stay active; the others lock.",
      "Locked properties are never deleted. You keep read-only access to their history, and tenants can still pay rent, report repairs and message you.",
    ],
    confirm: "Cancel on 1 Nov 2026",
    tone: "danger",
    picker: true,
  },
};

const ABOUT: Record<Move, { title: string; text: string }> = {
  upgrade: { title: "Straight away, prorated", text: "You pay only for what is left of the month, less what you already paid. More homes and your team are there the moment it goes through." },
  annual: { title: "A new year starts today", text: "The unused part of this month comes off the first yearly payment. On Advanced, that saves 17% against paying monthly." },
  free: { title: "At your renewal, nothing deleted", text: "You pick the homes that stay active. The rest lock with their history intact, and you can undo it any time before the date." },
};

/** The app's checkbox, as a picture: ink with a white tick when ticked, sunken when not. */
function Tick({ on }: { on: boolean }) {
  return (
    <span className={cn("flex size-5 shrink-0 items-center justify-center rounded-[3px]", on ? "bg-ink" : "bg-sunken")}>
      {on ? (
        <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5.5 10.5l3 3 6-7" />
        </svg>
      ) : null}
    </span>
  );
}

export function SectionPlanChange() {
  const [move, setMove] = useState<Move>("upgrade");
  const d = DIALOG[move];

  return (
    <section aria-labelledby="plan-change-title" className="pt-24 sm:pt-32">
      <Column className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-16">
        <div className="flex flex-col lg:py-4">
          <h2 id="plan-change-title" className="text-[clamp(28px,3.8vw,52px)] leading-[1.06] tracking-[-0.03em] text-ink">
            Change plan
            <br />
            whenever you like.
          </h2>
          <p className="mt-5 max-w-[30rem] text-[17px] leading-[1.55] text-ink-2">
            Move up and it starts straight away, charged only for the rest of the month. Move down and it waits for your renewal. Nothing is ever deleted.
          </p>
          <div className="mt-8">
            <p className="text-[15px] text-ink">On Advanced, paying monthly</p>
            <p className="mt-0.5 text-[14px] text-muted">Renews on 1 Nov 2026 at {money(ADVANCED.month)}</p>
            <Choice label="Change your plan" options={MOVES} value={move} onChange={setMove} className="mt-4 w-full sm:w-auto" />
          </div>
          <div className="mt-8 lg:mt-auto">
            <p className="text-[18px] leading-snug text-ink">{ABOUT[move].title}</p>
            <p className="mt-1.5 max-w-[28rem] text-[15px] leading-[1.5] text-ink-2">{ABOUT[move].text}</p>
          </div>
        </div>

        {/* The dialog, as the app draws it from the Billing page. A picture: the switch beside it drives it. */}
        <div aria-live="polite" className="brand-wash brand-wash-3 flex items-center rounded-panel lg:min-h-[560px] p-3 sm:p-8 lg:p-12">
          <div className="pointer-events-none w-full rounded-[10px] bg-canvas p-5 text-ink shadow-[0_1px_2px_rgb(20_20_20/0.1),0_24px_40px_-28px_rgb(30_28_40/0.5)] select-none sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <p className="text-[22px] leading-tight">{d.title}</p>
              <span aria-hidden className="flex size-9 shrink-0 items-center justify-center rounded-control bg-surface text-ink">
                <Icon icon={Cancel01Icon} size={18} />
              </span>
            </div>
            <div className="mt-4 flex flex-col gap-2.5 text-[14.5px] leading-relaxed text-ink-2">
              {d.summary.map((line) => (
                <p key={line}>{line}</p>
              ))}
            </div>
            {d.picker ? (
              <div className="mt-5">
                <p className="mb-2 flex items-baseline justify-between gap-3 px-1 text-[13px] text-ink-2">
                  <span>Properties that stay active</span>
                  <span className="text-muted tabular">1 of 1 chosen</span>
                </p>
                <ul className="flex flex-col gap-1">
                  {HOMES.map((h) => (
                    <li key={h.title} className="flex items-center gap-3.5 rounded-tile bg-surface px-4 py-3">
                      <Tick on={h.keep} />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14.5px] text-ink">{h.title}</span>
                        <span className="block text-[12.5px] text-muted">{h.place}</span>
                      </span>
                      <span className={cn("text-[12.5px]", h.keep ? "text-good" : "text-muted")}>{h.keep ? "Stays active" : "Locks"}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 px-1 text-[14px] leading-relaxed text-ink-2">Your properties, tenancies, rent history and documents all stay. You can resume your plan before then.</p>
              </div>
            ) : null}
            <div className="mt-6 flex justify-end">
              <span className={cn("inline-flex h-11 items-center rounded-control px-5 text-[14.5px]", d.tone === "ink" ? "bg-ink text-white" : "bg-bad-soft text-bad")}>{d.confirm}</span>
            </div>
          </div>
        </div>
      </Column>
    </section>
  );
}
