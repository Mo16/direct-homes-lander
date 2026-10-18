"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUpRight01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  DashboardSquare01Icon,
  Download01Icon,
  File02Icon,
  FileUploadIcon,
  Message01Icon,
  Notification03Icon,
  Pdf01Icon,
  Tick02Icon,
  UndoIcon,
  ViewIcon,
  Wallet01Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Choice } from "./choice";
import { Icon } from "./icon";
import { LogoMark } from "./logo";
import { Column, SectionHead } from "./ui";
import { cn } from "@/lib/utils";

/*
 * Two pieces of the Tenant portal page, drawn from the web app's tenant screens and its own words:
 * - Nina's phone: her Home, a repair waiting for her to confirm the fix, and her Documents, at phone size as the app
 *   lays them out on a 390px screen (webapp app/tenant/page.tsx, repairs/[id], documents), with the bottom tab bar.
 * - The invitation: the email the app sends a tenant (features/invitations/server/issue.ts), on the day and as the
 *   day 3 and day 7 reminders, beside the page its button opens (app/invite/[token]).
 */

function Tag({ tone, icon, children, className }: { tone: string; icon: IconSvgElement; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[13.5px]", tone, className)}>
      <Icon icon={icon} size={16} />
      {children}
    </span>
  );
}

const sheet = "rounded-[10px] bg-canvas text-ink shadow-[0_1px_2px_rgb(20_20_20/0.1),0_24px_40px_-28px_rgb(30_28_40/0.5)]";
const btn = "flex h-12 items-center justify-center gap-2 rounded-control px-5 text-[15px]";

/* ---------- Nina's phone ---------- */

type Screen = "home" | "repair" | "documents";

const SCREENS = [
  { value: "home", label: "Home" },
  { value: "repair", label: "A repair" },
  { value: "documents", label: "Documents" },
] as const;

const ABOUT: Record<Screen, { title: string; text: string }> = {
  home: { title: "What needs them, first", text: "The next payment and their balance, open repairs, new messages and anything you've asked them to read." },
  repair: { title: "They close the loop", text: "When you mark a repair fixed, they confirm it or tell you it isn't, with every step on one timeline." },
  documents: { title: "Read, and on record", text: "Ask them to confirm a gas safety record or EPC and their answer is kept with the date. They can add their own, like contents insurance." },
};

const TABS: [string, IconSvgElement][] = [
  ["Home", DashboardSquare01Icon],
  ["Rent", Wallet01Icon],
  ["Repairs", Wrench01Icon],
  ["Documents", File02Icon],
  ["Messages", Message01Icon],
];
const LIT: Record<Screen, number> = { home: 0, repair: 2, documents: 3 };

function PhoneHeader() {
  return (
    <div className="flex items-center justify-between">
      <LogoMark className="size-10 text-ink" />
      <div className="flex items-center gap-2">
        <span className="flex -space-x-2.5">
          <Image src="/hero/sam.jpg" alt="" width={80} height={80} className="size-10 rounded-full object-cover ring-2 ring-canvas" />
          <Image src="/hero/ellie.jpg" alt="" width={80} height={80} className="size-10 rounded-full object-cover ring-2 ring-canvas" />
        </span>
        <span className="flex h-12 items-center gap-1 rounded-control bg-surface pl-1">
          <span className="relative flex h-10 w-11 items-center justify-center text-ink">
            <Icon icon={Notification03Icon} size={20} />
            <span className="absolute top-1 left-[27px] inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-ink px-1 text-[10.5px] leading-none text-white ring-2 ring-surface">1</span>
          </span>
          <Image src="/hero/nina.jpg" alt="" width={96} height={96} className="size-12 rounded-control object-cover" />
        </span>
      </div>
    </div>
  );
}

function Title({ children, sub }: { children: ReactNode; sub: ReactNode }) {
  return (
    <>
      <h3 className="text-[32px] leading-[1.08] tracking-[-0.025em]">{children}</h3>
      <p className="mt-1.5 text-[15px] leading-snug text-muted">{sub}</p>
    </>
  );
}

function Corner() {
  return (
    <span className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-control bg-surface">
      <Icon icon={ArrowUpRight01Icon} size={17} />
    </span>
  );
}

