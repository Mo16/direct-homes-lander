import { siAirbnb } from "simple-icons";
import { AURELO, RIGHTMOVE } from "./brand-marks";
import { cn } from "@/lib/utils";

/*
 * The logo strip under the hero, with no label (the user's call, 15 Oct 2026): property companies the user says
 * DirectHomes works with. Each is that company's own mark (Rightmove's wordmark from its site, Airbnb's symbol from
 * Simple Icons, Aurelo's wordmark and Driive's symbol from the user's own files), drawn in one quiet grey at one
 * height. Zoopla is waiting on a logo file from the user. The row drifts left in a seamless loop, fading out at both ends; with reduced motion it stands still.
 */

/** A mark drawn from vector paths, or (`mask`) from an image whose shape is filled with the strip's grey. */
type Mark = { name: string; width: number } & ({ viewBox: string; paths: string[] } | { mask: string });

const MARKS: Mark[] = [
  { name: "Rightmove", viewBox: RIGHTMOVE.viewBox, paths: RIGHTMOVE.paths, width: 132 },
  { name: "Aurelo", viewBox: AURELO.viewBox, paths: AURELO.paths, width: 92 },
  { name: "Airbnb", viewBox: "0 0 24 24", paths: [siAirbnb.path], width: 30 },
  { name: "Driive", mask: "/logos/driive.png", width: 26 },
];

/** Enough copies of the marks to run wider than any screen, so one copy sliding away never leaves a gap. */
const ROW = Array.from({ length: 4 }, () => MARKS).flat();

/** One mark. `repeat` marks the copies that only exist to fill the loop: hidden from screen readers, and gone when motion is off. */
function Logo({ mark, repeat }: { mark: Mark; repeat?: boolean }) {
  return (
    <li aria-hidden={repeat || undefined} className={cn("flex shrink-0 items-center px-12 text-ink-2 sm:px-16", repeat && "motion-reduce:hidden")}>
      {"mask" in mark ? (
        <span
          role={repeat ? undefined : "img"}
          aria-label={repeat ? undefined : mark.name}
          className="block h-7 shrink-0 bg-current [mask-position:center] [mask-repeat:no-repeat] [mask-size:contain]"
          style={{ width: mark.width, maskImage: `url(${mark.mask})` }}
        />
      ) : (
        <svg viewBox={mark.viewBox} style={{ width: mark.width }} className="h-7 shrink-0" fill="currentColor" role={repeat ? undefined : "img"} aria-label={repeat ? undefined : mark.name}>
          {mark.paths.map((d) => (
            <path key={d} d={d} fillRule="evenodd" />
          ))}
        </svg>
      )}
    </li>
  );
}

export function LogoStrip() {
  return (
    <section aria-label="Companies we work with" className="pt-4 pb-8 sm:pt-6 sm:pb-12">
      {/* Two identical rows side by side; sliding the pair left by exactly one row's width loops without a seam. */}
      <div className="overflow-hidden [mask-image:linear-gradient(to_right,transparent,#000_14%,#000_86%,transparent)]">
        <div className="flex w-max animate-marquee motion-reduce:w-full motion-reduce:animate-none">
          <ul className="flex motion-reduce:w-full motion-reduce:justify-center">
            {ROW.map((m, i) => (
              <Logo key={`${m.name}-${i}`} mark={m} repeat={i >= MARKS.length} />
            ))}
          </ul>
          <ul aria-hidden className="flex motion-reduce:hidden">
            {ROW.map((m, i) => (
              <Logo key={`${m.name}-copy-${i}`} mark={m} repeat />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
