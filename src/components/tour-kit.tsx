"use client";

import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { animate, motion } from "motion/react";
import {
  Building03Icon,
  BubbleChatEditIcon,
  Cancel01Icon,
  CreditCardIcon,
  DashboardSquare01Icon,
  File02Icon,
  HandshakeIcon,
  HelpCircleIcon,
  KanbanIcon,
  Message01Icon,
  Notification03Icon,
  PieChart01Icon,
  Search01Icon,
  Settings02Icon,
  UserGroupIcon,
  Wallet01Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "./icon";
import { LogoMark } from "./logo";
import { cn } from "@/lib/utils";

/* The app drawn for the product tour: its shell and the small pieces every page shares (product-tour.tsx). */

export const W = 1440;
export const H = 760;

/* ---------- Shared pieces, as the app draws them ---------- */

export type Tone = "good" | "warn" | "bad" | "info" | "plain" | "muted";
export const TONE: Record<Tone, string> = { good: "text-good", warn: "text-warn", bad: "text-bad", info: "text-info", plain: "text-ink-2", muted: "text-muted" };

export function Tag({ tone, icon, children, className }: { tone: Tone; icon: IconSvgElement; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[14px] whitespace-nowrap", TONE[tone], className)}>
      <Icon icon={icon} size={16} />
      {children}
    </span>
  );
}

export function Square({ icon, className, target }: { icon: IconSvgElement; className?: string; target?: string }) {
  return (
    <span data-target={target} className={cn("flex size-12 shrink-0 items-center justify-center rounded-control bg-surface text-ink", className)}>
      <Icon icon={icon} size={20} />
    </span>
  );
}

export function Avatar({ photo, initials, size = "size-8", className }: { photo?: string; initials?: string; size?: string; className?: string }) {
  return photo ? (
    <Image src={`/hero/${photo}.jpg`} alt="" width={80} height={80} loading="eager" className={cn("shrink-0 rounded-full object-cover", size, className)} />
  ) : (
    <span className={cn("flex shrink-0 items-center justify-center rounded-full bg-sunken text-[12px] text-ink-2", size, className)}>{initials}</span>
  );
}

export const pounds = (pence: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(pence / 100);
export const exact = (pence: number) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 }).format(pence / 100);

/** A figure that runs to its new value when it changes, so the eye catches what moved. */
export function Count({ value, format }: { value: number; format: (n: number) => string }) {
  const node = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);
  const fmt = useRef(format);
  const [first] = useState(value);
  useEffect(() => {
    const el = node.current;
    if (!el || shown.current === value) return;
    const run = animate(shown.current, value, { duration: 0.8, ease: [0.2, 0.8, 0.2, 1], onUpdate: (v) => ((shown.current = v), (el.textContent = fmt.current(Math.round(v)))) });
    return () => run.stop();
  }, [value]);
  return <span ref={node}>{format(first)}</span>;
}

/** Text typed into a field: empty, typing out over `ms`, or all there. */
export function Typed({ text, state, ms = 2200 }: { text: string; state: "empty" | "typing" | "full"; ms?: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (state !== "typing") return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      setN(Math.min(text.length, Math.round(((t - start) / ms) * text.length)));
      if (t - start < ms) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state, text, ms]);
  const shown = state === "full" ? text : state === "typing" ? text.slice(0, n) : "";
  return (
    <>
      {shown}
      {state === "typing" ? <span className="ml-px inline-block h-[1.1em] w-px translate-y-[3px] bg-ink" /> : null}
    </>
  );
}

export const TENANT_RAIL: IconSvgElement[][] = [
  [DashboardSquare01Icon, Wallet01Icon, Wrench01Icon, File02Icon, Message01Icon],
  [Settings02Icon, HelpCircleIcon],
];
export const RAIL: IconSvgElement[][] = [
  [DashboardSquare01Icon, KanbanIcon, Building03Icon, Wallet01Icon, Wrench01Icon, File02Icon, Message01Icon, HandshakeIcon, PieChart01Icon, UserGroupIcon, CreditCardIcon],
  [Settings02Icon, HelpCircleIcon],
];

/**
 * The app around every page: the logo over the rail (the page's own destination lit), search and the account tray
 * top right, the page title with its controls overhanging it on the right.
 */
