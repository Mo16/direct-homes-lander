"use client";

import { useState } from "react";
import { CheckmarkCircle02Icon, Clock01Icon, Mail01Icon, Notification03Icon } from "@hugeicons/core-free-icons";
import { Choice } from "./choice";
import { Icon } from "./icon";
import { Count, exact } from "./tour-kit";
import { Column, SectionHead, Status } from "./ui";
import { cn } from "@/lib/utils";

/*
 * Two pieces of the Rent collection page, both drawn from the web app's own screens and words:
 * - What reaches your bank: the Money and Details panels of a payment's page (webapp rent/payments/[id]), for one
 *   £1,000.00 rent payment. Pick how it was paid and which plan you are on; the fees and the net work themselves out
 *   with Stripe's published rates and DirectHomes' fee (spec section 11).
 * - The reminders: the four the app sends a tenant (features/rent/server/jobs.ts), in its own words, and what
 *   auto-pay does to them.
 */

/* ---------- What reaches your bank ---------- */

type Method = "pay_by_bank" | "bacs_debit" | "bank_transfer";
type Plan = "advanced" | "professional";

const METHODS = [
  { value: "pay_by_bank", label: "Pay by Bank" },
  { value: "bacs_debit", label: "Direct Debit" },
  { value: "bank_transfer", label: "Bank transfer" },
] as const;

const PLANS = [
  { value: "advanced", label: "Free or Advanced" },
  { value: "professional", label: "Professional" },
] as const;

const GROSS = 100000;

/** Stripe's fee on a payment, in pence: Pay by Bank 0.5% + 20p capped at £5, Bacs Direct Debit 1% capped at £4. */
function stripeFee(m: Method, pence: number) {
  if (m === "pay_by_bank") return Math.min(Math.round(pence * 0.005) + 20, 500);
  if (m === "bacs_debit") return Math.min(Math.round(pence * 0.01), 400);
  return 0;
}

const ABOUT: Record<Method, { title: string; text: string }> = {
  pay_by_bank: { title: "Approved in their banking app", text: "It confirms straight away and can't be charged back. It's the Pay now button tenants see first." },
  bacs_debit: { title: "Auto-pay on the due date", text: "Collected by Direct Debit and confirmed in about 4 working days, or 7 the first time." },
  bank_transfer: { title: "Collected your own way", text: "Standing orders, transfers, cash or cheques, recorded against the ledger in seconds. No fees at all." },
};

function Row({ label, value, strong, muted }: { label: string; value: React.ReactNode; strong?: boolean; muted?: boolean }) {
  return (
    <div className={cn("flex items-baseline justify-between gap-4 py-2.5", strong && "mt-1 border-t border-ink/10 pt-3.5")}>
      <span className={muted ? "text-[13.5px] text-muted" : "text-[14px] text-ink-2"}>{label}</span>
      <span className={cn("tabular", strong ? "text-[20px] text-ink" : "text-[14.5px] text-ink")}>{value}</span>
    </div>
  );
}

function Detail({ label, children, wide }: { label: string; children: React.ReactNode; wide?: boolean }) {
  return (
    <div className={cn("flex flex-col gap-1", wide && "col-span-2")}>
      <span className="text-[12.5px] text-muted">{label}</span>
      <span className="text-[14px] text-ink">{children}</span>
    </div>
  );
}

