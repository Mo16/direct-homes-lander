"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Alert02Icon,
  ArrowLeft01Icon,
  Call02Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Invoice01Icon,
  PencilEdit02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Choice } from "./choice";
import { Icon } from "./icon";
import { Avatar, exact } from "./tour-kit";
import { Column, SectionHead } from "./ui";
import { cn } from "@/lib/utils";

/*
 * Three pieces of the Repairs page, each drawn from the web app's own screens and words (webapp features/repairs):
 * - The safety gate: step 2 of the tenant's report (report-wizard.tsx), with the app's four questions and the advice
 *   each one brings up (rules.ts assessSafety). The boxes work, and what the report is sent as follows them.
 * - Priorities: one repair's page (repairs/[id]) as the landlord changes its priority. The targets are the app's
 *   recommendations (rules.ts DEFAULT_TARGETS) and the due times are worked out the way the app does it, working days
 *   skipping weekends, in London time.
 * - Costs: the repair's Costs panel and the draft expense it puts in Finance (addRepairToExpenses).
 */

const LONDON = "Europe/London";
const HOUR = 3_600_000;
const DAY = 24 * HOUR;
const stamp = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: LONDON });
const weekday = new Intl.DateTimeFormat("en-GB", { weekday: "short", timeZone: LONDON });

/** A status as the app writes it: an icon and words in a quiet tone. */
function Tag({ tone, icon, children, className }: { tone: string; icon: IconSvgElement; children: React.ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[13.5px] whitespace-nowrap", tone, className)}>
      <Icon icon={icon} size={16} />
      {children}
    </span>
  );
}

/** The window the app's screens sit in on this site: the canvas, lifted off the wash by a tight shadow. */
const sheet = "rounded-[10px] bg-canvas text-ink shadow-[0_1px_2px_rgb(20_20_20/0.1),0_24px_40px_-28px_rgb(30_28_40/0.5)]";

/* ---------- The safety gate ---------- */

type Question = "gasSmell" | "immediateDanger" | "electricalDanger" | "noHeating";

/** The questions the app asks for a heating report, which is every one of them, in its order and words. */
const QUESTIONS: { key: Question; label: string; description: string }[] = [
  { key: "gasSmell", label: "I can smell gas", description: "A rotten-egg smell near the boiler, cooker or meter." },
  { key: "immediateDanger", label: "Someone is in immediate danger", description: "A fire, someone hurt, or a risk to life right now." },
  { key: "electricalDanger", label: "There is an electrical danger", description: "Sparks, a burning smell, exposed wires, or water near electrics." },
  { key: "noHeating", label: "There is no heating or hot water at all", description: "Not just one radiator: the whole system is off." },
];

type Advice = { key: string; emergency: boolean; title: string; body: string; call?: string };

const ADVICE: Record<"gas" | "danger" | "electric" | "cold", Advice> = {
  gas: {
    key: "gas",
    emergency: true,
    title: "Leave the property and call the National Gas Emergency Service on 0800 111 999 now",
    body: "Do not use light switches, flames or anything electrical. Open doors and windows if it is safe, and turn off the gas at the meter if you can.",
    call: "0800 111 999",
  },
  danger: {
    key: "danger",
    emergency: true,
    title: "If anyone is in immediate danger, call 999 now",
    body: "For a fire, a gas explosion risk or anyone hurt, call the emergency services first. Then finish this report.",
    call: "999",
  },
  electric: {
    key: "electric",
    emergency: true,
    title: "Keep away from the danger and call 105 for a power cut",
    body: "Do not touch exposed wires or anything sparking. Turn the power off at the fuse box if it is safe. If there is a fire, call 999.",
    call: "105",
  },
  cold: {
    key: "cold",
    emergency: false,
    title: "No heating in the colder months is treated as urgent",
    body: "Tell your landlord if anyone at home is elderly, very young, unwell or disabled. Keep one room warm if you can.",
  },
};

/** The app's heating months, October to March, in London. */
function heatingSeason(at: Date) {
  const month = Number(new Intl.DateTimeFormat("en-GB", { month: "numeric", timeZone: LONDON }).format(at));
  return month >= 10 || month <= 3;
}

