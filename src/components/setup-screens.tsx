"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { ArrowDown01Icon, CheckmarkCircle02Icon, Location01Icon, Search01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "./icon";
import { Field, Typed } from "./tour-kit";
import { cn } from "@/lib/utils";

/*
 * Getting started: the four screens a new landlord goes through before the first rent is due, copied from the web
 * app (onboarding's Set up your workspace, Add a property's postcode lookup, the tenancy wizard's Rent and Tenants
 * steps), with what plays them and the close-ups the cards show (setup-cards.tsx).
 */

/** Each screen is drawn at this size and scaled to its box, like a screenshot. */
const DW = 380;
const DH = 486;

/** When each step's beats land (ms from the step starting), and how long the step runs. */
const STEPS = [
  { beats: [0, 400, 1900], ms: 3800 },
  { beats: [0, 300, 1500, 2600], ms: 4400 },
  { beats: [0, 300, 1500], ms: 3800 },
  { beats: [0, 300, 1900, 2500], ms: 4600 },
];

/**
 * Which step is open and how far its screen has got. While the box is on screen the steps open in turn until the
 * visitor picks one (`go`); then that one plays once and stays. Every screen not playing rests filled in, and so does
 * everything with reduced motion.
 */
export function useSteps() {
  const ref = useRef<HTMLDivElement>(null);
  const seen = useInView(ref, { amount: 0.35 });
  const still = useReducedMotion();
  const live = seen && !still;
  const [open, setOpen] = useState(0);
  const [play, setPlay] = useState({ step: -1, beat: 0 });
  const [auto, setAuto] = useState(true);
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!live) return;
    const s = STEPS[open];
    const timers = s.beats.map((at, beat) => setTimeout(() => setPlay({ step: open, beat }), at));
    if (auto) timers.push(setTimeout(() => setOpen((o) => (o + 1) % STEPS.length), s.ms));
    return () => timers.forEach(clearTimeout);
  }, [live, open, auto, run]);

  const go = (i: number) => {
    setAuto(false);
    setPlay({ step: -1, beat: 0 });
    setOpen(i);
    setRun((r) => r + 1);
  };
  // A step that has just opened starts from its first beat, not from wherever the last run left it.
  const beat = (i: number) => (live && i === open ? (play.step === i ? play.beat : 0) : STEPS[i].beats.length - 1);
  return { ref, open, go, beat };
}

/* ---------- The app's own small pieces ---------- */

function Head({ title, text }: { title: string; text: string }) {
  return (
    <>
      <p className="text-[18px] leading-tight">{title}</p>
      <p className="mt-1 text-[13.5px] leading-snug text-muted">{text}</p>
    </>
  );
}

function Input({ children, icon, focus }: { children: ReactNode; icon?: typeof ArrowDown01Icon; focus?: boolean }) {
  return (
    <span className={cn("flex h-11 items-center justify-between gap-2 rounded-control px-4 text-[14px] whitespace-nowrap", focus ? "bg-white ring-2 ring-accent" : "bg-surface")}>
      <span className="truncate">{children}</span>
      {icon ? <Icon icon={icon} size={17} className="text-muted" /> : null}
    </span>
  );
}

const typed = (beat: number, typing: number) => (beat < typing ? "empty" : beat === typing ? "typing" : "full");

/* ---------- 1. Onboarding: set up your workspace ---------- */

const PLANS = [
  ["Free", "£0", "One property, rent tracking, repairs, documents and messages."],
  ["Advanced", "£29.99 a month", "Up to ten properties."],
  ["Try Professional", "Free for 14 days", "Unlimited properties and staff."],
];

