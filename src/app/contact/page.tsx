import type { Metadata } from "next";
import { ContactStage, SectionInAppSupport } from "@/components/contact-pieces";
import { NextPages } from "@/components/next-pages";
import { PageHero } from "@/components/page-hero";
import { SectionHelp } from "@/components/section-help";

export const metadata: Metadata = {
  title: "Contact",
  description: "Send the DirectHomes team a message. We aim to reply within 1 working day, or 4 working hours on Professional.",
};

const QUESTIONS = [
  { q: "Can I phone you?", a: "Not at the moment. Write to us here, or from Support inside the app, and we reply by email." },
  { q: "I've lost my phone and can't sign in.", a: "Use one of your recovery codes in place of the code from your phone. If you've lost those too, write to us here." },
  { q: "Can DirectHomes help with a problem with my landlord?", a: "No. DirectHomes isn't a letting agent and can't settle disputes. For free, independent advice, contact Shelter or Citizens Advice." },
  { q: "My landlord isn't on DirectHomes. Can I still use it?", a: "You can invite your landlord to join. Once they add your home and tenancy, you can pay rent and report repairs there, free." },
  { q: "Can I try it before I ask anything?", a: "Yes. Your first home is free to run, so you can set it up and see for yourself." },
  { q: "Do you work with letting agents?", a: "DirectHomes is built for landlords who run their own homes, alone or with a team. It doesn't do client accounts or owner statements for agents." },
];

export default function ContactPage() {
  return (
    <main>
      <PageHero
        photo="sky"
        title={
          <>
            Write to us.
            <br />
            We&rsquo;ll write back.
          </>
        }
        lead="Questions before you start, help with your account, or something we should know. Tell us who you are and we'll reply by email."
        action={false}
        caption="The contact form: your name, email, who you are, what it's about and your message, with reply times and emergency numbers beside it."
      >
        <ContactStage />
      </PageHero>
      <SectionInAppSupport />
      <SectionHelp id="contact-questions" title={<>Before you write.</>} questions={QUESTIONS} />
      <NextPages
        items={[
          { page: "about", text: "What DirectHomes is and isn't, and how your account and data are kept safe." },
          { page: "pricing", text: "Free for one home. The plans, the fees and what paying yearly saves." },
          { page: "tenants", text: "What tenants see when they pay rent, report a repair or read a document." },
        ]}
      />
    </main>
  );
}
