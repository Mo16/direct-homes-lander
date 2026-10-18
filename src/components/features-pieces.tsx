"use client";

import Link from "next/link";
import { useState, type MouseEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  ArrowUp02Icon,
  ArrowUpRight01Icon,
  Building03Icon,
  CreditCardIcon,
  DashboardSquare01Icon,
  File02Icon,
  HandshakeIcon,
  HelpCircleIcon,
  KanbanIcon,
  Message01Icon,
  PieChart01Icon,
  Settings02Icon,
  UserGroupIcon,
  UserMultiple02Icon,
  Wallet01Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "./icon";
import { LogoMark } from "./logo";
import { Column, SectionHead } from "./ui";
import { PAGES } from "@/lib/pages";
import { cn } from "@/lib/utils";

/*
 * The map of the app: the web app's own side rail (webapp components/layouts/nav-config.ts and nav.tsx), in its own
 * order and with its own names, drawn large. In the app the rail is icons only and each names itself in a pointed ink
 * tag on hover; here every name is written out, and the one under the pointer (Home at rest, as the app opens on Home)
 * lights the way the app lights the page you are on: an ink square on the rail and its tag beside it. Each row goes
 * somewhere real: a part with a demo plays it in the product tour at the top of the page (product-tour.tsx listens for
 * "tour:pick"), the rest open the page about them.
 */

type Part = { label: string; icon: IconSvgElement; text: string; tour?: string; href?: string; badge?: string };

const STRIPS: Part[][] = [
  [
    { label: "Home", icon: DashboardSquare01Icon, text: "Money in and out, and everything that needs you today.", href: PAGES.home.href },
    { label: "Tasks", icon: KanbanIcon, text: "One board for your team. Rent, repairs and certificates land on it.", tour: "tasks" },
    { label: "Properties", icon: Building03Icon, text: "Add a home by postcode, with its compliance reminders already set.", tour: "properties" },
    { label: "Tenants", icon: UserMultiple02Icon, text: "Everyone who rents from you, and the free app they use.", href: PAGES.tenants.href },
    { label: "Rent", icon: Wallet01Icon, text: "Pay by Bank and Direct Debit into your own bank, and a ledger that keeps itself.", href: PAGES.rent.href },
    { label: "Repairs", icon: Wrench01Icon, text: "Tenants report with photos. Book the trade, close it when they confirm.", href: PAGES.repairs.href },
    { label: "Documents", icon: File02Icon, text: "Certificates tracked home by home, and files you choose to share.", href: `${PAGES.landlords.href}#certificates` },
    { label: "Messages", icon: Message01Icon, text: "One thread for each tenancy, with read receipts on every message.", tour: "messages", badge: "1" },
    { label: "Help & Services", icon: HandshakeIcon, text: "Introductions to mortgage, insurance, tax and legal experts, with your consent.", href: PAGES.services.href },
    { label: "Finance", icon: PieChart01Icon, text: "Repair bills arrive as drafts. Confirm them and the year’s profit updates.", tour: "finance" },
    { label: "Team", icon: UserGroupIcon, text: "Staff with roles, each limited to the homes they look after.", href: PAGES.managers.href },
    { label: "Billing", icon: CreditCardIcon, text: "Your plan, your seats and your invoices.", href: PAGES.pricing.href },
  ],
  [
    { label: "Settings", icon: Settings02Icon, text: "Notifications, quiet hours and two-step sign-in.", href: PAGES.about.href },
    { label: "Support", icon: HelpCircleIcon, text: "Ask us from inside the app. First reply within one working day.", href: PAGES.contact.href },
  ],
];

function Row({ part, lit, onLight }: { part: Part; lit: boolean; onLight: () => void }) {
  const still = useReducedMotion();
  const demo = Boolean(part.tour);

  // A demo plays in the tour at the top of the page: tell the tour which one, then bring it into view.
  const play = (e: MouseEvent) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("tour:pick", { detail: part.tour }));
    document.getElementById("tour")?.scrollIntoView({ behavior: still ? "auto" : "smooth", block: "start" });
  };

  const body = (
    <>
      {/* The rail's square: ink when lit, as the app marks the page you are on. */}
      <span className={cn("relative flex size-14 shrink-0 items-center justify-center rounded-[8px] transition-colors duration-300 sm:size-16", lit ? "text-white" : "text-ink-2")}>
        {lit ? <motion.span layoutId="map-lit" transition={still ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 42 }} className="absolute inset-0 rounded-[8px] bg-ink" /> : null}
        <Icon icon={part.icon} size={24} className="relative" />
        {part.badge ? (
          <span aria-hidden className={cn("absolute top-1.5 right-1.5 inline-flex size-[18px] items-center justify-center rounded-full text-[11px] leading-none tabular ring-2 transition-colors duration-300", lit ? "bg-white text-ink ring-ink" : "bg-ink text-white ring-[#ece9f0]")}>
            {part.badge}
          </span>
        ) : null}
      </span>

      {/* The name, in the app's pointed ink tag when lit; the same box at rest, so nothing shifts. */}
      <span className="flex min-w-0 flex-col gap-1 py-2 md:grid md:grid-cols-[minmax(0,17rem)_minmax(0,1fr)] md:items-center md:gap-8 lg:grid-cols-[minmax(0,21rem)_minmax(0,1fr)]">
        <span className="relative -ml-1 w-fit sm:-ml-3">
          <span
            aria-hidden
            className={cn(
              "absolute top-1/2 right-full -mr-px h-4 w-[9px] -translate-y-1/2 bg-ink [clip-path:polygon(100%_0,0_50%,100%_100%)] transition-opacity duration-200",
              lit ? "opacity-100" : "opacity-0",
            )}
          />
          <span className={cn("block rounded-[5px] px-3 py-1.5 text-[clamp(19px,2.3vw,32px)] leading-[1.25] tracking-[-0.015em] whitespace-nowrap transition-colors duration-200", lit ? "bg-ink text-white" : "text-ink")}>{part.label}</span>
        </span>
        <span className="max-w-[34rem] text-[14.5px] leading-[1.45] text-ink-2 sm:text-[15.5px]">{part.text}</span>
      </span>

      {/* Where it goes: up to the tour, or out to its page. */}
      <span className={cn("ml-auto flex shrink-0 items-center gap-2 pl-3 text-[14.5px] whitespace-nowrap transition-colors duration-200", lit ? "text-ink" : "text-muted")}>
        <span className="hidden lg:inline">{demo ? "Play the demo" : "Read more"}</span>
        <Icon icon={demo ? ArrowUp02Icon : ArrowUpRight01Icon} size={18} className={cn("transition-transform duration-200", lit && (demo ? "-translate-y-0.5" : "translate-x-0.5 -translate-y-0.5"))} />
      </span>
    </>
  );

  const cls = "flex min-h-16 items-center gap-4 rounded-[8px] pr-2 outline-offset-4 sm:gap-6 sm:pr-4";
  const light = { onPointerEnter: onLight, onFocus: onLight };
  return demo ? (
    <a href="#tour" onClick={play} aria-label={`${part.label}: play the demo`} className={cls} {...light}>
      {body}
    </a>
  ) : (
    <Link href={part.href!} className={cls} {...light}>
      {body}
    </Link>
  );
}

