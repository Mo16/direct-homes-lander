import type { Metadata } from "next";
import { NextPages } from "@/components/next-pages";
import { PageHero } from "@/components/page-hero";
import { ProductTour } from "@/components/product-tour";
import { SectionPriorities, SectionRepairCosts, SectionSafetyGate } from "@/components/repairs-pieces";
import { SectionHelp } from "@/components/section-help";

export const metadata: Metadata = {
  title: "Repairs",
  description: "Tenants report repairs with photos from their phone. You confirm the priority, book the visit and close it on one timeline they can follow.",
};

const QUESTIONS = [
  { q: "How do tenants report a repair?", a: "From their phone, in four short steps: what is wrong, a safety check, the details, then access and photos. Up to 10 photos or videos at a time, with location data stripped." },
  { q: "Who decides the priority?", a: "The tenant suggests one and you confirm it. If their safety answers point to an emergency, the report arrives as one whatever they pick." },
  { q: "Are the targets legal deadlines?", a: "No. They are DirectHomes' recommendations to help you respond in good time, and you can change them. While a repair is on hold, its clock pauses." },
  { q: "What happens with damp and mould?", a: "Reports in that category are flagged for hazard review automatically, so they stand out in your list and on the repair itself." },
  { q: "How does a repair close?", a: "When you mark it resolved, the tenant is asked to confirm the fix. It closes when they do, or by itself after 7 days, and they can reopen it within those 7 days." },
  { q: "Can I keep notes the tenant won't see?", a: "Yes. Internal notes stay with your team. Everything else on the timeline is shared, so nobody has to ask for an update." },
  { q: "Can my team handle repairs?", a: "Assign a repair to anyone on your team. Contractor details are kept on the repair, and you set the visit window for the tenant to confirm." },
  { q: "Do tenants ever pay for a repair?", a: "Never through DirectHomes. Costs you pay go into Finance as expenses, and nothing is ever charged to a tenant." },
];

export default function RepairsPage() {
  return (
    <main>
      <PageHero
        photo="clouds"
        title={
          <>
            Every repair,
            <br />
            start to finish.
          </>
        }
        lead="Tenants report it with photos from their phone. You confirm the priority, book the visit and close it on one timeline they can follow."
        caption="The DirectHomes Repairs page: a damp patch reported by Freya is booked for a visit, marked resolved, and closes when Freya confirms the fix."
      >
        <ProductTour only={["repairs"]} bare />
      </PageHero>
      <SectionSafetyGate />
      <SectionPriorities />
      <SectionRepairCosts />
      <SectionHelp id="repairs-questions" title={<>Repairs, answered.</>} questions={QUESTIONS} />
      <NextPages
        items={[
          { page: "tenants", text: "What your tenants see on their phone, from reporting a repair to paying rent." },
          { page: "rent", text: "Rent by bank or Direct Debit, straight into your own account, with reminders sent for you." },
          { page: "pricing", text: "Repairs work the same on every plan. Free for one home." },
        ]}
      />
    </main>
  );
}
