import Image from "next/image";
import { Column } from "./ui";
import Link from "next/link";
import { LAUNCHED } from "@/lib/links";
import { StartLink } from "./start-link";
import { WaitlistForm } from "./waitlist-form";
import { FOOTER_COLUMNS, PAGES } from "@/lib/pages";

/*
 * The close: the hero's sky again, as an island inset from the page, so the page ends where it began. One line and
 * one way in (the waitlist form before launch), the links, then the name across the full width, anchored to the
 * island's foot with its letters spaced out to fill it and their feet just cut by the edge.
 */

export function SiteFooter() {
  return (
    <footer className="px-2 pt-24 pb-2 sm:px-3 sm:pt-32 sm:pb-3">
      <div className="relative isolate overflow-hidden rounded-panel bg-[#46679f]">
        <Image src="/hero/footer-sky.jpg" alt="" fill sizes="100vw" className="-z-10 object-cover" />
        <Column className="pt-14 sm:pt-20">
          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div>
              <h2 className="text-[clamp(32px,4.2vw,56px)] leading-[1.04] tracking-[-0.03em] text-white">
                Your first home
                <br />
                is free to run.
              </h2>
              {/* Before launch the footer, on every page, holds the waitlist form itself. */}
              {LAUNCHED ? (
                <StartLink arrow={18} className="group mt-8 inline-flex h-12 items-center gap-2 rounded-control bg-ink pr-4 pl-5 text-[15.5px] text-white transition-colors hover:bg-ink-hover" />
              ) : (
                <WaitlistForm className="mt-8" />
              )}
            </div>
            {/* Every page on the site, in three columns with no headings (the user's list). */}
            <nav aria-label="Footer" className="grid grid-cols-2 gap-x-10 gap-y-2 sm:grid-cols-3 sm:gap-x-14 xl:gap-x-20">
              {FOOTER_COLUMNS.map((col, i) => (
                <ul key={i} className="flex flex-col gap-2.5">
                  {col.map((key) => (
                    <li key={key}>
                      <Link href={PAGES[key].href} className="text-[15px] whitespace-nowrap text-white transition-colors hover:text-white/70">
                        {PAGES[key].label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ))}
            </nav>
          </div>

          <div className="mt-16 flex flex-col gap-2 text-[12.5px] leading-[1.5] text-white/85 sm:flex-row sm:justify-between sm:gap-8">
            <p>© 2026 DirectHomes.</p>
          </div>
        </Column>

        {/* The name, spaced to the island's full width and set on its foot: the letters' feet run a few units past the edge. */}
        <svg viewBox="0 0 1000 128" className="mt-8 block w-full font-sans sm:mt-12" aria-hidden>
          <text x="500" y="136" textAnchor="middle" textLength="968" lengthAdjust="spacing" fontSize="150" fontWeight="400" fill="#fff" fillOpacity="0.94">
            DirectHomes
          </text>
        </svg>
      </div>
    </footer>
  );
}
