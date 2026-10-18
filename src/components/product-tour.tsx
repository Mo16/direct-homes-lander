"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import {
  Add01Icon,
  Building03Icon,
  KanbanIcon,
  UserGroupIcon,
  UserIcon,
  Wallet01Icon,
  Alert02Icon,
  AlertCircleIcon,
  ArrowDown01Icon,
  ArrowUpDownIcon,
  ArrowUpRight01Icon,
  Attachment01Icon,
  Calendar03Icon,
  CancelCircleIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Delete02Icon,
  DropletIcon,
  FilterHorizontalIcon,
  Fire02Icon,
  FlashIcon,
  FridgeIcon,
  HumidityIcon,
  Loading03Icon,
  Message01Icon,
  PauseIcon,
  Pdf01Icon,
  PencilEdit02Icon,
  PieChart01Icon,
  Search01Icon,
  SentIcon,
  Shield01Icon,
  SquareLock02Icon,
  Tick02Icon,
  UndoIcon,
  UserAccountIcon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "./icon";
import { cn } from "@/lib/utils";
import { PropertiesTour, RentTour, TasksTour, TeamTour, TenantTour } from "./tour-pages";
import { W, H, Tone, Tag, Square, Avatar, pounds, exact, Count, Typed, Shell, Ink, Tray, Dialog, Field } from "./tour-kit";

/*
 * The product tour: one big window holding the web app at 1440px, and a row of tabs under it. Each tab plays a short
 * demo inside the window, a drawn pointer doing a real task on a copy of a real page (the demo landlord's data, the
 * app's own words, checked against screenshots of the running app on 15 Oct 2026): a repair booked and closed, a
 * certificate uploaded, a reply sent, a draft expense confirmed. When one ends the next tab starts. Every frame is
 * complete on its own, so nothing waits on an animation to appear; with reduced motion each tab shows its last frame.
 * The window itself is a picture: the visitor drives it with the tabs, not by clicking inside it.
 */

/* ---------- Repairs: the list, then #28 booked and closed ---------- */

type Row = {
  icon: IconSvgElement;
  title: string;
  ref: string;
  hazard?: boolean;
  home: string;
  town: string;
  tenant: { name: string; photo?: string; initials?: string } | null;
  priority: [Tone, IconSvgElement, string];
  status: [Tone, IconSvgElement, string];
  who: string;
  target: [Tone, IconSvgElement, string];
  reported: string;
};
const URGENT: Row["priority"] = ["warn", Clock01Icon, "Urgent"];
const ROUTINE: Row["priority"] = ["plain", Clock01Icon, "Routine"];
const REPAIRS: Row[] = [
  { icon: HumidityIcon, title: "Damp patch on bedroom ceiling", ref: "#28 · Damp and mould", hazard: true, home: "26 Headingley Mount", town: "Leeds", tenant: { name: "Freya Lindqvist", photo: "freya" }, priority: URGENT, status: ["info", Loading03Icon, "In progress"], who: "Tariq Hussain", target: ["good", CheckmarkCircle02Icon, "Attended"], reported: "4 Oct 2026" },
  { icon: Fire02Icon, title: "No heating or hot water in the house", ref: "#26 · Heating and hot water", home: "Room 5, Lavender Grove HMO", town: "London", tenant: { name: "Hugo Martin", initials: "HM" }, priority: ["bad", Alert02Icon, "Emergency"], status: ["warn", Clock01Icon, "Reported"], who: "", target: ["bad", Alert02Icon, "Acknowledge overdue by 8 days"], reported: "7 Oct 2026" },
  { icon: FlashIcon, title: "EICR before new tenancy", ref: "#31 · Maintenance job", hazard: true, home: "5 Thornhill Road", town: "Huddersfield", tenant: null, priority: URGENT, status: ["info", Clock01Icon, "Scheduled"], who: "Tariq Hussain", target: ["bad", Alert02Icon, "Attend overdue by 7 days"], reported: "5 Oct 2026" },
  { icon: FridgeIcon, title: "Dishwasher not drying", ref: "#29 · Appliances", home: "15 St Leonard's Road", town: "Exeter", tenant: { name: "Peter Lowe", initials: "PL" }, priority: ROUTINE, status: ["plain", PauseIcon, "Awaiting"], who: "Tariq Hussain", target: ["muted", PauseIcon, "Clock paused while on hold"], reported: "28 Sept 2026" },
  { icon: DropletIcon, title: "Kitchen tap loose and dripping", ref: "#27 · Plumbing", home: "Cotham Vale", town: "Bristol", tenant: { name: "Grace Adebayo", photo: "grace" }, priority: ROUTINE, status: ["info", Clock01Icon, "Scheduled"], who: "Ellie Marsh", target: ["plain", Clock01Icon, "Attend within 16 days"], reported: "3 Oct 2026" },
  { icon: FlashIcon, title: "Bathroom extractor fan buzzing", ref: "#30 · Electrical", hazard: true, home: "Flat 2", town: "Bristol", tenant: { name: "Nina Kowalski", photo: "nina" }, priority: ROUTINE, status: ["info", CheckmarkCircle02Icon, "Acknowledged"], who: "Ellie Marsh", target: ["plain", Clock01Icon, "Attend within 19 days"], reported: "6 Oct 2026" },
];
const COLS = "grid-cols-[296px_214px_150px_112px_132px_minmax(0,1fr)_90px]";

function Head({ children, sorts }: { children: string; sorts?: boolean }) {
  return (
    <span className="inline-flex items-center gap-1">
      {children}
      {sorts ? <Icon icon={ArrowUpDownIcon} size={14} className="text-faint" /> : null}
    </span>
  );
}

