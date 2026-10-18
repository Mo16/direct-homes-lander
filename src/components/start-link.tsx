"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ArrowUpRight01Icon, Cancel01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "./icon";
import { WaitlistForm } from "./waitlist-form";
import { LAUNCHED, SIGN_UP, START_LABEL } from "@/lib/links";

/**
 * Every "way in" button on the site. After launch it is a plain link to the app's sign-up; before it (LAUNCHED in
 * lib/links.ts) the same button opens the waitlist form in a dialog, so pages without the hero's form still have one.
 */
export function StartLink({ className, arrow, children }: { className: string; /** The up-right arrow's size, or none. */ arrow?: number; children?: ReactNode }) {
  const [open, setOpen] = useState(false);
  const inside = (
    <>
      {children ?? START_LABEL}
      {arrow ? <Icon icon={ArrowUpRight01Icon} size={arrow} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /> : null}
    </>
  );

  if (LAUNCHED) {
    return (
      <a href={SIGN_UP} className={className}>
        {inside}
      </a>
    );
  }
  return (
    <>
      <button type="button" aria-haspopup="dialog" onClick={() => setOpen(true)} className={className}>
        {inside}
      </button>
      {open ? <WaitlistDialog onClose={() => setOpen(false)} /> : null}
    </>
  );
}

/** The app's own dialog look (tour-kit.tsx Dialog): the page dimmed behind, a canvas panel, a title, one line, the form. */
function WaitlistDialog({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const still = useReducedMotion();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (!d.open) d.showModal();
    // A native modal dialog doesn't stop the page scrolling under it.
    const root = document.documentElement;
    const before = root.style.overflow;
    root.style.overflow = "hidden";
    // No d.close() here: it fires "close", which would unmount this the moment it opens (effects run twice in dev).
    // Unmounting removes the element, and that takes it off the top layer anyway.
    return () => {
      root.style.overflow = before;
    };
  }, []);

  return (
    <dialog
      ref={ref}
      aria-labelledby="waitlist-dialog-title"
      onClose={onClose}
      // A click on the dimmed page (the dialog box itself, outside the panel) closes it.
      onClick={(e) => e.target === e.currentTarget && onClose()}
      className="m-auto max-h-none max-w-none bg-transparent p-4 backdrop:bg-ink/45 backdrop:backdrop-blur-[2px]"
    >
      <motion.div
        initial={still ? false : { y: 10, scale: 0.985 }}
        animate={{ y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative w-[min(480px,calc(100vw-32px))] rounded-panel bg-canvas p-6 shadow-float sm:p-7"
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-control text-ink transition-colors hover:bg-ink/[0.06]"
        >
          <Icon icon={Cancel01Icon} size={19} />
        </button>
        <h2 id="waitlist-dialog-title" className="pr-10 text-[26px] leading-tight tracking-[-0.02em] text-ink">
          Join the waitlist
        </h2>
        <p className="mt-2 max-w-[24rem] text-[15.5px] leading-[1.5] text-ink-2">DirectHomes isn&rsquo;t open yet. Leave your email and we&rsquo;ll write the day it opens.</p>
        <WaitlistForm tone="light" autoFocus className="mt-6" />
      </motion.div>
    </dialog>
  );
}
