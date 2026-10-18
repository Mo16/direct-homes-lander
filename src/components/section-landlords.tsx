"use client";

import { MotionConfig } from "motion/react";
import { ProductTour } from "./product-tour";
import { Column } from "./ui";

/*
 * "The whole let": the product overview. The whole app in one big window, with tabs under it that each play a short
 * demo of one part of it in that window (product-tour.tsx).
 */
export function SectionLandlords() {
  return (
    <section id="landlords" aria-labelledby="landlords-title" className="scroll-mt-[-56px] pt-24 sm:scroll-mt-[-88px] sm:pt-32">
      <Column>
        <div className="mx-auto flex max-w-[44rem] flex-col items-center text-center">
          <h2 id="landlords-title" className="text-[clamp(32px,4.2vw,56px)] leading-[1.04] tracking-[-0.03em] text-ink">
            The whole let,
            <br />
            not just the rent.
          </h2>
          <p className="mt-5 max-w-[30rem] text-[17px] leading-[1.5] text-ink-2">Collecting, fixing, certifying and talking, for every home you let, kept in one record you and your tenants share.</p>
        </div>

        <MotionConfig reducedMotion="user">
          <div className="mt-10">
            <ProductTour />
          </div>
        </MotionConfig>
      </Column>
    </section>
  );
}
