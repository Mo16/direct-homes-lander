"use client";

import Image from "next/image";
import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Column } from "./ui";
import { StartLink } from "./start-link";
import { cn } from "@/lib/utils";

/*
 * The first screen of every page after Home: the same world as the home hero, a UK sky over a terrace, as an island
 * inset from the page. The page's name sits in the clear sky with one line of what it does across from it, and, when
 * the page has one, the real part of the app it is about rises out of the photo's foot and carries on past it while the
 * photo fades into the page around it. Without a stage the island is a closed panel. The photo lags the scroll a
 * little, so the layers part. Nothing waits on motion to appear.
 */

const PHOTOS = {
  /** The terrace along the foot, sky above it: the long row of the two-sides section. */
  terrace: { src: "/hero/terrace-row.jpg", position: "object-[12%_100%]", fill: "bg-[#5d8fe0]" },
  /** The same photo turned to its clouds and the tree on the right. */
  clouds: { src: "/hero/terrace-row.jpg", position: "object-[100%_60%]", fill: "bg-[#5d8fe0]" },
  /** The footer's open sky, deeper blue. */
  sky: { src: "/hero/footer-sky.jpg", position: "object-[70%_50%]", fill: "bg-[#46679f]" },
} as const;

export type HeroPhoto = keyof typeof PHOTOS;

export function PageHero({
  title,
  lead,
  photo = "terrace",
  action = true,
  children,
  caption,
}: {
  title: ReactNode;
  lead: ReactNode;
  photo?: HeroPhoto;
  /** One way in, beside the lead: Start free (or Join the waitlist before launch) by default, or your own button, or none. */
  action?: boolean | ReactNode;
  /** The page's real app part, rising out of the photo's foot. */
  children?: ReactNode;
  /** Words for screen readers saying what the stage shows. */
  caption?: string;
}) {
  const island = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: island, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], still ? ["0%", "0%"] : ["0%", "12%"]);
  const p = PHOTOS[photo];
  const staged = Boolean(children);

  return (
    <header className="relative isolate p-2 sm:p-3">
      <div
        ref={island}
        className={cn(
          "absolute inset-x-2 top-2 -z-10 overflow-hidden rounded-panel sm:inset-x-3 sm:top-3",
          p.fill,
          staged
            ? // Its last 260px fade into the page, so the stage carries on past it with no hard line beside it.
              "h-[clamp(640px,88svh,940px)] [mask-image:linear-gradient(to_bottom,#000_calc(100%-260px),rgb(0_0_0/0.6)_calc(100%-150px),rgb(0_0_0/0.2)_calc(100%-70px),transparent)]"
            : "bottom-0",
        )}
      >
        <motion.div style={{ y }} className="absolute inset-x-0 -top-[4%] h-[116%]">
          <Image src={p.src} alt="" fill priority sizes="100vw" className={cn("object-cover", p.position)} />
        </motion.div>
        {/* A graduated filter over the sky only, so white type clears it; it is gone well before the stone. */}
        <span aria-hidden className="absolute inset-x-0 top-0 h-[55%] bg-gradient-to-b from-[rgb(22_38_92/0.34)] via-[rgb(22_38_92/0.14)] to-[rgb(22_38_92/0)]" />
      </div>

      {/* Room for the fixed bar (site-nav.tsx). */}
      <div aria-hidden className="h-[76px]" />

      <Column className={cn("pt-[clamp(36px,7vh,88px)]", !staged && "pb-[clamp(180px,30svh,300px)]")}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,25rem)] lg:items-end lg:gap-16">
          <h1 className="text-[clamp(38px,5.4vw,72px)] leading-[1.02] tracking-[-0.03em] text-balance text-white">{title}</h1>
          {/* The lead on a tray of the nav's pale frosted glass, so it reads over cloud as well as clear sky. */}
          <div className="rounded-[10px] bg-surface/80 p-5 shadow-[inset_0_1px_0_rgb(255_255_255/0.7)] backdrop-blur-xl backdrop-saturate-125 sm:p-6 lg:mb-1">
            <p className="max-w-[30rem] text-[clamp(16px,1.25vw,17.5px)] leading-[1.5] text-ink-2">{lead}</p>
            {action === true ? (
              <StartLink arrow={17} className="group mt-5 inline-flex h-11 items-center gap-2 rounded-control bg-ink pr-4 pl-5 text-[15px] text-white transition-colors hover:bg-ink-hover" />
            ) : action ? (
              <div className="mt-5">{action}</div>
            ) : null}
          </div>
        </div>
      </Column>

      {staged ? (
        <Column className="mt-[clamp(48px,9vh,104px)]">
          {children}
          {caption ? <p className="sr-only">{caption}</p> : null}
        </Column>
      ) : null}
    </header>
  );
}
