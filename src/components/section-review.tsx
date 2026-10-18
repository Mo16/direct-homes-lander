"use client";

import { Fragment, useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from "motion/react";
import { Column } from "./ui";

/*
 * A landlord's word, between the tenants and the prices (the same piece as the Portsmouth Muslim Academy home page).
 * The quote is read in by scrolling: everything starts in a quiet grey, and the first and last sentences fill to ink
 * word by word as it rises through the screen. The middle sentence stays grey. Readable at every point (the grey
 * clears 3:1 on the canvas at this size); with reduced motion it is simply inked.
 *
 * DRAFT: DirectHomes has no real reviews yet. Swap this for a real landlord's words and name before launch.
 */
const REVIEW = {
  name: "A landlord on the early access list",
  where: "four homes in Leeds",
  text: [
    "I used to spend Sunday nights chasing rent across three spreadsheets.",
    "Now my tenants pay in the app and every receipt files itself.",
    "Tax time went from a week of dread to one download.",
  ],
} as const;

const MUTE = "#7f7f84";
const INK = "#141414";

/* One word of the quote, inking in over its own slice of the scroll. */
function Word({ word, i, n, progress }: { word: string; i: number; n: number; progress: MotionValue<number> }) {
  const from = i / n;
  const to = Math.min(1, (i + 1.6) / n);
  const color = useTransform(progress, [from, to], [MUTE, INK]);
  return <motion.span style={{ color }}>{word}</motion.span>;
}

export function SectionReview() {
  const ref = useRef<HTMLParagraphElement>(null);
  const still = useReducedMotion();
  // Switched to "inked" for reduced motion after mount, not during render, so the server's markup and the first
  // client render agree.
  const calm = useMotionValue(0);
  useEffect(() => calm.set(still ? 1 : 0), [calm, still]);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });
  const progress = useTransform(() => (calm.get() ? 1 : scrollYProgress.get()));

  const first = REVIEW.text[0].split(" ");
  const last = REVIEW.text[2].split(" ");
  const n = first.length + last.length;

  const inked = (words: string[], offset: number) =>
    words.map((w, j) => (
      <Fragment key={j}>
        {j > 0 && " "}
        <Word word={w} i={offset + j} n={n} progress={progress} />
      </Fragment>
    ));

  return (
    <section aria-label="What landlords say" className="pt-36 pb-12 sm:pt-52 sm:pb-20">
      <Column>
        <figure className="text-center">
          <blockquote className="mx-auto max-w-216 px-2 text-[clamp(24px,2.6vw,34px)] leading-[1.24] tracking-[-0.022em] text-balance">
            <p ref={ref}>
              {inked(first, 0)} <span style={{ color: MUTE }}>{REVIEW.text[1]}</span> {inked(last, first.length)}
            </p>
          </blockquote>
          <figcaption className="mt-8 text-[15px] text-balance text-ink-2">
            <span className="text-ink">{REVIEW.name}</span>, {REVIEW.where}
          </figcaption>
        </figure>
      </Column>
    </section>
  );
}
