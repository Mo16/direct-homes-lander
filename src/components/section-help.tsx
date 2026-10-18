import type { ReactNode } from "react";
import { Column } from "./ui";

/*
 * Help: the questions landlords ask before they move a home over, answered in full and left open. No accordion:
 * eight short answers read faster than eight clicks.
 */

export type Question = { q: string; a: string };

const QUESTIONS: Question[] = [
  {
    q: "Is it really free for tenants?",
    a: "Yes, on every plan. Tenants never pay to use DirectHomes and never pay a fee on their rent. Any payment fee is paid by you and never added to their rent.",
  },
  {
    q: "How does the rent reach me?",
    a: "Tenants pay through Stripe, by Pay by Bank or Direct Debit, and Stripe pays it into your own bank account on its normal schedule. DirectHomes never holds your rent.",
  },
  {
    q: "Can I keep collecting rent my own way?",
    a: "Yes. Record standing orders, transfers, cash or cheques against the ledger yourself. Rent you record carries no collection fee.",
  },
  {
    q: "Do you hold tenancy deposits?",
    a: "No. Deposits stay with a government-approved protection scheme. DirectHomes tracks the 30-day deadline and keeps the certificate with the tenancy.",
  },
  {
    q: "Does it cover Wales, Scotland and Northern Ireland?",
    a: "Rules, notices and deadlines are written for England in full. Homes elsewhere in the UK get the general certificate tracker, rent, repairs and messages.",
  },
  {
    q: "Can my existing tenants join?",
    a: "Add the home and the tenancy, then invite each tenant by email. They confirm their details, set up how they pay, and the tenancy history starts there.",
  },
  {
    q: "Is there an app to download?",
    a: "There is nothing to install. DirectHomes works in the browser on any phone or computer, and the tenant side is built for phones first.",
  },
  {
    q: "Where is my data kept?",
    a: "Core processing stays in London. Data is encrypted at rest and in transit, and no card or bank numbers are ever stored by DirectHomes.",
  },
];

/** The questions and answers, two columns of them; other pages pass their own `questions` and `title`. */
export function SectionHelp({ id = "help", title, questions = QUESTIONS }: { id?: string; title?: ReactNode; questions?: Question[] }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-[-56px] pt-24 sm:scroll-mt-[-88px] sm:pt-32">
      <Column className="grid gap-10 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)] lg:gap-16">
        <h2 id={`${id}-title`} className="text-[clamp(32px,4.2vw,56px)] leading-[1.04] tracking-[-0.03em] text-ink lg:sticky lg:top-24 lg:self-start">
          {title ?? (
            <>
              Questions
              <br />
              landlords ask.
            </>
          )}
        </h2>
        <dl className="grid gap-x-12 gap-y-9 sm:grid-cols-2">
          {questions.map(({ q, a }) => (
            <div key={q}>
              <dt className="text-[17px] leading-snug text-ink">{q}</dt>
              <dd className="mt-2 text-[15px] leading-[1.55] text-ink-2">{a}</dd>
            </div>
          ))}
        </dl>
      </Column>
    </section>
  );
}
