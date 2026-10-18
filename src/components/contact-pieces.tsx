"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowUpRight01Icon,
  Call02Icon,
  CheckmarkCircle02Icon,
  CustomerService01Icon,
  InformationCircleIcon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import { Choice } from "./choice";
import { Icon } from "./icon";
import { Column, SectionHead } from "./ui";
import { cn } from "@/lib/utils";

/*
 * The Contact page's two pieces.
 * - The stage under the hero: the form (it posts to /api/contact) with what to expect beside it. Every word beside the
 *   form is true today: the first-reply targets (webapp features/support/rules.ts), that DirectHomes is not a letting
 *   agent, and the safety numbers the app's own repair report gives (features/repairs/rules.ts). No email address,
 *   phone line or status page is shown, because none exists yet.
 * - Support inside the app: the landlord's "Contact support" page and the tenant's Support page, in the app's words
 *   (webapp support/new and features/support). A picture of the app, driven only by the switch beside it.
 */

/* ---------- The form ---------- */

type Who = "landlord" | "tenant" | "other";
type Field = "name" | "email" | "who" | "topic" | "message";
type Values = Record<Field, string>;

const WHO = [
  { value: "landlord", label: "Landlord" },
  { value: "tenant", label: "Tenant" },
  { value: "other", label: "Something else" },
] as const;

