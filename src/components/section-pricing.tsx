"use client";

import { useState } from "react";
import { Column } from "./ui";
import { StartLink } from "./start-link";
import { cn } from "@/lib/utils";

/*
 * Pricing as three cards (the user's pick) under a centred Annual / Monthly switch, billed annually by default: each card shows the annual price a month at a
 * time, how it is billed and what paying yearly saves, then the app's own comparison rows. One subgrid runs across
 * the cards so every row lines up. The plans are exactly as the web app seeds them
 * (supabase/migrations/20261002000500_billing.sql: names, taglines, prices, entitlements) and the rows are the app's
 * plan comparison (lib/billing/rules.ts). Prices, VAT and the trial are still open decisions in the spec.
 */

const PLANS = [
  { code: "free", name: "Free", tagline: "One property, everything you need to run it", monthly: 0, yearly: 0 },
  { code: "advanced", name: "Advanced", tagline: "Up to ten properties with online rent collection", monthly: 2999, yearly: 29999 },
  { code: "professional", name: "Professional", tagline: "Unlimited properties, staff and no collection fee", monthly: 9999, yearly: 110000 },
] as const;

type Plan = (typeof PLANS)[number];

/** The app's plan comparison, one cell per plan. `off` marks the cells the app shows as not included. */
const FEATURES: { label: string; cells: [string, string, string]; off?: [boolean, boolean, boolean] }[] = [
  { label: "Active properties", cells: ["1", "Up to 10", "Unlimited"] },
  { label: "Fee on rent collected online", cells: ["5% to DirectHomes", "5% to DirectHomes", "No DirectHomes fee"] },
  { label: "Card payments from tenants", cells: ["Available", "Available", "Available"] },
  { label: "Staff accounts", cells: ["Owner only", "Owner only", "25 included"] },
  { label: "Extra staff seats", cells: ["Not available", "Not available", "£50 each, one-off"], off: [true, true, false] },
  { label: "Roles and property assignment", cells: ["Not included", "Not included", "Included"], off: [true, true, false] },
  { label: "Priority support", cells: ["Not included", "Not included", "Included"], off: [true, true, false] },
];

const exact = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 });
const money = (pence: number) => exact.format(pence / 100);
/** Whole pounds without pence, as the app writes yearly prices: £1,100, £299.99. */
const short = (pence: number) => (pence % 100 === 0 ? `£${(pence / 100).toLocaleString("en-GB")}` : money(pence));
/** The annual price split over twelve months, or the monthly price. */
const perMonth = (p: Plan, yearly: boolean) => (yearly ? Math.round(p.yearly / 12) : p.monthly);
/** What paying annually saves against twelve monthly payments: £59.89 and £99.88. */
const saved = (p: Plan) => p.monthly * 12 - p.yearly;
/** The same saving as the app rounds it: 17% and 8%. */
const savedPercent = (p: Plan) => (p.monthly ? Math.round((1 - p.yearly / (p.monthly * 12)) * 100) : 0);

function Price({ p, yearly, dark }: { p: Plan; yearly: boolean; dark: boolean }) {
  return (
    <div>
      <p>
        <span className="text-[44px] leading-none font-light tracking-[-0.02em] tabular">{p.monthly ? money(perMonth(p, yearly)) : "£0"}</span>
        <span className={cn("ml-2 text-[13px]", dark ? "text-white/70" : "text-muted")}>{p.monthly ? "a month" : "for ever"}</span>
      </p>
      <p className={cn("mt-2.5 text-[13.5px] tabular", dark ? "text-white/70" : "text-ink-2")}>
        {!p.monthly ? "No card needed" : yearly ? `${short(p.yearly)} billed yearly` : `${money(p.monthly)} billed monthly`}
      </p>
      {/* Always holds its line, so the cards stay level when Free has nothing to save. */}
      <p className={cn("mt-0.5 min-h-[20px] text-[13.5px] tabular", dark ? "text-[#9fe08a]" : "text-good")}>
        {!p.monthly ? " " : yearly ? `You save ${money(saved(p))} a year (${savedPercent(p)}%)` : `Save ${money(saved(p))} a year paying annually`}
      </p>
    </div>
  );
}

