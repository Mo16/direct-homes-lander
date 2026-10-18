import type { Metadata } from "next";
import { SectionSafeguards, SectionSecurity, SectionWhatItIs } from "@/components/about-pieces";
import { NextPages } from "@/components/next-pages";
import { PageHero } from "@/components/page-hero";
import { SectionHelp } from "@/components/section-help";

export const metadata: Metadata = {
  title: "About and security",
  description: "What DirectHomes is and isn't, and how it keeps your account and data safe: two-step sign-in, data in London and no card numbers stored.",
};

const QUESTIONS = [
  { q: "Can DirectHomes see my bank details?", a: "No. Your payout details stay in your own Stripe account, and card and bank numbers are held by Stripe, never by DirectHomes." },
  { q: "Who can see my tenants' records?", a: "You, and anyone you invite to your team, within the role you give them. Each tenant sees only their own tenancy." },
  { q: "Do I have to use two-step sign-in?", a: "On Free and Advanced it's your choice. On Professional, Owners and Admins must use it, and changing payout details always asks for it." },
  { q: "What if I signed in somewhere I shouldn't have?", a: "Settings, then Security, lists every device you're signed in on. Sign out any of them, or everywhere else at once." },
  { q: "Can I take my data with me?", a: "Yes. Settings, then Data and privacy, builds a ZIP of everything held about you: profile, tenancies, payments, repairs, messages and your files." },
  { q: "What happens if I delete my account?", a: "It's erased after 30 days, and you can cancel until then. Rent ledgers, receipts and tenancy records are kept for 6 years, as the law requires, then erased." },
];

export default function AboutPage() {
  return (
    <main>
      <PageHero
        photo="clouds"
        title={
          <>
            The software,
            <br />
            not the agent.
          </>
        }
        lead="DirectHomes runs rent, repairs and paperwork for UK landlords and their tenants. You stay in charge of your homes, and DirectHomes never holds your money."
      />
      <SectionWhatItIs />
      <SectionSecurity />
      <SectionSafeguards />
      <SectionHelp id="about-questions" title={<>Your data, answered.</>} questions={QUESTIONS} />
      <NextPages
        items={[
          { page: "legal", text: "Every document DirectHomes needs before it opens, and where each one stands." },
          { page: "pricing", text: "Free for one home. The plans, the fees and what paying yearly saves." },
          { page: "contact", text: "A question we haven't answered? Write to us and we'll reply by email." },
        ]}
      />
    </main>
  );
}