/** The app's Notice, drawn: a tinted tile with the icon, a title and the advice, and the number to call. */
function Notice({ advice }: { advice: Advice }) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-tile px-4 py-3.5 @lg:flex-row @lg:items-center", advice.emergency ? "bg-bad-soft text-bad" : "bg-warn-soft text-warn")}>
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <Icon icon={Alert02Icon} size={19} className="mt-0.5" />
        <div className="min-w-0 text-[14px] leading-snug">
          <p className="font-medium">{advice.title}</p>
          <p className="mt-0.5 opacity-90">{advice.body}</p>
        </div>
      </div>
      {advice.call ? (
        <span className="ml-8 flex h-9 w-fit shrink-0 items-center gap-2 rounded-control bg-ink px-3.5 text-[13.5px] whitespace-nowrap text-white @lg:ml-0">
          <Icon icon={Call02Icon} size={16} />
          Call {advice.call}
        </span>
      ) : null}
    </div>
  );
}

const OUTCOME = {
  none: { title: "They suggest how urgent it is", text: "Nothing ticked, so the report goes on as normal. The tenant picks a priority on the next step, and you confirm it." },
  urgent: { title: "Sent as at least urgent", text: "With no heating or hot water at all, the tenant can't send it as routine. You still confirm the priority." },
  emergency: { title: "Sent as an emergency", text: "The emergency number comes first, with a button that calls it. The report still reaches you, as an emergency, flagged as a hazard." },
};

