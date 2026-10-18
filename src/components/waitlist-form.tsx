"use client";

import { useId, useState, type FormEvent } from "react";
import { ArrowUpRight01Icon, CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "./icon";
import { cn } from "@/lib/utils";

/**
 * The way in while the app is closed (hero, footer, and the dialog every other "Join the waitlist" opens): one
 * surface-toned bar holding the email field with the ink button set inside it. Once sent, the bar becomes the
 * confirmation at the same size, so nothing below it moves. "sky" sits on the photos; "light" on the dialog's canvas.
 */
export function WaitlistForm({ className, tone = "sky", autoFocus }: { className?: string; tone?: "sky" | "light"; autoFocus?: boolean }) {
  const id = useId();
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setState("sending");
    try {
      const res = await fetch("/api/waitlist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email, source: window.location.pathname }) });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error ?? "Something went wrong. Try again.");
      setState("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
      setState("idle");
    }
  }

  if (state === "done") {
    return (
      <p role="status" className={cn("flex min-h-14 w-full max-w-[460px] items-center gap-2.5 rounded-control bg-surface px-4 py-3 text-[15.5px] leading-snug text-ink", className)}>
        <Icon icon={CheckmarkCircle02Icon} size={20} className="text-good" />
        You&apos;re on the list. We&apos;ll email you when it opens.
      </p>
    );
  }

  return (
    <form onSubmit={submit} noValidate className={cn("w-full max-w-[460px]", className)}>
      <div className={cn("flex h-14 items-center gap-1.5 rounded-control bg-surface p-1.5 focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-white", tone === "light" && "focus-within:outline-ink")}>
        <label htmlFor={`${id}-email`} className="sr-only">
          Email address
        </label>
        <input
          id={`${id}-email`}
          autoFocus={autoFocus}
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="h-full min-w-0 flex-1 bg-transparent pl-2.5 text-[15.5px] text-ink outline-none placeholder:text-muted"
        />
        <button
          type="submit"
          disabled={state === "sending"}
          className="group flex h-full shrink-0 items-center gap-2 rounded-[4px] bg-ink pr-3.5 pl-4 text-[15px] whitespace-nowrap text-white transition-colors hover:bg-ink-hover disabled:cursor-wait disabled:bg-ink-hover"
        >
          {state === "sending" ? "Joining…" : "Join the waitlist"}
          <Icon icon={ArrowUpRight01Icon} size={17} className="hidden transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:block" />
        </button>
      </div>
      {error ? (
        <p
          id={`${id}-error`}
          role="alert"
          className={cn("mt-2.5 text-[14.5px]", tone === "light" ? "text-bad" : "text-white [text-shadow:0_1px_2px_rgb(24_34_80/0.45),0_0_14px_rgb(24_34_80/0.5)]")}
        >
          {error}
        </p>
      ) : null}
    </form>
  );
}