function RepairsList({ pressed }: { pressed: boolean }) {
  return (
    <Shell
      lit={4}
      title={["Repairs", "6 open"]}
      sub="Reports from your tenants and your own jobs, ordered by what is due next."
      actions={
        <>
          <Square icon={Search01Icon} />
          <Square icon={FilterHorizontalIcon} />
          <Square icon={Calendar03Icon} />
          <Ink icon={Add01Icon}>Log a repair</Ink>
        </>
      }
    >
      <Tray separate on={0} tabs={[["Open", "6"], ["Needs a response", "1"], ["Overdue", "2"], ["On hold", "1"], ["Finished"], ["All"]]} />
      <div className="panel mt-6 px-9 pt-6 pb-5">
        <div className={cn("grid items-center pb-3 text-[13px] text-muted", COLS)}>
          <Head sorts>Repair</Head>
          <Head>Property</Head>
          <Head>Tenant</Head>
          <Head sorts>Priority</Head>
          <Head sorts>Status</Head>
          <Head sorts>Target</Head>
          <span className="justify-self-end">
            <Head sorts>Reported</Head>
          </span>
        </div>
        <ul>
          {REPAIRS.map((r, i) => (
            <li key={r.ref} data-target={i === 0 ? "row-damp" : undefined} className={cn("-mx-4 grid h-[72px] items-center rounded-tile px-4 transition-colors duration-200", COLS, i === 0 && pressed && "bg-surface")}>
              <span className="flex min-w-0 items-center gap-4">
                <Icon icon={r.icon} size={20} className="text-ink-2" />
                <span className="min-w-0">
                  <span className="block truncate text-[15px] leading-5">{r.title}</span>
                  <span className="mt-1 flex items-center gap-1.5 text-[12.5px] text-muted">
                    {r.ref}
                    {r.hazard ? (
                      <span className="ml-1 inline-flex items-center gap-1 text-bad">
                        <Icon icon={Shield01Icon} size={13} /> Hazard
                      </span>
                    ) : null}
                  </span>
                </span>
              </span>
              <span className="min-w-0 pr-3">
                <span className="block truncate text-[14px] leading-5">{r.home}</span>
                <span className="mt-1 block text-[12.5px] text-muted">{r.town}</span>
              </span>
              <span className="flex min-w-0 items-center gap-2.5 text-[14px]">
                {r.tenant ? (
                  <>
                    <Avatar photo={r.tenant.photo} initials={r.tenant.initials} />
                    <span className="truncate">{r.tenant.name}</span>
                  </>
                ) : (
                  <span className="text-ink-2">No tenant</span>
                )}
              </span>
              <Tag tone={r.priority[0]} icon={r.priority[1]}>
                {r.priority[2]}
              </Tag>
              <span>
                <Tag tone={r.status[0]} icon={r.status[1]}>
                  {r.status[2]}
                </Tag>
                {r.who ? <span className="mt-1 block pl-[22px] text-[12.5px] text-muted">{r.who}</span> : null}
              </span>
              <span className="min-w-0 truncate">
                <Tag tone={r.target[0]} icon={r.target[1]}>
                  {r.target[2]}
                </Tag>
              </span>
              <span className="text-right text-[14px] text-ink-2 tabular">{r.reported}</span>
            </li>
          ))}
        </ul>
      </div>
    </Shell>
  );
}

type Entry = { key: string; who: string; photo: string; verb: string; when: string; body?: string; internal?: boolean };
const HISTORY: Entry[] = [
  { key: "a", who: "Freya Lindqvist", photo: "freya", verb: "reported it", when: "4 Oct 2026, 13:12", body: "A brown damp patch has appeared on the ceiling of the back bedroom after the heavy rain." },
  { key: "b", who: "Tariq Hussain", photo: "tariq", verb: "added an internal note", when: "5 Oct 2026, 19:12", body: "Quote £480 to replace lead flashing and two slates. Approved by Sam.", internal: true },
  { key: "c", who: "Tariq Hussain", photo: "tariq", verb: "updated the repair", when: "7 Oct 2026, 07:12", body: "Roofer on site, replacing the flashing today." },
];
const RESOLVE_NOTE = "Flashing replaced and two slates fixed. The ceiling should dry out over the next week.";

