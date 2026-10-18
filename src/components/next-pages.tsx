import Link from "next/link";
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "./icon";
import { Column } from "./ui";
import { PAGES, type PageKey } from "@/lib/pages";

/*
 * Where to go next, at the foot of a page before the footer: two or three pages that carry on from this one, each a
 * wide plain tile with its name set large and one line under it. The tile lifts a tone and the arrow nudges on hover.
 */
export function NextPages({ items }: { items: { page: PageKey; text: string }[] }) {
  return (
    <nav aria-label="Read next" className="pt-24 sm:pt-32">
      <Column>
        <ul className="grid gap-2 md:grid-cols-[repeat(auto-fit,minmax(0,1fr))]">
          {items.map(({ page, text }) => (
            <li key={page} className="flex">
              <Link href={PAGES[page].href} className="group flex w-full flex-col rounded-panel bg-white/40 p-6 transition-colors duration-300 hover:bg-white/75 sm:p-7">
                <span className="flex items-start justify-between gap-6">
                  <span className="text-[clamp(22px,2.2vw,30px)] leading-[1.1] tracking-[-0.02em] text-ink">{PAGES[page].label}</span>
                  <Icon icon={ArrowUpRight01Icon} size={22} className="mt-1 text-ink transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
                <span className="mt-10 max-w-[26rem] text-[15px] leading-[1.5] text-ink-2">{text}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Column>
    </nav>
  );
}
