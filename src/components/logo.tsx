import { cn } from "@/lib/utils";

/** The DirectHomes mark: three stepped blocks rising to the right (the same drawing as the web app's). */
const PATHS = [
  "M125.763 0L215 36.5484L214.17 205.169H125.763V0Z",
  "M125.763 0L63.0888 36.1331V132.903L88.8224 119.198V51.9153L125.763 31.1492V0Z",
  "M63.0888 62.2984L0 99.2621V206H89.6525V147.855L62.6737 162.391V179.835H25.7336V115.044L63.0888 94.2782V62.2984Z",
];

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 215 206" className={cn("size-9", className)} aria-hidden>
      {PATHS.map((d) => (
        <path key={d} d={d} fill="currentColor" />
      ))}
    </svg>
  );
}