/** Repair #28's page at step `s` of the repairs tour (see TOURS). */
function RepairDetail({ s }: { s: number }) {
  const status: [Tone, IconSvgElement, string] =
    s >= 18 ? ["good", CheckmarkCircle02Icon, "Closed"] : s >= 17 ? ["good", CheckmarkCircle02Icon, "Resolved"] : s >= 10 ? ["info", Clock01Icon, "Scheduled"] : ["info", Loading03Icon, "In progress"];
  const log: Entry[] = [...HISTORY];
  if (s >= 10) log.push({ key: "d", who: "Sam Whitfield", photo: "sam", verb: "scheduled a visit", when: "15 Oct 2026, 13:52", body: "Friday 16 October, 08:00 to 10:00. Freya is asked to confirm or suggest another time." });
  if (s >= 11) log.push({ key: "e", who: "Freya Lindqvist", photo: "freya", verb: "confirmed the visit", when: "15 Oct 2026, 13:58" });
  if (s >= 17) log.push({ key: "f", who: "Sam Whitfield", photo: "sam", verb: "marked it resolved", when: "16 Oct 2026, 10:14", body: RESOLVE_NOTE });
  if (s >= 18) log.push({ key: "g", who: "Freya Lindqvist", photo: "freya", verb: "confirmed it is fixed", when: "16 Oct 2026, 18:40" });
  const resolved = s >= 17;

  return (
    <Shell
      lit={4}
      title={["Damp patch on bedroom ceiling", "#28"]}
      sub={<span className="text-ink-2">26 Headingley Mount · Damp and mould · reported by Freya Lindqvist, 4 Oct 2026, 13:12</span>}
      actions={<span className="flex h-11 items-center rounded-control bg-surface px-5 text-[15px]">All repairs</span>}
    >
      <div className="-mt-2 flex gap-3 rounded-panel bg-warn-soft px-6 py-4 text-warn">
        <Icon icon={AlertCircleIcon} size={20} className="mt-0.5" />
        <p className="text-[14.5px] leading-snug">
          <span className="block font-medium">Flagged for hazard review: damp and mould</span>
          Damp and mould can harm health. Inspect it promptly and record what you find.
        </p>
      </div>
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_428px] gap-2">
        <div className="flex flex-col gap-2">
          <div className="panel px-6 pt-6 pb-6">
            <div className="flex items-center justify-between">
              <p className="text-[18px]">Details</p>
              <span className="flex h-9 items-center gap-2 rounded-control bg-surface px-3.5 text-[13.5px]">
                <Icon icon={PencilEdit02Icon} size={15} /> Change priority
              </span>
            </div>
            <dl className="mt-5 grid grid-cols-3 gap-x-6 gap-y-5 text-[13px]">
              {[
                ["Status", <Tag key="s" tone={status[0]} icon={status[1]}>{status[2]}</Tag>],
                ["Priority", <Tag key="p" tone="warn" icon={Clock01Icon}>Urgent</Tag>],
                ["Target", <Tag key="t" tone="good" icon={CheckmarkCircle02Icon}>Attended</Tag>],
                ["Category", <span key="c" className="text-[15px] text-ink">Damp and mould</span>],
                ["Where in the home", <span key="w" className="text-[15px] text-ink">Back bedroom</span>],
                ["Visible to tenants", <span key="v" className="text-[15px] text-ink">Yes</span>],
              ].map(([k, v]) => (
                <div key={k as string}>
                  <dt className="text-muted">{k}</dt>
                  <dd className="mt-1.5">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div data-focus="timeline" className="panel flex h-[396px] flex-col px-6 pt-6">
            <p className="text-[18px]">Timeline</p>
            <p className="mt-1 text-[13.5px] text-muted">Everything here is shared with the tenant, except internal notes.</p>
            {/* Newest at the foot, so what just happened is always in view; older steps slide up under a soft edge. */}
            <ol className="mt-4 flex min-h-0 flex-1 flex-col justify-end gap-2 overflow-hidden pb-6 [mask-image:linear-gradient(to_bottom,transparent,#000_48px)]">
              {log.map((e) => (
                <motion.li key={e.key} layout="position" initial={e.key > "c" ? { y: 14 } : false} animate={{ y: 0 }} transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }} className="flex shrink-0 gap-3 rounded-tile bg-surface px-4 py-3.5">
                  <Avatar photo={e.photo} />
                  <div className="min-w-0 flex-1">
                    <p className="flex justify-between gap-3 text-[14px]">
                      <span>
                        {e.who} <span className="text-ink-2">{e.verb}</span>
                      </span>
                      <span className="text-[12.5px] text-muted tabular">{e.when}</span>
                    </p>
                    {e.internal ? (
                      <p className="mt-1 inline-flex items-center gap-1 text-[12.5px] text-warn">
                        <Icon icon={SquareLock02Icon} size={13} /> Internal: only your team sees this
                      </p>
                    ) : null}
                    {e.body ? <p className="mt-1 text-[14px] text-ink-2">{e.body}</p> : null}
                  </div>
                </motion.li>
              ))}
            </ol>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div data-focus="next-step" className="panel p-6">
            <p className="text-[18px]">Next step</p>
            <div className="mt-4 flex flex-col gap-1.5 text-[14.5px]">
              {resolved ? (
                <>
                  <p className="flex h-11 items-center gap-2.5 px-1 text-ink-2">
                    <Icon icon={CheckmarkCircle02Icon} size={17} className="text-good" />
                    {s >= 18 ? "Closed when Freya confirmed the fix" : "Waiting for Freya to confirm the fix"}
                  </p>
                  <span className="flex h-11 items-center gap-2.5 rounded-control bg-surface px-5">
                    <Icon icon={UndoIcon} size={17} /> Reopen
                  </span>
                </>
              ) : (
                <>
                  <span data-target="resolve" className={cn("flex h-11 items-center gap-2.5 rounded-control bg-ink px-5 text-white transition-colors", s === 13 && "bg-ink-hover")}>
                    <Icon icon={CheckmarkCircle02Icon} size={17} /> Mark resolved
                  </span>
                  <span data-target="schedule" className={cn("flex h-11 items-center gap-2.5 rounded-control bg-surface px-5 transition-colors", s === 5 && "bg-white")}>
                    <Icon icon={Calendar03Icon} size={17} /> {s >= 10 ? "Reschedule visit" : "Schedule a visit"}
                  </span>
                  <span className="flex h-11 items-center gap-2.5 rounded-control bg-surface px-5">
                    <Icon icon={PauseIcon} size={17} /> Put on hold
                  </span>
                  <span className="flex h-11 items-center gap-2.5 rounded-control bg-bad-soft px-5 text-bad">
                    <Icon icon={CancelCircleIcon} size={17} /> Cancel repair
                  </span>
                </>
              )}
            </div>
          </div>
          <div className="panel flex-1 p-6">
            <p className="text-[18px]">People</p>
            <ul className="mt-4 flex flex-col gap-1.5">
              {[
                ["Freya Lindqvist", "Lead tenant", "freya", ""],
                ["Oscar Pike", "Tenant", "", "OP"],
                ["Jade Kimani", "Tenant", "", "JK"],
                ["Ravi Patel", "Tenant", "", "RP"],
              ].map(([n, r, p, i]) => (
                <li key={n} className="flex items-center gap-3 rounded-tile bg-surface px-4 py-3">
                  <Avatar photo={p || undefined} initials={i} />
                  <span className="text-[14px] leading-tight">
                    {n}
                    <span className="block text-[12.5px] text-muted">{r}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {s >= 6 && s <= 9 ? (
          <Dialog key="schedule" title="Schedule a visit" help="Pick the day and arrival window. The tenant is asked to confirm or suggest another time.">
            <div className="flex flex-col gap-4">
              <Field label="Visit date">
                <span data-target="date" className={cn("flex h-12 items-center gap-2.5 rounded-control bg-surface px-4 text-[15px]", s >= 7 ? "text-ink" : "text-faint", s === 6 && "ring-2 ring-accent")}>
                  <Icon icon={Calendar03Icon} size={17} className="text-muted" />
                  {s >= 7 ? "Friday 16 October 2026" : "Choose a date"}
                </span>
              </Field>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Arrive from", s >= 7 ? "08:00" : "09:00"],
                  ["Until", s >= 7 ? "10:00" : "12:00"],
                ].map(([l, v]) => (
                  <Field key={l} label={l}>
                    <span className="flex h-12 items-center justify-between rounded-control bg-surface px-4 text-[15px] tabular">
                      {v} <Icon icon={ArrowDown01Icon} size={16} className="text-ink-2" />
                    </span>
                  </Field>
                ))}
              </div>
              <Field label="Message to the tenant" optional>
                <span className="block h-20 rounded-control bg-surface" />
              </Field>
              <span data-target="save" className={cn("ml-auto flex h-11 items-center rounded-control bg-ink px-5 text-[15px] text-white", s === 9 && "bg-ink-hover")}>
                Save visit
              </span>
            </div>
          </Dialog>
        ) : null}
        {s >= 14 && s <= 16 ? (
          <Dialog key="resolve" title="Mark resolved" help="The tenant is asked to confirm the fix. It closes when they do, or after 7 days.">
            <div className="flex flex-col gap-4">
              <Field label="Message to the tenant" optional>
                <span className="block h-24 rounded-control bg-surface px-4 py-3 text-[15px] leading-relaxed ring-2 ring-accent">
                  <Typed text={RESOLVE_NOTE} state={s === 14 ? "typing" : "full"} ms={2000} />
                </span>
              </Field>
              <span data-target="resolve-confirm" className={cn("ml-auto flex h-11 items-center rounded-control bg-ink px-5 text-[15px] text-white", s === 16 && "bg-ink-hover")}>
                Mark resolved
              </span>
            </div>
          </Dialog>
        ) : null}
      </AnimatePresence>
    </Shell>
  );
}

function RepairsTour({ s }: { s: number }) {
  return s < 3 ? <RepairsList pressed={s === 2} /> : <RepairDetail s={s} />;
}

/* ---------- Messages: a reply to Cotham Vale, read and answered ---------- */

type Thread = { id: string; names: string; faces: { photo?: string; initials?: string }[]; home: string; when: string; last: string; unread?: number };
const THREADS: Thread[] = [
  { id: "freya", names: "Freya Lindqvist, Ravi Patel, Oscar Pike and Jade Kimani", faces: [{ photo: "freya" }, { initials: "RP" }, { initials: "+2" }], home: "26 Headingley Mount", when: "7 Oct", last: "Freya: The roofer is here now, thanks for sorting it so fast.", unread: 5 },
  { id: "grace", names: "Grace Adebayo and Liam Connor", faces: [{ photo: "grace" }, { photo: "liam" }], home: "8 Cotham Vale", when: "6 Oct", last: "Ellie: Thanks Grace, the plumber is booked for tomorrow morning." },
  { id: "nina", names: "Nina Kowalski", faces: [{ photo: "nina" }], home: "Flat 2, 14 Royal York Crescent", when: "6 Oct", last: "Nina: I've sent £595 for the rest of August and will clear the rest by Friday." },
  { id: "marcus", names: "Marcus Holloway and Bea Holloway", faces: [{ initials: "MH" }, { initials: "BH" }], home: "48 Auckland Road", when: "5 Oct", last: "You: Hi Marcus and Bea, the EPC assessor is coming on Tuesday." },
  { id: "rhys", names: "Rhys Morgan", faces: [{ initials: "RM" }], home: "33 Pontcanna Street", when: "2 Oct", last: "You: Hi Rhys, just a reminder the gas safety check is next week." },
  { id: "arjun", names: "Arjun Mehta", faces: [{ photo: "arjun" }], home: "Room 1, 17 Lavender Grove", when: "1 Oct", last: "You: Of course, that's no problem for a weekend." },
  { id: "peter", names: "Peter Lowe", faces: [{ initials: "PL" }], home: "15 St Leonard's Road", when: "23 Sept", last: "Tariq: Hi Peter, could we book viewings on Saturday?" },
];
const REPLY = "Hi both, the plumber says the tap is sorted now. Let us know if it drips again.";
const ANSWER = "Brilliant, thank you. All dry this morning.";

function Bubble({ who, photo, mine, body, when, run = true }: { who: string; photo?: string; mine?: boolean; body: string; when: string; run?: boolean }) {
  return (
    <div className={cn("flex gap-2.5", mine ? "flex-row-reverse" : "flex-row")}>
      <span className="w-8 shrink-0">{run && !mine && photo ? <Avatar photo={photo} /> : null}</span>
      <div className={cn("flex max-w-[78%] flex-col gap-1", mine ? "items-end" : "items-start")}>
        {run ? <p className="px-1 text-[12.5px] text-ink-2">{who}</p> : null}
        <p className={cn("rounded-[8px] px-4 py-2.5 text-[14.5px] leading-snug", mine ? "bg-ink text-white" : "bg-surface")}>{body}</p>
        <p className="px-1 text-[11.5px] text-faint tabular">{when}</p>
      </div>
    </div>
  );
}

function MessagesTour({ s }: { s: number }) {
  const sent = s >= 6;
  const answered = s >= 8;
  const grace: Thread = { ...THREADS[1], when: sent ? "13:52" : "6 Oct", last: answered ? `Grace: ${ANSWER}` : sent ? `You: ${REPLY}` : THREADS[1].last };
  // A newer message moves the conversation to the top of the list, as the inbox sorts by latest.
  const threads = sent ? [grace, THREADS[0], ...THREADS.slice(2)] : [THREADS[0], grace, ...THREADS.slice(2)];

  return (
    <Shell
      lit={6}
      title={["Messages", "1 unread"]}
      sub="One conversation per tenancy, kept as a permanent record."
      actions={
        <>
          <Square icon={Search01Icon} />
          <Square icon={FilterHorizontalIcon} />
          <Ink icon={Add01Icon}>New message</Ink>
        </>
      }
    >
      <div className="grid h-[600px] grid-cols-[380px_minmax(0,1fr)] gap-2">
        <ul className="panel flex flex-col gap-0.5 overflow-hidden p-3">
          {threads.map((t) => (
            <motion.li key={t.id} layout transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }} className={cn("flex shrink-0 gap-3 rounded-tile px-3 py-3.5", t.id === "grace" && "bg-surface")}>
              <span className="flex shrink-0 -space-x-2.5">
                {t.faces.map((f, i) => (f.initials === "+2" ? <span key={i} className="flex size-10 items-center justify-center rounded-full bg-ink text-[13px] text-white ring-2 ring-canvas">+2</span> : <Avatar key={i} photo={f.photo} initials={f.initials} size="size-10" className="ring-2 ring-canvas" />))}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[14.5px]">{t.names}</span>
                  <span className="shrink-0 text-[12px] text-ink-2 tabular">{t.when}</span>
                </span>
                <span className="block truncate text-[12.5px] text-ink-2">{t.home}</span>
                <span className="mt-1 flex items-center gap-2 text-[13px]">
                  <span className="truncate">{t.last}</span>
                  {t.unread ? <span className="ml-auto flex size-5 shrink-0 items-center justify-center rounded-full bg-ink text-[11px] text-white">{t.unread}</span> : null}
                </span>
              </span>
            </motion.li>
          ))}
        </ul>

        <div className="panel flex min-h-0 flex-col">
          <div className="flex items-center gap-3 px-6 pt-5 pb-3">
            <span className="flex -space-x-2.5">
              <Avatar photo="grace" size="size-10" className="ring-2 ring-canvas" />
              <Avatar photo="liam" size="size-10" className="ring-2 ring-canvas" />
            </span>
            <span>
              <span className="block text-[17px]">Grace Adebayo and Liam Connor</span>
              <span className="block text-[13px] text-ink-2">8 Cotham Vale</span>
            </span>
            <span className="ml-auto flex gap-2">
              <Square icon={UserAccountIcon} className="size-11" />
              <Square icon={ArrowUpRight01Icon} className="size-11" />
            </span>
          </div>
          <div data-focus="conversation" className="flex min-h-0 flex-1 flex-col justify-end gap-3 overflow-hidden px-6 pb-4 [mask-image:linear-gradient(to_bottom,transparent,#000_56px)]">
            <Bubble who="Liam Connor" photo="liam" body="No problem, I'll be working from home." when="14:00" />
            <p className="text-center text-[12.5px] text-muted">3 Oct 2026</p>
            <Bubble who="Grace Adebayo" photo="grace" body="Hi, I've reported the kitchen tap. It's not urgent but it's getting worse." when="09:12" />
            <p className="text-center text-[12.5px] text-muted">6 Oct 2026</p>
            <Bubble who="Ellie · Whitfield Property Group" photo="ellie" body="Thanks Grace, the plumber is booked for tomorrow morning." when="13:12" />
            {sent ? (
              <motion.div layout="position" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.4 }} className="flex flex-col gap-3">
                <p className="text-center text-[12.5px] text-muted">Today</p>
                <Bubble who="You" mine body={REPLY} when="13:52" />
                {!answered ? <p className="-mt-2 px-10 text-right text-[12px] text-muted">{s >= 7 ? "Seen by Grace" : "Delivered"}</p> : null}
              </motion.div>
            ) : (
              <p className="-mt-2 px-10 text-[12px] text-muted">Seen by Grace</p>
            )}
            {answered ? (
              <motion.div layout="position" initial={{ y: 14 }} animate={{ y: 0 }} transition={{ duration: 0.4 }}>
                <Bubble who="Grace Adebayo" photo="grace" body={ANSWER} when="13:55" />
              </motion.div>
            ) : null}
          </div>
          <div data-target="composer" className={cn("mx-4 mb-4 rounded-[8px] bg-surface p-2 transition-shadow", (s >= 2 && s <= 5) && "ring-2 ring-accent")}>
            <p className={cn("min-h-12 px-3 py-2 text-[15px] leading-relaxed", s >= 3 && s <= 5 ? "text-ink" : "text-faint")}>{s >= 3 && s <= 5 ? <Typed text={REPLY} state={s === 3 ? "typing" : "full"} ms={2400} /> : "Message everyone on the tenancy"}</p>
            <div className="flex items-center gap-2 px-1">
              <span className="flex size-10 items-center justify-center text-ink-2">
                <Icon icon={Attachment01Icon} size={18} />
              </span>
              <span className="relative inline-flex h-7 w-12 items-center rounded-[6px] bg-faint">
                <span className="block size-5 translate-x-1 rounded-[4px] bg-white" />
              </span>
              <span className="inline-flex items-center gap-1 text-[13px] text-ink-2">
                <Icon icon={SquareLock02Icon} size={14} className="text-muted" /> Internal note
              </span>
              <span className="ml-auto text-[12px] text-faint">Ctrl + Enter to send</span>
              <span data-target="send" className={cn("flex h-11 items-center gap-2 rounded-control px-5 text-[15px] text-white transition-colors", s >= 3 && s <= 5 ? (s === 5 ? "bg-ink-hover" : "bg-ink") : "bg-faint")}>
                <Icon icon={SentIcon} size={16} /> Send
              </span>
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ---------- Finance: the roofer's draft expense confirmed ---------- */

