/**
 * Every page on the site, in the footer's three columns (the user's list, 17 Oct 2026). URLs follow the spec's
 * sitemap (webapp/docs/reference/spec.txt, section 21).
 */
export const PAGES = {
  home: { href: "/", label: "Home" },
  features: { href: "/features", label: "Features overview" },
  rent: { href: "/features/rent-collection", label: "Rent collection" },
  tenants: { href: "/features/tenant-portal", label: "Tenant portal" },
  repairs: { href: "/features/repairs", label: "Repairs" },
  landlords: { href: "/landlords", label: "For landlords" },
  managers: { href: "/property-managers", label: "For property managers" },
  pricing: { href: "/pricing", label: "Pricing" },
  services: { href: "/services", label: "Help & Services" },
  guides: { href: "/guides", label: "Guides and FAQs" },
  about: { href: "/about", label: "About and security" },
  contact: { href: "/contact", label: "Contact" },
  legal: { href: "/legal", label: "Legal set" },
} as const;

export type PageKey = keyof typeof PAGES;

export const FOOTER_COLUMNS: PageKey[][] = [
  ["home", "features", "rent", "tenants", "repairs"],
  ["landlords", "managers", "pricing", "services"],
  ["guides", "about", "contact", "legal"],
];
