"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll } from "motion/react";
import {
  ArrowRight01Icon,
  ArrowUpRight01Icon,
  BookOpen01Icon,
  Building03Icon,
  HandshakeIcon,
  Key01Icon,
  KanbanIcon,
  Message01Icon,
  PieChart01Icon,
  SecurityCheckIcon,
  UserGroupIcon,
  UserIcon,
  Wallet01Icon,
  Wrench01Icon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Icon } from "./icon";
import { LogoMark } from "./logo";
import { LAUNCHED, SIGN_IN, START_LABEL, START_SHORT } from "@/lib/links";
import { StartLink } from "./start-link";
import { PAGES, type PageKey } from "@/lib/pages";
import { cn } from "@/lib/utils";

/**
 * The bar reads in the order someone weighs it up: what it is (Product), whether it's for them (Who it's for), where
 * to learn more (Resources), then what it costs (Pricing), last so it sits beside the button that acts on it.
 */
const LINKS = [{ href: PAGES.pricing.href, label: "Pricing" }];

/** Tax is a section of the home page (and of Features), so it lives in the Product menu with the other parts. */
const taxHref = (path: string) => (path === "/" || path === "/features" ? "#tax" : "/#tax");

type MenuId = "product" | "audience" | "resources";

/** A page in a menu: its name, a mark and one line. */
type Entry = { page: PageKey; icon: IconSvgElement; text: string };

/** Who it's for: the three ways into the product, one for each kind of person. */
const AUDIENCE: Entry[] = [
  { page: "landlords", icon: Key01Icon, text: "A home or ten. Free for the first, with certificates kept home by home." },
  { page: "managers", icon: UserGroupIcon, text: "Staff with roles, each limited to the homes they look after." },
  { page: "tenants", icon: UserIcon, text: "What your tenants get: rent, repairs and messages, always free." },
];

/** Resources: answers, introductions and who we are. */
const RESOURCES: Entry[] = [
  { page: "guides", icon: BookOpen01Icon, text: "Straight answers, and the dates landlords in England are working to." },
  { page: "services", icon: HandshakeIcon, text: "Mortgages, insurance, tax and legal help, through people we introduce." },
  { page: "about", icon: SecurityCheckIcon, text: "What DirectHomes is and isn't, and how your data is kept safe." },
];

/** Which menu a page belongs to, so its trigger stays lit while you are on it. */
const MENU_OF: Partial<Record<string, MenuId>> = {
  [PAGES.features.href]: "product",
  [PAGES.rent.href]: "product",
  [PAGES.repairs.href]: "product",
  ...Object.fromEntries(AUDIENCE.map((e) => [PAGES[e.page].href, "audience"])),
  ...Object.fromEntries(RESOURCES.map((e) => [PAGES[e.page].href, "resources"])),
};

/** Every page, grouped as the bar is, for the phone menu. */
const PHONE_GROUPS: { title: string; pages: PageKey[] }[] = [
  { title: "Product", pages: ["features", "rent", "repairs"] },
  { title: "Who it's for", pages: ["landlords", "managers", "tenants"] },
  { title: "Resources", pages: ["guides", "services", "about", "contact", "legal"] },
  { title: "Plans", pages: ["pricing"] },
];

/** Pages that carry the full product tour, and the tour's anchor on each: there the menu plays a demo in place. */
const TOUR_AT: Record<string, string> = { "/": "#landlords", "/features": "#tour" };
/** Elsewhere a part with its own page goes there, and the rest open their demo on Features. */
const OWN_PAGE: Record<string, string> = { rent: PAGES.rent.href, repairs: PAGES.repairs.href };
const productHref = (path: string, tour: string) => TOUR_AT[path] ?? OWN_PAGE[tour] ?? `${PAGES.features.href}#tour-${tour}`;

/** The product menu: each one opens its demo in the tour (product-tour.tsx listens for "tour:pick"), except tax, which goes to its section. */
const PRODUCT: { tour: string; label: string; icon: IconSvgElement; text: string }[] = [
  { tour: "rent", label: "Rent", icon: Wallet01Icon, text: "See who has paid, confirm transfers and chase what is overdue." },
  { tour: "repairs", label: "Repairs", icon: Wrench01Icon, text: "Tenants report with photos. Book the trade, close it when they confirm." },
  { tour: "messages", label: "Messages", icon: Message01Icon, text: "One thread for each tenancy, with read receipts on every message." },
  { tour: "tasks", label: "Tasks", icon: KanbanIcon, text: "One board for your team. Rent, repairs and certificates land on it." },
  { tour: "properties", label: "Properties", icon: Building03Icon, text: "Add a home by postcode, with its compliance reminders already set." },
  { tour: "tax", label: "Finance and tax", icon: PieChart01Icon, text: "Profit kept as you go, and a tax year ready to download for HMRC." },
];