export function SectionPricing() {
  const [yearly, setYearly] = useState(true);
  const best = Math.max(...PLANS.map(savedPercent));

  return (
    <section id="pricing" aria-labelledby="pricing-title" className="scroll-mt-[-56px] pt-24 sm:scroll-mt-[-88px] sm:pt-32">
      <Column>
        <h2 id="pricing-title" className="text-center text-[clamp(32px,4.2vw,56px)] leading-[1.04] tracking-[-0.03em] text-ink">
          Free for one home.
          <br />
          From {short(Math.min(...PLANS.filter((p) => p.monthly).map((p) => perMonth(p, true))))} a month for more.
        </h2>

        {/* Annual or monthly: one tray holding both, centred over the cards. The ink thumb slides under the picked
            half; the two halves are equal width, so it moves by exactly its own width plus the gap. */}
        <div className="mt-12 flex justify-center lg:mt-14">
          <div role="radiogroup" aria-label="Billing interval" className="relative grid grid-cols-2 gap-1 rounded-[8px] bg-panel-solid p-1">
            <span
              aria-hidden
              className="absolute inset-y-1 left-1 w-[calc(50%-6px)] rounded-control bg-ink transition-transform duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] motion-reduce:transition-none"
              style={{ transform: yearly ? "translateX(0)" : "translateX(calc(100% + 4px))" }}
            />
            {[true, false].map((y) => (
              <button
                key={String(y)}
                type="button"
                role="radio"
                aria-checked={yearly === y}
                onClick={() => setYearly(y)}
                className={cn("relative h-11 rounded-control px-5 text-[14.5px] whitespace-nowrap transition-colors duration-300", yearly === y ? "text-white" : "text-ink-2 hover:text-ink")}
              >
                {y ? `Annual, save up to ${best}%` : "Monthly"}
              </button>
            ))}
          </div>
        </div>

        {/* One subgrid across the cards, so name, price, list and button share a line in every card. */}
        <ul className="mt-6 grid gap-2 lg:grid-cols-3 lg:grid-rows-[auto_auto_1fr_auto]">
          {PLANS.map((p, i) => {
            const dark = p.code === "professional";
            return (
              <li key={p.code} className={cn("grid gap-6 rounded-panel p-6 lg:row-span-4 lg:grid-rows-subgrid", dark ? "bg-ink text-white" : "bg-panel-solid text-ink")}>
                <div>
                  <h3 className="text-[22px] leading-tight">{p.name}</h3>
                  <p className={cn("mt-1 text-[14px] leading-snug", dark ? "text-white/75" : "text-ink-2")}>{p.tagline}</p>
                </div>
                <Price p={p} yearly={yearly} dark={dark} />
                <ul className={cn("flex flex-col gap-2.5 border-t pt-5 text-[13.5px]", dark ? "border-white/15" : "border-ink/10")}>
                  {FEATURES.map((f) => (
                    <li key={f.label} className="flex justify-between gap-4">
                      <span className={dark ? "text-white/65" : "text-muted"}>{f.label}</span>
                      <span className={cn("text-right", f.off?.[i] && (dark ? "text-white/45" : "text-faint"))}>{f.cells[i]}</span>
                    </li>
                  ))}
                </ul>
                <StartLink
                  arrow={17}
                  className={cn(
                    "group inline-flex h-11 w-full items-center justify-center gap-2 rounded-control px-5 text-[15px] transition-colors",
                    dark ? "bg-white text-ink hover:bg-white/85" : "bg-surface text-ink hover:bg-white",
                  )}
                />
              </li>
            );
          })}
        </ul>
      </Column>
    </section>
  );
}
