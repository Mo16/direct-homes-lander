"use client";

import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { AppWindow, WindowSheets } from "./app-window";
import { WaitlistForm } from "./waitlist-form";
import { StartLink } from "./start-link";
import { LAUNCHED } from "@/lib/links";

/**
 * The first screen: an island of photograph inset from the page on every side, a Georgian terrace under a big sky.
 * As the page scrolls, the island opens out to fill the screen edge to edge.
 * The photo is the user's own (public/hero/terrace-townhouse.jpg): some sky trimmed off the top so the rooftops land
 * between the button and the app, the top darkened like a graduated filter so white text reads, and a blurred
 * continuation added under it that only shows in the strips beside the app. The headline and waitlist form sit in the clear sky; the
 * app's Home screen rises in front of the terrace, runs on past the island's foot, and the two fade into the page together. Scrolling lets the photograph lag behind the page, so the
 * three layers part. Nothing here waits on motion to appear.
 */
export function Hero() {
  const island = useRef<HTMLDivElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: island, offset: ["start start", "end start"] });
  const photoY = useTransform(scrollYProgress, [0, 1], still ? ["0%", "0%"] : ["0%", "14%"]);
  // The island opens out to the full screen over the first 280px of scroll: its margin and corners close to nothing.
  // Only the clip moves, so the photo never shifts under the text.
  const { scrollY } = useScroll();
  const inset = useTransform(scrollY, [0, 280], still ? [1, 1] : [1, 0]);
  const clip = useTransform(inset, (k) => `inset(calc(var(--gap) * ${k}) calc(var(--gap) * ${k}) 0 round calc(var(--radius-panel) * ${k}))`);
  const app = useRef<HTMLDivElement>(null);
  const words = useRef<HTMLDivElement>(null);
  const gap = useRef<HTMLDivElement>(null);

  // Where the photograph ends, measured from the top of the app: the fade is pinned there, so the app always dissolves
  // into the page below the photo rather than turning see-through over it. Offsets ignore the parallax transform.
  useLayoutEffect(() => {
    const photo = island.current;
    const el = app.current;
    const above = words.current;
    const space = gap.current;
    if (!photo || !el || !above || !space) return;
    // On a phone the shrunk desktop screen is short, so a full-screen photo left a wide empty band above it. Instead
    // the window sits a set gap under the form and the photo is cut to end just below it; the two fade out together.
    const phone = window.matchMedia("(max-width: 639px)");
    const pin = () => {
      const shot = el.firstElementChild as HTMLElement | null;
      if (phone.matches && shot) {
        const h = shot.offsetHeight;
        const lift = Math.round(Math.min(120, Math.max(80, window.innerHeight * 0.12)));
        const top = above.offsetTop + above.offsetHeight + lift;
        space.style.marginTop = `${lift}px`;
        photo.style.minHeight = "0px";
        photo.style.height = `${top + h + 20}px`;
        el.style.height = `${h + 8}px`;
        el.style.maskImage = `linear-gradient(to bottom, #000 ${Math.round(h * 0.3)}px, transparent ${h}px)`;
        photo.style.maskImage = `linear-gradient(to bottom, #000 calc(100% - ${h + 40}px), transparent calc(100% - 20px))`;
      } else {
        for (const s of [el.style, photo.style]) s.removeProperty("mask-image");
        for (const p of ["height", "min-height"]) photo.style.removeProperty(p);
        space.style.removeProperty("margin-top");
        el.style.removeProperty("height");
        el.style.setProperty("--foot", `${photo.offsetTop + photo.offsetHeight - el.offsetTop}px`);
      }
    };
    pin();
    const ro = new ResizeObserver(pin);
    ro.observe(photo);
    ro.observe(el);
    if (el.firstElementChild) ro.observe(el.firstElementChild);
    phone.addEventListener("change", pin);
    return () => {
      ro.disconnect();
      phone.removeEventListener("change", pin);
    };
  }, []);

  return (
    <header className="relative isolate p-2 sm:p-3">
      {/* The island of photograph: a fixed first-screen height, so the app below can carry on past its foot. Its last
          280px fade into the page, so it never ends in a hard line. */}
      <motion.div
        ref={island}
        style={{ clipPath: clip }}
        className="absolute inset-x-0 top-0 -z-10 h-svh max-h-[1188px] min-h-[708px] overflow-hidden bg-[#7f9ae0] [--gap:8px] [mask-image:linear-gradient(to_bottom,#000_calc(100%-280px),transparent_calc(100%-20px))] sm:max-h-[1192px] sm:min-h-[712px] sm:[--gap:12px]"
      >
        <motion.div style={{ y: photoY }} className="absolute inset-x-0 top-0 h-[112%]">
          <Image src="/hero/terrace-townhouse.jpg" alt="" fill priority sizes="max(100vw, 200vh)" className="object-cover object-[30%_0%] sm:object-[58%_0%]" />
        </motion.div>
      </motion.div>

      {/* Room for the bar, which is fixed over the page (site-nav.tsx). */}
      <div aria-hidden className="h-[76px]" />

      <div ref={words} className="mx-auto max-w-[1408px] px-5 pt-[clamp(28px,5vh,64px)] sm:px-10 lg:px-16">
        <h1 className="text-[clamp(36px,5.6vw,72px)] leading-[1.02] tracking-[-0.03em] text-white">
          Every home you let,
          <br />
          run from one place.
        </h1>
        <p className="mt-5 max-w-[30rem] text-[clamp(16px,1.35vw,18px)] leading-[1.45] text-balance text-white [text-shadow:0_1px_2px_rgb(24_34_80/0.45),0_0_14px_rgb(24_34_80/0.5)]">
          Rent, repairs, certificates and tenants for UK landlords. Free to start, and always free for your tenants.
        </p>
        {LAUNCHED ? (
          <StartLink arrow={18} className="group mt-8 inline-flex h-12 items-center gap-2 rounded-control bg-ink pr-4 pl-5 text-[15.5px] text-white transition-colors hover:bg-ink-hover" />
        ) : (
          <WaitlistForm className="mt-8" />
        )}
      </div>

      {/* The app fades with the photograph: it starts to go once the photo is nearly gone (its own fade runs from 60px
          above the photo's foot, --foot, to 170px below it), so it dissolves into the page rather than turning
          see-through over the picture. Below the fade it is cut off. The glass sheets peeking over its top edge sit just
          before it, in a box of no height that holds the gap above the app, because the app's mask would stop their
          blur from seeing the photograph. */}
      <div
        ref={gap}
        className="relative -z-[1] mx-auto mt-[clamp(56px,15vh,160px)] h-0 max-w-[1408px] px-5 sm:px-10 lg:px-16"
      >
        <WindowSheets />
      </div>
      <div
        ref={app}
        className="mx-auto h-[calc(var(--foot,360px)+180px)] max-w-[1408px] overflow-hidden px-5 [--foot:360px] [mask-image:linear-gradient(to_bottom,#000_calc(var(--foot)-60px),transparent_calc(var(--foot)+170px))] sm:px-10 lg:px-16"
      >
        <AppWindow />
        <p className="sr-only">The DirectHomes Home screen: a year of money in and out, ten things that need attention with one emergency repair, and every property with how it is let.</p>
      </div>
    </header>
  );
}
