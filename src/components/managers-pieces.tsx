"use client";

import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, type ReactNode } from "react";
import {
  Add01Icon,
  ArrowUpDownIcon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  MinusSignCircleIcon,
  UserIcon,
  ViewIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Choice } from "./choice";
import { Icon } from "./icon";
import { Column, SectionHead } from "./ui";
import { cn } from "@/lib/utils";

/*
 * The For property managers page's own pieces, drawn from the web app:
 * - Roles: the four roles and what each may do, from the permission matrix the app enforces
 *   (webapp domain/permissions.ts, spec section 8), with the role descriptions from the Team page. Pick a role and
 *   the Properties page redraws as that person sees it: a Manager sees only the homes they are assigned, and only the
 *   Owner and Admins get Add property.
 * - Staff controls: the Team page's Seats panel, the workspace setting that requires two-step verification for all
 *   staff, and a property's Activity tab, which lists every change from the audit trail.
 */

/* ---------- Roles ---------- */

type Role = "owner" | "admin" | "manager" | "viewer";
const ROLE_OPTIONS = [
  { value: "owner", label: "Owner" },
  { value: "admin", label: "Admin" },
  { value: "manager", label: "Manager" },
  { value: "viewer", label: "Viewer" },
] as const;

const PEOPLE: Record<Role, { name: string; photo?: string; access: string; does: string }> = {
  owner: { name: "Sam Whitfield", photo: "sam", access: "All properties", does: "Everything, including billing, payouts and the workspace itself" },
  admin: { name: "Ellie Marsh", photo: "ellie", access: "All properties", does: "All properties and staff, but not payouts or the workspace itself" },
  manager: { name: "Tariq Hussain", photo: "tariq", access: "3 properties", does: "Day-to-day work on the properties they are assigned" },
  viewer: { name: "Your accountant", access: "All properties", does: "Read-only access, for example an accountant" },
};

type Grant = "yes" | "theirs" | "read" | "view" | "no" | "managers";
const GRANT: Record<Grant, { word: string; icon: IconSvgElement; tone: string }> = {
  yes: { word: "Yes", icon: CheckmarkCircle02Icon, tone: "text-good" },
  theirs: { word: "Their homes", icon: CheckmarkCircle02Icon, tone: "text-good" },
  managers: { word: "Managers and Viewers", icon: CheckmarkCircle02Icon, tone: "text-good" },
  read: { word: "Read only", icon: ViewIcon, tone: "text-ink-2" },
  view: { word: "View only", icon: ViewIcon, tone: "text-ink-2" },
  no: { word: "No", icon: MinusSignCircleIcon, tone: "text-faint" },
};

/** The permission matrix, a row per job, in the app's order. Grants are Owner, Admin, Manager, Viewer. */
const MATRIX: { job: string; grants: [Grant, Grant, Grant, Grant] }[] = [
  { job: "See properties, rent and statements", grants: ["yes", "yes", "theirs", "theirs"] },
  { job: "Add or archive a property", grants: ["yes", "yes", "no", "no"] },
  { job: "Tenancies, rent terms and recorded payments", grants: ["yes", "yes", "theirs", "no"] },
  { job: "Refund an online payment", grants: ["yes", "yes", "no", "no"] },
  { job: "Repairs and documents", grants: ["yes", "yes", "theirs", "read"] },
  { job: "Message tenants", grants: ["yes", "yes", "theirs", "no"] },
  { job: "Invite staff", grants: ["yes", "managers", "no", "no"] },
  { job: "Plan, billing and seats", grants: ["yes", "view", "no", "no"] },
  { job: "Payout account and the workspace", grants: ["yes", "no", "no", "no"] },
  { job: "Audit log", grants: ["yes", "yes", "no", "no"] },
];
const COL: Record<Role, number> = { owner: 0, admin: 1, manager: 2, viewer: 3 };

