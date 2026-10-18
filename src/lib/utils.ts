import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// The brand radii (globals.css @theme), so `rounded-control` and `rounded-[4px]` resolve as one conflict.
const twMerge = extendTailwindMerge({
  extend: { theme: { radius: ["panel", "tile", "field", "control"] } },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
