import { CheckmarkCircle02Icon } from "@hugeicons/core-free-icons";
import { Icon } from "./icon";
import { Column, Status } from "./ui";
import { cn } from "@/lib/utils";

/*
 * The Legal set page's two pieces.
 * - The index: every document the spec says DirectHomes needs before launch (webapp/docs/reference/spec.txt, section
 *   27), with one plain line on what it will cover, drawn from the spec. None is written yet, so none is shown as if
 *   it were: each says it is being prepared. The one wording that exists, the compliance disclaimer, is given in full,
 *   exactly as the app writes it (webapp documents/compliance). Each document has its own anchor.
 * - The disclaimer in use: the Compliance panel of a property's page in the app (webapp properties/[id]), where the
 *   short form of that wording already sits.
 */

const DISCLAIMER = "Suggested documents only. DirectHomes does not give legal advice and cannot guarantee compliance.";

const DOCUMENTS: { id: string; name: string; text: string }[] = [
  {
    id: "landlord-terms",
    name: "Landlord terms",
    text: "The agreement between you and DirectHomes: your plan and fees, how rent paid through Stripe works, refunds and disputes, and a data processing addendum for the records you keep about your tenants.",
  },
  {
    id: "tenant-terms",
    name: "Tenant terms",
    text: "What tenants agree to when they accept an invitation: a free account, paying rent through Stripe, and what DirectHomes does and doesn't do for them.",
  },
  {
    id: "privacy",
    name: "Privacy notice",
    text: "What DirectHomes collects and why. Core processing stays in London. You control the records you enter about your tenants and DirectHomes processes them for you. Tenants get their own notice with their invitation.",
  },
  {
    id: "cookies",
    name: "Cookie policy",
    text: "Only the cookies the site needs to work, unless you agree to analytics. Reject all will be as easy to choose as Accept all.",
  },
  {
    id: "acceptable-use",
    name: "Acceptable use",
    text: "The rules for using DirectHomes fairly and lawfully, for landlords, their staff and tenants alike.",
  },
  {
    id: "complaints",
    name: "Complaints procedure",
    text: "How to complain about DirectHomes itself and how your complaint will be handled. Disputes between landlords and tenants are not something DirectHomes can settle.",
  },
  {
    id: "sub-processors",
    name: "Sub-processors",
    text: "Every company that handles data for DirectHomes, where it is and the safeguard that covers it. Among them Supabase, which keeps the database and files in London, and Stripe, which handles payments as a controller in its own right.",
  },
  {
    id: "accessibility",
    name: "Accessibility statement",
    text: "The standard DirectHomes is being built to, WCAG 2.2 AA, and anywhere it still falls short.",
  },
  {
    id: "vulnerability-disclosure",
    name: "Vulnerability disclosure",
    text: "How to report a security problem safely, with a security.txt file for researchers. Until it is published, use the contact form.",
  },
];

function Row({ id, name, status, wash, children }: { id: string; name: string; status: React.ReactNode; wash?: boolean; children: React.ReactNode }) {
  return (
    <li id={id} className={cn("grid scroll-mt-28 gap-x-10 gap-y-4 rounded-[10px] p-6 sm:p-8 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]", wash ? "brand-wash" : "bg-white/50")}>
      <div className="flex flex-col gap-2.5">
        <h3 className="text-[clamp(21px,1.8vw,25px)] leading-[1.15] tracking-[-0.01em] text-ink">
          <a href={`#${id}`} className="transition-colors hover:text-ink-2">
            {name}
          </a>
        </h3>
        {status}
      </div>
      <div className="max-w-[44rem] md:pt-0.5">{children}</div>
    </li>
  );
}

const preparing = <Status kind="upcoming">Being prepared before launch</Status>;