export function SectionAppMap() {
  const [lit, setLit] = useState("Home");
  return (
    <section id="map" aria-labelledby="map-title" className="pt-24 sm:pt-32">
      <Column>
        <SectionHead
          id="map-title"
          title={
            <>
              Every part of the app,
              <br />
              where you&rsquo;ll find it.
            </>
          }
          text="The app’s own menu, in its own order. Pick a part to watch it work in the window above, or to read more about it."
        />

        <nav aria-label="Parts of the app" className="brand-wash brand-wash-3 mt-10 rounded-panel px-3 py-6 sm:px-8 sm:py-10 lg:mt-14 lg:px-12 lg:py-12">
          <LogoMark className="ml-2.5 size-9 text-ink sm:ml-3.5" />
          <div onPointerLeave={() => setLit("Home")} className="mt-8 flex flex-col gap-3 sm:mt-10">
            {STRIPS.map((strip, s) => (
              <div key={s} className={cn("relative", s === 1 && "mt-6 sm:mt-10")}>
                {/* The rail's strip: one panel behind its squares, as in the app. */}
                <span aria-hidden className="absolute inset-y-0 left-0 w-14 rounded-[10px] bg-white/45 sm:w-16" />
                <ul className="relative flex flex-col gap-0.5">
                  {strip.map((p) => (
                    <li key={p.label}>
                      <Row part={p} lit={lit === p.label} onLight={() => setLit(p.label)} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </nav>
      </Column>
    </section>
  );
}
