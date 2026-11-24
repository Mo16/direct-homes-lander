import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SiteFooter } from "@/components/site-footer";
import { SiteNav } from "@/components/site-nav";

// Outfit, the brand typeface (SIL Open Font License, src/app/fonts/OUTFIT-LICENSE), self-hosted as one variable file.
const outfit = localFont({
  src: "./fonts/outfit-latin-wght-normal.woff2",
  variable: "--font-outfit",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "DirectHomes: rent, repairs and tenants in one place", template: "%s | DirectHomes" },
  description: "Run every home you let from one place: rent, repairs, certificates and tenants for UK landlords. Free for your tenants, always.",
  metadataBase: new URL(process.env.SITE_URL ?? "https://direct-homes.co.uk"),
  // Google Search Console's ownership tag, carried over from the site that was on direct-homes.co.uk before.
  verification: { google: "FlYywUdTvaGNNOy63BOfqNDk5UQsGOsSkFXLd35KNWw" },
};

export const viewport: Viewport = {
  themeColor: "#ebebeb",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={outfit.variable}>
      <body>
        <SiteNav />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