/** A plus drawn in two rounded strokes: it turns a quarter into a cross while its menu is open. */
function Plus({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 12 12" aria-hidden className={cn("size-[11px] transition-transform duration-300 ease-[cubic-bezier(0.3,0.7,0.2,1)]", open && "rotate-45")}>
      <path d="M6 1.5v9M1.5 6h9" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" />
    </svg>
  );
}

/** Two rounded strokes that close into a cross while the phone menu is open. */
function Burger({ open }: { open: boolean }) {
  return (
    <svg viewBox="0 0 16 16" aria-hidden className="size-4">
      <path d="M2.5 5.5h11" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className={cn("origin-center transition-transform duration-300 ease-[cubic-bezier(0.3,0.7,0.2,1)]", open && "translate-y-[2.5px] rotate-45")} />
      <path d="M2.5 10.5h11" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" className={cn("origin-center transition-transform duration-300 ease-[cubic-bezier(0.3,0.7,0.2,1)]", open && "-translate-y-[2.5px] -rotate-45")} />
    </svg>
  );
}

/** The glass every menu sits on: the tray's pale frost, a little more opaque. */
const GLASS = "rounded-[12px] bg-surface/[0.93] shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_1px_2px_rgb(20_20_20/0.08),0_22px_40px_-26px_rgb(28_26_60/0.5)] backdrop-blur-2xl backdrop-saturate-125";

/**
 * The site's top bar, laid over the photograph: the mark and name on the left, the sections in a tray of pale frosted
 * glass with ink text (so a cloud behind it never washes the words out) in the middle, and the two ways in on the
 * right, both solid so they read over any cloud: sign in in the surface tone, start free in ink. A pale block slides
 * under whichever item the pointer is on, and rests under the page you are on.
 *
 * Three items open a mega menu of the same glass, all the same width so they read as one system: Product (the six
 * parts of the app, each opening its demo, its page or the tax section, and a photograph for the tenant side), Who
 * it's for (landlords, property managers, tenants) and Resources (guides, services, about). Pricing is a plain link. No row along their foot (the user removed it).
 * Below 1024px the tray gives way to a Menu button that opens every page, grouped.
 *
 * The bar is fixed: it slides away while the page scrolls down and comes back the moment it scrolls up. Off the top
 * of the page it sits on its own pale frosted strip with the name in ink, since the photo is no longer behind it.
 */
