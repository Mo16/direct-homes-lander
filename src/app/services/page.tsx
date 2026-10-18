import type { Metadata } from "next";
import { NextPages } from "@/components/next-pages";
import { PageHero } from "@/components/page-hero";
import { SectionHelp } from "@/components/section-help";
import { SectionRequests, SectionServiceRules, ServicesStage } from "@/components/services-pieces";

export const metadata: Metadata = {
  title: "Help & Services",
  description: "Introductions for Islamic finance, buy-to-let mortgages, landlord insurance, accounting and tax, and legal help. DirectHomes introduces, partners advise.",
};

const QUESTIONS = [
  { q: "Does it cost anything?", a: "No, and it is on every plan. If you go ahead with a partner, DirectHomes may receive a referral fee from them, and every service says so before you send." },
  { q: "Does DirectHomes give advice?", a: "No. We introduce you to someone who can help, and they advise. We never recommend a product." },
  { q: "Who can send a request?", a: "The owner or an admin of the workspace. Other staff can see what is available and ask them to send one." },
  { q: "How soon will I hear back?", a: "Someone from DirectHomes aims to contact you within 1 working day, by email or phone, at the time you said suits you." },
  { q: "What is shared, and when?", a: "Your name, email, phone if you give one, the property address if you pick one, and your answers. Only after we have spoken to you, and only because you ticked the box." },
  { q: "Can I change my mind?", a: "Yes. Cancel the request at any time before it is complete. Requests are kept for 2 years after they close, then deleted." },
];

export default function ServicesPage() {
  return (
    <main>
      <PageHero
        photo="sky"
        title={
          <>
            We introduce.
            <br />
            Partners advise.
          </>
        }
        lead="Mortgages, Islamic finance, insurance, tax and legal help for landlords. Answer a few questions, tick the box, and we aim to be in touch within 1 working day."
        caption="The DirectHomes request page for each of the five services: the service's own questions, how to contact you, and an unticked consent box naming what is shared and with whom."
      >
        <ServicesStage />
      </PageHero>
      <SectionServiceRules />
      <SectionRequests />
      <SectionHelp id="services-questions" title={<>Help, answered.</>} questions={QUESTIONS} />
      <NextPages
        items={[
          { page: "pricing", text: "Every plan includes Help & Services. The plans differ on homes, fees and team." },
          { page: "guides", text: "Straight answers, and the dates landlords in England are working to." },
        ]}
      />
    </main>
  );
}