type Home = { name: string; place: string; photo: string; occ: string; ending?: boolean; tenants: string; tariq?: boolean };
const HOMES: Home[] = [
  { name: "Flat 2, 14 Royal York Crescent", place: "Bristol", photo: "bristol-caledonia", occ: "Let", tenants: "Nina Kowalski" },
  { name: "8 Cotham Vale", place: "Bristol", photo: "bristol-eldon", occ: "Let", tenants: "Grace Adebayo" },
  { name: "26 Headingley Mount", place: "Leeds LS6 3EL", photo: "leeds-semi", occ: "Let", tenants: "Freya and 3 others", tariq: true },
  { name: "15 St Leonard's Road", place: "Exeter EX2 4LA", photo: "exeter-semi", occ: "Ending 3 Nov 2026", ending: true, tenants: "Peter Lowe", tariq: true },
  { name: "33 Pontcanna Street", place: "Cardiff CF11 9HQ", photo: "cardiff-zinc", occ: "Let", tenants: "Rhys Morgan", tariq: true },
  { name: "48 Auckland Road", place: "London SE19 2DJ", photo: "norwood", occ: "Let", tenants: "Marcus and Bea Holloway" },
];

function Who({ role }: { role: Role }) {
  const p = PEOPLE[role];
  return (
    <span className="flex items-center gap-3">
      {p.photo ? (
        <Image src={`/hero/${p.photo}.jpg`} alt="" width={88} height={88} className="size-11 shrink-0 rounded-control object-cover" />
      ) : (
        <span className="flex size-11 shrink-0 items-center justify-center rounded-control bg-sunken text-ink-2">
          <Icon icon={UserIcon} size={20} />
        </span>
      )}
      <span className="min-w-0">
        <span className="block truncate text-[15px] leading-snug text-ink">{p.name}</span>
        <span className="block text-[13px] leading-snug text-muted">
          {ROLE_OPTIONS[COL[role]].label} · {p.access}
        </span>
      </span>
    </span>
  );
}

