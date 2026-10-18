"use client";

import { useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  Clock01Icon,
  ComputerIcon,
  Logout03Icon,
  MinusSignCircleIcon,
  RefreshIcon,
  SecurityCheckIcon,
  SmartPhone01Icon,
  SquareUnlock02Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Choice } from "./choice";
import { Icon } from "./icon";
import { Column, SectionHead, Status } from "./ui";
import { cn } from "@/lib/utils";

/*
 * The About and security page's three pieces.
 * - What it is and isn't: four plain pairs, each true in the spec (facts.md). No company story, team or history,
 *   because none is written yet.
 * - Security: the app's Settings, Security tab (webapp features/settings/components/sections.tsx and security.tsx), in
 *   its own words. A sign-in nobody recognises sits in the list; the two switches beside it sign that device out and
 *   turn on two-step verification, and the activity list records both, as the app does.
 * - The safeguards: the platform facts from the spec's security section, with what is only planned marked as planned.
 */

/* ---------- What it is and isn't ---------- */

const PAIRS = [
  {
    is: { title: "Software you run yourself.", text: "For UK landlords and their tenants, in the browser on any phone or computer. Nothing to install." },
    not: { title: "Not a letting agent.", text: "It doesn't find tenants, visit homes or manage them for you, and it can't settle disputes." },
  },
  {
    is: { title: "Rent straight to your bank.", text: "Tenants pay through Stripe, which pays the rent out to your own bank account on its normal schedule." },
    not: { title: "Never holding your money.", text: "DirectHomes never holds rent or deposits. Deposits stay with a government-approved protection scheme." },
  },
  {
    is: { title: "Free for tenants, always.", text: "On every plan, with no fee on their rent. They pay exactly what they owe, and nothing more." },
    not: { title: "Not a repairs firm.", text: "Your tenant reports it and you arrange the fix. DirectHomes keeps one timeline you can both see." },
  },
  {
    is: { title: "Written for England first.", text: "Rules and deadlines are written for England in full. Homes in Wales, Scotland and Northern Ireland run as general tenancies with the general certificate tracker." },
    not: { title: "Not legal advice.", text: "Reminders and suggested documents help you keep on top of things, but they can't guarantee compliance." },
  },
];

function Claim({ icon, title, text, quiet }: { icon: IconSvgElement; title: string; text: string; quiet?: boolean }) {
  return (
    <div className={cn("grid h-full grid-cols-[22px_minmax(0,1fr)] gap-x-4 rounded-[10px] p-6 sm:p-8", quiet ? "bg-white/25" : "bg-white/55")}>
      <Icon icon={icon} size={22} strokeWidth={1.6} className={cn("mt-1", quiet ? "text-muted" : "text-ink")} />
      <div>
        <p className="text-[clamp(20px,1.7vw,24px)] leading-[1.2] tracking-[-0.01em] text-ink">{title}</p>
        <p className="mt-2.5 max-w-[32rem] text-[15.5px] leading-[1.55] text-ink-2">{text}</p>
      </div>
    </div>
  );
}

export function SectionWhatItIs() {
  return (
    <section aria-labelledby="what-title" className="pt-24 sm:pt-32">
      <Column>
        <SectionHead
          id="what-title"
          title={
            <>
              What it does,
              <br />
              and what it never will.
            </>
          }
          text="The plain version, before you move a single home over. Each line on the left is what DirectHomes does; the one beside it is where it stops."
        />
        <ul className="mt-10 grid gap-2 lg:mt-14">
          {PAIRS.map((p) => (
            <li key={p.is.title} className="grid gap-2 md:grid-cols-2">
              <Claim icon={Tick02Icon} {...p.is} />
              <Claim icon={Cancel01Icon} quiet {...p.not} />
            </li>
          ))}
        </ul>
      </Column>
    </section>
  );
}

/* ---------- Security: Settings, Security ---------- */

type Tone = "good" | "warn" | "muted" | "plain";
const TONE: Record<Tone, string> = { good: "text-good", warn: "text-warn", muted: "text-muted", plain: "text-ink-2" };

function AppStatus({ tone, icon, label, detail }: { tone: Tone; icon: IconSvgElement; label: string; detail?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[13.5px] whitespace-nowrap", TONE[tone])}>
      <Icon icon={icon} size={16} />
      <span>{label}</span>
      {detail ? <span className="text-muted">· {detail}</span> : null}
    </span>
  );
}

