"use client";

import { useState } from "react";
import {
  Alert02Icon,
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  BankIcon,
  Calculator01Icon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  JusticeScale01Icon,
  Loading03Icon,
  MinusSignCircleIcon,
  Mosque01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { ChoiceWrap } from "./choice-wrap";
import { Icon } from "./icon";
import { Column, SectionHead } from "./ui";
import { cn } from "@/lib/utils";

/*
 * Help & Services, drawn from the web app's own pages and words:
 * - The stage: a category's request page (webapp app/(landlord)/services/[category] with features/services/components/
 *   intake-form.tsx), for each of the five categories the app seeds (scripts/seed.ts): their names, descriptions,
 *   intake questions, disclosure and the consent sentence from features/services/rules.ts. The consent box is unticked.
 * - Your requests: the requests list and a request's Progress and consent panels (services/requests/[id]), with the
 *   app's four steps and its labels (Submitted, Contacted, In progress, Completed; Closed or Cancelled in place of
 *   Completed when a request ends early).
 */

/* ---------- The categories, as the app seeds them ---------- */

type Slug = "islamic" | "btl" | "insurance" | "tax" | "legal";

type Question = { label: string; answer: string; select?: boolean };

type Category = {
  slug: Slug;
  tab: string;
  name: string;
  description: string;
  icon: IconSvgElement;
  regulated?: boolean;
  /** The partner kind the disclosure names. */
  partner: string;
  property: string;
  questions: Question[];
  notes?: string;
  phone?: boolean;
  time: string;
};

const CATEGORIES: Category[] = [
  {
    slug: "islamic",
    tab: "Islamic finance",
    name: "Islamic finance",
    description: "Introductions to FCA-authorised providers of Sharia-compliant buy-to-let finance.",
    icon: Mosque01Icon,
    regulated: true,
    partner: "an FCA-authorised Islamic finance provider",
    property: "Not about one property",
    questions: [
      { label: "Property value", answer: "£285,000" },
      { label: "Finance amount", answer: "£200,000" },
      { label: "When do you need it?", answer: "Within 3 months", select: true },
    ],
    notes: "Buying a two-bed flat in Bristol to let.",
    time: "Weekday evenings",
  },
  {
    slug: "btl",
    tab: "Mortgages",
    name: "Buy-to-let mortgages and remortgages",
    description: "Speak to a whole-of-market broker about a new mortgage or a remortgage when your fix ends.",
    icon: BankIcon,
    regulated: true,
    partner: "an FCA-authorised mortgage broker",
    property: "26 Headingley Mount, LS6 3EL",
    questions: [
      { label: "Property value", answer: "£340,000" },
      { label: "Loan amount", answer: "£210,000" },
      { label: "When do you need it?", answer: "Within 3 months", select: true },
    ],
    notes: "My five-year fix ends in January.",
    phone: true,
    time: "Weekday mornings",
  },
  {
    slug: "insurance",
    tab: "Insurance",
    name: "Landlord insurance",
    description: "Buildings, contents and liability cover for rented homes.",
    icon: Shield01Icon,
    partner: "an insurance broker",
    property: "Not about one property",
    questions: [
      { label: "How many properties?", answer: "6" },
      { label: "When is your renewal?", answer: "1 December" },
    ],
    time: "Any time",
  },
  {
    slug: "tax",
    tab: "Accounting and tax",
    name: "Accounting and tax",
    description: "Accountants who understand landlords, including Making Tax Digital.",
    icon: Calculator01Icon,
    partner: "an accountant",
    property: "Not about one property",
    questions: [
      { label: "How do you own your properties?", answer: "Personally", select: true },
      { label: "Are you already using MTD software?", answer: "Not sure", select: true },
    ],
    time: "Any time",
  },
  {
    slug: "legal",
    tab: "Legal",
    name: "Legal and conveyancing",
    description: "Solicitors for purchases, sales, possession and tenancy questions.",
    icon: JusticeScale01Icon,
    partner: "a solicitor",
    property: "15 St Leonard's Road, EX2 4LA",
    questions: [{ label: "What do you need help with?", answer: "Selling", select: true }],
    notes: "The tenancy ends on 3 Nov and I plan to sell.",
    phone: true,
    time: "Weekday afternoons",
  },
];

const disclosure = (partner: string) =>
  `DirectHomes introduces you to ${partner}; we do not give advice or recommend products. If you go ahead, DirectHomes may receive a referral fee from the partner. Your details are shared only with your consent.`;

const consent = (withProperty: boolean) =>
  `I agree that DirectHomes may share ${withProperty ? "my name, email address, phone number (if I give one), the property address and my answers on this form" : "my name, email address, phone number (if I give one) and my answers on this form"} with the professional DirectHomes introduces me to, so they can contact me about this request. I understand DirectHomes does not give advice.`;

/* ---------- The app's form pieces, as pictures ---------- */

function Field({ label, optional, hint, children, className }: { label: string; optional?: boolean; hint?: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <span className="flex items-baseline justify-between gap-2 px-1 text-[13px] text-ink-2">
        {label}
        {optional ? <span className="text-[12px] text-faint">Optional</span> : null}
      </span>
      {children}
      {hint ? <span className="px-1 text-[12.5px] leading-snug text-muted">{hint}</span> : null}
    </div>
  );
}

function Box({ children, select, tall }: { children: React.ReactNode; select?: boolean; tall?: boolean }) {
  return (
    <span className={cn("relative flex w-full rounded-[6px] bg-surface px-4 text-[15px] text-ink", tall ? "min-h-20 py-3 leading-relaxed" : "h-12 items-center", select && "pr-11")}>
      <span className="truncate">{children}</span>
      {select ? <Icon icon={ArrowDown01Icon} size={18} className="absolute top-1/2 right-4 -translate-y-1/2 text-muted" /> : null}
    </span>
  );
}

/* ---------- The stage: a category's request page ---------- */

export function ServicesStage() {
  const [slug, setSlug] = useState<Slug>("btl");
  const c = CATEGORIES.find((x) => x.slug === slug)!;
  const withProperty = c.property !== "Not about one property";

  return (
    <div className="brand-wash rounded-panel p-2 sm:p-6 lg:p-10">
      <div className="flex flex-col items-start gap-3 px-1 pt-1 sm:flex-row sm:items-center sm:gap-5 sm:px-0 sm:pt-0">
        <p className="text-[15px] text-ink">Request help with</p>
        <ChoiceWrap label="Request help with" options={CATEGORIES.map((x) => ({ value: x.slug, label: x.tab }))} value={slug} onChange={setSlug} />
      </div>

      {/* The category's request page, as the app draws it. A picture: the switch above drives it. */}
      <div aria-live="polite" className="pointer-events-none mt-4 rounded-[10px] bg-canvas p-2 text-ink shadow-[0_1px_2px_rgb(20_20_20/0.1),0_24px_40px_-28px_rgb(30_28_40/0.5)] select-none sm:mt-6">
        <div className="flex items-start justify-between gap-6 px-3 pt-3 pb-5 sm:px-4 sm:pt-4">
          <div className="min-w-0">
            <p className="text-[clamp(22px,2.4vw,30px)] leading-tight tracking-[-0.02em]">{c.name}</p>
            <p className="mt-1 max-w-[40rem] text-[14px] leading-snug text-muted">{c.description}</p>
          </div>
          <span className="hidden h-11 shrink-0 items-center gap-2 rounded-control bg-surface px-4 text-[14px] text-ink sm:inline-flex">
            <Icon icon={ArrowLeft01Icon} size={17} />
            All services
          </span>
        </div>

        <div className="grid gap-2 lg:grid-cols-12 lg:items-start">
          <div className="panel p-5 sm:p-6 lg:col-span-7">
            <p className="text-[18px] leading-tight">Request help</p>
            <p className="mt-1 text-[13.5px] leading-snug text-muted">Takes about a minute. Only answer what you are happy to share.</p>
            <div className="mt-5 flex flex-col gap-5">
              <Field label="Which property is this about?" optional>
                <Box select>{c.property}</Box>
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                {c.questions.map((q) => (
                  <Field key={q.label} label={q.label} optional>
                    <Box select={q.select}>{q.answer}</Box>
                  </Field>
                ))}
              </div>
              <Field label="Anything else we should know?" optional hint="For example your current deal, dates that matter, or what you have tried." className="hidden sm:flex">
                <Box tall>{c.notes ?? ""}</Box>
              </Field>
              <div className="flex flex-col gap-1.5">
                <span className="px-1 text-[13px] text-ink-2">How should we contact you?</span>
                <span className="mt-1.5 flex gap-2">
                  {["Email", "Phone"].map((m) => (
                    <span key={m} className={cn("inline-flex h-11 items-center rounded-control px-5 text-[14px]", (m === "Phone") === Boolean(c.phone) ? "bg-ink text-white" : "bg-surface text-ink-2")}>
                      {m}
                    </span>
                  ))}
                </span>
              </div>
              <div className="hidden gap-4 sm:grid sm:grid-cols-2">
                <Field label="Phone number" optional hint="Needed if you would like a call.">
                  <Box>{c.phone ? "07700 900123" : <span className="text-faint">07700 900123</span>}</Box>
                </Field>
                <Field label="Best time to reach you">
                  <Box select>{c.time}</Box>
                </Field>
              </div>
              {/* The consent box: always unticked to start with. */}
              <div className="rounded-tile bg-surface px-3 py-3">
                <div className="flex items-start gap-3 px-1 py-1">
                  <span className="mt-0.5 size-5 shrink-0 rounded-[3px] bg-sunken" />
                  <span className="flex flex-col gap-0.5">
                    <span className="text-[14.5px] leading-snug text-ink">{consent(withProperty)}</span>
                    <span className="text-[13px] leading-snug text-muted">You can cancel the request at any time before it is complete.</span>
                  </span>
                </div>
              </div>
              <div className="flex justify-end">
                <span className="inline-flex h-12 items-center rounded-control bg-ink px-6 text-[15px] text-white">Send request</span>
              </div>
            </div>
          </div>

          <div className="panel p-5 sm:p-6 lg:col-span-5">
            <p className="text-[18px] leading-tight">Before you send</p>
            <div className="mt-4 flex items-start gap-3 rounded-tile bg-warn-soft px-4 py-3.5 text-warn">
              <Icon icon={Alert02Icon} size={19} className="mt-0.5" />
              <div className="min-w-0 text-[14px] leading-snug">
                <p className="font-medium">We introduce, we do not advise</p>
                <p className="mt-0.5 opacity-90">{disclosure(c.partner)}</p>
              </div>
            </div>
            <dl className="mt-4 flex flex-col gap-2">
              <div className="rounded-tile bg-surface px-4 py-3">
                <dt className="text-[12.5px] text-muted">Who helps</dt>
                <dd className="mt-0.5 text-[14.5px] text-ink">A professional DirectHomes introduces you to</dd>
              </div>
              {c.regulated ? (
                <div className="rounded-tile bg-surface px-4 py-3">
                  <dt className="text-[12.5px] text-muted">FCA firm reference number</dt>
                  <dd className="mt-0.5 text-[14.5px] text-ink">Shown before we share your details</dd>
                </div>
              ) : null}
              <div className="rounded-tile bg-surface px-4 py-3">
                <dt className="text-[12.5px] text-muted">What happens next</dt>
                <dd className="mt-0.5 text-[14px] leading-snug text-ink-2">
                  Someone from DirectHomes contacts you within 1 working day. Your details go to the partner only after that, and only because you ticked the box. You will see each update on your requests page.
                </dd>
              </div>
              <div className="rounded-tile bg-surface px-4 py-3">
                <dt className="text-[12.5px] text-muted">How long we keep it</dt>
                <dd className="mt-0.5 text-[14px] leading-snug text-ink-2">Requests are kept for 2 years after they close, then deleted.</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- The guardrails ---------- */

const RULES = [
  { title: "Nothing goes out until you tick the box.", text: "The box starts unticked and says exactly what is shared and with whom. Your details reach a partner only after someone from DirectHomes has spoken to you." },
  { title: "We introduce. Partners advise.", text: "DirectHomes never gives advice and never recommends a product. The professional you are introduced to does that." },
  { title: "Referral fees, said up front.", text: "If you go ahead, DirectHomes may receive a referral fee from the partner. Every service tells you so before you send anything." },
  { title: "The FCA reference, before your details.", text: "For mortgages and Islamic finance, the firm’s FCA reference number is shown before anything about you is shared." },
];

export function SectionServiceRules() {
  return (
    <section aria-labelledby="rules-title" className="pt-24 sm:pt-32">
      <Column className="grid gap-10 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-16">
        <div>
          <h2 id="rules-title" className="text-[clamp(28px,3.8vw,52px)] leading-[1.06] tracking-[-0.03em] text-ink">
            Your details move
            <br />
            only when you say.
          </h2>
          <p className="mt-5 max-w-[26rem] text-[17px] leading-[1.55] text-ink-2">On every plan, for the owner or an admin of the workspace to ask.</p>
        </div>
        <ul className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:pt-2">
          {RULES.map((r) => (
            <li key={r.title} className="flex flex-col">
              <p className="text-[clamp(21px,1.9vw,25px)] leading-[1.2] tracking-[-0.015em] text-balance text-ink">{r.title}</p>
              <p className="mt-2.5 text-[15px] leading-[1.55] text-ink-2">{r.text}</p>
            </li>
          ))}
        </ul>
      </Column>
    </section>
  );
}

/* ---------- Your requests ---------- */

type StepKey = "new" | "contacted" | "in_progress" | "completed" | "closed" | "cancelled";
const LABEL: Record<StepKey, string> = { new: "Submitted", contacted: "Contacted", in_progress: "In progress", completed: "Completed", closed: "Closed", cancelled: "Cancelled" };
const TONE: Record<StepKey, { icon: IconSvgElement; tone: string }> = {
  new: { icon: Clock01Icon, tone: "text-ink-2" },
  contacted: { icon: Loading03Icon, tone: "text-info" },
  in_progress: { icon: Loading03Icon, tone: "text-info" },
  completed: { icon: CheckmarkCircle02Icon, tone: "text-good" },
  closed: { icon: MinusSignCircleIcon, tone: "text-muted" },
  cancelled: { icon: MinusSignCircleIcon, tone: "text-muted" },
};

type Request = {
  id: string;
  service: string;
  property: string | null;
  sent: string;
  state: StepKey;
  /** When each step was reached; a missing one was not. */
  at: Partial<Record<StepKey, string>>;
  told: [string, string][];
  outcome?: string;
  withProperty: boolean;
};

const REQUESTS: Request[] = [
  {
    id: "btl",
    service: "Buy-to-let mortgages and remortgages",
    property: "26 Headingley Mount",
    sent: "14 Oct 2026, 09:12",
    state: "in_progress",
    at: { new: "14 Oct 2026, 09:12", contacted: "14 Oct 2026, 15:40", in_progress: "16 Oct 2026, 11:05" },
    told: [
      ["Contact by", "Phone · Weekday mornings"],
      ["Loan amount", "£210,000"],
      ["When do you need it?", "Within 3 months"],
    ],
    withProperty: true,
  },
  {
    id: "insurance",
    service: "Landlord insurance",
    property: null,
    sent: "16 Oct 2026, 19:48",
    state: "contacted",
    at: { new: "16 Oct 2026, 19:48", contacted: "17 Oct 2026, 10:02" },
    told: [
      ["Contact by", "Email · Any time"],
      ["How many properties?", "6"],
      ["When is your renewal?", "1 December"],
    ],
    withProperty: false,
  },
  {
    id: "tax",
    service: "Accounting and tax",
    property: null,
    sent: "2 Sept 2026, 08:30",
    state: "completed",
    at: { new: "2 Sept 2026, 08:30", contacted: "2 Sept 2026, 14:15", in_progress: "4 Sept 2026, 10:00", completed: "22 Sept 2026, 16:20" },
    told: [
      ["Contact by", "Email · Any time"],
      ["How do you own your properties?", "Personally"],
      ["Are you already using MTD software?", "Not sure"],
    ],
    outcome: "Introduced to an accountant who works with landlords.",
    withProperty: false,
  },
  {
    id: "legal",
    service: "Legal and conveyancing",
    property: "15 St Leonard's Road",
    sent: "20 Aug 2026, 17:05",
    state: "cancelled",
    at: { new: "20 Aug 2026, 17:05", cancelled: "21 Aug 2026, 09:30" },
    told: [
      ["Contact by", "Phone · Weekday afternoons"],
      ["What do you need help with?", "Selling"],
    ],
    withProperty: true,
  },
];

function StatusWord({ state, className }: { state: StepKey; className?: string }) {
  const t = TONE[state];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[13.5px] whitespace-nowrap", t.tone, className)}>
      <Icon icon={t.icon} size={16} />
      {LABEL[state]}
    </span>
  );
}

/** The four steps, as the app's timeline() builds them: an early end takes the last step's place. */
function steps(r: Request): { key: StepKey; at?: string; reached: boolean; current: boolean; skipped: boolean }[] {
  const flow: StepKey[] = ["new", "contacted", "in_progress", "completed"];
  const ended = r.state === "closed" || r.state === "cancelled";
  const keys = ended ? [...flow.slice(0, 3), r.state] : flow;
  return keys.map((k) => ({ key: k, at: r.at[k], reached: Boolean(r.at[k]), current: k === r.state, skipped: ended && !r.at[k] }));
}

export function SectionRequests() {
  const [id, setId] = useState("btl");
  const r = REQUESTS.find((x) => x.id === id)!;

  return (
    <section aria-labelledby="requests-title" className="pt-24 sm:pt-32">
      <Column>
        <SectionHead
          id="requests-title"
          title={
            <>
              Every request,
              <br />
              followed to the end.
            </>
          }
          text="Each update from the DirectHomes team shows on the request and in your notifications. Cancel any time before it is complete. Pick a request to see it."
        />

        <div className="brand-wash brand-wash-2 mt-10 rounded-panel p-2 sm:p-6 lg:mt-14 lg:p-10">
          <div className="grid gap-2 rounded-[10px] bg-canvas p-2 text-ink shadow-[0_1px_2px_rgb(20_20_20/0.1),0_24px_40px_-28px_rgb(30_28_40/0.5)] lg:grid-cols-12">
            {/* The requests list: these rows are real, and pick the request shown beside them. */}
            <div className="panel p-4 sm:p-5 lg:col-span-5">
              <p className="px-1 text-[18px] leading-tight">Your requests</p>
              <p className="mt-1 px-1 text-[13.5px] leading-snug text-muted">2 requests open. Each update from DirectHomes shows here and in your notifications.</p>
              <ul className="mt-4 flex flex-col gap-1">
                {REQUESTS.map((x) => {
                  const on = x.id === id;
                  return (
                    <li key={x.id}>
                      <button
                        type="button"
                        aria-pressed={on}
                        onClick={() => setId(x.id)}
                        className={cn("flex w-full flex-wrap items-center gap-x-4 gap-y-1 rounded-tile px-4 py-3 text-left transition-colors duration-200", on ? "bg-lift" : "bg-surface hover:bg-lift")}
                      >
                        <span className="min-w-0 flex-1 basis-[12rem]">
                          <span className={cn("block truncate text-[14.5px]", on ? "text-ink" : "text-ink-2")}>{x.service}</span>
                          <span className="block truncate text-[12.5px] text-muted">
                            {x.property ? `${x.property} · ` : ""}Sent {x.sent}
                          </span>
                        </span>
                        <StatusWord state={x.state} />
                        <Icon icon={ArrowRight01Icon} size={16} className={cn("transition-colors", on ? "text-ink" : "text-faint")} />
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* The request's own page: progress, what was asked and the consent given. */}
            <div aria-live="polite" className="flex flex-col gap-2 lg:col-span-7">
              <div className="panel p-4 sm:p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                  <p className="text-[18px] leading-tight">Progress</p>
                  <StatusWord state={r.state} />
                </div>
                <p className="mt-1 text-[13.5px] leading-snug text-muted">Every change from the DirectHomes team appears here and in your notifications.</p>
                <ol className="mt-4 grid grid-cols-2 gap-1 xl:grid-cols-4">
                  {steps(r).map((s) => (
                    <li key={s.key} aria-current={s.current ? "step" : undefined} className={cn("flex min-h-[84px] flex-col justify-between gap-2 rounded-tile px-3.5 py-3", s.reached ? "bg-surface" : "bg-sunken/50")}>
                      <span className={cn("flex items-center gap-2 text-[14px]", s.reached ? "text-ink" : "text-muted")}>
                        <Icon
                          icon={s.key === "cancelled" ? CancelCircleIcon : s.reached ? CheckmarkCircle02Icon : MinusSignCircleIcon}
                          size={17}
                          className={s.key === "cancelled" || s.key === "closed" ? "text-muted" : s.reached ? "text-good" : "text-faint"}
                        />
                        {LABEL[s.key]}
                      </span>
                      <span className="text-[12px] text-muted tabular">{s.at ?? (s.skipped ? "Skipped" : "Not yet")}</span>
                    </li>
                  ))}
                </ol>
                {r.outcome ? (
                  <p className="mt-2 rounded-tile bg-surface px-4 py-3 text-[14px] text-ink-2">
                    <span className="text-muted">Outcome: </span>
                    {r.outcome}
                  </p>
                ) : null}
              </div>
              <div className="grid flex-1 gap-2 sm:grid-cols-2">
                <div className="panel p-4 sm:p-5">
                  <p className="text-[16px] leading-tight">What you told us</p>
                  <dl className="mt-3 flex flex-col gap-3">
                    <div>
                      <dt className="text-[12.5px] text-muted">Property</dt>
                      <dd className="mt-0.5 text-[14px] text-ink">{r.property ?? "Not about one property"}</dd>
                    </div>
                    {r.told.map(([k, v]) => (
                      <div key={k}>
                        <dt className="text-[12.5px] text-muted">{k}</dt>
                        <dd className="mt-0.5 text-[14px] text-ink">{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
                <div className="panel p-4 sm:p-5">
                  <p className="text-[16px] leading-tight">Your consent</p>
                  <p className="mt-3 rounded-tile bg-surface px-3.5 py-3 text-[13px] leading-relaxed text-ink-2">{consent(r.withProperty)}</p>
                  <p className="mt-2.5 px-1 text-[12px] text-muted">Agreed {r.sent} · wording v1</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Column>
    </section>
  );
}
