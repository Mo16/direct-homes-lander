import type { Metadata } from "next";
import { SectionAppMap } from "@/components/features-pieces";
import { NextPages } from "@/components/next-pages";
import { PageHero } from "@/components/page-hero";
import { ProductTour } from "@/components/product-tour";
import { SectionConnect } from "@/components/section-connect";
import { SectionFeatures } from "@/components/section-features";
import { SectionTax } from "@/components/section-tax";

export const metadata: Metadata = {
  title: "Features",
  description: "Rent, repairs, certificates, messages, tasks and the books for every home you let, in one app you and your tenants share.",
};

export default function FeaturesPage() {
  return (
    <main>
      <PageHero
        photo="sky"
        title={
          <>
            Rent to repairs,
            <br />
            all in one app.
          </>
        }
        lead="Certificates, messages, tasks and the books as well, for every home you let, in one record you and your tenants share."
        caption="The DirectHomes web app, playing a short demo of each part in turn: rent, repairs, messages, tasks, properties, team, the tenant's app and finance."
      >
        {/* The nav's product menu plays its demos here ("#tour"), and other pages link to them as /features#tour-<id>. */}
        <div id="tour" className="scroll-mt-20 sm:scroll-mt-24">
          <ProductTour bare />
        </div>
      </PageHero>
      <SectionAppMap />
      <SectionFeatures />
      <SectionTax />
      <SectionConnect />
      <NextPages
        items={[
          { page: "landlords", text: "For a home or ten: certificates home by home, and Free or Advanced in plain words." },
          { page: "managers", text: "Professional for teams: roles, the homes each person looks after, and no fee on rent." },
          { page: "pricing", text: "Free for one home. The plans, the fees and what paying yearly saves." },
        ]}
      />
    </main>
  );
}