function AppPanel({ title, description, children, className }: { title: string; description: string; children: ReactNode; className?: string }) {
  return (
    <div className={cn("panel flex flex-col p-5 sm:p-6", className)}>
      <div className="mb-4">
        <p className="text-[18px] leading-tight text-ink">{title}</p>
        <p className="mt-1 text-[13.5px] leading-snug text-muted">{description}</p>
      </div>
      {children}
    </div>
  );
}

function AppButton({ icon, children, tone = "secondary", size = "md" }: { icon?: IconSvgElement; children: ReactNode; tone?: "primary" | "secondary" | "danger"; size?: "sm" | "md" }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap",
        size === "sm" ? "h-9 rounded-[4px] px-3.5 text-[13px]" : "h-11 rounded-control px-5 text-[14px]",
        tone === "primary" ? "bg-ink text-white" : tone === "danger" ? "bg-bad-soft text-bad" : "bg-surface text-ink",
      )}
    >
      {icon ? <Icon icon={icon} size={size === "sm" ? 16 : 18} /> : null}
      {children}
    </span>
  );
}

const SESSIONS = [
  { id: "mac", device: "Chrome on macOS", mobile: false, line: "IP 203.0.113.42 · Last active now · Signed in 2 Oct 2026", current: true },
  { id: "iphone", device: "Safari on iOS", mobile: true, line: "IP 203.0.113.8 · Last active 2 hours ago · Signed in 3 Oct 2026" },
  { id: "windows", device: "Edge on Windows", mobile: false, line: "IP 198.51.100.23 · Last active 9 hours ago · Signed in 16 Oct 2026" },
];

type Event = { id: string; label: string; where: string; at: string; warn?: boolean; signIn?: boolean };

const EARLIER: Event[] = [
  { id: "in-win", label: "Signed in", where: "Edge on Windows · IP 198.51.100.23", at: "16 Oct 2026, 23:48", signIn: true },
  { id: "fail-win", label: "Failed sign-in attempt", where: "Edge on Windows · IP 198.51.100.23", at: "16 Oct 2026, 23:46", warn: true },
  { id: "in-ios", label: "Signed in", where: "Safari on iOS · IP 203.0.113.8", at: "3 Oct 2026, 08:15", signIn: true },
  { id: "pw", label: "Password changed", where: "Chrome on macOS · IP 203.0.113.42", at: "2 Oct 2026, 19:02" },
];

const MAC = "Chrome on macOS · IP 203.0.113.42";

function TwoStepOff() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <AppStatus tone="muted" icon={MinusSignCircleIcon} label="Off" />
      <p className="text-[14px] leading-relaxed text-ink-2">Add a second step when you sign in: a 6-digit code from an authenticator app on your phone. It stops anyone who learns your password.</p>
      <ol className="flex flex-col gap-2.5 rounded-tile bg-surface px-4 py-3.5 text-[14px] leading-snug text-ink-2">
        <li>
          <span className="mr-2 text-ink tabular">1</span>Scan a QR code with Google Authenticator, 1Password or Authy.
        </li>
        <li>
          <span className="mr-2 text-ink tabular">2</span>Type the 6-digit code it shows.
        </li>
        <li>
          <span className="mr-2 text-ink tabular">3</span>Save 10 recovery codes in case you lose your phone.
        </li>
      </ol>
      <div className="mt-auto pt-1">
        <AppButton tone="primary" icon={SecurityCheckIcon}>
          Turn on two-step verification
        </AppButton>
      </div>
    </div>
  );
}

function TwoStepOn() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <AppStatus tone="good" icon={CheckmarkCircle02Icon} label="On" detail="since 17 Oct 2026" />
        <AppStatus tone="plain" icon={SecurityCheckIcon} label="10 of 10 recovery codes left" />
      </div>
      <div className="mt-auto flex flex-wrap gap-2 pt-1">
        <AppButton icon={RefreshIcon}>New recovery codes</AppButton>
        <AppButton tone="danger" icon={SquareUnlock02Icon}>
          Turn off
        </AppButton>
      </div>
    </div>
  );
}

