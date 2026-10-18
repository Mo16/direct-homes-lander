import type { Metadata } from "next";
import { NextPages } from "@/components/next-pages";
import { PageHero } from "@/components/page-hero";
import { SectionPlanChange } from "@/components/pricing-pieces";
import { SectionPaymentMoney } from "@/components/rent-pieces";
import { SectionHelp } from "@/components/section-help";
import { SectionPricing } from "@/components/section-pricing";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Free for one property. Advanced and Professional for more homes, a lower fee and a team. Tenants never pay.",
};

const QUESTIONS = [
  { q: "Is Free really free?", a: "Yes, for one property, with every feature. The only cost is on rent collected online: the 5% DirectHomes fee and Stripe’s own fee." },
  { q: "What is the 5% fee?", a: "On Free and Advanced, DirectHomes takes 5% of rent collected online, as the payment lands. Professional has no DirectHomes fee. Rent you record yourself carries none on any plan." },
  { q: "Do tenants pay anything?", a: "Never. Tenants pay exactly the rent and use DirectHomes free on every plan, with as many tenant accounts as you need." },
  { q: "How much does paying yearly save?", a: "17% on Advanced, £299.99 a year instead of £359.88, and 8% on Professional, £1,100 instead of £1,199.88." },
  { q: "Can I change plan later?", a: "Any time, from Billing. Upgrades start straight away and are prorated. Downgrades and cancellations take effect when your paid period ends." },
  { q: "What if I move to a smaller plan?", a: "You choose which properties stay active and the rest lock. Locked properties are never deleted, and their tenants can still pay rent, report repairs and message you." },
  { q: "How do staff seats work?", a: "Professional includes 25, the owner’s among them. Extra seats are £50 each, one-off. Free and Advanced are for the owner alone." },
  { q: "Is VAT included?", a: "VAT on DirectHomes’ prices is still being confirmed before launch, so the prices here are shown before that is settled." },
];

export default function PricingPage() {
  return (
    <main>
      <PageHero
        photo="clouds"
        title={
          <>
            Every feature,
            <br />
            on every plan.
          </>
        }
        lead="Plans differ only in how many homes you run, the fee on rent collected online and whether you have a team. Your tenants never pay."
      />
      <SectionPricing />
      <SectionPaymentMoney />
      <SectionPlanChange />
      <SectionHelp id="pricing-questions" title={<>Pricing, answered.</>} questions={QUESTIONS} />
      <NextPages
        items={[
          { page: "rent", text: "Pay by Bank and Direct Debit, straight into your own bank through Stripe." },
          { page: "managers", text: "Staff seats, roles and property assignment on Professional." },
          { page: "services", text: "Mortgages, insurance, tax and legal help, on every plan." },
        ]}
      />
    </main>
  );
}
