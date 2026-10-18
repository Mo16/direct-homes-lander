import type { Metadata } from "next";
import { NextPages } from "@/components/next-pages";
import { PageHero } from "@/components/page-hero";
import { ProductTour } from "@/components/product-tour";
import { SectionPaymentMoney, SectionReminders } from "@/components/rent-pieces";
import { SectionHelp } from "@/components/section-help";
import { SectionTwoSides } from "@/components/section-two-sides";

export const metadata: Metadata = {
  title: "Rent collection",
  description: "Pay by Bank and Direct Debit straight into your own bank through Stripe, reminders sent for you, and a ledger that keeps itself.",
};

const QUESTIONS = [
  { q: "Does DirectHomes ever hold my rent?", a: "No. Tenants pay into your own Stripe account and Stripe pays it into your bank on its normal schedule. DirectHomes adds no holds or delays of its own." },
  { q: "Do tenants pay a fee?", a: "Never. They pay exactly the rent. Stripe’s fee and the DirectHomes fee come out of the payment before it reaches you, and Professional has no DirectHomes fee." },
  { q: "Can a tenant pay part of the rent?", a: "Yes, from £10. The payment goes to the oldest charge first, and the rest stays on the ledger as partially paid." },
  { q: "How do joint tenants pay?", a: "Each can pay their own share by auto-pay, with the shares set as percentages, or any one of them can pay the whole charge." },
  { q: "What if a Direct Debit fails?", a: "You and the tenant are both told straight away, and the tenant gets a Pay now link to pay by bank instead." },
  { q: "Do I get statements?", a: "Every month, as a PDF and a CSV: rent charged, money received online and by hand, fees, payouts and arrears. Every payment gets a numbered receipt too." },
];

export default function RentCollectionPage() {
  return (
    <main>
      <PageHero
        photo="terrace"
        title={
          <>
            Rent that arrives
            <br />
            on its own.
          </>
        }
        lead="Tenants pay by bank in a tap or by Direct Debit, straight into your own bank through Stripe. Every payment files itself in the ledger."
        caption="The DirectHomes Rent page: a tenant's reported bank transfer is confirmed and goes into the ledger, and the month's received and overdue totals update."
      >
        <ProductTour only={["rent"]} bare />
      </PageHero>
      <SectionTwoSides />
      <SectionPaymentMoney />
      <SectionReminders />
      <SectionHelp id="rent-questions" title={<>Rent, answered.</>} questions={QUESTIONS} />
      <NextPages
        items={[
          { page: "tenants", text: "What your tenants see when they pay, report a repair or read a document." },
          { page: "pricing", text: "Free for one home. The plans, the fees and what paying yearly saves." },
          { page: "repairs", text: "From the tenant's photo to the fix they confirm, on one shared timeline." },
        ]}
      />
    </main>
  );
}
