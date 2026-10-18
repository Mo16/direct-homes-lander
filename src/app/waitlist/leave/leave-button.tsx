"use client";

import { useState } from "react";
import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";

/** The confirm step: posts to the leave route and turns into the confirmation at the same spot. */
export function LeaveButton({ email, token }: { email: string; token: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");
  const [error, setError] = useState<string | null>(null);

  async function leave() {
    setError(null);
    setState("sending");
    try {
      const res = await fetch(`/api/waitlist/leave?e=${encodeURIComponent(email)}&t=${encodeURIComponent(token)}`, { method: "POST" });
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
      <p role="status" className="mt-7 flex min-h-12 items-center gap-2.5 rounded-control bg-canvas px-4 py-3 text-[15.5px] text-ink">
        <Icon icon={CheckmarkCircle02Icon} size={20} className="text-good" />
        Done. You&apos;re off the list.
      </p>
    );
  }

  return (
    <div className="mt-7">
      <button
        type="button"
        onClick={leave}
        disabled={state === "sending"}
        className="flex h-12 items-center rounded-control bg-ink px-5 text-[15.5px] text-white transition-colors hover:bg-ink-hover disabled:cursor-wait disabled:bg-ink-hover"
      >
        {state === "sending" ? "Removing…" : "Leave the waitlist"}
      </button>
      {error ? (
        <p role="alert" className="mt-3 text-[14.5px] text-bad">
          {error}
        </p>
      ) : null}
    </div>
  );
}