export function SectionPaymentMoney() {
  const [method, setMethod] = useState<Method>("pay_by_bank");
  const [plan, setPlan] = useState<Plan>("advanced");
  const online = method !== "bank_transfer";
  const stripe = stripeFee(method, GROSS);
  const bps = online && plan === "advanced" ? 500 : 0;
  const ours = Math.round((GROSS * bps) / 10000);
  const net = GROSS - stripe - ours;
  const label = METHODS.find((m) => m.value === method)!.label;

  return (
    <section aria-labelledby="money-title" className="pt-24 sm:pt-32">
      <Column>
        <SectionHead
          id="money-title"
          title={
            <>
              Every penny accounted for,
              <br />
              before it reaches you.
            </>
          }
          text="Each payment has its own page: what the tenant paid, what Stripe and DirectHomes took, and what lands in your bank. Your tenants always pay exactly the rent."
        />

        <div className="brand-wash mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 rounded-panel p-4 sm:p-8 lg:mt-14 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-12 lg:p-12">
          {/* The two choices, and what the picked method means. */}
          <div className="flex flex-col gap-8 px-1 pt-2 sm:px-0">
            <div>
              <p className="text-[15px] text-ink">How the tenant paid</p>
              <Choice label="How the tenant paid" options={METHODS} value={method} onChange={setMethod} className="mt-3 w-full sm:w-auto" />
            </div>
            <div className={cn("transition-opacity duration-300", !online && "opacity-45")}>
              <p className="text-[15px] text-ink">Your plan</p>
              <Choice label="Your plan" options={PLANS} value={plan} onChange={setPlan} className="mt-3 w-full sm:w-auto" />
            </div>
            <div className="mt-auto lg:pb-2">
              <p className="text-[18px] leading-snug text-ink">{ABOUT[method].title}</p>
              <p className="mt-1.5 max-w-[26rem] text-[15px] leading-[1.5] text-ink-2">{ABOUT[method].text}</p>
            </div>
          </div>

          {/* The payment's page, as the app draws it. */}
          <div aria-live="polite" className="rounded-[10px] bg-canvas p-2 text-ink shadow-[0_1px_2px_rgb(20_20_20/0.1),0_24px_40px_-28px_rgb(30_28_40/0.5)]">
            <div className="px-3 pt-3 pb-4">
              <p className="text-[22px] leading-tight">Payment</p>
              <p className="mt-1 text-[13.5px] text-muted">
                Arjun Mehta · Room 1, 17 Lavender Grove · {label} on 1 Oct 2026
              </p>
            </div>
            <div className="grid gap-2 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
              <div className="panel p-5">
                <p className="text-[17px] leading-tight">Money</p>
                <p className="mt-1 min-h-[2.8em] text-[13px] leading-snug text-muted">
                  {online ? "Stripe deducts its fee from your Stripe account; DirectHomes takes its fee as the payment lands." : "Recorded payments carry no fees."}
                </p>
                <div className="mt-3">
                  <Row label="Gross from tenant" value={exact(GROSS)} />
                  <Row label="Stripe processing fee" muted={!online} value={online ? <>-<Count value={stripe} format={exact} /></> : "None"} />
                  <Row label={`DirectHomes fee (${bps / 100}%)`} muted={!online} value={online ? <>-<Count value={ours} format={exact} /></> : "None"} />
                  <Row label="Net to you" strong value={<Count value={net} format={exact} />} />
                </div>
              </div>
              <div className="panel grid grid-cols-2 content-start gap-x-4 gap-y-4 p-5">
                <p className="col-span-2 text-[17px] leading-tight">Details</p>
                <Detail label="Status">
                  <Status kind="paid">Paid</Status>
                </Detail>
                <Detail label="Source">{online ? "Online" : "Recorded by landlord"}</Detail>
                <Detail label="Received">1 Oct 2026</Detail>
                <Detail label="Reference">{online ? "DH-1042" : "MEHTA OCT RENT"}</Detail>
                <Detail label="Receipt" wide>
                  Receipt 0187, emailed to Arjun
                </Detail>
                <Detail label="Payout" wide>
                  {online ? "Paid out by Stripe on its normal schedule" : "Not an online payment"}
                </Detail>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-4 px-1 text-[13px] leading-[1.55] text-muted">
          Stripe&rsquo;s fees as published: Pay by Bank 0.5% + 20p, at most £5; Direct Debit 1%, at most £4. Card payments are off unless you switch them on. Fees and VAT are still being finalised before launch.
        </p>
      </Column>
    </section>
  );
}

