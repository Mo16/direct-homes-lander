"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import { Camera01Icon, Notification03Icon, Tap01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "./icon";
import { Column } from "./ui";

/*
 * Tenants, told to the landlord: what they gain when their tenants use the app. The section sits on the brand wash (the attention
 * card's sand into lavender, at the size of a section) and shows the tenant side as it really is: a hand holding the
 * Rent screen. The photo is cut at its foot and right side, so it sits flush on the wash's foot (the wash clips it)
 * with its right edge feathered out, and it settles down into place as the page scrolls. It only ever moves down, so
 * the cut foot never lifts into view.
 */

const POINTS = [
  { icon: Tap01Icon, title: "Rent that turns up", body: "Tenants set up Direct Debit or Pay by Bank themselves. Joint tenants each pay their own share." },
  { icon: Camera01Icon, title: "Repairs you can act on", body: "Every report comes with photos or video and access notes. The job closes when the tenant confirms the fix." },
  { icon: Notification03Icon, title: "Fewer calls and texts", body: "Tenants get in-app and email updates as things move. Every message, receipt and document is kept if you need it." },
];

export function SectionTenants() {
  const box = useRef<HTMLElement>(null);
  const still = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: box, offset: ["start end", "end start"] });
  // How much the phone drifts: switched off for reduced motion after mount, not during render, so the server's
  // markup and the first client render agree.
  const amount = useMotionValue(1);
  useEffect(() => amount.set(still ? 0 : 1), [amount, still]);
  const drift = useTransform([scrollYProgress, amount], ([p, k]: number[]) => k * 60 * (1 - Math.min(p * 2, 1)));

  return (
    <section ref={box} id="tenants" aria-labelledby="tenants-title" className="scroll-mt-[-72px] px-2 pt-24 sm:scroll-mt-[-104px] sm:px-3 sm:pt-32">
      <div className="brand-wash @container overflow-hidden rounded-panel">
        <Column className="grid gap-10 pt-10 sm:pt-12 lg:grid-cols-[minmax(0,1fr)_500px] lg:gap-8">
          {/* The copy's panel fills the wash with a small inset on every side; on wide screens it stops at the photo.
              Its left edge is worked out from the wash's width (the container) so the copy keeps the page's column. */}
          <div className="relative isolate px-3 pb-10 lg:flex lg:flex-col lg:justify-center before:absolute before:inset-x-[-12px] before:top-[-32px] before:bottom-0 before:-z-10 before:rounded-panel before:bg-panel sm:px-0 sm:before:inset-x-[-28px] sm:before:top-[-36px] lg:pr-12 lg:pb-12 lg:before:right-0 lg:before:rounded-r-none lg:before:bottom-3 lg:before:left-[calc((min(100cqw,1408px)_-_100cqw)/2_-_52px)]">
            <h2 id="tenants-title" className="text-[clamp(32px,4.2vw,56px)] leading-[1.04] tracking-[-0.03em] text-ink">
              Give tenants the app.
              <br />
              Get your time back.
            </h2>
            <p className="mt-4 max-w-[30rem] text-[17px] leading-[1.5] text-ink-2">Rent, repairs, messages and documents on one screen, on any phone. Nothing to install and free for tenants, so they actually use it.</p>
            <ul className="mt-8 grid max-w-[34rem] gap-4">
              {POINTS.map((p) => (
                <li key={p.title} className="grid grid-cols-[22px_minmax(0,1fr)] gap-x-3.5">
                  <Icon icon={p.icon} size={22} className="mt-px text-ink" />
                  <div>
                    <p className="text-[16px] leading-snug text-ink">{p.title}</p>
                    <p className="mt-1 text-[15px] leading-[1.5] text-ink-2">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* The tenant's phone, in a hand. Flush to the wash's foot and, on wide screens, its right edge; the wash clips it. */}
          <motion.div style={{ y: drift }} className="relative mx-auto w-full max-w-[440px] self-end lg:max-w-[500px] select-none lg:mr-[calc((min(100cqw,1408px)_-_100cqw)/2_-_64px)] lg:justify-self-end">
            <Image
              src="/hero/tenant-phone.png"
              alt="A tenant holding a phone showing their rent in DirectHomes: £1,725.00 due, paid by Direct Debit, auto-pay active"
              width={1204}
              height={1306}
              sizes="(min-width: 1024px) 500px, (min-width: 640px) 440px, 100vw"
              className="block h-auto w-full [mask-image:linear-gradient(to_right,#000_86%,transparent_100%)]"
            />
          </motion.div>
        </Column>
      </div>
    </section>
  );
}
