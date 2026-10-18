import { Hero } from "@/components/hero";
import { LogoStrip } from "@/components/logo-strip";
import { SectionTwoSides } from "@/components/section-two-sides";
import { SectionHelp } from "@/components/section-help";
import { SectionLandlords } from "@/components/section-landlords";
import { SectionPricing } from "@/components/section-pricing";
import { SectionSetup } from "@/components/section-setup";
import { SectionReview } from "@/components/section-review";
import { SectionTenants } from "@/components/section-tenants";
import { SectionTax } from "@/components/section-tax";
import { SectionFeatures } from "@/components/section-features";
import { SectionConnect } from "@/components/section-connect";

export default function Page() {
  return (
    <main>
      <Hero />
      <LogoStrip />
      <SectionTwoSides />
      <SectionLandlords />
      <SectionTax />
      <SectionFeatures />
      <SectionConnect />
      <SectionTenants />
      <SectionReview />
      <SectionSetup />
      <SectionPricing />
      <SectionHelp />
    </main>
  );
}
