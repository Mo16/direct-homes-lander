"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

/**
 * A choice of a few options in one tray, the pricing switch's look: an ink thumb slides under the picked one. It is a
 * radio group, so arrow keys move between options.
 */
export function Choice<T extends string>({
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
      className={cn("inline-flex max-w-full gap-1 rounded-[8px] bg-panel-solid p-1", className)}
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
            className={cn("relative h-10 min-w-0 flex-1 rounded-control px-2.5 text-[14px] sm:flex-none sm:px-4 sm:text-[14.5px] whitespace-nowrap transition-colors duration-300", on ? "text-white" : "text-ink-2 hover:text-ink")}
          >
            {on ? <motion.span layoutId={`${id}-thumb`} transition={still ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 36 }} className="absolute inset-0 rounded-control bg-ink" /> : null}
            <span className="relative">{o.label}</span>
          </button>
        );
      })}
    </div>
  );
}