/** What the topic field suggests for each kind of person: examples only, nothing is pre-filled. */
const TOPIC_EXAMPLE: Record<Who, string> = {
  landlord: "For example: moving six homes over from a spreadsheet",
  tenant: "For example: setting up auto-pay",
  other: "For example: working with DirectHomes",
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_MESSAGE = 5000;

/** The same rules as the route (app/api/contact/route.ts), so most mistakes are caught before anything is sent. */
function check(v: Values): Partial<Record<Field, string>> {
  const e: Partial<Record<Field, string>> = {};
  const name = v.name.trim();
  const topic = v.topic.trim();
  const message = v.message.trim();
  if (name.length < 2) e.name = "Tell us your name.";
  if (!EMAIL.test(v.email.trim())) e.email = v.email.trim() ? "That email doesn't look right." : "We need an email to reply to.";
  if (topic.length < 3) e.topic = "A few words on what it's about.";
  if (message.length > MAX_MESSAGE) e.message = "Keep it under 5,000 characters.";
  else if (message.length < 10) e.message = "Tell us a little more, at least a sentence.";
  return e;
}

const fieldBase =
  "w-full rounded-[6px] bg-surface px-4 text-[15.5px] text-ink outline-none ring-inset transition-[box-shadow,background-color] duration-200 placeholder:text-faint focus:ring-2 focus:ring-accent aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-bad";

function FormField({ id, label, error, hint, children, className }: { id: string; label: string; error?: string; hint?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="px-1 text-[14px] text-ink-2">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-error`} className="px-1 text-[13px] leading-snug text-bad">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="px-1 text-[13px] leading-snug text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function ContactForm() {
  const id = useId();
  const [values, setValues] = useState<Values>({ name: "", email: "", who: "landlord", topic: "", message: "" });
  const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
  const [tried, setTried] = useState(false);
  const [serverErrors, setServerErrors] = useState<Partial<Record<Field, string>>>({});
  const [problem, setProblem] = useState<string | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [height, setHeight] = useState<number | null>(null);
  const box = useRef<HTMLDivElement>(null);
  const done = useRef<HTMLHeadingElement>(null);

  const local = check(values);
  const errors = Object.fromEntries((Object.keys(values) as Field[]).map((f) => [f, serverErrors[f] ?? local[f]])) as Partial<Record<Field, string>>;
  const shown = (f: Field) => ((tried || touched[f]) && errors[f]) || undefined;
  const set = (f: Field) => (v: string) => {
    setValues((s) => ({ ...s, [f]: v }));
    setServerErrors((s) => {
      const next = { ...s };
      delete next[f];
      return next;
    });
  };
  const who = values.who as Who;
  const fid = (f: Field) => `${id}-${f}`;
  const described = (f: Field, hint?: boolean) => (shown(f) ? `${fid(f)}-error` : hint ? `${fid(f)}-hint` : undefined);

  useEffect(() => {
    if (state === "done") done.current?.focus();
  }, [state]);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setTried(true);
    setProblem(null);
    const first = (["name", "email", "topic", "message"] as const).find((f) => local[f]);
    if (first) {
      document.getElementById(fid(first))?.focus();
      return;
    }
    setState("sending");
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const data = (await res.json().catch(() => ({}))) as { error?: string; errors?: Partial<Record<Field, string>> };
      if (!res.ok) {
        if (data.errors) setServerErrors(data.errors);
        throw new Error(data.error ?? "Something went wrong. Try again.");
      }
      // The thanks takes the form's place at the form's size, so nothing around it moves.
      setHeight(box.current?.offsetHeight ?? null);
      setState("done");
    } catch (err) {
      setProblem(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setState("idle");
    }
  }

  function again() {
    setValues({ name: values.name, email: values.email, who: values.who, topic: "", message: "" });
    setTouched({});
    setTried(false);
    setState("idle");
  }

  if (state === "done") {
    const first = values.name.trim().split(/\s+/)[0];
    return (
      <div role="status" style={height ? { minHeight: height } : undefined} className="panel flex flex-col items-start justify-center p-6 sm:p-10">
        <Icon icon={CheckmarkCircle02Icon} size={36} strokeWidth={1.3} className="text-good" />
        <h3 ref={done} tabIndex={-1} className="mt-6 text-[clamp(26px,2.6vw,34px)] leading-[1.1] tracking-[-0.02em] text-balance text-ink outline-none">
          Thanks, {first}. It&rsquo;s with us.
        </h3>
        <p className="mt-3 max-w-[30rem] text-[16px] leading-[1.55] text-ink-2">
          We aim to reply to <span className="text-ink">{values.email.trim()}</span> within 1 working day.
        </p>
        <button type="button" onClick={again} className="mt-8 inline-flex h-11 items-center rounded-control bg-surface px-5 text-[15px] text-ink transition-colors hover:bg-sunken">
          Send another message
        </button>
      </div>
    );
  }

  const count = values.message.trim().length;
  return (
    <div ref={box} className="panel p-6 sm:p-10">
      <form onSubmit={submit} noValidate aria-describedby={problem ? `${id}-problem` : undefined} className="flex flex-col gap-6">
        <div className="grid gap-6 sm:grid-cols-2 sm:gap-4">
          <FormField id={fid("name")} label="Your name" error={shown("name")}>
            <input
              id={fid("name")}
              autoComplete="name"
              maxLength={120}
              value={values.name}
              onChange={(e) => set("name")(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              aria-invalid={shown("name") ? true : undefined}
              aria-describedby={described("name")}
              className={cn(fieldBase, "h-12")}
            />
          </FormField>
          <FormField id={fid("email")} label="Email" error={shown("email")}>
            <input
              id={fid("email")}
              type="email"
              inputMode="email"
              autoComplete="email"
              maxLength={254}
              value={values.email}
              onChange={(e) => set("email")(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              aria-invalid={shown("email") ? true : undefined}
              aria-describedby={described("email")}
              className={cn(fieldBase, "h-12")}
            />
          </FormField>
        </div>

        <div className="flex flex-col gap-1.5">
          <p className="px-1 text-[14px] text-ink-2" id={`${id}-who-label`}>
            Who you are
          </p>
          <Choice label="Who you are" options={WHO} value={who} onChange={set("who")} className="w-full sm:w-auto sm:self-start" />
          {who === "tenant" ? (
            <p className="mt-2 flex gap-2.5 rounded-[6px] bg-surface px-4 py-3 text-[14px] leading-snug text-ink-2">
              <Icon icon={Wrench01Icon} size={18} className="mt-px text-ink" />
              <span>
                <span className="text-ink">Something needs fixing?</span> Report it in your DirectHomes app, under Repairs, so it reaches your landlord. We can&rsquo;t arrange repairs.
              </span>
            </p>
          ) : null}
        </div>

        <FormField id={fid("topic")} label="What it's about" error={shown("topic")} hint={TOPIC_EXAMPLE[who]}>
          <input
            id={fid("topic")}
            maxLength={140}
            value={values.topic}
            onChange={(e) => set("topic")(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, topic: true }))}
            aria-invalid={shown("topic") ? true : undefined}
            aria-describedby={described("topic", true)}
            className={cn(fieldBase, "h-12")}
          />
        </FormField>

        <FormField
          id={fid("message")}
          label="Your message"
          error={shown("message")}
          hint={
            <span className="flex justify-between gap-4">
              <span>What you need, and anything that helps us answer.</span>
              <span className={cn("whitespace-nowrap tabular", count > MAX_MESSAGE && "text-bad")}>{count.toLocaleString("en-GB")} / 5,000</span>
            </span>
          }
        >
          <textarea
            id={fid("message")}
            rows={6}
            value={values.message}
            onChange={(e) => set("message")(e.target.value)}
            onBlur={() => setTouched((t) => ({ ...t, message: true }))}
            aria-invalid={shown("message") ? true : undefined}
            aria-describedby={described("message", true)}
            className={cn(fieldBase, "min-h-40 resize-y py-3 leading-relaxed")}
          />
        </FormField>

        <div className="flex flex-col-reverse items-stretch gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
          <p id={`${id}-problem`} role="alert" className="text-[14px] leading-snug text-bad">
            {problem}
          </p>
          <button
            type="submit"
            disabled={state === "sending"}
            className="group inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-control bg-ink pr-4 pl-5 text-[15.5px] text-white transition-colors hover:bg-ink-hover disabled:cursor-wait disabled:bg-ink-hover"
          >
            {state === "sending" ? "Sending…" : "Send message"}
            <Icon icon={ArrowUpRight01Icon} size={18} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </form>
    </div>
  );
}

/** What to expect, beside the form. True today, and nothing more. */
function Expectations() {
  return (
    <aside aria-label="What to expect" className="brand-wash flex flex-col gap-10 rounded-panel p-6 sm:p-10">
      <div>
        <p className="text-[clamp(30px,3vw,40px)] leading-[1.05] tracking-[-0.02em] text-ink">1 working day</p>
        <p className="mt-3 max-w-[24rem] text-[15.5px] leading-[1.55] text-ink-2">For a first reply, whoever you are. Landlords on Professional hear back within 4 working hours.</p>
      </div>

      <div>
        <p className="text-[17px] leading-snug text-ink">Not a letting agent</p>
        <p className="mt-2 max-w-[24rem] text-[15.5px] leading-[1.55] text-ink-2">
          DirectHomes is software, so we can&rsquo;t fix a home or settle a dispute. Tenants with a repair should report it in their app, where their landlord sees it.
        </p>
      </div>

      {/* The same advice and numbers the app gives a tenant reporting a repair, as real tap-to-call links. */}
      <div className="mt-auto flex flex-col gap-4 rounded-[8px] bg-bad-soft p-5 text-bad sm:p-6">
        <div>
          <p className="text-[16px] leading-snug">Smell gas? Leave the property, then call the National Gas Emergency Service.</p>
          <a href="tel:08001119999" className="mt-2 inline-flex items-center gap-2 text-[24px] leading-none tracking-[-0.01em] text-bad tabular transition-colors hover:text-urgent">
            <Icon icon={Call02Icon} size={20} />
            0800 111 999
          </a>
        </div>
        <div>
          <p className="text-[16px] leading-snug">Anyone in immediate danger? Call the emergency services.</p>
          <a href="tel:999" className="mt-2 inline-flex items-center gap-2 text-[24px] leading-none tracking-[-0.01em] text-bad tabular transition-colors hover:text-urgent">
            <Icon icon={Call02Icon} size={20} />
            999
          </a>
        </div>
      </div>
    </aside>
  );
}

/** The stage that rises out of the hero: the form, and what to expect beside it. */
export function ContactStage() {
  return (
    <div id="write" className="rounded-[12px] bg-canvas p-2 shadow-[0_1px_2px_rgb(20_20_20/0.1),0_24px_40px_-28px_rgb(30_28_40/0.5)]">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-2 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <ContactForm />
        <Expectations />
      </div>
    </div>
  );
}

/* ---------- Support inside the app ---------- */

type Side = "standard" | "professional" | "tenant";

const SIDES = [
  { value: "standard", label: "Landlord" },
  { value: "professional", label: "Professional" },
  { value: "tenant", label: "Tenant" },
] as const;

const CATEGORIES = ["Account", "Billing", "Rent collection", "Something is not working", "Feature request", "Other"];

function ShotField({ label, optional, hint, children }: { label: string; optional?: boolean; hint?: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="flex items-baseline justify-between gap-2 px-1 text-[13px] text-ink-2">
        {label}
        {optional ? <span className="text-[12px] text-faint">Optional</span> : null}
      </p>
      {children}
      {hint ? <p className="px-1 text-[12.5px] leading-snug text-muted">{hint}</p> : null}
    </div>
  );
}

function ShotHeader({ title, description, action }: { title: string; description: string; action: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-4 px-3 pt-3 pb-5 sm:px-4">
      <div className="min-w-0">
        <p className="text-[28px] leading-[1.08] tracking-[-0.025em] sm:text-[34px]">{title}</p>
        <p className="mt-2 text-[14px] leading-snug text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}

/** The landlord's "Contact support" page (webapp (landlord)/support/new), with a ticket part-written. */
function LandlordSupport({ professional }: { professional: boolean }) {
  return (
    <>
      <ShotHeader
        title="Contact support"
        description={professional ? "On Professional we aim to reply within 4 working hours." : "We aim to reply within 1 working day."}
        action={
          <span className="inline-flex h-11 items-center gap-2 rounded-control bg-surface px-5 text-[14px] text-ink">
            <Icon icon={ArrowLeft01Icon} size={18} />
            Support
          </span>
        }
      />
      <div className="panel flex flex-col gap-5 p-5 sm:p-6">
        <div className="flex flex-col gap-1.5">
          <p className="mb-1.5 px-1 text-[13px] text-ink-2">What is it about?</p>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <span key={c} className={cn("inline-flex h-11 items-center rounded-control px-5 text-[14px]", c === "Rent collection" ? "bg-ink text-white" : "bg-surface text-ink-2")}>
                {c}
              </span>
            ))}
          </div>
        </div>
        <ShotField label="Title" hint="A few words, for example: Tenant cannot see the Pay now button">
          <span className="flex h-12 items-center rounded-[6px] bg-surface px-4 text-[15px] text-ink">Grace can&rsquo;t see the Pay now button</span>
        </ShotField>
        <ShotField label="Property" optional hint="If it is about one property, choose it so we can look straight away.">
          <span className="flex h-12 items-center justify-between rounded-[6px] bg-surface px-4 text-[15px] text-ink">
            8 Cotham Vale
            <Icon icon={ArrowDown01Icon} size={18} className="text-muted" />
          </span>
        </ShotField>
        <ShotField label="What happened?" hint="What you were trying to do, what you expected and what you saw instead.">
          <span className="block min-h-28 rounded-[6px] bg-surface px-4 py-3 text-[15px] leading-relaxed text-ink">
            Grace says the Pay now button is missing from her Rent page this month. Auto-pay was switched off last week.
          </span>
        </ShotField>
        <div className="flex flex-col-reverse items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[12.5px] leading-snug text-muted">We attach the page you came from, your browser and app version. Never passwords or payment details.</p>
          <span className="inline-flex h-[52px] shrink-0 items-center rounded-[6px] bg-ink px-6 text-[15px] text-white">Send to support</span>
        </div>
      </div>
    </>
  );
}

/** The tenant's Support page (webapp tenant/support): help with the app only, and where everything else goes. */
function TenantSupport() {
  return (
    <>
      <ShotHeader
        title="Support"
        description="Help with using DirectHomes: paying rent, your account and the app."
        action={
          <span className="inline-flex h-[52px] items-center gap-2 rounded-[6px] bg-ink px-6 text-[15px] text-white">
            <Icon icon={CustomerService01Icon} size={18} />
            Contact support
          </span>
        }
      />
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-3 rounded-tile bg-surface px-4 py-3.5 text-ink-2 sm:flex-row sm:items-center">
          <div className="flex min-w-0 flex-1 items-start gap-3">
            <Icon icon={InformationCircleIcon} size={19} className="mt-0.5" />
            <div className="min-w-0 text-[14px] leading-snug">
              <p className="font-medium">Questions about your home, rent amount or tenancy?</p>
              <p className="mt-0.5 opacity-90">
                Ask your landlord in Messages. DirectHomes is not a letting agent and cannot settle disputes between landlords and tenants. For free, independent advice contact <span className="underline underline-offset-2">Shelter</span> or{" "}
                <span className="underline underline-offset-2">Citizens Advice</span>.
              </p>
            </div>
          </div>
          <span className="inline-flex h-9 shrink-0 items-center self-start rounded-[4px] bg-ink px-3.5 text-[13px] text-white sm:ml-auto sm:self-center">Message your landlord</span>
        </div>
        <div className="panel p-5 sm:p-6">
          <p className="text-[18px] leading-tight">Your tickets</p>
          <div className="flex flex-col items-center px-4 py-10 text-center">
            <Icon icon={CustomerService01Icon} size={26} className="text-muted" />
            <p className="mt-4 text-[16px] text-ink">No tickets yet</p>
            <p className="mt-1.5 max-w-[26rem] text-[14px] leading-snug text-muted">If something is not working, or you cannot find an answer, send us a ticket. You can attach screenshots.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export function SectionInAppSupport() {
  const [side, setSide] = useState<Side>("standard");
  const views: { key: Side; node: ReactNode }[] = [
    { key: "standard", node: <LandlordSupport professional={false} /> },
    { key: "professional", node: <LandlordSupport professional /> },
    { key: "tenant", node: <TenantSupport /> },
  ];
  return (
    <section aria-labelledby="in-app-title" className="pt-24 sm:pt-32">
      <Column>
        <SectionHead
          id="in-app-title"
          title={
            <>
              Already signed in?
              <br />
              Ask from inside the app.
            </>
          }
          text="Support sits in the app's own menu. A ticket carries the page you were on, so we can look straight away, and every reply lands there and in your email."
        />

        <div className="brand-wash brand-wash-3 mt-10 rounded-panel p-2 sm:p-8 lg:mt-14 lg:p-12">
          <div className="flex flex-col gap-3 px-3 pt-4 pb-6 sm:flex-row sm:items-center sm:gap-5 sm:px-0 sm:pt-0 sm:pb-8">
            <p className="text-[15px] text-ink">Signed in as</p>
            <Choice label="Signed in as" options={SIDES} value={side} onChange={setSide} className="w-full sm:w-auto" />
          </div>

          {/* The app's page: a picture, so it can't be clicked. All three are drawn in one cell so the frame keeps the tallest one's height. */}
          <div aria-live="polite" className="rounded-[10px] bg-canvas p-2 text-ink shadow-[0_1px_2px_rgb(20_20_20/0.1),0_24px_40px_-28px_rgb(30_28_40/0.5)]">
            <div className="pointer-events-none grid select-none">
              {views.map((v) => (
                <div key={v.key} inert={v.key !== side} aria-hidden={v.key !== side} className={cn("[grid-area:1/1] transition-[opacity,visibility] duration-300", v.key === side ? "opacity-100" : "invisible opacity-0")}>
                  {v.node}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Column>
    </section>
  );
}
