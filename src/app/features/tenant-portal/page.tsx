import type { Metadata } from "next";
import { Mail01Icon } from "@hugeicons/core-free-icons";
import { Icon } from "@/components/icon";
import { NextPages } from "@/components/next-pages";
import { PageHero } from "@/components/page-hero";
import { ProductTour } from "@/components/product-tour";
import { SectionHelp } from "@/components/section-help";
import { SectionInvite, SectionTenantPhone } from "@/components/tenant-portal-pieces";

export const metadata: Metadata = {
  title: "Tenant portal",
  description: "Tenants pay rent, report repairs, read documents and message their landlord from any phone. Free for them on every plan, with nothing to install.",
};

const QUESTIONS = [
  { q: "Do tenants pay anything?", a: "No. The tenant side is free on every plan, with as many tenant accounts as you need, and tenants pay exactly the rent with no fee added." },
  { q: "How does a tenant join?", a: "You invite them from the tenancy and they get an email from you. The link works for 14 days, and they set up their account from it." },
  { q: "What about joint tenants?", a: "Each one gets their own account and sees the same tenancy. Any of them can pay, or each can pay their own share by auto-pay." },
  { q: "Is there an app to install?", a: "No. It works in the browser on any phone or computer, and the tenant side is made for phones first. Native apps are planned after launch." },
  { q: "What happens when the tenancy ends?", a: "Tenants keep read-only access to their statement, receipts and shared documents. Messaging closes 90 days after the end date." },
  { q: "Who do tenants contact for help?", a: "DirectHomes support helps tenants with the platform itself. DirectHomes is not a letting agent, so questions about the home go to their landlord." },
  { q: "What if their landlord isn't on DirectHomes?", a: "A tenant who signs up without an invitation can invite their landlord to join." },
  { q: "What can tenants upload?", a: "Their own documents, like contents insurance or check-in photos, and photos or video on a repair. You can see what they add." },
];

export default function TenantPortalPage() {
  return (
    <main>
      <PageHero
        photo="sky"
        title={
          <>
            Free for tenants,
            <br />
            and always will be.
          </>
        }
        lead="Your tenants pay rent, report repairs, read their documents and message you from any phone. No fees for them, and nothing to install."
        action={
          <p className="flex items-start gap-2.5 text-[15px] leading-snug text-ink">
            <Icon icon={Mail01Icon} size={18} className="mt-px" />
            Got an invitation? Open the email from your landlord to set up your account.
          </p>
        }
        caption="Nina's tenant app: she reports a broken bedroom window with a photo, and it appears in her open repairs, sent to her landlord."
      >
        <ProductTour only={["tenants"]} bare />
      </PageHero>
      <SectionTenantPhone />
      <SectionInvite />
      <SectionHelp id="tenant-questions" title={<>Tenants, answered.</>} questions={QUESTIONS} />
      <NextPages
        items={[
          { page: "repairs", text: "From the tenant's report to the fix they confirm, with targets for every priority." },
          { page: "rent", text: "How tenants pay by bank or Direct Debit, straight into your own account." },
          { page: "pricing", text: "The tenant side is free on every plan. Free for one home." },
        ]}
      />
    </main>
  );
}