function Workspace({ beat }: { beat: number }) {
  return (
    <>
      <Head title="Set up your workspace" text="Your workspace holds your properties, tenancies and rent." />
      <div className="mt-4">
        <Field label="Workspace name">
          <Input focus={beat === 1}>
            <Typed text="Sam Whitfield" state={typed(beat, 1)} ms={1100} />
          </Input>
        </Field>
      </div>
      <p className="mt-4 mb-2 px-1 text-[13px] text-ink-2">Plan</p>
      <div className="flex flex-col gap-1.5">
        {PLANS.map(([name, price, summary], i) => (
          <div key={name} className={cn("rounded-tile px-4 py-3", i === 0 ? "bg-ink text-white" : "bg-surface")}>
            <span className="flex items-baseline justify-between gap-3">
              <span className="text-[14.5px]">{name}</span>
              <span className={cn("text-[13px] tabular", i === 0 ? "text-white/75" : "text-muted")}>{price}</span>
            </span>
            <span className={cn("mt-0.5 block text-[12.5px] leading-snug", i === 0 ? "text-white/75" : "text-muted")}>{summary}</span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------- 2. Add a property: the postcode lookup ---------- */

const ADDRESSES = ["12 Elm Grove", "16 Elm Grove", "18 Elm Grove", "20 Elm Grove"];

function Address({ beat }: { beat: number }) {
  return (
    <>
      <Head title="Add a property" text="Look it up by postcode for a verified address." />
      <div className="mt-4 flex items-end gap-2">
        <div className="flex-1">
          <Field label="Postcode">
            <Input focus={beat === 1}>
              <Typed text="BS7 8LZ" state={typed(beat, 1)} ms={900} />
            </Input>
          </Field>
        </div>
        <span className="flex h-11 items-center gap-1.5 rounded-control bg-ink px-3.5 text-[13.5px] whitespace-nowrap text-white">
          <Icon icon={Search01Icon} size={16} />
          Find address
        </span>
      </div>
      <ul className="mt-3 flex flex-col gap-1.5">
        {ADDRESSES.map((a, i) => {
          const picked = beat >= 3 && i === 1;
          return (
            <li
              key={a}
              className={cn(
                "flex h-11 items-center gap-3 rounded-tile px-4 text-[14px] transition-[background-color,opacity] duration-300",
                picked ? "bg-white ring-2 ring-accent" : "bg-surface",
                beat < 2 && "opacity-0",
              )}
            >
              <Icon icon={Location01Icon} size={17} className="text-muted" />
              {a}, Bristol
            </li>
          );
        })}
      </ul>
      <p className={cn("mt-3 flex items-center gap-2 px-1 text-[13px] text-good transition-opacity duration-300", beat < 3 && "opacity-0")}>
        <Icon icon={CheckmarkCircle02Icon} size={16} /> Verified address
      </p>
    </>
  );
}

/* ---------- 3. New tenancy: rent ---------- */

const CHARGES = [
  ["1 Nov 2026", "1 Nov 2026 to 30 Nov 2026"],
  ["1 Dec 2026", "1 Dec 2026 to 31 Dec 2026"],
  ["1 Jan 2027", "1 Jan 2027 to 31 Jan 2027"],
];

function Rent({ beat }: { beat: number }) {
  return (
    <>
      <Head title="Rent" text="Set the rent and when it falls due. The first three charges preview below." />
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <Field label="Rent amount">
          <Input focus={beat === 1}>
            <span className="text-muted">£ </span>
            <span className="tabular">
              <Typed text="1,250.00" state={typed(beat, 1)} ms={900} />
            </span>
          </Input>
        </Field>
        <Field label="How often">
          <Input icon={ArrowDown01Icon}>Monthly</Input>
        </Field>
      </div>
      <div className="panel mt-4 bg-surface p-3">
        <p className="px-1 text-[13px] text-muted">First three charges</p>
        {beat < 2 ? (
          <p className="mt-2 h-[194px] px-1 text-[13.5px] leading-snug text-ink-2">Enter the rent to see the schedule. Rent is never due before the period it covers.</p>
        ) : (
          <ol className="mt-2 flex flex-col gap-1">
            {CHARGES.map(([due, covers]) => (
              <li key={due} className="flex h-[62px] items-center justify-between gap-3 rounded-tile bg-white px-3.5">
                <span className="text-[13.5px]">
                  Due {due}
                  <span className="block text-[12px] whitespace-nowrap text-muted">Covers {covers}</span>
                </span>
                <span className="text-[14px] tabular">£1,250.00</span>
              </li>
            ))}
          </ol>
        )}
      </div>
    </>
  );
}

/* ---------- 4. New tenancy: tenants, then the confirmation ---------- */

function Tenants({ beat }: { beat: number }) {
  return (
    <>
      <Head title="Tenants" text="Up to ten people. The lead tenant is the default contact." />
      <div className="mt-4 grid grid-cols-2 gap-2.5">
        <Field label="First name">
          <Input>Owen</Input>
        </Field>
        <Field label="Last name">
          <Input>Price</Input>
        </Field>
      </div>
      <div className="mt-2.5">
        <Field label="Email">
          <Input focus={beat === 1}>
            <Typed text="owen.price@outlook.com" state={typed(beat, 1)} ms={1400} />
          </Input>
        </Field>
        <p className="mt-1.5 px-1 text-[12.5px] leading-snug text-muted">Their invitation goes here. They accept with this address.</p>
      </div>
      <div className={cn("mt-4 flex items-start gap-2.5 rounded-tile bg-good-soft px-3.5 py-3 text-good transition-opacity duration-300", beat < 3 && "opacity-0")}>
        <Icon icon={CheckmarkCircle02Icon} size={18} className="mt-px" />
        <p className="text-[13px] leading-snug">
          <span className="block text-[13.5px]">Tenancy created</span>
          We have emailed 1 invitation. The rent schedule and the tenancy&rsquo;s conversation are ready.
        </p>
      </div>
    </>
  );
}

export const SCREENS = [
  { title: "Name your workspace", text: "Your name or your trading name. Tenants see it on receipts and messages.", Screen: Workspace },
  { title: "Find the home by postcode", text: "A verified address in a few taps. Photos, units and documents can come later.", Screen: Address },
  { title: "Set the rent", text: "Pick when it falls due and see the first three charges before you save.", Screen: Rent },
  { title: "Invite your tenants", text: "They accept from the email and set up how they pay. Free for them, always.", Screen: Tenants },
];

/**
 * The part of each screen that says the most (in drawn pixels): the name, the address list, the charges, the invite.
 * All the same height, so close-ups side by side line up.
 */
export const CROPS = [
  { y: 90, h: 230 },
  { y: 76, h: 230 },
  { y: 176, h: 230 },
  { y: 146, h: 230 },
];

/** The app's page surface every screen is drawn on. */
const FRAME = "h-full bg-lift p-5 text-ink";

/** A close-up of one part of a screen, scaled to the width of its box. `fade` softens its foot. */
export function Crop({ i, className, fade, children }: { i: number; className?: string; fade?: boolean; children: ReactNode }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState<number | null>(null);
  useLayoutEffect(() => {
    const el = box.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setScale(e.contentRect.width / DW));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const { y, h } = CROPS[i];
  return (
    <div
      ref={box}
      className={cn("relative overflow-hidden rounded-[10px] shadow-[0_0_0_1px_rgb(30_28_40/0.06),0_1px_2px_rgb(30_28_40/0.08)]", fade && "[mask-image:linear-gradient(to_bottom,#000_78%,transparent)]", className)}
      style={{ aspectRatio: `${DW} / ${h}` }}
    >
      <div
        aria-hidden
        inert
        className="pointer-events-none absolute top-0 left-0 origin-top-left select-none"
        style={{ width: DW, height: DH, transform: `scale(${scale ?? 0.8}) translateY(${-y}px)` }}
      >
        <div className={FRAME}>{children}</div>
      </div>
    </div>
  );
}
