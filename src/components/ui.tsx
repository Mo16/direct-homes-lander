import type { ReactNode } from "react";
import { Alert02Icon, CheckmarkCircle02Icon, Clock01Icon, Loading03Icon } from "@hugeicons/core-free-icons";
import { Icon } from "./icon";
import { cn } from "@/lib/utils";

/** The page's content column: the same width and gutters as the hero, so every section shares its edges. */
export function Column({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn("mx-auto w-full max-w-[1408px] px-5 sm:px-10 lg:px-16", className)}>{children}</div>;
}

const STATUS = {
  paid: { icon: CheckmarkCircle02Icon, tone: "text-good" },
  processing: { icon: Loading03Icon, tone: "text-info" },
  upcoming: { icon: Clock01Icon, tone: "text-muted" },
  overdue: { icon: Alert02Icon, tone: "text-bad" },
  warn: { icon: Clock01Icon, tone: "text-warn" },
} as const;

/** A status as the app writes it: an icon and words, never colour alone. */
export function Status({ kind, children, className }: { kind: keyof typeof STATUS; children: ReactNode; className?: string }) {
  const s = STATUS[kind];
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[13px] whitespace-nowrap", s.tone, className)}>
      <Icon icon={s.icon} size={15} />
      {children}
    </span>
  );
}

export const pounds = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 });
export const exact = new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", minimumFractionDigits: 2 });

/**
 * A section's opening, in the two ways the site opens one: the headline on the left with its paragraph across from it
 * ("split"), or both centred. No label above the headline.
 */
export function SectionHead({ id, title, text, center, className }: { id?: string; title: ReactNode; text?: ReactNode; center?: boolean; className?: string }) {
  if (center) {
    return (
      <div className={cn("mx-auto flex max-w-[48rem] flex-col items-center text-center", className)}>
        <h2 id={id} className="text-[clamp(30px,4vw,54px)] leading-[1.05] tracking-[-0.03em] text-balance text-ink">
          {title}
        </h2>
        {text ? <p className="mt-5 max-w-[34rem] text-[17px] leading-[1.5] text-balance text-ink-2">{text}</p> : null}
      </div>
    );
  }
  return (
    <div className={cn("grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(0,28rem)] xl:items-start", className)}>
      <h2 id={id} className="text-[clamp(28px,3.8vw,52px)] leading-[1.06] tracking-[-0.03em] text-ink">
        {title}
      </h2>
      {text ? <p className="max-w-[40rem] text-[17px] leading-[1.55] text-ink-2 xl:pt-2">{text}</p> : null}
    </div>
  );
}