export function SectionSecurity() {
  const [device, setDevice] = useState<"keep" | "out">("keep");
  const [mfa, setMfa] = useState<"off" | "on">("off");
  const still = useReducedMotion();
  const out = device === "out";
  const on = mfa === "on";

  const sessions = SESSIONS.filter((s) => !(out && s.id === "windows"));
  const others = sessions.filter((s) => !s.current).length;
  // Newest first, as the app lists them. The list keeps four rows, so the panel never changes height.
  const events: Event[] = [
    ...(on ? [{ id: "mfa", label: "Two-step verification turned on", where: MAC, at: "17 Oct 2026, 09:14" }] : []),
    ...(out ? [{ id: "out", label: "Signed out a session", where: MAC, at: "17 Oct 2026, 09:12" }] : []),
    ...EARLIER,
  ].slice(0, 4);

  const note = on && out ? "Signed out, and your password alone is no longer enough to get in." : out ? "Signed out of that device. The app's advice is to change your password next." : on ? "Two-step is on. A stolen password alone can't get anyone in now." : "A sign-in from a laptop you don't own, late last night, just after a failed attempt.";

  return (
    <section id="security" aria-labelledby="security-title" className="scroll-mt-4 pt-24 sm:pt-32">
      <Column>
        <SectionHead
          id="security-title"
          title={
            <>
              Your account stays
              <br />
              in your hands.
            </>
          }
          text="In Settings, then Security: two-step sign-in with an authenticator app, recovery codes in case you lose your phone, and every device you're signed in on. No codes by text message."
        />

        <div className="brand-wash brand-wash-2 mt-10 rounded-panel p-2 sm:p-8 lg:mt-14 lg:p-12">
          <div className="grid gap-6 px-3 pt-4 pb-6 sm:px-0 sm:pt-0 sm:pb-8 lg:grid-cols-[auto_auto_minmax(0,1fr)] lg:items-end lg:gap-10">
            <div>
              <p className="text-[15px] text-ink">Edge on Windows, signed in last night</p>
              <Choice
                label="Edge on Windows, signed in last night"
                options={[
                  { value: "keep", label: "Leave it" },
                  { value: "out", label: "Sign it out" },
                ]}
                value={device}
                onChange={setDevice}
                className="mt-3 w-full sm:w-auto"
              />
            </div>
            <div>
              <p className="text-[15px] text-ink">Two-step verification</p>
              <Choice
                label="Two-step verification"
                options={[
                  { value: "off", label: "Off" },
                  { value: "on", label: "On" },
                ]}
                value={mfa}
                onChange={setMfa}
                className="mt-3 w-full sm:w-auto"
              />
            </div>
            <p aria-live="polite" className="max-w-[28rem] text-[15px] leading-[1.5] text-ink-2 lg:min-h-[3em] lg:pb-0.5">
              {note}
            </p>
          </div>

          {/* The Security tab as the app draws it: a picture, driven only by the two switches above. */}
          <div className="pointer-events-none rounded-[10px] bg-canvas p-2 text-ink select-none shadow-[0_1px_2px_rgb(20_20_20/0.1),0_24px_40px_-28px_rgb(30_28_40/0.5)]">
            <div className="px-3 pt-3 pb-5 sm:px-4">
              <p className="text-[28px] leading-[1.08] tracking-[-0.025em] sm:text-[34px]">Settings</p>
              <p className="mt-2 text-[14px] leading-snug text-muted">Password, two-step verification and where you are signed in.</p>
              <div aria-hidden className="mt-5 flex w-fit max-w-full gap-1 rounded-[6px] bg-panel p-1">
                {["Profile", "Security", "Notifications", "Workspace", "Payments", "Data and privacy"].map((t, i) => (
                  <span
                    key={t}
                    className={cn(
                      "h-9 shrink-0 items-center rounded-[4px] px-4 text-[14px]",
                      t === "Security" ? "inline-flex bg-ink text-white" : "text-ink-2",
                      t !== "Security" && (i < 1 ? "inline-flex" : i < 3 ? "hidden sm:inline-flex" : "hidden lg:inline-flex"),
                    )}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-[minmax(0,1fr)] gap-2 lg:grid-cols-2">
              <AppPanel title="Two-step verification" description="A code from your phone as well as your password.">
                {/* Both states in one cell, so the panel keeps the taller one's height. */}
                <div className="grid flex-1">
                  <div aria-hidden={on} className={cn("flex [grid-area:1/1] transition-[opacity,visibility] duration-300", on ? "invisible opacity-0" : "opacity-100")}>
                    <TwoStepOff />
                  </div>
                  <div aria-hidden={!on} className={cn("flex [grid-area:1/1] transition-[opacity,visibility] duration-300", on ? "opacity-100" : "invisible opacity-0")}>
                    <TwoStepOn />
                  </div>
                </div>
              </AppPanel>

              <AppPanel title="Where you are signed in" description="Sign out anything you do not recognise, then change your password.">
                <ul className="flex flex-col gap-1">
                  <AnimatePresence initial={false}>
                    {sessions.map((s) => (
                      <motion.li
                        key={s.id}
                        exit={still ? { opacity: 0 } : { height: 0, opacity: 0, transition: { duration: 0.35, ease: [0.2, 0.8, 0.2, 1] } }}
                        className="overflow-hidden"
                      >
                        <div className="flex items-center gap-4 rounded-tile bg-surface px-4 py-3.5">
                          <Icon icon={s.mobile ? SmartPhone01Icon : ComputerIcon} size={22} className="text-ink-2" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[14.5px] text-ink">
                              {s.device}
                              {s.current ? <span className="ml-2 text-[13px] text-good">This device</span> : null}
                            </p>
                            <p className="truncate text-[12.5px] text-muted">{s.line}</p>
                          </div>
                          {s.current ? null : (
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-[4px] bg-surface text-ink-2">
                              <Icon icon={Logout03Icon} size={16} />
                            </span>
                          )}
                        </div>
                      </motion.li>
                    ))}
                  </AnimatePresence>
                </ul>
                <div className="mt-auto pt-4">
                  <AppButton size="sm" icon={Logout03Icon}>
                    Sign out everywhere else
                  </AppButton>
                  <span className="sr-only">{others} other sessions</span>
                </div>
              </AppPanel>

              <AppPanel title="Recent security activity" description="Sign-ins and changes to your account, newest first." className="lg:col-span-2">
                <ol className="flex flex-col">
                  {events.map((e) => (
                    <li key={e.id} className="flex items-start gap-3 py-3">
                      <Icon icon={e.warn ? Alert02Icon : e.signIn ? Clock01Icon : CheckmarkCircle02Icon} size={18} className={cn("mt-0.5", e.warn ? "text-warn" : "text-muted")} />
                      <div className="min-w-0 flex-1">
                        <p className="text-[14.5px] text-ink">{e.label}</p>
                        <p className="truncate text-[12.5px] text-muted">{e.where}</p>
                      </div>
                      <span className="shrink-0 text-[12.5px] text-muted tabular">{e.at}</span>
                    </li>
                  ))}
                </ol>
              </AppPanel>
            </div>
          </div>
        </div>
        <p className="mt-4 px-1 text-[13px] leading-[1.55] text-muted">
          Two-step sign-in is optional for most people. It is required for Owners and Admins on Professional, on by default for their staff, and always asked for before payout details change.
        </p>
      </Column>
    </section>
  );
}

/* ---------- The safeguards ---------- */

const SAFEGUARDS = [
  { value: "London", text: "Core processing stays in London: the database, your files and the app itself." },
  { value: "AES-256", text: "Encryption at rest for the database, stored files and every backup." },
  { value: "TLS 1.2+", text: "HTTPS only, with HSTS, for everything between your browser and DirectHomes." },
  { value: "0", text: "Card or bank numbers stored by DirectHomes. Stripe holds them, and your payout details stay in your own Stripe account." },
  { value: "15 min", text: "The most a restore could lose, with point-in-time recovery, daily backups and a weekly copy kept off-platform. Running again within 4 hours." },
  { value: "7 years", text: "How long money entries stay in the audit trail. It can only be added to, and each entry carries a hash of the one before, so tampering shows." },
];

export function SectionSafeguards() {
  return (
    <section aria-labelledby="safeguards-title" className="pt-24 sm:pt-32">
      <Column>
        <SectionHead
          id="safeguards-title"
          center
          title={
            <>
              What sits behind
              <br />
              the sign-in screen.
            </>
          }
        />
        <dl className="mt-12 grid gap-x-12 gap-y-12 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3 lg:gap-y-16">
          {SAFEGUARDS.map((s) => (
            <div key={s.value} className="flex flex-col">
              <dt className="text-[clamp(40px,4.4vw,64px)] leading-none tracking-[-0.02em] text-ink tabular">{s.value}</dt>
              <dd className="mt-4 max-w-[24rem] text-[15.5px] leading-[1.55] text-ink-2">{s.text}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-14 flex flex-col gap-2 rounded-[10px] bg-white/40 p-6 sm:flex-row sm:items-baseline sm:gap-5 sm:p-7">
          <Status kind="upcoming" className="text-[14px]">
            Planned before launch
          </Status>
          <p className="text-[15.5px] leading-[1.55] text-ink-2">
            An independent CREST-accredited penetration test and Cyber Essentials certification, then Cyber Essentials Plus within six months. Neither is done yet.
          </p>
        </div>
      </Column>
    </section>
  );
}