export function Shell({
  lit,
  title,
  sub,
  actions,
  children,
  tenant,
  scroll = 0,
}: {
  lit: number;
  title: [string, string?];
  sub: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  /** The tenant's app: their own rail, their landlord's faces and their own tray in place of search. */
  tenant?: boolean;
  /** How far the page has scrolled, in px; the rail stays put, as in the app. */
  scroll?: number;
}) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-canvas px-8 pt-4 text-ink">
      <LogoMark className="absolute top-[22px] left-8 z-10 size-9 text-ink" />
      <div className="absolute top-[104px] bottom-8 left-8 z-10 flex w-11 flex-col gap-2">
        {(tenant ? TENANT_RAIL : RAIL).map((strip, s) => (
          <ul key={s} className={cn("flex flex-col gap-0.5 rounded-[8px] bg-panel", s === 1 && "mt-auto")}>
            {strip.map((icon, i) => (
              <li key={i} className={cn("relative flex h-11 items-center justify-center rounded-[6px]", s === 0 && i === lit ? "bg-ink text-white" : "text-ink-2")}>
                <Icon icon={icon} size={19} />
                {!tenant && s === 0 && i === 6 ? <span className={cn("absolute top-0.5 right-1 inline-flex size-4 items-center justify-center rounded-full text-[10px] leading-none ring-2", lit === 6 ? "bg-white text-ink ring-ink" : "bg-ink text-white ring-panel-solid")}>1</span> : null}
              </li>
            ))}
          </ul>
        ))}
      </div>

      <div className="ml-[72px] transition-transform duration-[900ms] ease-[cubic-bezier(0.65,0,0.35,1)]" style={{ transform: `translateY(${-scroll}px)` }}>
        <div className="relative h-[112px]">
          <h3 className="pt-1.5 text-[44px] leading-[52px] tracking-[-0.025em] whitespace-nowrap">
            {title[0]}
            {title[1] ? (
              <>
                <span className="mx-3.5 text-faint">&mdash;</span>
                {title[1]}
              </>
            ) : null}
          </h3>
          <div className="mt-1 max-w-[620px] text-[15px] leading-snug text-muted">{sub}</div>
          <div className="absolute top-0 right-0 flex items-center gap-3">
            {tenant ? (
              <span className="flex -space-x-2.5">
                <Avatar photo="sam" size="size-12" className="ring-2 ring-canvas" />
                <Avatar photo="ellie" size="size-12" className="ring-2 ring-canvas" />
              </span>
            ) : (
            <span className="flex h-12 w-[360px] items-center gap-2.5 rounded-control bg-surface px-4 text-[14.5px] text-muted">
              <Icon icon={Search01Icon} size={18} />
              Search
              <span className="ml-auto rounded-[3px] bg-sunken px-1.5 py-0.5 text-[11px] text-ink-2">⌘K</span>
            </span>
            )}
            <span className="flex h-12 items-center gap-1 rounded-control bg-surface pl-1">
              <span className="flex h-10 w-11 items-center justify-center">
                <Icon icon={BubbleChatEditIcon} size={20} />
              </span>
              <span className="relative flex h-10 w-11 items-center justify-center">
                <Icon icon={Notification03Icon} size={20} />
                <span className="absolute top-1 left-[27px] inline-flex size-4 items-center justify-center rounded-full bg-ink text-[10.5px] leading-none text-white ring-2 ring-surface">{tenant ? 1 : 7}</span>
              </span>
              <Image src={tenant ? "/hero/nina.jpg" : "/hero/sam.jpg"} alt="" width={96} height={96} loading="eager" className="size-12 rounded-control object-cover" />
            </span>
          </div>
          <div className="absolute top-[60px] right-0 flex items-center gap-2">{actions}</div>
        </div>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function Ink({ icon, children, target, className }: { icon?: IconSvgElement; children: ReactNode; target?: string; className?: string }) {
  return (
    <span data-target={target} className={cn("ml-1 flex h-[52px] items-center gap-2.5 rounded-control bg-ink px-6 text-[15.5px] whitespace-nowrap text-white", className)}>
      {icon ? <Icon icon={icon} size={18} /> : null}
      {children}
    </span>
  );
}

/** A tab tray as the app draws it: the current one in ink. */
export function Tray({ tabs, on, separate, targets }: { tabs: [string, string?][]; on: number; separate?: boolean; targets?: Record<number, string> }) {
  return (
    <div className={cn("flex w-fit gap-1", separate ? "gap-2" : "rounded-[8px] bg-panel p-1")}>
      {tabs.map(([t, n], i) => (
        <span
          key={t}
          data-target={targets?.[i]}
          className={cn("inline-flex h-10 items-center gap-2.5 rounded-[6px] px-4 text-[14.5px] transition-colors duration-300", i === on ? "bg-ink text-white" : separate ? "bg-surface text-ink" : "text-ink-2")}
        >
          {t}
          {n ? <span className={cn("text-[12.5px] tabular", i === on ? "text-white/60" : "text-faint")}>{n}</span> : null}
        </span>
      ))}
    </div>
  );
}

/** The app's dialog: the page dimmed behind, a canvas panel with its title, help line and close square. */
export function Dialog({ title, help, children }: { title: string; help: string; children: ReactNode }) {
  return (
    <motion.div className="absolute inset-0 z-20 flex items-center justify-center bg-ink/30" initial={{ backgroundColor: "rgb(20 20 20 / 0)" }} animate={{ backgroundColor: "rgb(20 20 20 / 0.3)" }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
      <motion.div data-focus="dialog" className="w-[512px] rounded-panel bg-canvas p-7 shadow-float" initial={{ y: 12, scale: 0.98 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}>
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="text-[22px] leading-tight">{title}</p>
            <p className="mt-1.5 text-[14px] leading-snug text-muted">{help}</p>
          </div>
          <Square icon={Cancel01Icon} className="size-9" />
        </div>
        {children}
      </motion.div>
    </motion.div>
  );
}

export function Field({ label, optional, children }: { label: string; optional?: boolean; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="flex justify-between px-1 text-[13px] text-ink-2">
        {label}
        {optional ? <span className="text-faint">Optional</span> : null}
      </span>
      {children}
    </div>
  );
}