function Glance({ icon, label, count, children }: { icon: IconSvgElement; label: string; count: number; children: ReactNode }) {
  return (
    <div className="panel relative p-5">
      <span className="flex items-center gap-2 text-[13.5px] text-muted">
        <Icon icon={icon} size={17} />
        {label}
      </span>
      <p className="mt-2 text-[34px] leading-none font-light">{count}</p>
      <div className="mt-3 text-[13.5px] leading-snug text-ink-2">{children}</div>
      <Corner />
    </div>
  );
}

function HomeScreen() {
  return (
    <>
      <Title sub="Flat 2, 14 Royal York Crescent, Bristol · let by Whitfield Property Group">Good evening, Nina</Title>
      <div className="mt-4 flex flex-col gap-2">
        <div className="panel relative p-5">
          <p className="text-[13.5px] text-muted">Next payment</p>
          <p className="mt-2 text-[44px] leading-none font-light tabular">£1,295.00</p>
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[14px] text-ink-2">
            <span>Due 15 Nov 2026</span>
            <Tag tone="text-ink-2" icon={Clock01Icon}>
              Upcoming
            </Tag>
          </div>
          <p className="mt-2 text-[13px] text-muted">Balance including upcoming rent: £1,295.00.</p>
          <span className={cn(btn, "mt-5 w-fit bg-surface")}>View rent statement</span>
          <Corner />
        </div>
        <Glance icon={Wrench01Icon} label="Open repairs" count={1}>
          <span className="block text-ink">Bathroom extractor fan buzzing</span>
          <span className="block text-muted">Acknowledged</span>
        </Glance>
        <Glance icon={Message01Icon} label="Unread messages" count={1}>
          <span className="block text-ink">Hi Nina, the electrician can come on Tuesday morning to look at the fan.</span>
          <span className="block text-muted">Ellie · 2 hours ago</span>
        </Glance>
        <Glance icon={File02Icon} label="Documents to read" count={1}>
          Gas safety record 2026
        </Glance>
      </div>
    </>
  );
}

const UPDATES: [string, string, string, string?][] = [
  ["nina", "Nina Kowalski reported it", "12 Oct 2026, 08:31", "The oven heats for a few minutes and then goes cold. The fan still runs."],
  ["ellie", "Ellie Marsh acknowledged the repair", "12 Oct 2026, 09:02"],
  ["ellie", "Ellie Marsh scheduled a visit", "12 Oct 2026, 09:10", "Wed 14 Oct, 09:00 to 12:00"],
  ["ellie", "Ellie Marsh marked it resolved", "14 Oct 2026, 11:48", "New element fitted and tested."],
];