const RENT = 9330000;
const EXPENSES = 744213;
const QUOTE = 48000;
const CATS = [
  { id: "utilities", what: "Utilities", pence: 193211 },
  { id: "letting", what: "Letting and management fees", pence: 161761 },
  { id: "repairs", what: "Repairs and maintenance", pence: 130900 },
  { id: "ground", what: "Ground rent and service charges", pence: 111000 },
  { id: "legal", what: "Legal and professional", pence: 57500 },
  { id: "council", what: "Council tax", pence: 48000 },
];
const BY_HOME: [string, number, number][] = [
  ["Lavender Grove HMO", 1879000, 311106],
  ["26 Headingley Mount", 1320000, 37900],
  ["48 Auckland Road", 1110000, 15296],
  ["15 St Leonard's Road", 1077000, 0],
  ["Cotham Vale", 862500, 70541],
  ["33 Pontcanna Street", 735000, 0],
  ["2F1, 18 Marchmont Road", 730000, 32400],
];
const SPENT: [string, string, string, string, string, number][] = [
  ["HMO gas and electricity", "Octopus Energy", "Lavender Grove HMO", "Utilities", "6 Oct 2026", 22181],
  ["HMO broadband", "Community Fibre", "Lavender Grove HMO", "Utilities", "6 Oct 2026", 3500],
  ["Oven element not heating", "Gill Property Services  Repair #25", "Flat 2", "Repairs and maintenance", "4 Oct 2026", 8500],
  ["Garden maintenance", "Leeds Garden Co", "26 Headingley Mount", "Repairs and maintenance", "3 Oct 2026", 2400],
  ["Fortnightly cleaning of shared areas", "Bright & Clean Hackney", "Lavender Grove HMO", "Other", "12 Sept 2026", 4800],
  ["EPC assessment deposit", "Domestic Energy Assessors", "48 Auckland Road", "Other", "12 Sept 2026", 9500],
  ["Tenant find and referencing", "Huddersfield Lets", "5 Thornhill Road", "Letting and management fees", "10 Sept 2026", 39500],
];
const EXP_COLS = "grid-cols-[300px_180px_220px_120px_95px_minmax(0,1fr)_176px]";

