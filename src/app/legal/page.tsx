import type { Metadata } from "next";
import { SectionDisclaimerInUse, SectionLegalIndex } from "@/components/legal-pieces";
import { NextPages } from "@/components/next-pages";
import { PageHero } from "@/components/page-hero";
import { SectionHelp } from "@/components/section-help";

export const metadata: Metadata = {
  title: "Legal set",
  description: "The terms, privacy notice, cookie policy and the rest of DirectHomes' legal set: what each will cover, and where each stands before launch.",
};

const QUESTIONS = [
  { q: "Can I read the terms before I sign up?", a: "Each document will be published here in full before DirectHomes opens. Until then, this page says what each will cover." },
  { q: "Who controls my tenants' data?", a: "You do, for the records you enter about your tenants. DirectHomes processes them for you, under a data processing addendum in the Landlord terms." },
  { q: "Does DirectHomes give legal advice?", a: "No. Reminders and suggested documents help you keep track, but they are not legal advice and can't guarantee compliance." },
  { q: "Where is my data kept?", a: "Core processing stays in London. Any company that handles data outside the UK will be named on the Sub-processors list, with the safeguard that covers it." },
  { q: "Will the site use cookies?", a: "Only the ones it needs to work, unless you agree to analytics. Saying no will be as easy as saying yes." },
  { q: "How do I report a security problem?", a: "A vulnerability disclosure policy is being prepared. Until it's published, write to us through the contact form." },
];

export default function LegalPage() {
  return (
    <main>
      <PageHero
        photo="terrace"
        title={
          <>
            The small print,
            <br />
            being written.
          </>
        }
        lead="Every document DirectHomes needs before it opens, what each will cover, and where it stands. A solicitor will write or review each one, so none is final yet."
        action={false}
      />
      <SectionLegalIndex />
      <SectionDisclaimerInUse />
      <SectionHelp
        id="legal-questions"
        title={
          <>
            Fair
            <br />
            questions.
          </>
        }
        questions={QUESTIONS}
      />
      <NextPages
        items={[
          { page: "about", text: "What DirectHomes is and isn't, and how your account and data are kept safe." },
          { page: "contact", text: "A question about any of these documents? Write to us and we'll reply by email." },
        ]}
      />
    </main>
  );
}
