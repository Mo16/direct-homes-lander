import type { Metadata } from "next";
import { SectionAnswers, SectionGuidesSoon, SectionKeyDates } from "@/components/guides-pieces";
import { NextPages } from "@/components/next-pages";
import { PageHero } from "@/components/page-hero";

export const metadata: Metadata = {
  title: "Guides and FAQs",
  description: "Search straight answers about DirectHomes, and see the dates landlords in England are working to. General information, not legal advice.",
};

export default function GuidesPage() {
  return (
    <main>
      <PageHero
        photo="terrace"
        title={
          <>
            Straight answers,
            <br />
            and the dates ahead.
          </>
        }
        lead="Search what landlords ask about DirectHomes, and see what changes for landlords in England and when. General information, not legal advice."
      />
      <SectionAnswers />
      <SectionKeyDates />
      <SectionGuidesSoon />
      <NextPages
        items={[
          { page: "services", text: "Mortgages, insurance, tax and legal help, through people we introduce you to." },
          { page: "contact", text: "Ask us anything else. Everyone gets a first reply within 1 working day." },
        ]}
      />
    </main>
  );
}