function RepairScreen() {
  return (
    <>
      <Title sub="#25 · Flat 2, 14 Royal York Crescent · reported 12 Oct 2026, 08:31">Oven element not heating</Title>
      <div className="mt-4 flex flex-col gap-2">
        <div className="panel p-5">
          <Tag tone="text-good" icon={CheckmarkCircle02Icon} className="text-[15px]">
            Fixed, please confirm
          </Tag>
          <p className="mt-1.5 text-[15px] leading-snug text-ink-2">Whitfield Property Group says it is fixed. If it is not, tell them by 21 Oct 2026. Otherwise it closes by itself after 7 days.</p>
          <div className="mt-4 flex flex-col gap-2">
            <span className={cn(btn, "bg-ink text-white")}>
              <Icon icon={CheckmarkCircle02Icon} size={17} /> Yes, it is fixed
            </span>
            <span className={cn(btn, "bg-surface")}>
              <Icon icon={UndoIcon} size={17} /> No, it is not fixed
            </span>
          </div>
        </div>
        <div className="panel p-5">
          <p className="text-[18px] leading-tight">Updates</p>
          <p className="mt-1 text-[13.5px] leading-snug text-muted">Every change, visit and comment, with who did it and when.</p>
          <ol className="mt-4 flex flex-col gap-2">
            {UPDATES.map(([photo, what, when, body]) => (
              <li key={what} className="flex gap-3 rounded-tile bg-surface px-4 py-3.5">
                <Image src={`/hero/${photo}.jpg`} alt="" width={64} height={64} className="size-8 shrink-0 rounded-full object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-[14px] leading-snug">{what}</p>
                  <p className="text-[12.5px] text-muted tabular">{when}</p>
                  {body ? <p className="mt-1.5 text-[14px] leading-relaxed text-ink-2">{body}</p> : null}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
}

const SHARED: [string, string, string?][] = [
  ["Tenancy agreement", "Tenancy agreement or written statement · Dated 15 Mar 2026", "Read on 15 Mar 2026"],
  ["Energy Performance Certificate", "EPC · Valid until 2 Jun 2033", "Read on 15 Mar 2026"],
  ["How to Rent guide", "Other · Added 15 Mar 2026"],
];

function FileIcons() {
  return (
    <span className="flex shrink-0 gap-1.5">
      {[ViewIcon, Download01Icon].map((icon, i) => (
        <span key={i} className="flex size-9 items-center justify-center rounded-control bg-canvas">
          <Icon icon={icon} size={16} />
        </span>
      ))}
    </span>
  );
}

function DocumentsScreen() {
  return (
    <>
      <Title sub="For Flat 2, 14 Royal York Crescent. Shared by your landlord, plus anything you add.">Documents</Title>
      <span className={cn(btn, "mt-4 bg-surface")}>
        <Icon icon={FileUploadIcon} size={18} /> Add a document
      </span>
      <div className="mt-4 flex flex-col gap-2">
        <div className="panel p-5">
          <p className="text-[18px] leading-tight">Please read</p>
          <p className="mt-1 text-[13.5px] leading-snug text-muted">Your landlord asked you to confirm this one.</p>
          <div className="mt-4 flex flex-col gap-3 rounded-tile bg-surface p-4">
            <div className="flex items-start gap-3">
              <Icon icon={Pdf01Icon} size={24} strokeWidth={1.3} className="mt-0.5 text-muted" />
              <div className="min-w-0 flex-1">
                <p className="text-[15px]">Gas safety record 2026</p>
                <p className="mt-0.5 text-[12.5px] text-muted">Gas safety record · Valid until 8 Sept 2027</p>
              </div>
            </div>
            <span className={cn(btn, "bg-canvas")}>
              <Icon icon={ViewIcon} size={17} /> Open PDF
            </span>
            <span className={cn(btn, "bg-ink text-white")}>
              <Icon icon={CheckmarkCircle02Icon} size={17} /> I&rsquo;ve read this
            </span>
          </div>
        </div>
        <div className="panel p-5">
          <p className="text-[18px] leading-tight">From your landlord</p>
          <ul className="mt-4 flex flex-col gap-1">
            {SHARED.map(([title, meta, read]) => (
              <li key={title} className="flex items-center gap-3 rounded-tile bg-surface px-4 py-3">
                <Icon icon={Pdf01Icon} size={24} strokeWidth={1.3} className="text-muted" />
                <div className="min-w-0 flex-1">
                  <p className="text-[14.5px]">{title}</p>
                  <p className="text-[12.5px] text-muted">{meta}</p>
                  {read ? (
                    <Tag tone="text-good" icon={CheckmarkCircle02Icon} className="mt-1 text-[12.5px]">
                      {read}
                    </Tag>
                  ) : null}
                </div>
                <FileIcons />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}

function Phone({ screen, moved }: { screen: Screen; moved: boolean }) {
  const still = useReducedMotion();
  return (
    <div className="relative h-[760px] w-full max-w-[390px] overflow-hidden rounded-[34px] bg-canvas text-ink shadow-[0_1px_2px_rgb(20_20_20/0.14),0_34px_56px_-30px_rgb(30_28_40/0.6)] sm:h-[844px]">
      <div className="px-4 pt-4">
        <PhoneHeader />
        {/* Each screen slides in from the right, like a page change in the app. It is never hidden while it moves. */}
        <motion.div key={screen} className="mt-6" initial={moved && !still ? { x: 28 } : false} animate={{ x: 0 }} transition={{ duration: 0.32, ease: [0.2, 0.8, 0.2, 1] }}>
          {screen === "home" ? <HomeScreen /> : screen === "repair" ? <RepairScreen /> : <DocumentsScreen />}
        </motion.div>
      </div>
      {/* The page runs on under the tab bar, as it does on a phone, and fades into the canvas at the foot. */}
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-b from-canvas/0 to-canvas to-60%" />
      <div className="absolute inset-x-3 bottom-3 flex items-center justify-between rounded-[8px] bg-surface p-1.5 shadow-float">
        {TABS.map(([label, icon], i) => (
          <span key={label} className={cn("relative flex h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-[6px] text-[11px] transition-colors duration-300", i === LIT[screen] ? "bg-ink text-white" : "text-ink-2")}>
            <Icon icon={icon} size={19} />
            <span className="truncate">{label}</span>
            {label === "Messages" ? <span className={cn("absolute top-0.5 right-[22%] inline-flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] ring-2 ring-surface", "bg-ink text-white")}>1</span> : null}
          </span>
        ))}
      </div>
    </div>
  );
}

export function SectionTenantPhone() {
  const [screen, setScreen] = useState<Screen>("home");
  // Screens only slide in once the visitor has picked one, so the first render is the same on the server and here.
  const [moved, setMoved] = useState(false);
  return (
    <section aria-labelledby="phone-title" className="pt-24 sm:pt-32">
      <Column className="grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
        <div className="lg:order-last lg:sticky lg:top-28 lg:self-start lg:pt-10">
          <h2 id="phone-title" className="text-[clamp(28px,3.8vw,52px)] leading-[1.06] tracking-[-0.03em] text-ink">
            Their whole tenancy,
            <br />
            on their phone.
          </h2>
          <p className="mt-5 max-w-[30rem] text-[17px] leading-[1.55] text-ink-2">
            Tenants get their own side of DirectHomes, made for phones first. It opens in any browser with nothing to install, and it&rsquo;s free for them on every plan.
          </p>
          <div className="mt-8">
            <p className="text-[15px] text-ink">Nina&rsquo;s screen</p>
            <Choice label="Nina's screen" options={SCREENS} value={screen} onChange={(v) => (setMoved(true), setScreen(v))} className="mt-3 w-full sm:w-auto" />
          </div>
          <div aria-live="polite" className="mt-8 max-w-[28rem]">
            <p className="text-[18px] leading-snug text-ink">{ABOUT[screen].title}</p>
            <p className="mt-1.5 text-[15px] leading-[1.5] text-ink-2">{ABOUT[screen].text}</p>
          </div>
        </div>

        <div className="brand-wash flex justify-center rounded-panel px-2 py-6 sm:p-10 lg:p-12">
          <div aria-hidden inert className="pointer-events-none flex w-full justify-center select-none">
            <Phone screen={screen} moved={moved} />
          </div>
          <p className="sr-only">
            {screen === "home"
              ? "Nina's Home screen: next payment £1,295.00 due 15 Nov 2026, one open repair, one unread message and one document to read."
              : screen === "repair"
                ? "Nina's repair page for the oven element, marked fixed by her landlord, with buttons to confirm it is fixed or say it is not, and the updates so far."
                : "Nina's Documents: a gas safety record to confirm with I've read this, and the documents her landlord has shared."}
          </p>
        </div>
      </Column>
    </section>
  );
}

/* ---------- The invitation ---------- */

type Mail = "invite" | "day3" | "day7";
const MAILS = [
  { value: "invite", label: "The invitation" },
  { value: "day3", label: "Day 3" },
  { value: "day7", label: "Day 7" },
] as const;
const SENT: Record<Mail, string> = { invite: "Sat 17 Oct 2026", day3: "Tue 20 Oct 2026", day7: "Sat 24 Oct 2026" };
const PLACE = "Flat 2, 14 Royal York Crescent, Bristol";
const LANDLORD = "Whitfield Property Group";

function Field({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="px-1 text-[13px] text-ink-2">{label}</span>
      <span className="flex h-12 items-center rounded-control bg-surface px-4 text-[15px]">{value}</span>
      {hint ? <span className="px-1 text-[12.5px] text-muted">{hint}</span> : null}
    </div>
  );
}

export function SectionInvite() {
  const [mail, setMail] = useState<Mail>("invite");
  const reminder = mail !== "invite";
  return (
    <section aria-labelledby="invite-title" className="pt-24 sm:pt-32">
      <Column>
        <SectionHead
          id="invite-title"
          title={
            <>
              They join from
              <br />
              one email.
            </>
          }
          text="Invite each tenant from the tenancy. The email comes from you, the link works for 14 days, and if they haven't joined it reminds them on day 3 and day 7."
        />

        <div className="brand-wash brand-wash-3 mt-10 grid grid-cols-[minmax(0,1fr)] items-start gap-x-10 gap-y-6 rounded-panel p-2 sm:p-8 lg:mt-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:p-12">
          <div className="px-3 pt-4 sm:px-0 sm:pt-0 lg:col-span-2">
            <p className="text-[15px] text-ink">Which email</p>
            <Choice label="Which email" options={MAILS} value={mail} onChange={setMail} className="mt-3 w-full sm:w-auto" />
          </div>
          <div>

            {/* The email as the app renders it: the grey page, a pale card, the subject, the words and one ink button. */}
            <div aria-live="polite" className={cn(sheet, "p-2 sm:p-3")}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 px-3 pt-2 pb-3">
                <span className="text-[14px] text-ink">{LANDLORD} via DirectHomes</span>
                <span className="text-[12.5px] text-muted tabular">{SENT[mail]}</span>
              </div>
              <div className="rounded-panel bg-surface px-5 py-7 sm:px-8 sm:py-8">
                <p className="text-[22px] leading-snug sm:text-[24px]">{reminder ? `Reminder: set up your tenancy at ${PLACE}` : `You're invited to manage your tenancy at ${PLACE}`}</p>
                <div className="mt-5 flex flex-col gap-4 text-[15.5px] leading-[1.55] text-ink">
                  <p>Hi Nina,</p>
                  <p>
                    {reminder ? "A reminder: " : ""}
                    {LANDLORD} has invited you to DirectHomes for your home at {PLACE}.
                  </p>
                  <p>DirectHomes is free for tenants. You can pay rent, see your rent statement, report repairs and message your landlord in one place.</p>
                  <p>Use the button below with this email address. The link works until 31 Oct 2026.</p>
                </div>
                <span aria-hidden className="mt-6 inline-flex rounded-control bg-ink px-[22px] py-3 text-[15px] text-white">
                  Accept and set up your account
                </span>
              </div>
              <p className="px-3 pt-4 pb-2 text-[12px] leading-[1.5] text-muted">You are receiving this because you have a DirectHomes account or were invited to one.</p>
            </div>
          </div>

          {/* The page the button opens, for someone new to DirectHomes. A picture: nothing here signs anyone up. */}
          <div aria-hidden inert className="pointer-events-none select-none">
            <div className={cn(sheet, "p-2 sm:p-3")}>
              <div className="panel p-5 sm:p-7">
                <p className="text-[26px] leading-tight tracking-[-0.02em] sm:text-[30px]">Welcome to {PLACE}</p>
                <p className="mt-2 text-[15px] leading-relaxed text-muted">{LANDLORD} has invited you to DirectHomes. Pay rent, see your statement, report repairs and message your landlord in one place. Always free for tenants.</p>
                <div className="mt-7 flex flex-col gap-5">
                  <div className="flex gap-2">
                    <span className="flex min-h-10 flex-1 items-center justify-center rounded-control bg-ink px-3 py-1.5 text-center text-[13.5px] leading-tight text-white">I&rsquo;m new to DirectHomes</span>
                    <span className="flex min-h-10 flex-1 items-center justify-center rounded-control bg-surface px-3 py-1.5 text-center text-[13.5px] leading-tight text-ink-2">I have an account</span>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="First name" value="Nina" />
                    <Field label="Last name" value="Kowalski" />
                  </div>
                  <Field label="Choose a password" value="" hint="At least 10 characters." />
                  <span className="flex items-start gap-3 px-1">
                    <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-[3px] bg-ink text-white">
                      <Icon icon={Tick02Icon} size={14} strokeWidth={2} />
                    </span>
                    <span className="text-[13.5px] leading-snug text-ink-2">I accept the Terms and Privacy Notice</span>
                  </span>
                  <span className={cn(btn, "w-full bg-ink text-white")}>Accept and set up your account</span>
                </div>
              </div>
            </div>
          </div>
          <p className="sr-only">The invitation page: Welcome to {PLACE}. New tenants add their name and a password, accept the terms and choose Accept and set up your account.</p>
        </div>
      </Column>
    </section>
  );
}