/* ---------- The reminders ---------- */

const REMINDERS = [
  { on: "Thu 29 Oct", title: "Rent of £1,000.00 is due in 3 days", body: "Rent for Room 1, 17 Lavender Grove is due on 1 Nov 2026. Pay now in a few taps, or set up auto-pay so you never have to think about it.", soon: true },
  { on: "Mon 2 Nov", title: "Rent of £1,000.00 was due yesterday", body: "Rent for Room 1, 17 Lavender Grove was due on 1 Nov 2026. If you have already paid by bank transfer, tell us so your landlord can confirm it." },
  { on: "Sun 8 Nov", title: "Rent of £1,000.00 is 7 days overdue", body: "Rent for Room 1, 17 Lavender Grove was due on 1 Nov 2026. Pay now, or message your landlord if you need to agree a plan." },
  { on: "Sun 15 Nov", title: "Rent of £1,000.00 is 14 days overdue", body: "Rent for Room 1, 17 Lavender Grove was due on 1 Nov 2026 and is now 14 days late. Pay now or speak to your landlord." },
];

export function SectionReminders() {
  const [auto, setAuto] = useState<"off" | "on">("off");
  const on = auto === "on";
  return (
    <section aria-labelledby="reminders-title" className="pt-24 sm:pt-32">
      <Column className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="reminders-title" className="text-[clamp(28px,3.8vw,52px)] leading-[1.06] tracking-[-0.03em] text-ink">
            The reminders
            <br />
            go out for you.
          </h2>
          <p className="mt-5 max-w-[30rem] text-[17px] leading-[1.55] text-ink-2">
            Three days before rent is due, then a day, a week and two weeks after, by email and in the app. They stop the moment it&rsquo;s paid, so nobody gets nagged for rent that has arrived.
          </p>
          <div className="mt-8">
            <p className="text-[15px] text-ink">The tenant&rsquo;s auto-pay</p>
            <Choice
              label="The tenant's auto-pay"
              options={[
                { value: "off", label: "Off" },
                { value: "on", label: "On" },
              ]}
              value={auto}
              onChange={setAuto}
              className="mt-3"
            />
          </div>
        </div>

        {/* What lands in the tenant's inbox, in the app's words. */}
        <ol aria-live="polite" className="brand-wash brand-wash-2 flex flex-col gap-2 rounded-panel p-2 sm:p-3">
          {REMINDERS.map((r, i) => {
            const skipped = on && r.soon;
            const onlyIf = on && !r.soon;
            return (
              <li key={r.on} className={cn("grid grid-cols-[22px_minmax(0,1fr)] gap-x-3.5 rounded-[8px] p-5 transition-colors duration-500 sm:p-6", skipped ? "bg-white/20" : "bg-white/60")}>
                <Icon icon={i === 0 ? Notification03Icon : Mail01Icon} size={20} className={cn("mt-0.5 transition-colors", skipped ? "text-faint" : "text-ink")} />
                <div className="min-w-0">
                  <p className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <span className={cn("text-[16px] leading-snug transition-colors", skipped ? "text-muted" : "text-ink")}>{r.title}</span>
                    <span className="text-[13px] text-muted tabular">{r.on}</span>
                  </p>
                  <p className={cn("mt-1.5 text-[14.5px] leading-[1.5] transition-colors", skipped ? "text-faint" : "text-ink-2")}>{r.body}</p>
                  {skipped ? (
                    <p className="mt-3 flex items-center gap-1.5 text-[13px] text-good">
                      <Icon icon={CheckmarkCircle02Icon} size={15} />
                      Not sent: Direct Debit collects it on the due date
                    </p>
                  ) : onlyIf ? (
                    <p className="mt-3 flex items-center gap-1.5 text-[13px] text-muted">
                      <Icon icon={Clock01Icon} size={15} />
                      Only if the collection doesn&rsquo;t arrive
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ol>
      </Column>
    </section>
  );
}