export function SectionSafetyGate() {
  const [answers, setAnswers] = useState<Record<Question, boolean>>({ gasSmell: false, immediateDanger: false, electricalDanger: false, noHeating: false });
  // Whether it is the colder months is read when a box is ticked, never while rendering, so the page renders the same everywhere.
  const [winter, setWinter] = useState(false);
  const still = useReducedMotion();

  const advice: Advice[] = [];
  if (answers.gasSmell) advice.push(ADVICE.gas);
  if (answers.immediateDanger) advice.push(ADVICE.danger);
  if (answers.electricalDanger) advice.push(ADVICE.electric);
  if (answers.noHeating && winter) advice.push(ADVICE.cold);
  const emergency = answers.gasSmell || answers.immediateDanger || answers.electricalDanger;
  const outcome = emergency ? OUTCOME.emergency : answers.noHeating ? OUTCOME.urgent : OUTCOME.none;
  const rise = still ? { duration: 0 } : { duration: 0.32, ease: [0.2, 0.8, 0.2, 1] as const };

  return (
    <section aria-labelledby="safety-title" className="pt-24 sm:pt-32">
      <Column className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="safety-title" className="text-[clamp(28px,3.8vw,52px)] leading-[1.06] tracking-[-0.03em] text-ink">
            If it&rsquo;s dangerous,
            <br />
            they know who to call.
          </h2>
          <p className="mt-5 max-w-[30rem] text-[17px] leading-[1.55] text-ink-2">
            Before a report is sent, tenants are asked whether anyone is in danger. Tick the boxes to see what they&rsquo;re told.
          </p>
          <div aria-live="polite" className="mt-8 max-w-[28rem]">
            <p className="text-[18px] leading-snug text-ink">{outcome.title}</p>
            <p className="mt-1.5 text-[15px] leading-[1.5] text-ink-2">{outcome.text}</p>
          </div>
        </div>

        {/* Step 2 of the tenant's report, as the app draws it. The boxes are real; the buttons are part of the picture. */}
        <div className="brand-wash brand-wash-2 rounded-panel p-2 sm:p-6 lg:p-10">
          <div className={cn(sheet, "@container p-4 sm:p-7")}>
            <p className="text-[24px] leading-tight tracking-[-0.02em]">Report a repair</p>
            <p className="mt-1.5 text-[14px] leading-snug text-muted">For Flat 2, 14 Royal York Crescent. It takes about a minute. If you can smell gas, leave the property and call 0800 111 999 first.</p>

            <div aria-hidden className="mt-6 flex items-center gap-3">
              <span className="flex h-9 items-center gap-1.5 rounded-control bg-surface px-3 text-[13.5px]">
                <Icon icon={ArrowLeft01Icon} size={15} /> Back
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] text-muted">
                  Step 2 of 4: <span className="text-ink-2">Safety check</span>
                </p>
                <div className="hatch relative mt-2 h-2.5 overflow-hidden rounded-[2px]">
                  <div className="absolute inset-y-0 left-0 w-1/2 rounded-[2px] bg-accent-fill" />
                </div>
              </div>
            </div>

            <fieldset className="mt-5 flex flex-col gap-4">
              <legend className="px-1 pb-4">
                <span className="block text-[20px]">Is anyone in danger?</span>
                <span className="mt-1 block text-[14px] text-muted">Tick anything that applies. Your report still goes to your landlord either way.</span>
              </legend>
              <AnimatePresence initial={false}>
                {advice.filter((a) => a.emergency).map((a) => (
                  <motion.div key={a.key} layout="position" initial={{ y: -8 }} animate={{ y: 0 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={rise}>
                    <Notice advice={a} />
                  </motion.div>
                ))}
              </AnimatePresence>
              <motion.div layout="position" transition={rise} className="panel flex flex-col gap-1 p-2 sm:p-3">
                {QUESTIONS.map((q) => (
                  <label key={q.key} className="flex cursor-pointer items-start gap-3 rounded-tile px-2.5 py-2.5 transition-colors hover:bg-surface">
                    <input
                      type="checkbox"
                      checked={answers[q.key]}
                      onChange={(e) => {
                        setWinter(heatingSeason(new Date()));
                        setAnswers((a) => ({ ...a, [q.key]: e.target.checked }));
                      }}
                      className="peer sr-only"
                    />
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[3px] bg-sunken text-white transition-colors peer-checked:bg-ink peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-accent">
                      {answers[q.key] ? <Icon icon={Tick02Icon} size={14} strokeWidth={2} /> : null}
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="text-[15px] text-ink">{q.label}</span>
                      <span className="text-[13px] leading-snug text-muted">{q.description}</span>
                    </span>
                  </label>
                ))}
              </motion.div>
              <AnimatePresence initial={false}>
                {advice.filter((a) => !a.emergency).map((a) => (
                  <motion.div key={a.key} layout="position" initial={{ y: -8 }} animate={{ y: 0 }} exit={{ opacity: 0, transition: { duration: 0.12 } }} transition={rise}>
                    <Notice advice={a} />
                  </motion.div>
                ))}
              </AnimatePresence>
              <motion.span layout="position" transition={rise} aria-hidden className="flex h-[52px] items-center justify-center self-stretch rounded-control bg-ink px-7 text-[16px] text-white @lg:self-end">
                {emergency ? "I am safe, continue" : "Continue"}
              </motion.span>
            </fieldset>
          </div>
        </div>
      </Column>
    </section>
  );
}

/* ---------- Priorities and their targets ---------- */

type Priority = "emergency" | "urgent" | "routine";
type Span = { unit: "hours" | "days" | "working_days"; value: number };

const PRIORITIES: Record<Priority, { label: string; tone: string; icon: IconSvgElement; examples: string; acknowledge: Span; attend: Span; reason?: string }> = {
  emergency: {
    label: "Emergency",
    tone: "text-bad",
    icon: Alert02Icon,
    examples: "Gas smell, flooding, no water, unsafe electrics, or the home cannot be secured",
    acknowledge: { unit: "hours", value: 4 },
    attend: { unit: "hours", value: 24 },
    reason: "The door can't be locked at all, so the home isn't secure tonight.",
  },
  urgent: {
    label: "Urgent",
    tone: "text-warn",
    icon: Clock01Icon,
    examples: "No heating or hot water, a roof leak, a broken fridge",
    acknowledge: { unit: "hours", value: 24 },
    attend: { unit: "working_days", value: 3 },
  },
  routine: {
    label: "Routine",
    tone: "text-ink-2",
    icon: Clock01Icon,
    examples: "A dripping tap, a sticking door, minor cosmetic damage",
    acknowledge: { unit: "working_days", value: 3 },
    attend: { unit: "days", value: 28 },
    reason: "It still locks with the key, so a locksmith can come with the next visit.",
  },
};

const PRIORITY_OPTIONS = (["emergency", "urgent", "routine"] as const).map((p) => ({ value: p, label: PRIORITIES[p].label }));

/** Repair #34: reported on a Friday afternoon, the priority changed 25 minutes later and the page seen straight after,
 * so the time left on the target reads the same as the target itself. */
const REPORTED = Date.parse("2026-10-09T15:40:00Z");
const CHANGED = Date.parse("2026-10-09T16:05:00Z");
const NOW = CHANGED;

/** A target added to a start time, as the app does it: working days skip Saturdays and Sundays in London. */
function addTarget(start: number, t: Span) {
  if (t.unit === "hours") return start + t.value * HOUR;
  if (t.unit === "days") return start + t.value * DAY;
  let at = start;
  let left = t.value;
  while (left > 0) {
    at += DAY;
    const d = weekday.format(at);
    if (d !== "Sat" && d !== "Sun") left -= 1;
  }
  return at;
}

const describe = (t: Span) => `${t.value} ${t.unit === "working_days" ? "working days" : t.unit}`;

/** The app's words for a span of time: "3 hours", "5 days". */
function spanWords(ms: number) {
  if (ms < 48 * HOUR) {
    const h = Math.round(ms / HOUR);
    return `${h} ${h === 1 ? "hour" : "hours"}`;
  }
  const d = Math.round(ms / DAY);
  return `${d} ${d === 1 ? "day" : "days"}`;
}

function Detail({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      <dt className="text-[12.5px] text-muted">{label}</dt>
      <dd className="mt-1 text-[15px] text-ink">{children}</dd>
    </div>
  );
}

export function SectionPriorities() {
  const [priority, setPriority] = useState<Priority>("emergency");
  const p = PRIORITIES[priority];
  const ackDue = addTarget(REPORTED, p.acknowledge);
  const attendDue = addTarget(REPORTED, p.attend);
  const changed = priority !== "urgent";

  return (
    <section aria-labelledby="priorities-title" className="pt-24 sm:pt-32">
      <Column>
        <SectionHead
          id="priorities-title"
          title={
            <>
              Every priority
              <br />
              starts its own clock.
            </>
          }
          text="The tenant suggests how urgent it is and you confirm it. The priority sets when you should acknowledge the report and when someone should attend, and you're reminded before a target slips."
        />

        <div className="brand-wash mt-10 grid grid-cols-[minmax(0,1fr)] gap-8 rounded-panel p-2 sm:p-8 lg:mt-14 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-12 lg:p-12">
          <div className="flex flex-col gap-8 px-3 pt-4 sm:px-0 sm:pt-0">
            <div>
              <p className="text-[15px] text-ink">Priority</p>
              <Choice label="Priority" options={PRIORITY_OPTIONS} value={priority} onChange={setPriority} className="mt-3 w-full sm:w-auto" />
              <p className="mt-3 min-h-[3em] max-w-[26rem] text-[14px] leading-[1.5] text-muted">{p.examples}</p>
            </div>
            <dl aria-live="polite" className="grid grid-cols-[auto_auto] justify-start gap-x-10 gap-y-4 sm:gap-x-14">
              {[
                ["Acknowledge within", describe(p.acknowledge)],
                ["Attend within", describe(p.attend)],
              ].map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[14px] text-ink-2">{k}</dt>
                  <dd className="mt-1 text-[clamp(24px,2.2vw,30px)] leading-tight tracking-[-0.02em] whitespace-nowrap text-ink">{v}</dd>
                </div>
              ))}
            </dl>

            {/* What the tenant sees on their own repair page, in the app's words. */}
            <div className="mt-auto">
              <p className="text-[14px] text-ink-2">On Rhys&rsquo;s phone</p>
              <div className="panel mt-2 flex items-start gap-3 p-4">
                <Avatar initials="RM" />
                <div className="min-w-0">
                  <Tag tone="text-warn" icon={Clock01Icon}>
                    Sent to your landlord
                  </Tag>
                  <p className="mt-1 text-[14px] leading-snug text-ink-2">Whitfield Property Group has been told. They aim to respond by {stamp.format(ackDue)}.</p>
                </div>
              </div>
            </div>
          </div>

          {/* The repair's page, as the app draws it, a few minutes after the priority was changed. */}
          <div aria-live="polite" className={cn(sheet, "p-2")}>
            <div className="px-3 pt-3 pb-4">
              <p className="text-[22px] leading-tight">
                Front door won&rsquo;t lock <span className="text-faint">#34</span>
              </p>
              <p className="mt-1 text-[13.5px] text-muted">33 Pontcanna Street · Locks and security · reported by Rhys Morgan, {stamp.format(REPORTED)}</p>
            </div>
            <div className="flex flex-col gap-2">
              <div className="panel p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-[17px] leading-tight">Details</p>
                  <span className="flex h-9 items-center gap-2 rounded-control bg-surface px-3 text-[13px]">
                    <Icon icon={PencilEdit02Icon} size={15} /> Change priority
                  </span>
                </div>
                <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-3">
                  <Detail label="Status">
                    <Tag tone="text-warn" icon={Clock01Icon}>
                      Reported
                    </Tag>
                  </Detail>
                  <Detail label="Priority">
                    <Tag tone={p.tone} icon={p.icon}>
                      {p.label}
                    </Tag>
                    {changed ? <span className="mt-0.5 block text-[12.5px] text-muted">Tenant suggested urgent</span> : null}
                  </Detail>
                  <Detail label="Target">
                    <Tag tone="text-ink-2" icon={Clock01Icon} className="whitespace-normal">
                      Acknowledge within {spanWords(ackDue - NOW)}
                    </Tag>
                    <span className="mt-0.5 block text-[12.5px] text-muted">By {stamp.format(ackDue)}</span>
                  </Detail>
                  <Detail label="Category">Locks and security</Detail>
                  <Detail label="Where in the home">Front door</Detail>
                  <Detail label="Visible to tenants">Yes</Detail>
                </dl>
              </div>
              <div className="panel p-5">
                <p className="text-[17px] leading-tight">Timeline</p>
                <p className="mt-1 text-[13px] text-muted">Everything here is shared with the tenant, except internal notes.</p>
                <ol className="mt-4 flex flex-col gap-2">
                  <li className="flex gap-3 rounded-tile bg-surface px-4 py-3.5">
                    <Avatar initials="RM" />
                    <div className="min-w-0 flex-1">
                      <p className="flex flex-wrap items-baseline gap-x-1.5 text-[14px] leading-snug">
                        Rhys Morgan <span className="text-ink-2">reported it</span>
                        <span className="text-[12.5px] text-muted tabular sm:ml-auto">{stamp.format(REPORTED)}</span>
                      </p>
                      <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">The key turns but the bolt doesn&rsquo;t catch, so the front door won&rsquo;t lock.</p>
                    </div>
                  </li>
                  <AnimatePresence initial={false} mode="popLayout">
                    {changed ? (
                      <motion.li key={priority} initial={{ y: 10 }} animate={{ y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }} className="flex gap-3 rounded-tile bg-surface px-4 py-3.5">
                        <Avatar photo="sam" />
                        <div className="min-w-0 flex-1">
                          <p className="flex flex-wrap items-baseline gap-x-1.5 text-[14px] leading-snug">
                            Sam Whitfield <span className="text-ink-2">changed the priority</span>
                            <span className="text-[12.5px] text-muted tabular sm:ml-auto">{stamp.format(CHANGED)}</span>
                          </p>
                          <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">{p.reason}</p>
                        </div>
                      </motion.li>
                    ) : null}
                  </AnimatePresence>
                </ol>
              </div>
            </div>
            <p className="px-3 pt-3 pb-2 text-[13px] text-muted">
              Attend by {stamp.format(attendDue)}. Targets follow the new priority, counted from when it was reported.
            </p>
          </div>
        </div>
        <p className="mt-4 px-1 text-[13px] leading-[1.55] text-muted">
          These are DirectHomes&rsquo; recommendations: guidance for your team and tenants, not legal deadlines. Working days skip weekends. Change them to suit how you work.
        </p>
      </Column>
    </section>
  );
}

