"use client";

import { Fragment, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  FileUploadIcon,
  MinusSignCircleIcon,
  PencilEdit02Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { ChoiceWrap } from "./choice-wrap";
import { Icon } from "./icon";
import { Column, SectionHead } from "./ui";
import { PAGES } from "@/lib/pages";
import { cn } from "@/lib/utils";

/*
 * The Guides and FAQs page:
 * - The answers: every question landlords ask about DirectHomes, searched as you type and sorted by topic. The
 *   answers are the spec's facts (webapp/docs/reference/spec.txt) in plain words.
 * - Key dates: what changes for landlords in England and when, beside the app's own compliance tracker
 *   (webapp app/(landlord)/documents/compliance, features/compliance/rules.ts) for one home, in its own words.
 * - Guides on the way: the longer guides, listed quietly until they have been through a housing-law review.
 */

/* ---------- The answers ---------- */

type Topic = "rent" | "repairs" | "tenants" | "plans" | "data";
type Answer = { topic: Topic; q: string; a: string };

const TOPICS = [
  { value: "all", label: "All" },
  { value: "rent", label: "Rent" },
  { value: "repairs", label: "Repairs" },
  { value: "tenants", label: "Tenants" },
  { value: "plans", label: "Plans" },
  { value: "data", label: "Data" },
] as const;

type TopicValue = (typeof TOPICS)[number]["value"];

const ANSWERS: Answer[] = [
  { topic: "rent", q: "How does the rent reach me?", a: "Tenants pay through Stripe, by Pay by Bank or Direct Debit, and Stripe pays it into your own bank account on its normal schedule. DirectHomes never holds your rent." },
  { topic: "rent", q: "Can I keep collecting rent my own way?", a: "Yes. Record standing orders, transfers, cash or cheques against the ledger yourself. Rent you record carries no DirectHomes fee." },
  { topic: "rent", q: "When does the money land?", a: "On Stripe’s own payout schedule. DirectHomes adds no delays or holds, and each payout lists the payments it includes." },
  { topic: "rent", q: "Can a tenant pay part of the rent?", a: "Yes, from £10. It goes to the oldest charge first, and the rest stays on the ledger as partially paid." },
  { topic: "rent", q: "What if a Direct Debit fails?", a: "You and the tenant are both told straight away, and the tenant gets a Pay now link to pay by bank instead." },
  { topic: "rent", q: "Can tenants pay by card?", a: "Only if you switch cards on. They are off to start with, and shown to tenants last, with what they cost." },
  { topic: "rent", q: "Do you hold tenancy deposits?", a: "No. Deposits stay with a government-approved protection scheme. DirectHomes tracks the 30-day deadline and warns you if a deposit is above five weeks’ rent." },
  { topic: "repairs", q: "How do tenants report a repair?", a: "From their phone: pick one of 12 categories, describe it, add up to 10 photos or videos and say how to get in. You see it straight away." },
  { topic: "repairs", q: "What if it is a gas leak or a danger?", a: "Before anything else, the tenant is pointed to the right line: the National Gas Emergency Service on 0800 111 999, 105 for electrical danger, or 999." },
  { topic: "repairs", q: "How quickly should I respond?", a: "The app suggests targets by priority, such as acknowledging an emergency within 4 hours and attending within 24. They are guidance you can change, not legal deadlines." },
  { topic: "repairs", q: "Does DirectHomes send contractors?", a: "No. Add your own contractor’s details to the repair and set a visit window. The tenant confirms it or suggests another time." },
  { topic: "repairs", q: "When does a repair close?", a: "When the tenant confirms it is fixed, or after 7 days with no reply. They can reopen it within 7 days." },
  { topic: "tenants", q: "Is it really free for tenants?", a: "Yes, on every plan. Tenants never pay to use DirectHomes and never pay a fee on their rent." },
  { topic: "tenants", q: "Can my existing tenants join?", a: "Add the home and the tenancy, then invite each tenant by email. The invite link lasts 14 days, with reminders on days 3 and 7." },
  { topic: "tenants", q: "Is there an app to download?", a: "There is nothing to install. DirectHomes works in the browser on any phone or computer, and the tenant side is built for phones first." },
  { topic: "tenants", q: "How do joint tenants pay?", a: "Each can pay their own share by auto-pay, with the shares set as percentages, or any one of them can pay the whole charge." },
  { topic: "tenants", q: "What happens when a tenancy ends?", a: "Former tenants keep read-only access to their records. Messaging closes 90 days after the tenancy ends." },
  { topic: "plans", q: "Is there a free plan?", a: "Yes. Free is £0 for one property, with every feature. Rent collected online carries the 5% DirectHomes fee and Stripe’s fee." },
  { topic: "plans", q: "What do the paid plans add?", a: "More homes, a lower fee and a team. Advanced runs up to 10 properties. Professional is unlimited, has no DirectHomes fee and includes 25 staff seats." },
  { topic: "plans", q: "Does it cover Wales, Scotland and Northern Ireland?", a: "Rules, notices and deadlines are written for England in full. Homes elsewhere in the UK get the general certificate tracker, rent, repairs and messages." },
  { topic: "plans", q: "Is DirectHomes a letting agent?", a: "No. It is software for landlords. It does not find tenants, hold client money or give legal advice." },
  { topic: "plans", q: "Does it write possession notices?", a: "No. DirectHomes does not generate possession notices. Help & Services can introduce you to a solicitor." },
  { topic: "data", q: "Where is my data kept?", a: "In London. It is encrypted at rest and in transit, over HTTPS only." },
  { topic: "data", q: "Do you store card or bank numbers?", a: "Never. Stripe holds them, and your payout details stay in your own Stripe account." },
  { topic: "data", q: "How is signing in protected?", a: "Two-step sign-in with an authenticator app and recovery codes, never SMS. It is required for Professional owners and admins, and for any change to payouts." },
  { topic: "data", q: "Who controls my tenants’ records?", a: "You do. You are the controller of the tenant records you enter, and DirectHomes processes them for you." },
  { topic: "data", q: "What if something goes wrong?", a: "Backups run daily with point-in-time recovery and a weekly copy kept off the platform. Money records are kept for 7 years." },
];

/** Lower case, curly quotes made straight, so "landlord's" finds "landlord’s". */
const norm = (s: string) => s.toLowerCase().replace(/[‘’]/g, "'");

/** The question with every searched word marked, so the eye finds why it matched. */
function Marked({ text, words }: { text: string; words: string[] }) {
  if (!words.length) return <>{text}</>;
  const pattern = new RegExp(`(${words.map((w) => w.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "gi");
  const parts = text.split(pattern);
  return (
    <>
      {parts.map((p, i) =>
        i % 2 ? (
          <mark key={i} className="rounded-[2px] bg-lavender/70 text-ink">
            {p}
          </mark>
        ) : (
          <Fragment key={i}>{p}</Fragment>
        ),
      )}
    </>
  );
}

export function SectionAnswers() {
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState<TopicValue>("all");
  const words = useMemo(() => norm(query).split(/\s+/).filter(Boolean), [query]);
  const shown = ANSWERS.filter((x) => (topic === "all" || x.topic === topic) && words.every((w) => norm(`${x.q} ${x.a}`).includes(w)));
  const topicLabel = TOPICS.find((t) => t.value === topic)!.label;
  const reset = () => {
    setQuery("");
    setTopic("all");
  };

  return (
    <section id="faq" aria-labelledby="faq-title" className="scroll-mt-[-56px] pt-24 sm:scroll-mt-[-88px] sm:pt-32">
      <Column>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-end lg:gap-16">
          <h2 id="faq-title" className="text-[clamp(28px,3.8vw,52px)] leading-[1.06] tracking-[-0.03em] text-ink">
            Ask it here first.
            <br />
            The answer is short.
          </h2>
          <div className="flex flex-col gap-3">
            <label className="relative block">
              <span className="sr-only">Search the answers</span>
              <Icon icon={Search01Icon} size={20} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search, for example deposit or card"
                autoComplete="off"
                className="h-14 w-full rounded-[8px] bg-surface pr-12 pl-12 text-[16px] text-ink placeholder:text-faint [&::-webkit-search-cancel-button]:appearance-none"
              />
              {query ? (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear the search" className="absolute top-1/2 right-2 flex size-10 -translate-y-1/2 items-center justify-center rounded-control text-ink-2 transition-colors hover:bg-sunken hover:text-ink">
                  <Icon icon={Cancel01Icon} size={18} />
                </button>
              ) : null}
            </label>
            <ChoiceWrap label="Topic" options={TOPICS} value={topic} onChange={setTopic} className="sm:self-start" />
          </div>
        </div>

        <p aria-live="polite" className="mt-10 px-1 text-[14px] text-muted tabular lg:mt-14">
          {shown.length === ANSWERS.length
            ? `${ANSWERS.length} answers`
            : `${shown.length} ${shown.length === 1 ? "answer" : "answers"}${topic === "all" ? "" : ` about ${topicLabel.toLowerCase()}`}${words.length ? ` matching “${query.trim()}”` : ""}`}
        </p>

        {shown.length ? (
          <dl className="mt-6 grid gap-x-12 gap-y-9 rounded-panel bg-white/40 p-6 sm:grid-cols-2 sm:p-10 lg:grid-cols-3 lg:p-12">
            {shown.map(({ q, a }) => (
              <div key={q}>
                <dt className="text-[17px] leading-snug text-ink">
                  <Marked text={q} words={words} />
                </dt>
                <dd className="mt-2 text-[15px] leading-[1.55] text-ink-2">{a}</dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="mt-6 flex flex-col items-start gap-5 rounded-panel bg-white/40 p-6 sm:p-10 lg:p-12">
            <div>
              <p className="text-[22px] leading-snug text-ink">Nothing matches that{topic === "all" ? "" : ` in ${topicLabel}`}.</p>
              <p className="mt-2 max-w-[34rem] text-[15px] leading-[1.55] text-ink-2">
                Try one shorter word, or{" "}
                <Link href={PAGES.contact.href} className="text-ink underline decoration-ink/30 underline-offset-[3px] transition-colors hover:decoration-ink">
                  send us the question
                </Link>
                . Everyone gets a first reply within 1 working day.
              </p>
            </div>
            <button type="button" onClick={reset} className="inline-flex h-11 items-center rounded-control bg-ink px-5 text-[15px] text-white transition-colors hover:bg-ink-hover">
              Show every answer
            </button>
          </div>
        )}
      </Column>
    </section>
  );
}

/* ---------- Key dates ---------- */

const DATES = [
  { on: "2026-04-06", when: "April 2026", title: "Making Tax Digital begins", text: "For landlords with income over £50,000." },
  { on: "2026-05-01", when: "1 May 2026", title: "The Renters’ Rights Act", text: "New tenancies are assured periodic. A rent period is a month at most, and no rent is taken before the period it covers." },
  { on: "2026-12-15", when: "15 Dec 2026", title: "The PRS Database opens", text: "Registration for private landlords opens region by region." },
  { on: "2027-04-06", when: "April 2027", title: "Making Tax Digital widens", text: "To landlords with income over £30,000." },
  { on: "2027-11-14", when: "14 Nov 2027", title: "Every landlord registered", text: "The deadline for every active landlord in England to be on the PRS Database." },
  { on: "2028-04-06", when: "April 2028", title: "And widens again", text: "To landlords with income over £20,000." },
  { on: "2030-10-01", when: "1 Oct 2030", title: "EPC rating C at least", text: "The minimum energy rating for private rentals rises to C." },
];

const CYCLES = [
  ["Gas safety check", "every 12 months"],
  ["EICR", "at least every 5 years"],
  ["Deposit protected", "within 30 days"],
] as const;

/** Today in London as yyyy-mm-dd, read in the browser only (null on the server), so the page never shows a stale "in force". */
const noop = () => () => {};
const londonToday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London", year: "numeric", month: "2-digit", day: "2-digit" }).format(new Date());
function useToday() {
  return useSyncExternalStore(noop, londonToday, () => null);
}

type Item = {
  label: string;
  who?: string;
  when: string;
  reminders?: string;
  note?: string;
  state: "valid" | "missing";
  action?: { icon: IconSvgElement; label: string };
  na?: boolean;
};

/** 8 Cotham Vale, Bristol, on 17 Oct 2026: the tenancy began on 1 Oct, its deposit is not yet protected. */
const ITEMS: Item[] = [
  { label: "Deposit protection", who: "Grace Adebayo, Liam Connor", when: "Due by 31 Oct 2026", reminders: "Reminders on days 20 and 28 after the deposit is received. Next 21 Oct 2026", state: "missing", action: { icon: FileUploadIcon, label: "Upload deposit certificate" } },
  { label: "PRS Database registration", when: "Due by 14 Nov 2027", reminders: "Reminders when the database opens, then 60 and 30 days before the deadline. Next 15 Dec 2026", state: "missing", action: { icon: PencilEdit02Icon, label: "Add PRS reference" } },
  { label: "Gas safety record", when: "Valid until 1 Oct 2027", reminders: "Reminders 60, 30 and 7 days before expiry. Next 2 Aug 2027", state: "valid" },
  { label: "EICR", when: "Valid until 13 Jun 2029", reminders: "Reminders 60, 30 and 7 days before expiry. Next 14 Apr 2029", state: "valid" },
  { label: "EPC", when: "Valid until 19 Mar 2031", reminders: "Reminders 90, 60 and 30 days before expiry. Next 19 Dec 2030", note: "Rated D. Private rentals need at least C from 1 October 2030.", state: "valid" },
  { label: "Smoke and CO alarm check", who: "Grace Adebayo, Liam Connor", when: "Done 1 Oct 2026", state: "valid" },
];

function ItemRow({ item }: { item: Item }) {
  const ok = item.state === "valid";
  return (
    <li className="flex flex-col gap-3 rounded-tile bg-surface px-4 py-3.5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[14.5px] text-ink">
            {item.label}
            {item.who ? <span className="text-muted"> · {item.who}</span> : null}
          </p>
          <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{item.when}</p>
          {item.reminders ? <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{item.reminders}</p> : null}
          {item.note ? <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{item.note}</p> : null}
        </div>
        <span className={cn("mt-px inline-flex shrink-0 items-center gap-1.5 text-[13.5px] whitespace-nowrap", ok ? "text-good" : "text-bad")}>
          <Icon icon={ok ? CheckmarkCircle02Icon : Alert02Icon} size={16} />
          {ok ? "Valid" : "Missing"}
        </span>
      </div>
      {item.action || item.na ? (
        <div className="flex flex-wrap items-center gap-1.5">
          {item.action ? (
            <span className="inline-flex h-9 items-center gap-2 rounded-[4px] bg-canvas px-3.5 text-[13px] text-ink">
              <Icon icon={item.action.icon} size={16} />
              {item.action.label}
            </span>
          ) : null}
          {item.na ? (
            <span className="inline-flex h-9 items-center gap-2 rounded-[4px] px-2 text-[13px] text-ink-2">
              <Icon icon={MinusSignCircleIcon} size={16} />
              Not applicable
            </span>
          ) : null}
        </div>
      ) : null}
    </li>
  );
}

export function SectionKeyDates() {
  const today = useToday();

  return (
    <section aria-labelledby="dates-title" className="pt-24 sm:pt-32">
      <Column>
        <SectionHead
          id="dates-title"
          title={
            <>
              The dates ahead,
              <br />
              and the ones that repeat.
            </>
          }
          text="What changes for landlords in England, and when. For each home, DirectHomes tracks the certificates and reminds you before anything is due."
        />

        <div className="mt-10 grid gap-2 lg:mt-14 lg:grid-cols-12">
          {/* The law's dates, in order. Those already in force say so, worked out from today's date. */}
          <div className="rounded-panel bg-white/40 p-6 sm:p-8 lg:col-span-5 lg:p-10">
            <ol className="flex flex-col gap-7">
              {DATES.map((d) => {
                const live = today !== null && d.on <= today;
                return (
                  <li key={d.title} className="grid gap-x-5 gap-y-1 sm:grid-cols-[8.5rem_minmax(0,1fr)]">
                    <span className="text-[14px] text-muted tabular sm:pt-0.5 sm:text-[15px] sm:text-ink">{d.when}</span>
                    <div className="min-w-0">
                      <p className="text-[17px] leading-snug text-ink">{d.title}</p>
                      <p className="mt-1 text-[14.5px] leading-[1.5] text-ink-2">{d.text}</p>
                      {live ? (
                        <p className="mt-1.5 inline-flex items-center gap-1.5 text-[13px] text-good">
                          <Icon icon={CheckmarkCircle02Icon} size={15} />
                          In force
                        </p>
                      ) : null}
                    </div>
                  </li>
                );
              })}
            </ol>
            <div className="mt-9 flex flex-col gap-2">
              <p className="text-[15px] text-ink">And every tenancy, over and over</p>
              <dl className="flex flex-col gap-1.5">
                {CYCLES.map(([what, when]) => (
                  <div key={what} className="flex justify-between gap-4 text-[14.5px]">
                    <dt className="text-ink-2">{what}</dt>
                    <dd className="text-right text-ink">{when}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>

          {/* One home's checks, as the app's compliance tracker lists them. A picture. */}
          <div className="brand-wash brand-wash-2 rounded-panel p-2 sm:p-6 lg:col-span-7 lg:p-10">
            <div aria-hidden className="pointer-events-none rounded-[10px] bg-canvas p-2 text-ink shadow-[0_1px_2px_rgb(20_20_20/0.1),0_24px_40px_-28px_rgb(30_28_40/0.5)] select-none">
              <div className="panel p-4 sm:p-5">
                <p className="text-[18px] leading-tight">Every item</p>
                <p className="mt-1 text-[13.5px] leading-snug text-muted">Reminders go to owners, admins and the property&rsquo;s managers by email and in the app.</p>
                <div className="mt-4 mb-2.5 flex items-baseline justify-between gap-3 px-1">
                  <p className="text-[15px] text-ink">
                    8 Cotham Vale<span className="text-muted">, Bristol</span>
                  </p>
                  <span className="text-[13px] text-muted tabular">67% health</span>
                </div>
                <ul className="flex flex-col gap-2">
                  {ITEMS.map((item) => (
                    <ItemRow key={item.label} item={item} />
                  ))}
                </ul>
              </div>
            </div>
            <p className="sr-only">
              The DirectHomes compliance tracker for 8 Cotham Vale: deposit protection due by 31 October 2026 and PRS Database registration due by 14 November 2027 are missing; the gas safety record, EICR, EPC and smoke and CO alarm check are valid.
            </p>
          </div>
        </div>
        <p className="mt-4 px-1 text-[13px] leading-[1.55] text-muted">
          General information, not legal advice. The tracker suggests documents only and cannot guarantee compliance. Dates are for England; homes elsewhere in the UK get the general certificate tracker.
        </p>
      </Column>
    </section>
  );
}

/* ---------- Guides on the way ---------- */

const GUIDES = [
  { title: "The Renters’ Rights Act for landlords", text: "Periodic tenancies, rent periods and what changed on 1 May 2026." },
  { title: "Rent increases with Section 13", text: "Form 4A, the 52-week gap and two months’ notice." },
  { title: "Registering on the PRS Database", text: "Who has to register, and when your region opens." },
  { title: "Making Tax Digital for landlords", text: "Who is in from April 2026, 2027 and 2028." },
  { title: "Deposits and the Tenant Fees Act", text: "Protection within 30 days, and the five-week cap." },
  { title: "Getting to EPC C by 2030", text: "What the 1 October 2030 minimum means for your homes." },
];

export function SectionGuidesSoon() {
  return (
    <section aria-labelledby="guides-title" className="pt-24 sm:pt-32">
      <Column className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] lg:gap-16">
        <div>
          <h2 id="guides-title" className="text-[clamp(28px,3.8vw,52px)] leading-[1.06] tracking-[-0.03em] text-ink">
            Longer guides,
            <br />
            checked first.
          </h2>
          <p className="mt-5 max-w-[28rem] text-[17px] leading-[1.55] text-ink-2">These are being written now. None goes up before a housing-law review.</p>
        </div>
        <ul className="flex flex-col gap-6 lg:pt-2">
          {GUIDES.map((g) => (
            <li key={g.title} className="grid gap-x-6 gap-y-1 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-baseline">
              <p className="text-[19px] leading-snug text-ink">{g.title}</p>
              <p className="order-last text-[14px] text-faint sm:order-none sm:row-span-2 sm:text-right">Coming soon</p>
              <p className="text-[15px] leading-[1.5] text-ink-2">{g.text}</p>
            </li>
          ))}
        </ul>
      </Column>
    </section>
  );
}
