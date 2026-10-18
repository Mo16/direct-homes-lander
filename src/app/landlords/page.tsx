import type { Metadata } from "next";
import { SectionCertificates, SectionLandlordSetup, SectionPlainPlans } from "@/components/landlords-pieces";
import { NextPages } from "@/components/next-pages";
import { PageHero } from "@/components/page-hero";
import { ProductTour } from "@/components/product-tour";
import { SectionHelp } from "@/components/section-help";

export const metadata: Metadata = {
  title: "For landlords",
  description: "Free for your first home, Advanced for up to ten. Rent, repairs, certificates and messages for every home you let, in one place.",
};

const QUESTIONS = [
  { q: "Can I start with one home and add more later?", a: "Yes. Free covers one home. When you add a second, move to Advanced, which covers up to ten with the same features." },
  { q: "Do I need a limited company?", a: "No. You can collect rent as an individual, a sole trader, a limited company or a partnership. Stripe asks for your details when you set up online rent." },
  { q: "Will it remind me about certificates?", a: "Yes. Gas safety, EICR, EPC, alarms, deposit protection and licences each have their own reminders, by email and in the app, before they run out." },
  { q: "Does DirectHomes find tenants?", a: "No. It runs the homes you already let, or are about to. Add the tenancy and invite your tenants when you have them." },
  { q: "Can my accountant see the numbers?", a: "Send them your statements and each tax year as PDF or CSV. Giving them their own read-only sign-in needs Professional." },
  { q: "My home is in Wales. Does it work?", a: "Yes. Rent, repairs, messages and documents work across the UK. Rules and deadlines are written for England in full, and other homes get the general certificate tracker." },
];

export default function LandlordsPage() {
  return (
    <main>
      <PageHero
        photo="clouds"
        title={
          <>
            For landlords
            <br />
            with a home or ten.
          </>
        }
        lead="Your first home is free. Add it by postcode and the rent, repairs and certificates run from one screen, with nothing to install."
        caption="The DirectHomes Properties page: a new home is found by its postcode and added with its compliance reminders already set."
      >
        <ProductTour only={["properties"]} bare />
      </PageHero>
      <SectionCertificates />
      <SectionLandlordSetup />
      <SectionPlainPlans />
      <SectionHelp id="landlord-questions" title={<>Landlords ask.</>} questions={QUESTIONS} />
      <NextPages
        items={[
          { page: "rent", text: "Pay by Bank and Direct Debit straight into your own bank, and a ledger that keeps itself." },
          { page: "tenants", text: "What your tenants see when they pay, report a repair or read a document." },
          { page: "pricing", text: "Every plan side by side, and what paying yearly saves." },
        ]}
      />
    </main>
  );
}
