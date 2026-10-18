"use client";

import { SetupCards } from "./setup-cards";
import { Column } from "./ui";
import { StartLink } from "./start-link";

/*
 * Getting started: the headline with the buttons across from it, then the four steps a new landlord goes through
 * before the first rent is due, as cards with close-ups of their real screens from the web app (setup-cards.tsx).
 */

export function SectionSetup() {
  return (
    <section id="start" aria-labelledby="start-title" className="scroll-mt-[-56px] pt-24 sm:scroll-mt-[-88px] sm:pt-32">
      <Column>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:gap-16">
          <div>
            <h2 id="start-title" className="text-[clamp(32px,4.2vw,56px)] leading-[1.04] tracking-[-0.03em] text-ink">
              Set up your first tenancy
              <br />
              in one sitting.
            </h2>
            <p className="mt-5 max-w-[42rem] text-[17px] leading-[1.5] text-balance text-ink-2">Find the home by postcode, set the rent and invite your tenants. That&rsquo;s the setup.</p>
          </div>
          <div className="flex gap-2 lg:pb-1">
            <StartLink className="inline-flex h-12 items-center rounded-control bg-ink px-6 text-[15.5px] text-white transition-colors hover:bg-ink-hover" />
            <a href="#pricing" className="inline-flex h-12 items-center rounded-control bg-surface px-6 text-[15.5px] text-ink transition-colors hover:bg-white">
              See pricing
            </a>
          </div>
        </div>

        <div className="mt-12 lg:mt-14">
          <SetupCards />
        </div>
      </Column>
    </section>
  );
}
