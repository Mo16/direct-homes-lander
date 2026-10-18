"use client";

import { AnimatePresence, motion } from "motion/react";
import {
  Add01Icon,
  Fire02Icon,
  HumidityIcon,
  Alert02Icon,
  ArrowDown01Icon,
  ArrowUpDoubleIcon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowUp01Icon,
  ArrowUpDownIcon,
  ArrowUpRight01Icon,
  Building03Icon,
  Calendar03Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  Delete02Icon,
  Door01Icon,
  DropletIcon,
  FlashIcon,
  FridgeIcon,
  Image01Icon,
  Location01Icon,
  Mail01Icon,
  PencilEdit02Icon,
  Search01Icon,
  FilterHorizontalIcon,
  Tick02Icon,
  UserAdd01Icon,
  UserRemove01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import Image from "next/image";
import type { ReactNode } from "react";
import { Icon } from "./icon";
import { Avatar, Count, Dialog, Field, Ink, Shell, Square, Tag, Tray, Typed, exact, pounds } from "./tour-kit";
import { cn } from "@/lib/utils";

/*
 * The rest of the product tour's pages (product-tour.tsx holds the engine and the first ones). Each is a copy of a
 * real page of the web app for the demo landlord, Sam Whitfield, or his tenant Nina Kowalski, checked against
 * screenshots of the running app on 15 Oct 2026, drawn at step `s` of its demo.
 */

const card = "panel relative p-5";

/* ---------- Rent: a payment a tenant reported, confirmed into the ledger ---------- */

const DUE = 1681500;
const REPORTED = 59500;

function Bars({ pct }: { pct: number }) {
  const shares = [0.86, 0.84, 0.88, 0.8, 0.78, pct / 100];
  return (
    <div className="mt-auto flex flex-col gap-1.5">
      <div className="flex h-[78px] items-end justify-between gap-2 px-1">
        {shares.map((v, i) => (
          <span key={i} className="hatch relative h-full flex-1 overflow-hidden rounded-[3px]">
            <span className={cn("absolute inset-x-0 bottom-0 rounded-[3px] transition-[height] duration-700", i === 5 ? "bg-accent-fill" : "bg-sunken")} style={{ height: `${v * 100}%` }} />
          </span>
        ))}
      </div>
      <div className="flex justify-between gap-2 px-1 text-center text-[11.5px] text-muted">
        {["May", "Jun", "Jul", "Aug", "Sept", "Oct"].map((m) => (
          <span key={m} className="flex-1">
            {m}
          </span>
        ))}
      </div>
    </div>
  );
}

const CHARGES: [string, string, string, string, number, number, "due" | "paid" | "late"][] = [
  ["15 Oct 2026", "Flat 2", "Nina Kowalski", "15 Oct to 14 Nov", 129500, 129500, "due"],
  ["15 Oct 2026", "Room 2, Lavender Grove HMO", "Ana Souza", "15 Oct to 14 Nov", 89500, 89500, "due"],
  ["5 Oct 2026", "33 Pontcanna Street", "Rhys Morgan", "5 Oct to 4 Nov", 105000, 0, "paid"],
  ["1 Oct 2026", "15 St Leonard's Road", "Peter Lowe", "1 Oct to 31 Oct", 179500, 0, "paid"],
  ["1 Oct 2026", "26 Headingley Mount", "Freya Lindqvist, Oscar Pike, Jade Kimani, Ravi Patel", "1 Oct to 31 Oct", 220000, 0, "paid"],
  ["20 Sept 2026", "Room 3, Lavender Grove HMO", "Kwame Asante", "20 Sept to 19 Oct", 82000, 82000, "late"],
];
const CHARGE_COLS = "grid-cols-[140px_minmax(0,1fr)_170px_120px_120px_220px]";

export function RentTour({ s }: { s: number }) {
  const reported = s >= 3 && s <= 8;
  const confirmed = s >= 6;
  const received = 938000 + (confirmed ? REPORTED : 0);
  const pct = Math.round((received / DUE) * 100);
  return (
    <Shell
      lit={3}
      title={["Rent", "October 2026"]}
      sub="Every charge, payment and payout across your tenancies, worked out from one ledger."
      actions={
        <>
          <Square icon={Search01Icon} />
          <Square icon={FilterHorizontalIcon} />
          <Square icon={Calendar03Icon} />
          <Ink icon={Add01Icon}>Record payment</Ink>
        </>
      }
    >
      <Tray on={reported ? 2 : 0} targets={{ 0: "tab-charges" }} tabs={[["Charges"], ["Payments"], ["Reported", confirmed ? undefined : "1"], ["Payouts"], ["Statements"]]} />
      {reported ? (
        <div data-focus="reported" className="panel mt-2 p-6">
          <p className="text-[18px]">Reported by tenants</p>
          <p className="mt-1 text-[13.5px] text-muted">Payments your tenants say they made outside DirectHomes. Confirm each one to add it to the ledger, or tell the tenant why not.</p>
          <div className={cn("mt-5 flex items-center gap-4 rounded-tile px-5 py-4 transition-colors duration-700", confirmed ? "bg-white" : "bg-surface")}>
            <Avatar photo="nina" size="size-10" />
            <span className="min-w-0 flex-1">
              <span className="block text-[15px]">Nina Kowalski · Flat 2</span>
              <span className="block text-[13px] text-ink-2">Bank transfer on 6 Oct 2026 · &ldquo;I&rsquo;ve sent £595 for the rest of August and will clear the rest by Friday.&rdquo;</span>
            </span>
            <span className="text-[17px] tabular">{exact(REPORTED)}</span>
            {confirmed ? (
              <Tag tone="good" icon={CheckmarkCircle02Icon} className="w-[260px]">
                Confirmed, added to the ledger
              </Tag>
            ) : (
              <span className="flex w-[260px] justify-end gap-2">
                <span className="flex h-10 items-center rounded-control bg-canvas px-4 text-[14px]">Tell Nina why not</span>
                <span data-target="confirm" className={cn("flex h-10 items-center gap-1.5 rounded-control bg-ink px-4 text-[14px] text-white", s === 5 && "bg-ink-hover")}>
                  <Icon icon={Tick02Icon} size={16} /> Confirm
                </span>
              </span>
            )}
          </div>
          <p className="mt-4 px-1 text-[13px] text-muted">Nina gets a receipt as soon as it&rsquo;s confirmed, and it shows on her statement.</p>
        </div>
      ) : (
        <>
          <div data-focus="stats" className="mt-2 grid grid-cols-4 gap-2">
            <div className={cn(card, "transition-colors duration-700", s >= 9 && "bg-white/80")}>
              <p className="text-[13.5px] text-muted">Received this month</p>
              <p className="mt-2 text-[40px] leading-none font-light tabular">
                <Count value={received} format={pounds} />
              </p>
              <p className="mt-2 text-[13px] text-ink-2">Online and recorded payments since 1 October</p>
              <div className="hatch relative mt-5 h-3 overflow-hidden rounded-[2px]">
                <div className="absolute inset-y-0 left-0 rounded-[2px] bg-accent-fill transition-[width] duration-700" style={{ width: `${pct}%` }} />
              </div>
              <p className="mt-2 text-[12.5px] text-ink-2">of £16,815 due this month</p>
              <Square icon={ArrowUpRight01Icon} className="absolute top-4 right-4 size-11" />
            </div>
            <div className={cn(card, "transition-colors duration-700", s >= 9 && "bg-white/80")}>
              <p className="text-[13.5px] text-muted">Overdue</p>
              <p className="mt-2 text-[40px] leading-none font-light tabular">
                <Count value={443500 - (confirmed ? REPORTED : 0)} format={pounds} />
              </p>
              <p className="mt-2 text-[13px] text-ink-2">Across 3 tenancies</p>
              <Square icon={ArrowUpRight01Icon} className="absolute top-4 right-4 size-11" />
            </div>
            <div className={card}>
              <p className="text-[13.5px] text-muted">In progress</p>
              <p className="mt-2 text-[40px] leading-none font-light tabular">£1,725</p>
              <p className="mt-2 text-[13px] text-ink-2">Direct Debits and bank payments on their way</p>
              <Square icon={ArrowUpRight01Icon} className="absolute top-4 right-4 size-11" />
            </div>
            <div className={cn(card, "flex flex-col")}>
              <p className="text-[13.5px] text-muted">Collected against due</p>
              <p className="mt-1 text-[13px] text-ink-2 tabular">
                <Count value={pct} format={(n) => `${n}%`} /> of £16,815 due in October
              </p>
              <Bars pct={pct} />
            </div>
          </div>
          <AnimatePresence initial={false}>
            {!confirmed ? (
              <motion.div key="banner" exit={{ opacity: 0, height: 0, marginTop: 0 }} transition={{ duration: 0.4 }} data-focus="banner" className="mt-2 flex items-center gap-3 overflow-hidden rounded-panel bg-warn-soft px-5 py-3.5 text-warn">
                <Icon icon={Alert02Icon} size={19} />
                <p className="flex-1 text-[14px] leading-snug">
                  <span className="block font-medium">1 payment reported by tenants</span>
                  Confirm each one to add it to the ledger, or tell the tenant why not.
                </p>
                <span data-target="review" className={cn("flex h-9 items-center rounded-control bg-ink px-4 text-[13.5px] text-white", s === 2 && "bg-ink-hover")}>
                  Review
                </span>
              </motion.div>
            ) : null}
          </AnimatePresence>
          <div className="panel mt-2 px-7 pt-5">
            <div className={cn("grid pb-2 text-[13px] text-muted", CHARGE_COLS)}>
              <span>Due</span>
              <span>Tenancy</span>
              <span>Covers</span>
              <span className="text-right">Amount</span>
              <span className="text-right">Outstanding</span>
              <span className="pl-8">Status</span>
            </div>
            {CHARGES.map(([due, home, who, covers, amount, left, st]) => (
              <div key={due + home} className={cn("grid h-[62px] items-center text-[14px]", CHARGE_COLS)}>
                <span>{due}</span>
                <span className="min-w-0">
                  <span className="block truncate">{home}</span>
                  <span className="block truncate text-[12.5px] text-ink-2">{who}</span>
                </span>
                <span className="text-[13px] text-ink-2">{covers}</span>
                <span className="text-right tabular">{exact(amount)}</span>
                <span className={cn("text-right tabular", !left && "text-ink-2")}>{left ? exact(left) : "None"}</span>
                <span className="pl-8">
                  {st === "paid" ? (
                    <Tag tone="good" icon={CheckmarkCircle02Icon}>
                      Paid
                    </Tag>
                  ) : st === "due" ? (
                    <Tag tone="warn" icon={Clock01Icon}>
                      Due today
                    </Tag>
                  ) : (
                    <Tag tone="bad" icon={Alert02Icon}>
                      Overdue 14+ days
                    </Tag>
                  )}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </Shell>
  );
}

/* ---------- Tasks: a to-do added, then a card dragged to In progress ---------- */

type Task = { id: string; kind: string; dot: string; title: string; sub: string; amount?: string; high?: boolean };
const TASKS: Task[] = [
  { id: "heat", kind: "Repair", dot: "bg-accent-fill", title: "No heating or hot water in the house", sub: "Lavender Grove HMO · Emergency, response overdue", high: true },
  { id: "nina", kind: "Rent overdue", dot: "bg-ink", title: "Flat 2: rent overdue", sub: "Nina Kowalski · 61 days overdue", amount: "£1,890.00", high: true },
  { id: "kwame", kind: "Rent overdue", dot: "bg-ink", title: "Room 3, Lavender Grove HMO: rent overdue", sub: "Kwame Asante · 25 days overdue", amount: "£820.00", high: true },
  { id: "eicr", kind: "Maintenance", dot: "bg-accent-fill/60", title: "EICR before new tenancy", sub: "5 Thornhill Road · Due 17 Oct", high: true },
  { id: "gas", kind: "Certificates", dot: "bg-accent-strong", title: "Gas safety record expiring", sub: "33 Pontcanna Street · 18 Oct 2026" },
];
const NEW_TASK = "Book gutter clearance at 9 Widcombe Parade";

function TaskCard({ t, lifted }: { t: Task; lifted?: boolean }) {
  return (
    <motion.div
      layoutId={`task-${t.id}`}
      transition={{ duration: 0.8, ease: [0.45, 0, 0.25, 1] }}
      className={cn("rounded-tile bg-surface px-4 pt-3.5 pb-4", lifted && "rotate-[1.5deg] shadow-[0_10px_24px_-12px_rgb(28_26_60/0.45)]")}
    >
      <p className="flex items-center gap-2 text-[12.5px] text-ink-2">
        <span className={cn("size-2 rounded-[2px]", t.dot)} />
        {t.kind}
        {t.high ? <Icon icon={ArrowUpDoubleIcon} size={16} className="ml-auto text-bad" /> : null}
      </p>
      <p className="mt-2 flex justify-between gap-3 text-[15px]">
        {t.title}
        {t.amount ? <span className="tabular">{t.amount}</span> : null}
      </p>
      <p className="mt-1 flex items-center gap-1.5 text-[12.5px] text-ink-2">
        {t.id === "new" ? <Icon icon={ArrowUp01Icon} size={14} className="text-warn" /> : null}
        {t.sub}
      </p>
    </motion.div>
  );
}

export function TasksTour({ s }: { s: number }) {
  const added = s >= 6;
  const moved = s >= 9;
  const mine: Task = { id: "new", kind: "Team to-do", dot: "bg-muted", title: NEW_TASK, sub: "Sam Whitfield · 15 Oct" };
  const todo = [...(added && !moved ? [mine] : []), ...TASKS];
  const open = 17 + (added ? 1 : 0);
  return (
    <Shell lit={1} title={["Tasks", `${open} open`]} sub="Your team's own tasks and everything your properties need, on one board.">
      <div className="-mt-[52px]">
        <Tray
          on={0}
          tabs={[["Everything", String(open)], ["Team to-dos", String(added ? 2 : 1)], ["Rent", "7"], ["Repairs", "1"], ["Maintenance", "1"], ["Certificates", "4"], ["Payments to confirm", "1"], ["Invitations", "2"]]}
        />
        <div className="mt-3 grid h-[540px] grid-cols-3 gap-2">
          <div data-focus="todo" className="panel flex flex-col gap-1.5 overflow-hidden p-3.5">
            <p className="flex items-center gap-2 px-1 pb-2 text-[15px]">
              To do <span className="text-[13px] text-muted tabular">{open - (moved ? 1 : 0)}</span>
            </p>
            <div data-target="add-task" className={cn("flex h-12 items-center rounded-tile bg-surface pr-1.5 pl-4 text-[14.5px]", s >= 2 && s <= 5 && "ring-2 ring-accent")}>
              <span className={cn("flex-1", s >= 3 && s <= 5 ? "text-ink" : "text-muted")}>{s >= 3 && s <= 5 ? <Typed text={NEW_TASK} state={s === 3 ? "typing" : "full"} ms={1800} /> : "Add a task"}</span>
              <span data-target="add-plus" className={cn("flex size-9 items-center justify-center rounded-[4px] transition-colors", s >= 3 && s <= 5 ? "bg-ink text-white" : "bg-sunken text-faint")}>
                <Icon icon={Add01Icon} size={17} />
              </span>
            </div>
            {todo.map((t) => (
              <div key={t.id} data-target={t.id === "new" ? "new-card" : undefined}>
                <TaskCard t={t} lifted={t.id === "new" && s === 8} />
              </div>
            ))}
          </div>
          <div className="panel flex flex-col p-3.5">
            <p className="flex items-center gap-2 px-1 pb-2 text-[15px]">
              In progress <span className="text-[13px] text-muted tabular">{moved ? 1 : 0}</span>
            </p>
            <div data-target="drop" className="min-h-[120px]">
              {moved ? <TaskCard t={{ ...mine, sub: "Sam Whitfield · started today" }} lifted={s === 9} /> : <p className="px-1 text-[13.5px] text-ink-2">Drag a card here when someone starts on it.</p>}
            </div>
          </div>
          <div className="panel p-3.5">
            <p className="flex items-center gap-2 px-1 pb-2 text-[15px]">
              Done <span className="text-[13px] text-muted">0</span>
            </p>
            <p className="px-1 text-[13.5px] text-ink-2">Finished tasks from the last 30 days.</p>
          </div>
        </div>
      </div>
    </Shell>
  );
}

/* ---------- Properties: a new home added from its postcode ---------- */

type Home = { name: string; place: string; photo?: string; type: string; beds: string; occ: [string, IconSvgElement, "good" | "warn" | "plain" | "muted"]; people: { photo?: string; initials?: string }[]; count: string; rent: string };
const HOMES: Home[] = [
  { name: "48 Auckland Road", place: "London SE19 2DJ", photo: "norwood", type: "Terraced house", beds: "3 beds", occ: ["Let", CheckmarkCircle02Icon, "good"], people: [{ initials: "MH" }, { initials: "BH" }], count: "2 tenants", rent: "£1,850/mo" },
  { name: "33 Pontcanna Street", place: "Cardiff CF11 9HQ", photo: "cardiff-zinc", type: "Terraced house", beds: "2 beds", occ: ["Let", CheckmarkCircle02Icon, "good"], people: [{ initials: "RM" }], count: "1 tenant", rent: "£1,050/mo" },
  { name: "26 Headingley Mount", place: "Leeds LS6 3EL", photo: "leeds-semi", type: "Semi-detached house", beds: "4 beds", occ: ["Let", CheckmarkCircle02Icon, "good"], people: [{ photo: "freya" }, { initials: "RP" }, { initials: "OP" }], count: "4 tenants", rent: "£2,200/mo" },
  { name: "15 St Leonard's Road", place: "Exeter EX2 4LA", photo: "exeter-semi", type: "Semi-detached house", beds: "4 beds", occ: ["Ending 3 Nov 2026", Clock01Icon, "warn"], people: [{ initials: "PL" }], count: "1 tenant", rent: "£1,795/mo" },
  { name: "2F1, 18 Marchmont Road", place: "Edinburgh EH9 1HX", photo: "edinburgh-tenement", type: "Flat", beds: "2 beds", occ: ["Let", CheckmarkCircle02Icon, "good"], people: [{ initials: "EF" }], count: "1 tenant", rent: "£1,225/mo" },
];
const NEW_HOME: Home = { name: "18 Elm Grove", place: "Bristol BS7 8LZ", type: "Terraced house", beds: "2 beds", occ: ["Vacant", Clock01Icon, "muted"], people: [], count: "No tenants yet", rent: "None" };
const HOME_COLS = "grid-cols-[minmax(0,1fr)_210px_210px_250px_120px]";
const ELM = ["12 Elm Grove", "16 Elm Grove", "18 Elm Grove", "20 Elm Grove"];

function PropertyList({ s, added }: { s: number; added: boolean }) {
  const homes = added ? [NEW_HOME, ...HOMES] : HOMES;
  return (
    <Shell
      lit={2}
      title={["Properties", added ? "11 active" : "10 active"]}
      sub="Every home you let, who lives there and on what rent."
      actions={
        <>
          <Square icon={Search01Icon} />
          <Square icon={FilterHorizontalIcon} />
          <Ink icon={Add01Icon} target="add-property" className={cn(s === 2 && "bg-ink-hover")}>
            Add property
          </Ink>
        </>
      }
    >
      <div className="grid grid-cols-4 gap-2">
        {[
          ["Let", "9", added ? "of 11 · 2 vacant" : "of 10 · 1 vacant"],
          ["Monthly rent roll", "£15,965", "Across live tenancies"],
          ["Ending", "1", "Notice given"],
          ["Starting soon", "1", "1 invite waiting"],
        ].map(([l, v, c]) => (
          <div key={l} className={card}>
            <p className="text-[13.5px] text-muted">{l}</p>
            <p className="mt-2 text-[40px] leading-none font-light tabular">{v}</p>
            <p className="mt-2 text-[13px] text-ink-2">{c}</p>
            <Square icon={ArrowUpRight01Icon} className="absolute top-4 right-4 size-11" />
          </div>
        ))}
      </div>
      <div data-focus="homes" className="panel mt-2 px-9 pt-6">
        <div className={cn("grid pb-3 text-[13px] text-muted", HOME_COLS)}>
          <span className="inline-flex items-center gap-1">
            Property <Icon icon={ArrowUpDownIcon} size={14} className="text-faint" />
          </span>
          <span>Type</span>
          <span>Occupancy</span>
          <span>Tenants</span>
          <span className="text-right">Rent roll</span>
        </div>
        {homes.map((h) => (
          <motion.div
            key={h.name}
            layout="position"
            initial={h === NEW_HOME ? { y: 14 } : false}
            animate={{ y: 0 }}
            transition={{ duration: 0.45, ease: [0.2, 0.8, 0.2, 1] }}
            className={cn("-mx-4 grid h-[80px] items-center rounded-tile px-4 text-[14.5px] transition-colors duration-700", HOME_COLS, h === NEW_HOME && s >= 20 && "bg-white")}
          >
            <span className="flex min-w-0 items-center gap-3.5">
              {h.photo ? (
                <Image src={`/hero/${h.photo}.jpg`} alt="" width={104} height={104} loading="eager" className="size-[52px] rounded-[4px] object-cover" />
              ) : (
                <span className="flex size-[52px] items-center justify-center rounded-[4px] bg-sunken text-muted">
                  <Icon icon={Building03Icon} size={22} />
                </span>
              )}
              <span className="min-w-0">
                <span className="block truncate text-[15.5px]">{h.name}</span>
                <span className="block text-[12.5px] text-ink-2">{h.place}</span>
              </span>
            </span>
            <span>
              <span className="block">{h.type}</span>
              <span className="block text-[12.5px] text-ink-2">{h.beds}</span>
            </span>
            <Tag tone={h.occ[2]} icon={h.occ[1]}>
              {h.occ[0]}
            </Tag>
            <span className="flex items-center gap-2.5">
              {h.people.length ? (
                <span className="flex -space-x-2">
                  {h.people.map((p, i) => (
                    <Avatar key={i} photo={p.photo} initials={p.initials} className="ring-2 ring-canvas" />
                  ))}
                </span>
              ) : null}
              <span className={h.people.length ? "" : "text-ink-2"}>{h.count}</span>
            </span>
            <span className={cn("text-right tabular", h.rent === "None" && "text-ink-2")}>{h.rent}</span>
          </motion.div>
        ))}
      </div>
    </Shell>
  );
}

function Section({ title, help, children, focus }: { title: string; help: string; children: ReactNode; focus?: string }) {
  return (
    <div data-focus={focus} className="panel grid grid-cols-[300px_minmax(0,1fr)] gap-8 px-6 py-7">
      <div>
        <p className="text-[18px]">{title}</p>
        <p className="mt-2 text-[14px] leading-relaxed text-ink-2">{help}</p>
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </div>
  );
}

const input = "flex h-12 items-center rounded-control bg-surface px-4 text-[15px]";

function AddProperty({ s }: { s: number }) {
  const found = s >= 9;
  const chosen = s >= 12;
  return (
    <Shell lit={2} title={["Add a property"]} sub="Most properties take under a minute. You can add photos, units and documents after." scroll={s >= 17 ? 420 : 0}>
      <div className="-mt-[52px] flex flex-col gap-2">
        <Section title="Address" help="Look it up by postcode for a verified address. Addresses typed by hand are marked unverified." focus="address">
          {chosen ? (
            <div className="flex items-center gap-3 rounded-tile bg-surface px-4 py-3.5">
              <Icon icon={Location01Icon} size={18} className="text-ink-2" />
              <span className="flex-1 text-[15px]">
                18 Elm Grove, Bristol BS7 8LZ
                <span className="mt-0.5 flex items-center gap-1.5 text-[12.5px] text-good">
                  <Icon icon={CheckmarkCircle02Icon} size={14} /> Verified address · England
                </span>
              </span>
              <span className="text-[13.5px] text-ink-2">Change</span>
            </div>
          ) : (
            <>
              <Field label="Postcode">
                <span className="flex gap-2">
                  <span data-target="postcode" className={cn(input, "flex-1", s >= 5 ? "text-ink ring-2 ring-accent" : "text-faint")}>
                    {s >= 6 ? <Typed text="BS7 8LZ" state={s === 6 ? "typing" : "full"} ms={800} /> : "BS7 8LZ"}
                  </span>
                  <span data-target="find" className={cn("flex h-12 w-[160px] items-center justify-center gap-2 rounded-control text-[15px] text-white transition-colors", s >= 6 ? "bg-ink" : "bg-faint", s === 8 && "bg-ink-hover")}>
                    <Icon icon={Search01Icon} size={17} /> Find address
                  </span>
                </span>
              </Field>
              {found ? (
                <motion.ul initial={{ y: 8 }} animate={{ y: 0 }} className="flex flex-col gap-1">
                  {ELM.map((a) => (
                    <li key={a} data-target={a === "18 Elm Grove" ? "pick" : undefined} className={cn("rounded-tile px-4 py-2.5 text-[14.5px] transition-colors", a === "18 Elm Grove" && s === 11 ? "bg-white" : "bg-surface")}>
                      {a}, Bristol BS7 8LZ
                    </li>
                  ))}
                </motion.ul>
              ) : (
                <p className="text-[13.5px] text-ink-2">Enter the address by hand</p>
              )}
            </>
          )}
        </Section>
        <Section title="The property" help="These drive the units we set up and which compliance reminders you see." focus="property">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Property type">
              <span data-target="type" className={cn(input, "justify-between", s === 14 && "ring-2 ring-accent")}>
                {s >= 14 ? "Terraced house" : "Choose a type"} <Icon icon={ArrowDown01Icon} size={16} />
              </span>
            </Field>
            <Field label="Furnishing" optional>
              <span className={cn(input, "justify-between")}>
                Not specified <Icon icon={ArrowDown01Icon} size={16} />
              </span>
            </Field>
            <Field label="Bedrooms">
              <span className={input}>2</span>
            </Field>
            <Field label="Bathrooms">
              <span className={input}>1</span>
            </Field>
          </div>
          <Field label="How is it let?">
            <span className="grid grid-cols-2 gap-2">
              <span className="rounded-tile bg-ink px-4 py-3 text-white">
                <span className="block text-[15px]">Whole property</span>
                <span className="block text-[12.5px] text-white/70">One tenancy for the whole home</span>
              </span>
              <span className="rounded-tile bg-surface px-4 py-3">
                <span className="block text-[15px]">By room or flat</span>
                <span className="block text-[12.5px] text-ink-2">HMOs, room lets and blocks</span>
              </span>
            </span>
          </Field>
          <Field label="Does it have a gas supply?">
            <span className="flex gap-2">
              <span data-target="gas" className={cn("flex h-11 items-center rounded-control px-4 text-[14.5px] transition-colors", s >= 16 ? "bg-ink text-white" : "bg-surface")}>
                Yes, it has gas
              </span>
              <span className="flex h-11 items-center rounded-control bg-surface px-4 text-[14.5px]">No gas</span>
            </span>
          </Field>
        </Section>
        <Section title="Energy and licensing" help="Optional. Expiry dates turn into reminders on your compliance tracker.">
          <div className="grid grid-cols-2 gap-4">
            <Field label="EPC rating" optional>
              <span className={cn(input, "justify-between")}>
                Not known <Icon icon={ArrowDown01Icon} size={16} />
              </span>
            </Field>
            <Field label="EPC expiry" optional>
              <span className={cn(input, "gap-2.5 text-faint")}>
                <Icon icon={Calendar03Icon} size={17} /> Choose a date
              </span>
            </Field>
          </div>
        </Section>
        <div className="flex justify-end pt-2">
          <span data-target="submit" className={cn("flex h-[52px] items-center rounded-control bg-ink px-7 text-[16px] text-white", s === 19 && "bg-ink-hover")}>
            Add property
          </span>
        </div>
      </div>
    </Shell>
  );
}

export function PropertiesTour({ s }: { s: number }) {
  if (s < 3) return <PropertyList s={s} added={false} />;
  if (s < 20) return <AddProperty s={s} />;
  return <PropertyList s={s} added />;
}

/* ---------- Team: a manager invited to two properties ---------- */

const MEMBERS = [
  { name: "Sam Whitfield", you: true, email: "demo@direct-homes.co.uk", photo: "sam", role: "Owner", access: "All properties", seen: "Active 2 minutes ago" },
  { name: "Ellie Marsh", email: "ellie.marsh@example.com", photo: "ellie", role: "Admin", access: "All properties", seen: "Active 4 days ago" },
  { name: "Tariq Hussain", email: "tariq.hussain@example.com", photo: "tariq", role: "Manager", access: "3 properties", seen: "Active 4 days ago" },
];
const INVITEE = "priya.shah@example.com";

export function TeamTour({ s }: { s: number }) {
  const sent = s >= 13;
  return (
    <Shell
      lit={9}
      title={["Team", "4 members"]}
      sub="Who can see and manage your properties, and what each person can do."
      actions={
        <Ink icon={UserAdd01Icon} target="invite" className={cn(s === 2 && "bg-ink-hover")}>
          Invite staff
        </Ink>
      }
    >
      <div className="grid grid-cols-[minmax(0,1fr)_428px] gap-2">
        <div className="flex flex-col gap-2">
          <div className="panel px-6 pt-6 pb-4">
            <p className="text-[18px]">Members</p>
            <p className="mt-1 text-[13.5px] text-muted">Two-step verification and last activity are visible to the Owner and Admins only.</p>
            <ul className="mt-4">
              {MEMBERS.map((m) => (
                <li key={m.name} className="grid h-[70px] grid-cols-[minmax(0,1fr)_110px_160px_170px_88px] items-center gap-2 text-[14.5px]">
                  <span className="flex min-w-0 items-center gap-3">
                    <Avatar photo={m.photo} size="size-10" />
                    <span className="min-w-0">
                      <span className="block">
                        {m.name} {m.you ? <span className="text-[12.5px] text-muted">You</span> : null}
                      </span>
                      <span className="block truncate text-[12.5px] text-ink-2">{m.email}</span>
                    </span>
                  </span>
                  <span>{m.role}</span>
                  <span>{m.access}</span>
                  <span>
                    {/* Professional requires two-step for the Owner and Admins, and asks it of staff by default. */}
                    <Tag tone="good" icon={CheckmarkCircle02Icon} className="text-[13px]">
                      Two-step on
                    </Tag>
                    <span className="mt-0.5 block text-[12.5px] text-ink-2">{m.seen}</span>
                  </span>
                  <span className="flex justify-end gap-1.5">{m.you ? null : <><Square icon={PencilEdit02Icon} className="size-9" /><Square icon={UserRemove01Icon} className="size-9" /></>}</span>
                </li>
              ))}
            </ul>
          </div>
          <div data-focus="invites" className="panel px-6 pt-6 pb-4">
            <p className="text-[18px]">Pending invitations</p>
            <p className="mt-1 text-[13.5px] text-muted">Each pending invitation holds a seat until it is accepted, revoked or expires.</p>
            <ul className="mt-4">
              {[...(sent ? [[INVITEE, "Sent 15 Oct 2026 by Sam Whitfield", "Manager", "2 properties", "new"]] : []), ["joe.barker@example.com", "Sent 6 Oct 2026 by Sam Whitfield", "Manager", "2 properties", "old"]].map(([email, when, role, access, k]) => (
                <motion.li key={email} layout="position" initial={k === "new" ? { y: 14 } : false} animate={{ y: 0 }} className={cn("-mx-3 grid h-[66px] grid-cols-[minmax(0,1fr)_110px_140px_140px_150px] items-center gap-2 rounded-tile px-3 text-[14.5px] transition-colors duration-700", k === "new" && s >= 13 && "bg-white")}>
                  <span>
                    <span className="block">{email}</span>
                    <span className="block text-[12.5px] text-ink-2">{when}</span>
                  </span>
                  <span>{role}</span>
                  <span>{access}</span>
                  {k === "new" ? (
                    <Tag tone="info" icon={Mail01Icon}>
                      Sent
                    </Tag>
                  ) : (
                    <Tag tone="warn" icon={Clock01Icon}>
                      Expired
                    </Tag>
                  )}
                  <span className="flex justify-end gap-1.5">{k === "new" ? <span className="text-[13px] text-ink-2">Expires in 7 days</span> : <Square icon={Delete02Icon} className="size-9" />}</span>
                </motion.li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div data-focus="seats" className="panel p-6">
            <p className="text-[18px]">Seats</p>
            <p className="mt-1 text-[13.5px] text-muted">The Owner counts as one. Pending invitations count too.</p>
            <div className="mt-4 rounded-tile bg-surface p-5">
              <p className="text-[14px] text-ink-2 tabular">
                <span className="mr-1.5 text-[30px] font-light text-ink">{sent ? 5 : 4}</span> of 25 used
              </p>
              <div className="hatch relative mt-3 h-3 overflow-hidden rounded-[2px]">
                <div className="absolute inset-y-0 left-0 rounded-[2px] bg-accent-fill transition-[width] duration-700" style={{ width: `${((sent ? 5 : 4) / 25) * 100}%` }} />
              </div>
              <p className="mt-3 text-[13.5px] text-ink-2">Extra seats are £50 each, one-off.</p>
            </div>
          </div>
          <div className="panel p-6">
            <p className="text-[18px]">What each role can do</p>
            <ul className="mt-4 flex flex-col gap-1.5">
              {[
                ["Owner", "Everything, including billing, payouts and the workspace itself"],
                ["Admin", "All properties and staff, but not payouts or the workspace itself"],
                ["Manager", "Day-to-day work on the properties they are assigned"],
                ["Viewer", "Read-only access, for example an accountant"],
              ].map(([r, d]) => (
                <li key={r} className="rounded-tile bg-surface px-4 py-3 text-[14.5px]">
                  {r}
                  <span className="block text-[13px] text-ink-2">{d}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {s >= 3 && s <= 12 ? (
          <Dialog key="invite" title="Invite a staff member" help="They get an email link that works for 7 days, only for that address. This uses 1 of your 21 free seats until they accept or you revoke it.">
            <div className="flex flex-col gap-4">
              <Field label="Email address">
                <span data-target="email" className={cn(input, s >= 5 ? "text-ink" : "text-faint", (s === 5 || s === 6) && "ring-2 ring-accent")}>
                  {s >= 6 ? <Typed text={INVITEE} state={s === 6 ? "typing" : "full"} ms={1300} /> : ""}
                </span>
              </Field>
              <Field label="Role">
                <span data-target="role" className={cn(input, "justify-between", s === 8 && "ring-2 ring-accent")}>
                  {s >= 8 ? "Manager" : "Admin"} <Icon icon={ArrowDown01Icon} size={16} />
                </span>
                <span className="px-1 text-[12.5px] text-ink-2">{s >= 8 ? "Day-to-day work on the properties they are assigned" : "All properties and staff, but not payouts or the workspace itself"}</span>
              </Field>
              <Field label="Access">
                <span className="grid grid-cols-2 gap-2">
                  {["All properties", "Selected properties"].map((o, i) => (
                    <span key={o} data-target={i === 1 ? "selected" : undefined} className={cn("flex h-11 items-center rounded-control px-4 text-[14.5px] transition-colors", (i === 1) === s >= 10 ? "bg-ink text-white" : "bg-surface")}>
                      {o}
                    </span>
                  ))}
                </span>
              </Field>
              {s >= 10 ? (
                <motion.ul initial={{ y: 8 }} animate={{ y: 0 }} className="grid grid-cols-2 gap-1.5">
                  {[
                    ["9 Widcombe Parade", true],
                    ["33 Pontcanna Street", true],
                    ["48 Auckland Road", false],
                    ["Cotham Vale", false],
                  ].map(([n, on]) => (
                    <li key={n as string} className="flex items-center gap-2.5 rounded-tile bg-surface px-3.5 py-2.5 text-[14px]">
                      <span className={cn("flex size-5 items-center justify-center rounded-[4px]", on ? "bg-ink text-white" : "bg-sunken")}>{on ? <Icon icon={Tick02Icon} size={13} /> : null}</span>
                      {n}
                    </li>
                  ))}
                </motion.ul>
              ) : null}
              <span data-target="send-invite" className={cn("ml-auto flex h-11 items-center rounded-control bg-ink px-5 text-[15px] text-white", s === 12 && "bg-ink-hover")}>
                Send invitation
              </span>
            </div>
          </Dialog>
        ) : null}
      </AnimatePresence>
    </Shell>
  );
}

/* ---------- Tenants: Nina reports a repair from her own app ---------- */

const CATEGORIES: [string, IconSvgElement][] = [
  ["Plumbing", DropletIcon],
  ["Heating and hot water", Fire02Icon],
  ["Electrical", FlashIcon],
  ["Damp and mould", HumidityIcon],
  ["Windows and doors", Door01Icon],
  ["Appliances", FridgeIcon],
];
const SAFETY = [
  ["I can smell gas", "A rotten-egg smell near the boiler, cooker or meter."],
  ["Someone is in immediate danger", "A fire, someone hurt, or a risk to life right now."],
  ["There is an electrical danger", "Sparks, a burning smell, exposed wires, or water near electrics."],
  ["There is no heating or hot water at all", "Not just one radiator: the whole system is off."],
];
const STEPS = ["What is wrong", "Safety check", "Details", "Access and photos"];
const R_TITLE = "Bedroom window won't close";
const R_BODY = "The catch snapped this morning, so it won't lock and there's a draught coming in.";

function TenantRepairs({ s, sent }: { s: number; sent: boolean }) {
  const rows: [string, IconSvgElement, ReactNode, string, string?][] = [
    ...(sent ? [[R_TITLE, Door01Icon, <Tag key="r" tone="plain" icon={Clock01Icon} className="text-[13.5px]">Sent to your landlord</Tag>, "Windows and doors · Reported just now", "new"] as [string, IconSvgElement, ReactNode, string, string]] : []),
    ["Bathroom extractor fan buzzing", FlashIcon, <Tag key="s" tone="info" icon={CheckmarkCircle02Icon} className="text-[13.5px]">Seen by your landlord</Tag>, "Electrical · Updated 8 days ago"],
  ];
  return (
    <Shell
      tenant
      lit={2}
      title={["Repairs"]}
      sub={sent ? "2 open repairs, 1 waiting for you at Flat 2." : "1 open repair, 1 waiting for you at Flat 2."}
      actions={
        <Ink icon={Add01Icon} target="report" className={cn(s === 2 && "bg-ink-hover")}>
          Report a repair
        </Ink>
      }
    >
      <div className="flex flex-col gap-2">
        <div className="panel p-6">
          <p className="text-[18px]">Waiting for you</p>
          <p className="mt-1 text-[13.5px] text-ink-2">Confirm a visit or tell your landlord whether a repair is fixed.</p>
          <div className="mt-4 flex items-center gap-4 rounded-tile bg-surface px-4 py-4">
            <span className="flex size-14 items-center justify-center rounded-[6px] bg-sunken text-ink-2">
              <Icon icon={FridgeIcon} size={22} />
            </span>
            <span className="flex-1 text-[15px]">
              Oven element not heating
              <span className="mt-1 block">
                <Tag tone="good" icon={CheckmarkCircle02Icon} className="text-[13.5px]">
                  Fixed, please confirm
                </Tag>
              </span>
              <span className="mt-1 block text-[12.5px] text-ink-2">Appliances · Is it fixed? Let your landlord know.</span>
            </span>
            <Icon icon={ArrowRight01Icon} size={18} className="text-ink-2" />
          </div>
        </div>
        <div data-focus="open" className="panel p-6">
          <p className="text-[18px]">Open</p>
          <div className="mt-4 flex flex-col gap-1.5">
            {rows.map(([t, icon, status, sub, k]) => (
              <motion.div key={t} layout="position" initial={k ? { y: 14 } : false} animate={{ y: 0 }} className={cn("flex items-center gap-4 rounded-tile px-4 py-4 transition-colors duration-700", k && s >= 16 ? "bg-white" : "bg-surface")}>
                <span className="flex size-14 items-center justify-center rounded-[6px] bg-sunken text-ink-2">
                  <Icon icon={icon} size={22} />
                </span>
                <span className="flex-1 text-[15px]">
                  {t}
                  <span className="mt-1 block">{status}</span>
                  <span className="mt-1 block text-[12.5px] text-ink-2">{sub}</span>
                </span>
                <Icon icon={ArrowRight01Icon} size={18} className="text-ink-2" />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}

function ReportWizard({ s }: { s: number }) {
  const step = s >= 13 ? 3 : s >= 9 ? 2 : s >= 6 ? 1 : 0;
  return (
    <Shell tenant lit={2} title={["Report a repair"]} sub="Flat 2, 14 Royal York Crescent. Your landlord sees it straight away.">
      <div data-focus="wizard" className="mx-auto -mt-[52px] flex w-[672px] flex-col gap-5">
        <div className="flex items-center gap-3">
          {step > 0 ? (
            <span className="flex h-9 items-center gap-1.5 rounded-control bg-surface px-3 text-[13.5px]">
              <Icon icon={ArrowLeft01Icon} size={15} /> Back
            </span>
          ) : null}
          <div className="flex-1">
            <p className="text-[13px] text-muted">
              Step {step + 1} of 4: <span className="text-ink-2">{STEPS[step]}</span>
            </p>
            <div className="hatch relative mt-2 h-2.5 overflow-hidden rounded-[2px]">
              <div className="absolute inset-y-0 left-0 rounded-[2px] bg-accent-fill transition-[width] duration-500" style={{ width: `${((step + 1) / 4) * 100}%` }} />
            </div>
          </div>
        </div>
        {step === 0 ? (
          <div>
            <p className="mb-3 px-1 text-[20px]">What kind of problem is it?</p>
            <ul className="grid grid-cols-3 gap-2.5">
              {CATEGORIES.map(([c, icon]) => {
                const on = c === "Windows and doors" && s >= 5;
                return (
                  <li key={c} data-target={c === "Windows and doors" ? "windows" : undefined} className={cn("flex min-h-[92px] flex-col justify-between gap-3 rounded-tile p-4 transition-colors", on ? "bg-ink text-white" : "bg-surface")}>
                    <Icon icon={icon} size={24} className={on ? "text-white" : "text-ink-2"} />
                    <span className="text-[14.5px] leading-tight">{c}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : step === 1 ? (
          <div className="flex flex-col gap-4">
            <div className="px-1">
              <p className="text-[20px]">Is anyone in danger?</p>
              <p className="mt-1 text-[14px] text-muted">Tick anything that applies. Your report still goes to your landlord either way.</p>
            </div>
            <div className="panel flex flex-col gap-1 p-4">
              {SAFETY.map(([l, d]) => (
                <div key={l} className="flex gap-3 px-2 py-2.5">
                  <span className="mt-0.5 size-5 shrink-0 rounded-[4px] bg-surface ring-1 ring-faint/60" />
                  <span>
                    <span className="block text-[15px]">{l}</span>
                    <span className="block text-[13px] text-muted">{d}</span>
                  </span>
                </div>
              ))}
            </div>
            <span data-target="continue-1" className={cn("flex h-[52px] items-center self-end rounded-control bg-ink px-7 text-[16px] text-white", s === 8 && "bg-ink-hover")}>
              Continue
            </span>
          </div>
        ) : step === 2 ? (
          <div className="flex flex-col gap-4">
            <p className="px-1 text-[20px]">Tell your landlord what is wrong</p>
            <Field label="Short title">
              <span className={cn(input, "ring-2", s === 9 ? "ring-accent" : "ring-transparent")}>
                <Typed text={R_TITLE} state={s === 9 ? "typing" : "full"} ms={1300} />
              </span>
            </Field>
            <Field label="What is happening?">
              <span className={cn("block min-h-[92px] rounded-control bg-surface px-4 py-3 text-[15px] leading-relaxed ring-2", s === 10 ? "ring-accent" : "ring-transparent")}>
                {s >= 10 ? <Typed text={R_BODY} state={s === 10 ? "typing" : "full"} ms={2000} /> : null}
              </span>
            </Field>
            <Field label="Where in the home" optional>
              <span className={input}>Back bedroom</span>
            </Field>
            <span data-target="continue-2" className={cn("flex h-[52px] items-center self-end rounded-control bg-ink px-7 text-[16px] text-white", s === 12 && "bg-ink-hover")}>
              Continue
            </span>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <p className="px-1 text-[20px]">Access and photos</p>
            <Field label="Can your landlord or a contractor let themselves in with a key if you are out?">
              <span className="flex gap-2">
                <span className="flex h-11 items-center rounded-control bg-ink px-4 text-[14.5px] text-white">Yes</span>
                <span className="flex h-11 items-center rounded-control bg-surface px-4 text-[14.5px]">No, someone must be in</span>
              </span>
            </Field>
            <Field label="Best times to visit" optional>
              <span className={input}>Weekday mornings</span>
            </Field>
            <div className="flex flex-col gap-1.5">
              <p className="px-1 text-[13px] text-ink-2">Photos or a short video</p>
              <span className="flex gap-2">
                <Image src="/hero/bristol-caledonia.jpg" alt="" width={160} height={160} loading="eager" className="size-20 rounded-[6px] object-cover" />
                <span className="flex size-20 flex-col items-center justify-center gap-1 rounded-[6px] bg-surface text-[12px] text-ink-2">
                  <Icon icon={Image01Icon} size={20} /> Add more
                </span>
              </span>
            </div>
            <span data-target="send-report" className={cn("flex h-[52px] items-center self-end rounded-control bg-ink px-7 text-[16px] text-white", s === 15 && "bg-ink-hover")}>
              Send report
            </span>
          </div>
        )}
      </div>
    </Shell>
  );
}

export function TenantTour({ s }: { s: number }) {
  if (s < 3) return <TenantRepairs s={s} sent={false} />;
  if (s < 16) return <ReportWizard s={s} />;
  return <TenantRepairs s={s} sent />;
}

