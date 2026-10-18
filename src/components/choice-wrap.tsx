"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * The site's Choice (choice.tsx), for five or six options: the same tray and sliding ink thumb, but on a phone the
 * options wrap onto a second row and grow to fill it, instead of squeezing into one. A radio group: arrow keys move.
 */
export function ChoiceWrap<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  const id = useId();
  const still = useReducedMotion();
  const move = (dir: number) => {
    const i = options.findIndex((o) => o.value === value);
    const next = options[(i + dir + options.length) % options.length];
    onChange(next.value);
    document.getElementById(`${id}-${next.value}`)?.focus();
  };
  return (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={(e) => {
        const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
        if (!dir) return;
        e.preventDefault();
        move(dir);
      }}
      className={cn("flex w-full flex-wrap gap-1 rounded-[8px] bg-panel-solid p-1 sm:inline-flex sm:w-auto sm:flex-nowrap", className)}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            id={`${id}-${o.value}`}
            type="button"
            role="radio"
            aria-checked={on}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(o.value)}
            className={cn("relative h-10 flex-auto rounded-control px-3.5 text-[14px] whitespace-nowrap transition-colors duration-300 sm:flex-none sm:px-4 sm:text-[14.5px]", on ? "text-white" : "text-ink-2 hover:text-ink")}
          >
            {on ? <motion.span layoutId={`${id}-thumb`} transition={still ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }} className="absolute inset-0 rounded-control bg-ink" /> : null}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