/* ---------- Costs into Finance ---------- */

type Payer = "landlord" | "insurer" | "other";
const PAYERS = [
  { value: "landlord", label: "Landlord" },
  { value: "insurer", label: "Insurance" },
  { value: "other", label: "Someone else" },
] as const;

const COST = 48000;
const OTHER_EXPENSES: [string, string, string, number][] = [
  ["Garden maintenance", "Leeds Garden Co", "3 Oct 2026", 2400],
  ["HMO gas and electricity", "Octopus Energy", "6 Oct 2026", 22181],
];

export function SectionRepairCosts() {
  const [payer, setPayer] = useState<Payer>("landlord");
  const ours = payer === "landlord";
  const still = useReducedMotion();

  return (
    <section aria-labelledby="costs-title" className="pt-24 sm:pt-32">
      <Column className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-16">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="costs-title" className="text-[clamp(28px,3.8vw,52px)] leading-[1.06] tracking-[-0.03em] text-ink">
            The roofer&rsquo;s bill
            <br />
            goes in the books.
          </h2>
          <p className="mt-5 max-w-[30rem] text-[17px] leading-[1.55] text-ink-2">
            Put the quote, the final cost and the invoice on the repair. What you pay arrives in Finance as a draft expense for you to confirm. Tenants are never charged.
          </p>
          <div className="mt-8">
            <p className="text-[15px] text-ink">Who pays</p>
            <Choice label="Who pays" options={PAYERS} value={payer} onChange={setPayer} className="mt-3 w-full sm:w-auto" />
          </div>
        </div>

        <div aria-live="polite" className="brand-wash brand-wash-3 flex flex-col gap-2 rounded-panel p-2 sm:p-4">
          {/* The repair's Costs panel. */}
          <div className={cn(sheet, "p-2")}>
            <div className="px-3 pt-3 pb-4">
              <p className="text-[19px] leading-tight">
                Damp patch on bedroom ceiling <span className="text-faint">#28</span>
              </p>
              <p className="mt-1 text-[13px] text-muted">26 Headingley Mount · Damp and mould · Firth Roofing Leeds</p>
            </div>
            <div className="panel p-5">
              <p className="text-[17px] leading-tight">Costs</p>
              <p className="mt-1 text-[13px] text-muted">Costs go to Finance as expenses. Tenants are never charged.</p>
              <dl className="mt-4 grid grid-cols-2 gap-x-5 gap-y-4">
                <Detail label="Quote">{exact(COST)}</Detail>
                <Detail label="Final cost">{exact(COST)}</Detail>
                <Detail label="Who pays">{PAYERS.find((x) => x.value === payer)!.label}</Detail>
                <Detail label="Invoice">
                  <span className="text-accent-strong">View invoice</span>
                </Detail>
              </dl>
              <div className="mt-4 min-h-[44px]">
                {ours ? (
                  <>
                    <p className="text-[12.5px] text-muted">In expenses</p>
                    <p className="mt-1 text-[15px] text-ink">
                      {exact(COST)} · draft, confirm it in Finance <span className="text-accent-strong">Open Finance</span>
                    </p>
                  </>
                ) : (
                  <p className="pt-1 text-[13.5px] leading-snug text-muted">Only costs the landlord pays go into expenses.</p>
                )}
              </div>
              <div aria-hidden className="mt-4 flex flex-wrap gap-2">
                <span className="flex h-9 items-center gap-2 rounded-control bg-surface px-3 text-[13px]">
                  <Icon icon={PencilEdit02Icon} size={15} /> Edit costs
                </span>
                <span className="flex h-9 items-center gap-2 rounded-control bg-surface px-3 text-[13px]">
                  <Icon icon={Invoice01Icon} size={15} /> Replace invoice
                </span>
                {ours ? <span className="flex h-9 items-center rounded-control bg-surface px-3 text-[13px]">Update draft expense</span> : null}
              </div>
            </div>
          </div>

          {/* Finance, Expenses: the draft it made, above what was already there. */}
          <div className={cn(sheet, "p-2")}>
            <p className="px-3 pt-3 pb-4 text-[19px] leading-tight">
              Finance <span className="mx-1.5 text-faint">&mdash;</span> Expenses
            </p>
            <ul className="panel flex flex-col gap-1 p-2">
              <AnimatePresence initial={false}>
                {ours ? (
                  <motion.li
                    key="draft"
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    transition={still ? { duration: 0 } : { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] }}
                    className="overflow-hidden"
                  >
                    <ExpenseRow what="Repair #28: Damp patch on bedroom ceiling" from="Firth Roofing Leeds" date="9 Oct 2026" pence={COST} draft />
                  </motion.li>
                ) : null}
              </AnimatePresence>
              {OTHER_EXPENSES.map(([what, from, date, pence]) => (
                <li key={what}>
                  <ExpenseRow what={what} from={from} date={date} pence={pence} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Column>
    </section>
  );
}

function ExpenseRow({ what, from, date, pence, draft }: { what: string; from: string; date: string; pence: number; draft?: boolean }) {
  return (
    <div className={cn("grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2 rounded-tile px-3 py-3 sm:grid-cols-[minmax(0,1fr)_76px_72px_168px] sm:px-4", draft ? "bg-surface" : "")}>
      <span className="min-w-0 text-[14px]">
        <span className="block leading-snug">{what}</span>
        <span className="block truncate text-[12.5px] text-ink-2">
          {from} <span className="sm:hidden">· {date}</span>
        </span>
      </span>
      <span className="hidden text-[13.5px] text-ink-2 sm:block">{date}</span>
      <span className="self-start text-right text-[14px] tabular sm:self-center">{exact(pence)}</span>
      <span className="col-span-2 flex items-center justify-between gap-3 sm:col-span-1">
        {draft ? (
          <>
            <Tag tone="text-warn" icon={Clock01Icon}>
              Draft
            </Tag>
            <span className="flex h-8 items-center gap-1.5 rounded-control bg-ink px-3 text-[13px] text-white">
              <Icon icon={Tick02Icon} size={14} /> Confirm
            </span>
          </>
        ) : (
          <Tag tone="text-good" icon={CheckmarkCircle02Icon}>
            Confirmed
          </Tag>
        )}
      </span>
    </div>
  );
}
