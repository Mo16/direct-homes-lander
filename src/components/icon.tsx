import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import { cn } from "@/lib/utils";

/** Thin, rounded line icons (Hugeicons stroke-rounded): the web app's own set, so the product shot matches the product. */
export function Icon({ icon, size = 20, className, strokeWidth = 1.5 }: { icon: IconSvgElement; size?: number; className?: string; strokeWidth?: number }) {
  return <HugeiconsIcon icon={icon} size={size} strokeWidth={strokeWidth} className={cn("shrink-0", className)} aria-hidden />;
}