export function SiteNav() {
  const path = usePathname();
  const [hovered, setHovered] = useState<string | null>(null);
  const [open, setOpen] = useState<MenuId | null>(null);
  const [phone, setPhone] = useState(false);
  const [item, setItem] = useState<string | null>(null);
  const still = useReducedMotion();
  const root = useRef<HTMLElement>(null);
  const triggers = useRef<Partial<Record<MenuId, HTMLButtonElement | null>>>({});
  const burger = useRef<HTMLButtonElement>(null);
  const closing = useRef<number | undefined>(undefined);
  const menuId = useId();
  const [scrolled, setScrolled] = useState(false);
  const [away, setAway] = useState(false);
  // Where the scroll last changed direction: the bar only moves once the page has gone 12px past it, so a jitter
  // of the wheel doesn't flick it in and out.
  const turn = useRef({ at: 0, dir: 0 });
  const hoverOpened = useRef(0);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? y;
    const dir = Math.sign(y - prev);
    if (dir && dir !== turn.current.dir) turn.current = { at: prev, dir };
    setScrolled(y > 24);
    if (y < 120) setAway(false);
    else if (dir > 0 && y - turn.current.at > 12 && !phone) {
      setAway(true);
      setOpen(null);
    } else if (dir < 0 && turn.current.at - y > 12) setAway(false);
  });
  const slide = still ? { duration: 0 } : { type: "spring" as const, stiffness: 520, damping: 40 };

  // A new page closes whatever was open (set during render, React's pattern for state that follows a prop).
  const [shownAt, setShownAt] = useState(path);
  if (shownAt !== path) {
    setShownAt(path);
    setOpen(null);
    setPhone(false);
  }

  // Hover opens a menu; leaving the bar and the menu closes it after a beat, so crossing the gap between them doesn't.
  const show = (id: MenuId) => {
    window.clearTimeout(closing.current);
    setOpen(id);
  };
  const hide = () => {
    window.clearTimeout(closing.current);
    closing.current = window.setTimeout(() => setOpen(null), 140);
  };
  useEffect(() => () => window.clearTimeout(closing.current), []);

  // Escape closes a menu and hands focus back to what opened it; a press anywhere else closes it.
  useEffect(() => {
    if (!open && !phone) return;
    const key = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      if (open) triggers.current[open]?.focus();
      else burger.current?.focus();
      setOpen(null);
      setPhone(false);
    };
    const press = (e: PointerEvent) => {
      if (root.current?.contains(e.target as Node)) return;
      setOpen(null);
      setPhone(false);
    };
    window.addEventListener("keydown", key);
    window.addEventListener("pointerdown", press);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("pointerdown", press);
    };
  }, [open, phone]);

  // The pale block follows the pointer, and otherwise rests under the page you are on (or the menu that holds it).
  const here = LINKS.find((l) => l.href === path)?.href ?? MENU_OF[path] ?? null;
  const lit = open ?? hovered ?? here;
  const close = () => setOpen(null);

  const trigger = (id: MenuId, label: string, extra?: string) => (
    <li className={cn("relative", extra)}>
      {lit === id ? <motion.span layoutId="nav-hover" transition={slide} className="absolute inset-0 rounded-[5px] bg-ink/[0.07]" /> : null}
      <button
        ref={(el) => {
          triggers.current[id] = el;
        }}
        type="button"
        aria-expanded={open === id}
        aria-controls={open === id ? menuId : undefined}
        onPointerEnter={(e) => {
          setHovered(id);
          if (e.pointerType !== "mouse") return;
          if (open !== id) hoverOpened.current = performance.now();
          show(id);
        }}
        // A click that lands just after the hover opened the menu keeps it open rather than shutting it again.
        onClick={() => (open === id && performance.now() - hoverOpened.current > 600 ? setOpen(null) : show(id))}
        className="relative flex h-9 items-center gap-2 rounded-[5px] pr-3.5 pl-4 text-[14.5px] whitespace-nowrap text-ink"
      >
        {label}
        <Plus open={open === id} />
      </button>
    </li>
  );

  /** One page in a menu: its mark, its name and one line, with the pale block sliding under it on hover. */
  const entry = (key: string, href: string, icon: IconSvgElement, label: string, text: string, onClick?: () => void) => (
    <li key={key} className="relative">
      {item === key ? <motion.span layoutId="nav-item" transition={slide} className="absolute inset-0 rounded-[8px] bg-ink/[0.045]" /> : null}
      <Link
        href={href}
        aria-current={href === path ? "page" : undefined}
        onPointerEnter={() => setItem(key)}
        onFocus={() => setItem(key)}
        onBlur={() => setItem(null)}
        onClick={() => {
          onClick?.();
          close();
        }}
        className="relative grid h-full grid-cols-[24px_minmax(0,1fr)] gap-x-3.5 rounded-[8px] px-4 pt-4 pb-[18px]"
      >
        <Icon icon={icon} size={22} className="mt-px text-ink" />
        <span className="text-[16px] leading-6 text-ink">{label}</span>
        <span className="col-start-2 mt-1 text-[14.5px] leading-[1.45] text-muted">{text}</span>
      </Link>
    </li>
  );

  return (
    <motion.div
      initial={false}
      animate={{ y: away ? "-130%" : "0%" }}
      transition={still ? { duration: 0 } : { duration: 0.38, ease: [0.3, 0.7, 0.2, 1] }}
      onFocusCapture={() => setAway(false)}
      className="fixed inset-x-0 top-0 z-50 px-2 pt-2 sm:px-3 sm:pt-3"
    >
      <nav ref={root} aria-label="Main" className={cn("relative isolate mx-auto flex max-w-[1408px] items-center gap-4 px-5 transition-[height] duration-300 sm:px-10 lg:px-16", scrolled || phone ? "h-16" : "h-[76px]")}>
        {/* The strip behind the bar once the photo has scrolled away (or the phone menu is open). It is a sibling, not
            the bar itself, so the menu's own glass still sees the page behind it. */}
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 -z-10 rounded-[10px] bg-surface/80 shadow-[inset_0_1px_0_rgb(255_255_255/0.7),0_1px_2px_rgb(20_20_20/0.06),0_12px_24px_-18px_rgb(28_26_60/0.4)] backdrop-blur-xl backdrop-saturate-125 transition-opacity duration-300",
            scrolled || phone ? "opacity-100" : "opacity-0",
          )}
        />
        <Link href="/" className={cn("flex items-center gap-2.5 rounded-control transition-colors duration-300", scrolled || phone ? "text-ink" : "text-white")} aria-label="DirectHomes home">
          <LogoMark className="size-8" />
          <span className="text-[19px] tracking-[-0.015em] sm:text-[20px]">DirectHomes</span>
        </Link>

        <ul
          onPointerLeave={() => {
            setHovered(null);
            if (open) hide();
          }}
          className={cn(
            "absolute left-1/2 hidden h-11 -translate-x-1/2 items-center rounded-[8px] p-1 transition-colors duration-300 lg:flex",
            scrolled ? "bg-transparent" : "bg-surface/80 shadow-[inset_0_1px_0_rgb(255_255_255/0.6)] backdrop-blur-xl backdrop-saturate-125",
          )}
        >
          {trigger("product", "Product")}
          {trigger("audience", "Who it's for")}
          {trigger("resources", "Resources")}
          {LINKS.map((l) => (
            <li key={l.href} className="relative">
              {lit === l.href ? <motion.span layoutId="nav-hover" transition={slide} className="absolute inset-0 rounded-[5px] bg-ink/[0.07]" /> : null}
              <Link
                href={l.href}
                aria-current={path === l.href ? "page" : undefined}
                onPointerEnter={() => {
                  setHovered(l.href);
                  setOpen(null);
                }}
                onFocus={() => {
                  setHovered(l.href);
                  setOpen(null);
                }}
                onBlur={() => setHovered(null)}
                className="relative flex h-9 items-center rounded-[5px] px-4 text-[14.5px] text-ink"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* The mega menus, all one width. Each is on screen the moment it opens and only settles a few pixels; nothing
            in it fades in. */}
        {open ? (
          <motion.div
            key={open}
            id={menuId}
            initial={still ? false : { y: -6, scale: 0.99 }}
            animate={{ y: 0, scale: 1 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            onPointerEnter={() => show(open)}
            onPointerLeave={hide}
            className="absolute top-full left-1/2 hidden w-[min(1040px,calc(100%-128px))] -translate-x-1/2 origin-top pt-2 lg:block"
          >
            {open === "product" ? (
              <div className={cn("grid grid-cols-[minmax(0,1fr)_220px] overflow-hidden xl:grid-cols-[minmax(0,1fr)_272px]", GLASS)}>
                <ul onPointerLeave={() => setItem(null)} className="grid grid-cols-2 gap-1 p-3">
                  {PRODUCT.map((p) =>
                    p.tour === "tax"
                      ? entry(p.tour, taxHref(path), p.icon, p.label, p.text)
                      : entry(p.tour, productHref(path, p.tour), p.icon, p.label, p.text, () => {
                          if (path in TOUR_AT) window.dispatchEvent(new CustomEvent("tour:pick", { detail: p.tour }));
                        }),
                  )}
                </ul>

                {/* The tenant side, on a photograph: a terrace in south London, darkened only under the words. */}
                <Link href={PAGES.tenants.href} onClick={close} className="group relative isolate flex flex-col justify-end overflow-hidden p-5 text-white">
                  <Image src="/hero/south-london.jpg" alt="" fill sizes="(min-width: 1280px) 272px, 220px" className="-z-10 object-cover object-[50%_30%] transition-transform duration-700 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:scale-[1.03]" />
                  <span aria-hidden className="absolute inset-x-0 bottom-0 -z-10 h-3/5 bg-gradient-to-b from-[rgb(20_20_24/0)] via-[rgb(20_20_24/0.55)] to-[rgb(20_20_24/0.8)]" />
                  <span className="flex items-center gap-1 text-[16px] leading-6">
                    For your tenants
                    <Icon icon={ArrowUpRight01Icon} size={16} className="transition-transform duration-200 group-hover:translate-x-px group-hover:-translate-y-px" />
                  </span>
                  <span className="mt-1.5 text-[14.5px] leading-[1.45] text-white/85">Rent, repairs and messages in one app. Always free.</span>
                </Link>
              </div>
            ) : (
              <div className={cn("overflow-hidden", GLASS)}>
                <ul onPointerLeave={() => setItem(null)} className="grid grid-cols-3 gap-1 p-3">
                  {(open === "audience" ? AUDIENCE : RESOURCES).map((e) => entry(e.page, PAGES[e.page].href, e.icon, PAGES[e.page].label, e.text))}
                </ul>
              </div>
            )}
          </motion.div>
        ) : null}

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {/* No accounts exist before launch, so Sign in waits for it (LAUNCHED in lib/links.ts). */}
          {LAUNCHED ? (
            <a
              href={SIGN_IN}
              className={cn(
                "hidden h-10 items-center rounded-control px-4 text-[14.5px] whitespace-nowrap text-ink transition-colors duration-300 sm:flex",
                scrolled || phone ? "bg-ink/[0.06] hover:bg-ink/10" : "bg-surface hover:bg-white",
              )}
            >
              Sign in
            </a>
          ) : null}
          <StartLink className="group flex h-10 items-center gap-1.5 rounded-control bg-ink px-3.5 text-[14.5px] whitespace-nowrap text-white transition-colors hover:bg-ink-hover sm:pr-3 sm:pl-4">
            <span className="sm:hidden">{START_SHORT}</span>
            <span className="hidden sm:inline">{START_LABEL}</span>
            <Icon icon={ArrowUpRight01Icon} size={16} className="hidden transition-transform sm:block duration-200 group-hover:translate-x-px group-hover:-translate-y-px" />
          </StartLink>
          {/* Below 1024px the tray gives way to this: every page, grouped, in a sheet under the bar. */}
          <button
            ref={burger}
            type="button"
            aria-expanded={phone}
            aria-controls={`${menuId}-phone`}
            aria-label={phone ? "Close menu" : "Open menu"}
            onClick={() => setPhone((v) => !v)}
            className={cn(
              "flex size-10 items-center justify-center rounded-control text-ink transition-colors duration-300 lg:hidden",
              scrolled || phone ? "bg-ink/[0.06] hover:bg-ink/10" : "bg-surface hover:bg-white",
            )}
          >
            <Burger open={phone} />
          </button>
        </div>

        {phone ? (
          <motion.div
            id={`${menuId}-phone`}
            initial={still ? false : { y: -6 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.28, ease: [0.2, 0.8, 0.2, 1] }}
            className="absolute inset-x-0 top-full pt-2 lg:hidden"
          >
            {/* The pages scroll if the screen is short; Sign in stays on the sheet's foot, whole. */}
            <div className={cn("flex max-h-[calc(100svh-96px)] flex-col overflow-hidden", GLASS)}>
              <div className="grid min-h-0 flex-1 gap-x-2 overflow-y-auto overscroll-contain p-2 sm:grid-cols-2">
                {PHONE_GROUPS.map((g) => (
                  <div key={g.title} className="px-3 pt-2.5 pb-1">
                    <p className="px-1 text-[13px] text-muted">{g.title}</p>
                    <ul className="mt-1.5">
                      {g.pages.map((k) => (
                        <li key={k}>
                          <Link
                            href={PAGES[k].href}
                            onClick={() => setPhone(false)}
                            aria-current={PAGES[k].href === path ? "page" : undefined}
                            className={cn("flex h-10 items-center justify-between rounded-[8px] px-1 text-[16.5px] text-ink transition-colors hover:bg-ink/[0.04] aria-[current=page]:bg-ink/[0.06] aria-[current=page]:px-3")}
                          >
                            {PAGES[k].label}
                            <Icon icon={ArrowRight01Icon} size={16} className="text-muted" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {LAUNCHED ? (
                <div className="p-2 pt-0 sm:hidden">
                  <a href={SIGN_IN} className="flex h-12 items-center justify-center rounded-[8px] bg-ink/[0.06] text-[15.5px] text-ink transition-colors hover:bg-ink/10">
                    Sign in
                  </a>
                </div>
              ) : null}
            </div>
          </motion.div>
        ) : null}
      </nav>
    </motion.div>
  );
}