export function SectionRoles() {
  const [role, setRole] = useState<Role>("manager");
  const still = useReducedMotion();
  const homes = role === "manager" ? HOMES.filter((h) => h.tariq) : HOMES;
  const canAdd = role === "owner" || role === "admin";
  const label = ROLE_OPTIONS[COL[role]].label;

  return (
    <section id="roles" aria-labelledby="roles-title" className="pt-24 sm:pt-32">
      <Column>
        <SectionHead
          id="roles-title"
          title={
            <>
              Everyone sees the homes
              <br />
              their job needs.
            </>
          }
          text="Invite staff with a role and the properties they look after. The app checks the role on every action, so a Manager only ever works on their own homes and a Viewer can look but not change."
        />

        <div className="brand-wash mt-10 rounded-panel p-2 sm:p-6 lg:mt-14 lg:p-10">
          <div className="flex flex-col gap-4 px-2 pt-3 pb-5 sm:flex-row sm:items-center sm:gap-6 sm:px-0 sm:pt-0 sm:pb-6">
            <Choice label="Signed in as" options={ROLE_OPTIONS} value={role} onChange={setRole} className="w-full sm:w-auto" />
            <p className="text-[15px] leading-snug text-ink-2">{PEOPLE[role].does}.</p>
          </div>

          <div aria-live="polite" className="grid gap-2 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            {/* The Properties page, as this person sees it. */}
            <div className="flex flex-col rounded-[10px] bg-canvas p-2 text-ink shadow-[0_1px_2px_rgb(20_20_20/0.1),0_24px_40px_-28px_rgb(30_28_40/0.5)]">
              <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-4 px-3 pt-3 pb-4 sm:px-4 sm:pt-4">
                <div>
                  <p className="text-[24px] leading-tight sm:text-[28px]">
                    Properties<span className="mx-2.5 text-faint">&mdash;</span>
                    <span className="tabular">{homes.length} active</span>
                  </p>
                  <p className="mt-1 text-[13.5px] text-muted">Every home you let, who lives there and on what rent.</p>
                </div>
                <div className="flex items-center gap-2">
                  {canAdd ? (
                    <span aria-hidden className="inline-flex h-10 items-center gap-2 rounded-control bg-ink px-4 text-[14px] text-white">
                      <Icon icon={Add01Icon} size={17} />
                      Add property
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="panel flex-1 px-3 pt-4 pb-2 sm:px-5">
                <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-4 px-1 pb-2 text-[12.5px] text-muted md:grid-cols-[minmax(0,1fr)_160px_180px]">
                  <span className="inline-flex items-center gap-1">
                    Property <Icon icon={ArrowUpDownIcon} size={13} className="text-faint" />
                  </span>
                  <span>Occupancy</span>
                  <span className="hidden md:block">Tenants</span>
                </div>
                <ul className="relative">
                  <AnimatePresence initial={false} mode="popLayout">
                    {homes.map((h) => (
                      <motion.li
                        key={h.name}
                        layout={still ? false : "position"}
                        exit={still ? undefined : { opacity: 0, transition: { duration: 0.15 } }}
                        transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                        className="grid min-h-[68px] grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-1 py-2 text-[14px] md:grid-cols-[minmax(0,1fr)_160px_180px]"
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <Image src={`/hero/${h.photo}.jpg`} alt="" width={88} height={88} className="size-11 shrink-0 rounded-[4px] object-cover" />
                          <span className="min-w-0">
                            <span className="block truncate text-[14.5px]">{h.name}</span>
                            <span className="block truncate text-[12.5px] text-ink-2">{h.place}</span>
                          </span>
                        </span>
                        <span className={cn("inline-flex items-center gap-1.5 text-[13.5px] whitespace-nowrap", h.ending ? "text-warn" : "text-good")}>
                          <Icon icon={h.ending ? Clock01Icon : CheckmarkCircle02Icon} size={16} />
                          <span className="max-sm:hidden">{h.occ}</span>
                          <span className="sm:hidden">{h.ending ? "Ending" : h.occ}</span>
                        </span>
                        <span className="hidden truncate text-ink-2 md:block">{h.tenants}</span>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
              </div>
              <div className="px-3 pt-3 pb-1 sm:px-4">
                <Who role={role} />
              </div>
            </div>

            {/* What this role may do, from the matrix the app checks on every action. */}
            <div className="rounded-[10px] bg-white/55 p-5 sm:p-6">
              <p className="text-[18px] leading-tight text-ink">What a{role === "owner" || role === "admin" ? "n" : ""} {label} can do</p>
              <ul className="mt-4 flex flex-col">
                {MATRIX.map((m) => {
                  const g = GRANT[m.grants[COL[role]]];
                  return (
                    <li key={m.job} className="grid grid-cols-[minmax(0,1fr)_7.5rem] items-baseline gap-4 border-t border-ink/[0.07] py-2.5 first:border-t-0 sm:grid-cols-[minmax(0,1fr)_10.5rem]">
                      <span className="text-[14px] leading-snug text-ink-2">{m.job}</span>
                      <span className={cn("inline-flex items-center gap-1.5 text-[13.5px] transition-colors duration-300", g.tone)}>
                        <Icon icon={g.icon} size={15} className="relative top-[2px]" />
                        {g.word}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>
      </Column>
    </section>
  );
}

/* ---------- Staff controls ---------- */

function Figure({ title, text, children }: { title: string; text: string; children: ReactNode }) {
  return (
    <figure className="flex flex-col">
      <div className="brand-wash flex flex-1 items-center rounded-panel p-4 sm:p-6">
        <div aria-hidden inert className="pointer-events-none w-full rounded-[10px] bg-canvas p-2 text-ink select-none shadow-[0_1px_2px_rgb(20_20_20/0.1),0_24px_40px_-28px_rgb(30_28_40/0.5)]">
          {children}
        </div>
      </div>
      <figcaption className="px-1 pt-4 lg:pt-5">
        <p className="text-[17px] text-ink">{title}</p>
        <p className="mt-1.5 max-w-[26rem] text-[15px] leading-[1.5] text-ink-2">{text}</p>
      </figcaption>
    </figure>
  );
}

function Panel({ title, text, children }: { title: string; text?: string; children: ReactNode }) {
  return (
    <div className="panel p-5">
      <p className="text-[17px] leading-tight">{title}</p>
      {text ? <p className="mt-1 text-[13px] leading-snug text-muted">{text}</p> : null}
      <div className="mt-4">{children}</div>
    </div>
  );
}

const ACTIVITY = [
  ["Online collection switched on", "Ellie Marsh", "14 Oct 2026, 09:12"],
  ["Deposit and checks updated", "Tariq Hussain", "2 Oct 2026, 16:40"],
  ["Invitation accepted", "Freya Lindqvist", "30 Sept 2026, 19:05"],
  ["Invitation sent", "Tariq Hussain", "29 Sept 2026, 11:20"],
  ["Tenancy created", "Tariq Hussain", "29 Sept 2026, 11:02"],
] as const;

export function SectionStaff() {
  return (
    <section aria-labelledby="staff-title" className="pt-24 sm:pt-32">
      <Column>
        <SectionHead
          id="staff-title"
          title={
            <>
              Room for the team,
              <br />
              and a record of it.
            </>
          }
          text="Professional comes with 25 seats, two-step sign-in for staff, an audit trail of every change and priority support, with a first reply within 4 working hours."
        />
        <div className="mt-10 grid gap-x-2 gap-y-10 lg:mt-14 lg:grid-cols-3">
          <Figure title="25 seats, the Owner included" text="A pending invitation holds a seat until it’s accepted. Need more? Extra seats are £50 each, paid once.">
            <Panel title="Seats" text="The Owner counts as one. Pending invitations count too.">
              <div className="rounded-tile bg-surface p-5">
                <p className="text-[14px] text-ink-2 tabular">
                  <span className="mr-1.5 text-[30px] font-light text-ink">4</span>of 25 used
                </p>
                <div className="hatch relative mt-3 h-3 overflow-hidden rounded-[2px]">
                  <div className="absolute inset-y-0 left-0 rounded-[2px] bg-accent-fill" style={{ width: `${(4 / 25) * 100}%` }} />
                </div>
                <p className="mt-3 text-[13px] text-ink-2">1 pending invitation. Extra seats are £50 each, one-off.</p>
              </div>
              <span className="mt-4 inline-flex h-9 items-center rounded-control bg-surface px-3.5 text-[13.5px]">Buy extra seats</span>
            </Panel>
          </Figure>

          <Figure title="Two-step sign-in for staff" text="Owners and Admins always need it, and requiring it for every member of staff is on from the start.">
            <Panel title="Security and payments">
              <div className="flex flex-col gap-2.5">
                {(
                  [
                    ["Require two-step verification for all staff", "Owners and Admins always need it. With this on, Managers and Viewers must set it up before they can open the workspace.", true],
                    ["Let tenants pay by card", "Off by default. Card payments cost you more than Pay by Bank or Direct Debit, and tenants never pay a surcharge.", false],
                  ] as const
                ).map(([t, d, on]) => (
                  <div key={t} className="flex items-center justify-between gap-4 rounded-tile bg-surface px-4 py-3.5">
                    <div className="min-w-0">
                      <p className="text-[14.5px] leading-snug">{t}</p>
                      <p className="mt-0.5 text-[12.5px] leading-snug text-muted">{d}</p>
                    </div>
                    <span className={cn("relative h-6 w-10 shrink-0 rounded-full", on ? "bg-ink" : "bg-sunken")}>
                      <span className={cn("absolute top-1 size-4 rounded-full bg-white", on ? "right-1" : "left-1")} />
                    </span>
                  </div>
                ))}
              </div>
            </Panel>
          </Figure>

          <Figure title="Who did what, kept" text="Every change is recorded with who made it and when, in an audit trail that can’t be edited after the fact.">
            <Panel title="Activity" text="Every change to this property and its current tenancy, from the audit trail.">
              <ol className="flex flex-col gap-1">
                {ACTIVITY.map(([what, who, at]) => (
                  <li key={what} className="flex flex-col gap-0.5 rounded-tile bg-surface px-3.5 py-2.5">
                    <span className="text-[13.5px] leading-snug">
                      {what}
                      <span className="text-muted"> by {who}</span>
                    </span>
                    <span className="text-[12px] text-muted tabular">{at}</span>
                  </li>
                ))}
              </ol>
            </Panel>
          </Figure>
        </div>
      </Column>
    </section>
  );
}