export function SectionLegalIndex() {
  return (
    <section aria-labelledby="documents-title" className="pt-24 sm:pt-32">
      <Column className="grid gap-10 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)] lg:gap-14">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <h2 id="documents-title" className="text-[clamp(32px,3.2vw,46px)] leading-[1.06] tracking-[-0.03em] text-ink">
            Ten documents.
            <br />
            None final yet.
          </h2>
          <p className="mt-5 max-w-[24rem] text-[16px] leading-[1.55] text-ink-2">
            Each is listed with what it will cover, so you know what to expect. The full text of each will appear here once it has been written and checked by a solicitor.
          </p>
        </div>

        <ol className="flex flex-col gap-2">
          {DOCUMENTS.slice(0, 7).map((d) => (
            <Row key={d.id} id={d.id} name={d.name} status={preparing}>
              <p className="text-[16px] leading-[1.55] text-ink-2">{d.text}</p>
            </Row>
          ))}
          <Row
            id="disclaimer"
            name="Disclaimer"
            wash
            status={
              <span className="inline-flex items-center gap-1.5 text-[13px] text-good">
                <Icon icon={CheckmarkCircle02Icon} size={15} />
                Wording in use in the app
              </span>
            }
          >
            <p className="text-[clamp(19px,1.6vw,22px)] leading-[1.4] tracking-[-0.005em] text-ink">{DISCLAIMER}</p>
            <p className="mt-3 text-[15px] leading-[1.55] text-ink-2">This is the wording the app shows wherever it tracks a certificate or deadline. The full disclaimer page is being prepared before launch.</p>
          </Row>
          {DOCUMENTS.slice(7).map((d) => (
            <Row key={d.id} id={d.id} name={d.name} status={preparing}>
              <p className="text-[16px] leading-[1.55] text-ink-2">{d.text}</p>
            </Row>
          ))}
        </ol>
      </Column>
    </section>
  );
}

/* ---------- The disclaimer, where it already sits ---------- */

const ITEMS = [
  { label: "Gas safety record", when: "Valid until 12 Nov 2026", status: "Expiring", tone: "warn" as const },
  { label: "EICR", when: "Valid until 4 Jun 2029", status: "Valid", tone: "paid" as const },
  { label: "EPC", when: "Valid until 20 Jan 2032", status: "Valid", tone: "paid" as const },
  { label: "Smoke and CO alarm check", when: "Done 1 Oct 2025", status: "Valid", tone: "paid" as const },
  { label: "Deposit protection", when: "Done 21 Oct 2025", status: "Valid", tone: "paid" as const },
];

export function SectionDisclaimerInUse() {
  return (
    <section aria-labelledby="in-use-title" className="pt-24 sm:pt-32">
      <Column>
        <div className="brand-wash brand-wash-3 grid gap-10 rounded-panel p-4 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-16 lg:p-14">
          <div className="px-2 pt-4 sm:px-0 sm:pt-0">
            <h2 id="in-use-title" className="text-[clamp(28px,3.8vw,52px)] leading-[1.06] tracking-[-0.03em] text-ink">
              Said plainly,
              <br />
              wherever it matters.
            </h2>
            <p className="mt-5 max-w-[28rem] text-[17px] leading-[1.55] text-ink-2">
              Every place the app tracks a certificate or a deadline says what it is and isn&rsquo;t: a reminder you can rely on, never legal advice.
            </p>
          </div>

          {/* The Compliance panel of a property's page, as the app draws it: a picture, so it can't be clicked. */}
          <div aria-hidden className="pointer-events-none rounded-[10px] bg-canvas p-2 text-ink select-none shadow-[0_1px_2px_rgb(20_20_20/0.1),0_24px_40px_-28px_rgb(30_28_40/0.5)]">
            <div className="panel p-5 sm:p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-[18px] leading-tight">Compliance</p>
                  <p className="mt-1 text-[13.5px] leading-snug text-muted">Suggested documents only. Not legal advice and no guarantee of compliance.</p>
                </div>
                <span className="shrink-0 text-[13.5px] text-ink-2">See all</span>
              </div>
              <ul className="flex flex-col gap-1">
                {ITEMS.map((c) => (
                  <li key={c.label} className="flex items-center justify-between gap-3 rounded-tile bg-surface px-4 py-3">
                    <span className="min-w-0">
                      <span className="block truncate text-[14.5px]">{c.label}</span>
                      <span className="block truncate text-[12.5px] text-muted">{c.when}</span>
                    </span>
                    <Status kind={c.tone} className="text-[13.5px]">
                      {c.status}
                    </Status>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="sr-only">
            The Compliance panel for Flat 2, 14 Royal York Crescent: gas safety record expiring on 12 November 2026, and the EICR, EPC, smoke and CO alarm check and deposit protection valid. Under its title: Suggested documents only. Not legal advice and no guarantee of compliance.
          </p>
        </div>
      </Column>
    </section>
  );
}