function FinanceTour({ s }: { s: number }) {
  const expensesTab = s >= 3 && s <= 8;
  const confirmed = s >= 6;
  const spent = EXPENSES + (confirmed ? QUOTE : 0);
  const cats = CATS.map((c) => (c.id === "repairs" && confirmed ? { ...c, pence: c.pence + QUOTE } : c)).sort((a, b) => b.pence - a.pence);
  const top = cats[0].pence;

  const tabs = <Tray on={expensesTab ? 2 : 0} targets={{ 0: "tab-overview" }} tabs={[["Overview"], ["Portfolio"], ["Expenses"], ["Records"], ["Reports"], ["Export"]]} />;

  if (expensesTab) {
    return (
      <Shell
        lit={8}
        title={["Finance", "Expenses"]}
        sub="Figures come from what you enter and your rent ledger. DirectHomes does not give financial, mortgage or investment advice."
        actions={
          <>
            <Square icon={Search01Icon} />
            <Square icon={FilterHorizontalIcon} />
            <Square icon={Calendar03Icon} />
            <Ink icon={Add01Icon}>Add expense</Ink>
          </>
        }
      >
        {tabs}
        <div className="panel mt-2 px-9 pt-6">
          <div className={cn("grid pb-3 text-[13px] text-muted", EXP_COLS)}>
            <span>Expense</span>
            <span>Property</span>
            <span>Category</span>
            <span>Date paid</span>
            <span className="text-right">Amount</span>
            <span className="pl-6">Status</span>
            <span />
          </div>
          <ul>
            {[["Replace lead flashing and two slates", "Firth Roofing Leeds  Repair #28", "26 Headingley Mount", "Repairs and maintenance", "9 Oct 2026", QUOTE] as const, ...SPENT].map(([what, from, home, cat, date, pence], i) => {
              const draft = i === 0 && !confirmed;
              return (
                <li key={what + date} data-focus={i === 0 ? "draft-row" : undefined} className={cn("-mx-4 grid h-[69px] items-center rounded-tile px-4 text-[14px] transition-colors duration-700", EXP_COLS, i === 0 && confirmed && "bg-white")}>
                  <span>
                    <span className="block">{what}</span>
                    <span className="block text-[12.5px] whitespace-pre text-ink-2">{from}</span>
                  </span>
                  <span className="text-ink-2">{home}</span>
                  <span className="text-ink-2">{cat}</span>
                  <span className="text-ink-2">{date}</span>
                  <span className="text-right tabular">{exact(pence)}</span>
                  <span className="pl-6">
                    {draft ? (
                      <Tag tone="warn" icon={Clock01Icon}>
                        Draft
                      </Tag>
                    ) : (
                      <Tag tone="good" icon={CheckmarkCircle02Icon} className="text-[13.5px]">
                        Confirmed
                      </Tag>
                    )}
                  </span>
                  <span className="flex justify-end gap-1.5">
                    {draft ? (
                      <span data-target="confirm" className={cn("flex h-9 items-center gap-1.5 rounded-control bg-ink px-3.5 text-[13.5px] text-white", s === 5 && "bg-ink-hover")}>
                        <Icon icon={Tick02Icon} size={15} /> Confirm
                      </span>
                    ) : null}
                    <Square icon={PencilEdit02Icon} className="size-9" />
                    <Square icon={Delete02Icon} className="size-9" />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </Shell>
    );
  }

  return (
    <Shell
      lit={8}
      title={["Finance", "2026/27"]}
      sub="Figures come from what you enter and your rent ledger. DirectHomes does not give financial, mortgage or investment advice."
      actions={
        <>
          {["Tax year 2026/27", "All properties"].map((t) => (
            <span key={t} className="flex h-[52px] items-center gap-3 rounded-control bg-surface px-6 text-[15.5px]">
              {t} <Icon icon={ArrowDown01Icon} size={16} />
            </span>
          ))}
          <Square icon={Pdf01Icon} className="size-[52px]" />
        </>
      }
    >
      {tabs}
      <div data-focus="stats" className="mt-2 grid grid-cols-4 gap-2">
        {[
          ["Rent received", <Count key="r" value={RENT} format={pounds} />, "6 Apr 2026 to 5 Apr 2027", false],
          ["Expenses", <Count key="e" value={spent} format={pounds} />, "Includes £183 rent collection fees", true],
          ["Net profit", <Count key="n" value={RENT - spent} format={pounds} />, "Rent received less expenses, before tax", false],
          ["Drafts to review", confirmed ? "0" : "1", confirmed ? "Nothing waiting" : "£480.00 from repair #28", true],
        ].map(([l, v, c, arrow], i) => (
          <div key={l as string} className={cn("panel relative p-5 transition-colors duration-700", s >= 9 && i < 3 && i > 0 && "bg-white/80")}>
            <p className="text-[13.5px] text-muted">{l}</p>
            <p className="mt-2 text-[40px] leading-none font-light tabular">{v}</p>
            <p className="mt-2 text-[13px] text-ink-2">{c}</p>
            {arrow ? <Square target={i === 3 ? "drafts" : undefined} icon={ArrowUpRight01Icon} className={cn("absolute top-4 right-4 size-11 transition-colors", i === 3 && s === 2 && "bg-white")} /> : null}
          </div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-[minmax(0,1fr)_757px] gap-2">
        <div className="panel h-[560px] px-6 pt-6">
          <p className="text-[18px]">Expenses by category</p>
          <p className="mt-1 text-[13.5px] text-muted">HMRC property expense headings.</p>
          <ul className="mt-5 flex flex-col gap-1">
            {cats.map((c) => (
              <motion.li key={c.id} layout transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }} className={cn("rounded-tile px-4 pt-3 pb-3.5 transition-colors duration-700", s >= 9 && c.id === "repairs" ? "bg-white" : "bg-surface")}>
                <span className="flex justify-between text-[14.5px]">
                  {c.what}
                  <span className="tabular">
                    <Count value={c.pence} format={exact} />
                  </span>
                </span>
                <span className="hatch relative mt-2.5 block h-2.5 overflow-hidden rounded-[2px]">
                  <span className="absolute inset-y-0 left-0 rounded-[2px] bg-accent-fill transition-[width] duration-700" style={{ width: `${(c.pence / top) * 100}%` }} />
                </span>
              </motion.li>
            ))}
          </ul>
        </div>
        <div className="panel h-[560px] px-6 pt-6">
          <p className="text-[18px]">By property</p>
          <p className="mt-1 text-[13.5px] text-muted">Profit and loss for each property in this tax year.</p>
          <div className="mt-5 grid grid-cols-[minmax(0,1fr)_130px_120px_130px] px-3 pb-2 text-[13px] text-muted">
            <span>Property</span>
            <span className="text-right">Rent received</span>
            <span className="text-right">Expenses</span>
            <span className="text-right">Net</span>
          </div>
          <ul>
            {BY_HOME.map(([home, rent, out]) => {
              const more = home === "26 Headingley Mount" && confirmed ? QUOTE : 0;
              return (
                <li key={home} className="grid h-[54px] grid-cols-[minmax(0,1fr)_130px_120px_130px] items-center px-3 text-[14.5px] tabular">
                  <span>{home}</span>
                  <span className="text-right">{exact(rent)}</span>
                  <span className="text-right">
                    <Count value={out + more} format={exact} />
                  </span>
                  <span className="text-right">
                    <Count value={rent - out - more} format={exact} />
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </Shell>
  );
}

/* ---------- The tour ---------- */

type Tour = {
  id: string;
  label: string;
  icon: IconSvgElement;
  caption: string;
  /** When each step starts, in ms from the start of the tab. */
  times: number[];
  /** How long the last step holds before the next tab. */
  hold: number;
  /** The element the pointer is on at a step (its data-target), and the steps where it presses. */
  aim: Record<number, string>;
  press: number[];
  /**
   * The camera: from a step on, zoom to `z` centred on an element (its data-focus or data-target), or null for the
   * whole page. A step with no entry keeps the shot before it. Every tab pulls back to the whole page at its end.
   */
  cam: Record<number, [string, number] | null>;
  Page: (p: { s: number }) => ReactNode;
};

const ALL: Tour[] = [
  {
    id: "rent",
    label: "Rent",
    icon: Wallet01Icon,
    caption: "Nina says she paid £595 by bank transfer. Confirm it and it goes into the ledger: received goes up, overdue comes down.",
    times: [0, 900, 1600, 1800, 2700, 3400, 3600, 4600, 5300, 5500],
    hold: 2800,
    aim: { 1: "review", 2: "review", 4: "confirm", 5: "confirm", 7: "tab-charges", 8: "tab-charges" },
    press: [2, 5, 8],
    cam: { 1: ["review", 1.45], 3: ["reported", 1.3], 4: ["confirm", 1.45], 7: ["tab-charges", 1.45], 9: ["stats", 1.3] },
    Page: RentTour,
  },
  {
    id: "repairs",
    label: "Repairs",
    icon: Wrench01Icon,
    caption: "Book the roofer into Freya's diary, mark the damp patch fixed, and it closes when Freya confirms.",
    times: [0, 900, 1700, 2000, 2800, 3500, 3700, 4500, 5300, 6000, 6200, 7800, 8800, 9500, 9700, 12000, 12700, 12900, 14500],
    hold: 2600,
    aim: { 1: "row-damp", 2: "row-damp", 4: "schedule", 5: "schedule", 6: "date", 7: "date", 8: "save", 9: "save", 12: "resolve", 13: "resolve", 15: "resolve-confirm", 16: "resolve-confirm" },
    press: [2, 5, 7, 9, 13, 16],
    cam: { 1: ["row-damp", 1.35], 3: null, 4: ["next-step", 1.45], 6: ["dialog", 1.45], 10: ["timeline", 1.35], 12: ["next-step", 1.45], 14: ["dialog", 1.5], 17: ["timeline", 1.35] },
    Page: RepairsTour,
  },
  {
    id: "messages",
    label: "Messages",
    icon: Message01Icon,
    caption: "Reply to everyone on the Cotham Vale tenancy. You see when Grace has read it, and her answer lands in the same thread.",
    times: [0, 800, 1500, 1700, 4300, 5000, 5200, 6400, 8000],
    hold: 2400,
    aim: { 1: "composer", 2: "composer", 4: "send", 5: "send" },
    press: [2, 5],
    cam: { 1: ["composer", 1.45], 6: ["conversation", 1.3] },
    Page: MessagesTour,
  },
  {
    id: "tasks",
    label: "Tasks",
    icon: KanbanIcon,
    caption: "Add a to-do for the team and drag it to In progress. Rent, repairs and certificates land on the same board by themselves.",
    times: [0, 900, 1600, 1800, 3900, 4600, 4800, 5900, 6600, 6900, 8000],
    hold: 2400,
    aim: { 1: "add-task", 2: "add-task", 4: "add-plus", 5: "add-plus", 7: "new-card", 8: "new-card", 9: "drop", 10: "drop" },
    press: [2, 5, 8, 9],
    cam: { 1: ["todo", 1.35], 7: null },
    Page: TasksTour,
  },
  {
    id: "properties",
    label: "Properties",
    icon: Building03Icon,
    caption: "Type a postcode, pick the address and answer a few questions. The home is added with its compliance reminders already set.",
    times: [0, 900, 1600, 1800, 2600, 3200, 3400, 4400, 5000, 5200, 6000, 6600, 6800, 7600, 8200, 9000, 9600, 10400, 11400, 12100, 12300],
    hold: 2600,
    aim: { 1: "add-property", 2: "add-property", 4: "postcode", 5: "postcode", 7: "find", 8: "find", 10: "pick", 11: "pick", 13: "type", 14: "type", 15: "gas", 16: "gas", 18: "submit", 19: "submit" },
    press: [2, 5, 8, 11, 14, 16, 19],
    cam: { 1: ["add-property", 1.45], 3: null, 4: ["address", 1.3], 13: ["property", 1.2], 17: null, 20: ["homes", 1.25] },
    Page: PropertiesTour,
  },
  {
    id: "team",
    label: "Team",
    icon: UserGroupIcon,
    caption: "Invite a manager to just the homes they look after. They get a link that works for 7 days, and their seat shows straight away.",
    times: [0, 900, 1600, 1800, 2600, 3200, 3400, 5000, 5600, 6400, 7000, 8000, 8700, 8900],
    hold: 2600,
    aim: { 1: "invite", 2: "invite", 4: "email", 5: "email", 7: "role", 8: "role", 9: "selected", 10: "selected", 11: "send-invite", 12: "send-invite" },
    press: [2, 5, 8, 10, 12],
    cam: { 1: ["invite", 1.45], 3: ["dialog", 1.35], 13: ["invites", 1.3] },
    Page: TeamTour,
  },
  {
    id: "tenants",
    label: "Tenants",
    icon: UserIcon,
    caption: "Nina reports a broken window from her own app, with a photo. It reaches you straight away, and she can follow every step. Free for tenants.",
    times: [0, 900, 1600, 1800, 2700, 3400, 3700, 4500, 5200, 5400, 6800, 9000, 9700, 9900, 10700, 11400, 11600],
    hold: 2600,
    aim: { 1: "report", 2: "report", 4: "windows", 5: "windows", 7: "continue-1", 8: "continue-1", 11: "continue-2", 12: "continue-2", 14: "send-report", 15: "send-report" },
    press: [2, 5, 8, 12, 15],
    cam: { 1: ["report", 1.45], 3: ["wizard", 1.25], 16: ["open", 1.3] },
    Page: TenantTour,
  },
  {
    id: "finance",
    label: "Finance",
    icon: PieChart01Icon,
    caption: "The roofer's £480 arrives from the repair as a draft. Confirm it and the year's expenses and profit update.",
    times: [0, 900, 1600, 1800, 2800, 3500, 3700, 4700, 5400, 5600],
    hold: 2800,
    aim: { 1: "drafts", 2: "drafts", 4: "confirm", 5: "confirm", 7: "tab-overview", 8: "tab-overview" },
    press: [2, 5, 8],
    cam: { 1: ["drafts", 1.5], 3: ["draft-row", 1.1], 4: ["confirm", 1.45], 7: ["tab-overview", 1.45], 9: ["stats", 1.3] },
    Page: FinanceTour,
  },
];
const length = (t: Tour) => t.times[t.times.length - 1] + t.hold;
/** How long before a tab ends the camera pulls back to the whole page. */
const OUTRO = 1500;
/** The change between tabs: the old page fades off the new one, which settles in; the demo starts after it. */
const INTRO = 500;
const CHANGE = 500;

/** The shot in force at step `s`: the latest camera entry at or before it. */
function shot(t: Tour, s: number) {
  for (let i = s; i >= 0; i--) if (i in t.cam) return t.cam[i];
  return null;
}

/** A drawn pointer (not the system one), travelling to its target and pressing it. Its tip sits at (7, 4) of its box. */
function Pointer({ at, pressing, tap }: { at: [number, number] | null; pressing: boolean; tap: string | null }) {
  const [x, y] = at ?? [W - 260, H - 140];
  return (
    <>
      {tap !== null && at ? <span key={tap} className="absolute top-0 left-0 z-30 size-14 animate-tap rounded-full bg-ink/25" style={{ translate: `${x - 28}px ${y - 28}px` }} /> : null}
      <svg
        viewBox="0 0 24 24"
        aria-hidden
        className={cn(
          "absolute top-0 left-0 z-30 size-10 origin-[7px_4px] drop-shadow-[0_2px_2px_rgb(20_20_20/0.3)] transition-[translate,scale] duration-[800ms] ease-[cubic-bezier(0.45,0,0.25,1)]",
          pressing && "scale-85",
        )}
        style={{ translate: `${x - 7}px ${y - 4}px` }}
      >
        <path d="M5 3l14 7.5-6.2 1.6L9.9 18z" fill="#141414" stroke="#fff" strokeWidth={1.6} strokeLinejoin="round" />
      </svg>
    </>
  );
}

/**
 * `only` limits the tour to some of its demos (by id), for pages about one part of the app; one demo shows no tabs.
 * `bare` drops the wash box and the caption, leaving just the app window (the caption stays for screen readers).
 */
export function ProductTour({ only, bare, className }: { only?: string[]; bare?: boolean; className?: string } = {}) {
  const TOURS = only ? ALL.filter((t) => only.includes(t.id)) : ALL;
  const box = useRef<HTMLDivElement>(null);
  const screen = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  const seen = useInView(box, { amount: 0.35 });
  const still = useReducedMotion();
  const [tab, setTab] = useState(0);
  const [run, setRun] = useState(0);
  const [step, setStep] = useState(0);
  const [aim, setAim] = useState<[number, number] | null>(null);
  const camera = useRef<HTMLDivElement>(null);
  const [outro, setOutro] = useState(false);
  // The page being left, drawn as it was at the moment of the change, fading off the top of the new one.
  const [leaving, setLeaving] = useState<{ tab: number; s: number; key: number } | null>(null);
  const changes = useRef(0);
  const tour = TOURS[tab];
  const playing = seen && !still;
  // Without motion (or before the tour runs) a tab shows its finished state.
  const s = playing ? step : tour.times.length - 1;

  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    // Boxed, it stays legible on a phone and the box crops it; bare, it shows the whole screen shrunk to fit.
    const fit = () => setScale(Math.max(bare ? 0 : 0.42, el.clientWidth / W));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [bare]);

  // Play the current tab from its start, then move to the next one; a tab click restarts from that tab.
  useEffect(() => {
    if (!playing) return;
    const timers = tour.times.map((t, i) => window.setTimeout(() => setStep(i), t && t + INTRO));
    timers.push(window.setTimeout(() => setOutro(true), INTRO + length(tour) - OUTRO));
    timers.push(
      window.setTimeout(() => {
        setLeaving({ tab, s: tour.times.length - 1, key: ++changes.current });
        setStep(0);
        setOutro(false);
        setTab((t) => (t + 1) % TOURS.length);
        // A tour of one demo plays it again from the start.
        if (TOURS.length === 1) setRun((r) => r + 1);
      }, INTRO + length(tour)),
    );
    return () => {
      timers.forEach(clearTimeout);
      setStep(0);
      setOutro(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- `tab` moves with `tour`
  }, [playing, tour, run]);

  // The leaving page is only there for the length of the change.
  useEffect(() => {
    if (!leaving) return;
    const t = window.setTimeout(() => setLeaving(null), CHANGE + 50);
    return () => clearTimeout(t);
  }, [leaving]);

  // Measure an element in the page's own units (1440 wide), whatever the window's scale and the camera's zoom,
  // even mid-move: both are read off the camera layer's current box.
  const measure = (cam: HTMLDivElement | null, name: string) => {
    const el = cam?.querySelector(`[data-focus="${name}"], [data-target="${name}"]`);
    if (!cam || !el) return null;
    const c = cam.getBoundingClientRect();
    const k = c.width / W;
    const b = el.getBoundingClientRect();
    return { x: (b.left - c.left) / k, y: (b.top - c.top) / k, w: b.width / k, h: b.height / k };
  };

  // Aim the pointer at the real element on the page, a little right of its centre.
  useLayoutEffect(() => {
    const name = playing ? tour.aim[s] : undefined;
    const r = name ? measure(camera.current, name) : null;
    if (!r) return;
    setAim([r.x + r.w * 0.6, r.y + r.h * 0.55]);
  }, [s, tour, playing]);

  // Point the camera: centre the shot's element at its zoom, kept inside the page so no edge of it ever shows.
  // It is written straight to the layer's style, so the CSS transition carries it from wherever it is now.
  useLayoutEffect(() => {
    const cam = camera.current;
    if (!cam) return;
    const want = playing && !outro ? shot(tour, s) : null;
    const r = want ? measure(cam, want[0]) : null;
    let [x, y, z] = [0, 0, 1];
    if (want && r) {
      // Never closer than keeps the whole element in the shot, and never further out than the page itself.
      z = Math.max(1, Math.min(want[1], (W * 0.96) / r.w, (H * 0.92) / r.h));
      const clamp = (v: number, lo: number) => Math.min(0, Math.max(lo, v));
      x = clamp(W / 2 - (r.x + r.w / 2) * z, W - W * z);
      y = clamp(H / 2 - (r.y + r.h / 2) * z, H - H * z);
    }
    cam.style.transform = `translate(${x}px, ${y}px) scale(${z})`;
  }, [s, tour, playing, outro]);

  const pick = (i: number) => {
    if (i !== tab && playing) setLeaving({ tab, s, key: ++changes.current });
    setStep(0);
    setOutro(false);
    setTab(i);
    setRun((r) => r + 1);
  };
  // The nav's product menu opens a demo by name ("tour:pick"), on its way down to this section.
  useEffect(() => {
    const open = (e: Event) => {
      const i = TOURS.findIndex((t) => t.id === (e as CustomEvent<string>).detail);
      if (i >= 0) pick(i);
    };
    window.addEventListener("tour:pick", open);
    return () => window.removeEventListener("tour:pick", open);
  });

  // Arriving from another page's menu (/features#tour-messages): open that demo and bring the tour into view.
  useEffect(() => {
    const id = window.location.hash.match(/^#tour-(\w+)$/)?.[1];
    const i = id ? TOURS.findIndex((t) => t.id === id) : -1;
    if (i < 0) return;
    pick(i);
    box.current?.scrollIntoView({ block: "center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- once, on arrival
  }, []);

  const Page = tour.Page;
  const Leaving = leaving ? TOURS[leaving.tab].Page : null;
  const pressing = playing && tour.press.includes(s);

  return (
    <div className={cn(!bare && "overflow-hidden px-3 pt-3 pb-6 sm:px-8 sm:pt-8 sm:pb-6 lg:px-12 lg:pt-10 lg:pb-6", className)}>
      <div ref={box}>
        <div
          ref={screen}
          aria-hidden
          inert
          style={{ width: W, height: H, ...(scale === null ? {} : { zoom: scale }) }}
          className={cn(
            "pointer-events-none relative overflow-hidden rounded-[12px] select-none",
            // Bare, the window fades into the page from its middle down, as the home hero's app does. Boxed, the app's canvas
            // drops a step to the sunken grey so the window reads by tone against the page, with a short shadow under it.
            bare ? "[mask-image:linear-gradient(to_bottom,#000_55%,rgb(0_0_0/0.75)_70%,rgb(0_0_0/0.4)_82%,rgb(0_0_0/0.12)_92%,transparent)]" : "[--color-canvas:var(--color-sunken)] bg-canvas shadow-[0_1px_2px_rgb(30_28_40/0.08),0_14px_24px_-16px_rgb(30_28_40/0.28)]",
            scale === null && "[zoom:0.42] md:[zoom:0.5] lg:[zoom:0.58] xl:[zoom:0.72] min-[1440px]:[zoom:0.84]",
          )}
        >
          {/* The camera: the page and the pointer move together, so a zoom never separates the pointer from its button. */}
          <div
            ref={camera}
            className="absolute inset-0 origin-top-left transition-transform duration-[1300ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
          >
            {/* The new page settles in: a hair smaller to full size. It is never hidden, only moving. */}
            <div key={`in-${tour.id}-${run}`} className="absolute inset-0" style={playing ? { animation: `tour-in ${CHANGE + 150}ms cubic-bezier(0.2,0.8,0.2,1) both` } : undefined}>
              <Page s={s} />
            </div>
            {playing ? <Pointer at={aim} pressing={pressing} tap={pressing ? `${tour.id}-${s}` : null} /> : null}
          </div>
          {/* The window's foot: the page fades into the app's canvas rather than stopping in a cut. */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-16 bg-gradient-to-b from-canvas/0 to-canvas" />
          {/* The page being left fades off the new one. Its resting state is invisible, so it can never cover the page. */}
          {Leaving && leaving ? (
            <div key={`out-${leaving.key}`} className="absolute inset-0 z-20 overflow-hidden opacity-0" style={{ animation: `tour-out ${CHANGE}ms cubic-bezier(0.4,0,0.2,1) both` }}>
              <Leaving s={leaving.s} />
            </div>
          ) : null}
        </div>
      </div>

      {/* The tabs: each plays its demo in the window above. The playing tab fills as its demo runs. */}
      <div role="tablist" aria-label="Product demos" hidden={TOURS.length === 1} className="mx-auto mt-6 grid w-full grid-cols-4 gap-1 rounded-[8px] bg-white/45 p-1 sm:mt-6 sm:flex lg:w-fit">
        {TOURS.map((t, i) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={i === tab}
            aria-controls="tour-caption"
            onClick={() => pick(i)}
            className={cn("relative flex h-[58px] min-w-0 flex-1 flex-col items-center justify-center gap-1.5 rounded-[6px] text-[12px] leading-none transition-colors duration-300 lg:h-11 lg:flex-none lg:flex-row lg:gap-2 lg:px-4 lg:text-[15px] lg:leading-normal", i === tab ? "text-white" : "text-ink-2 hover:bg-white/60 hover:text-ink")}
          >
            {/* The ink highlight slides from the old tab to the new one, and fills as the demo runs. */}
            {i === tab ? (
              <motion.span layoutId="tour-tab" transition={{ type: "spring", stiffness: 380, damping: 34 }} className="absolute inset-0 overflow-hidden rounded-[6px] bg-ink">
                {playing ? <span key={`${t.id}-${run}`} className="absolute inset-y-0 left-0 bg-white/15" style={{ animation: `tour-fill ${INTRO + length(t)}ms linear forwards` }} /> : null}
              </motion.span>
            ) : null}
            {/* Small screens: the name under the icon, in two rows of four on a phone. Names alone from 1024px, both side by side from 1280px. */}
            <Icon icon={t.icon} size={18} className="relative lg:hidden xl:block" />
            <span className="relative">{t.label}</span>
          </button>
        ))}
      </div>
      <p id="tour-caption" role="tabpanel" aria-live="polite" className={cn(bare ? "sr-only" : "mx-auto mt-4 min-h-[3em] max-w-[34rem] px-2 text-center text-[15px] leading-normal text-ink-2")}>
        {tour.caption}
      </p>
    </div>
  );
}
