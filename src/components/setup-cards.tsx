"use client";

import type { KeyboardEvent, ReactNode } from "react";
import { Crop, SCREENS, useSteps } from "./setup-screens";
import { cn } from "@/lib/utils";

/*
 * The getting-started steps as four cards in a row (the user's pick from the card layouts). Each card has its words
 * and a close-up of the part of its screen that matters (Crop), pinned to the card's foot so the close-ups share a
 * line whatever the words above them. They play in turn while on screen; clicking a card plays that one.
 */

/** A step's card: lighter while its step plays, and a click (or Enter) plays it. */
function Card({ on, onPick, className, children }: { on: boolean; onPick: () => void; className?: string; children: ReactNode }) {
  const key = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onPick();
    }
  };
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={on}
      onClick={onPick}
      onKeyDown={key}
      className={cn("relative cursor-pointer overflow-hidden rounded-[10px] transition-colors duration-500 outline-offset-2", on ? "bg-white/75" : "bg-white/35 hover:bg-white/55", className)}
    >
      {children}
    </div>
  );
}

export function SetupCards() {
  const { ref, open, go, beat } = useSteps();
  return (
    <div ref={ref} className="brand-wash grid gap-2 rounded-panel p-2 sm:grid-cols-2 sm:p-3 xl:grid-cols-4">
      {SCREENS.map((st, i) => {
        const on = open === i;
        return (
          <Card key={st.title} on={on} onPick={() => go(i)} className="flex flex-col p-5">
            <span className={cn("block text-[17px] leading-none tabular transition-colors", on ? "text-ink" : "text-muted")}>{i + 1}</span>
            <p className="mt-5 text-[18px] leading-snug text-ink">{st.title}</p>
            <p className="mt-1.5 max-w-[24rem] text-[14.5px] leading-normal text-ink-2">{st.text}</p>
            <div className="mt-auto pt-6">
              <Crop i={i} fade>
                <st.Screen beat={beat(i)} />
              </Crop>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
