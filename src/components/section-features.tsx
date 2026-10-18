import { ChartIncreaseIcon, Database01Icon, FileValidationIcon, JusticeScale01Icon, PassportIcon, PercentSquareIcon } from "@hugeicons/core-free-icons";
import { Icon } from "./icon";
import { Column } from "./ui";
import { cn } from "@/lib/utils";

/*
 * What a landlord gains, as plain text tiles (the user's August reference): an icon, a name and one or two lines.
 * Only things the rest of the home page does not already say (the user asked). Every fact is the app's own:
 * tenancy and rent-change rules (features/tenancies/rules.ts), acknowledgements (spec 1840), compliance reminder
 * days and the PRS dates (domain/compliance.ts), and mortgage fixed-period reminders (features/finance/rules.ts).
 * The Renters' Rights Act tile carries the brand wash.
 */

const TILES = [
  { icon: JusticeScale01Icon, title: "Renters’ Rights Act ready", text: "New tenancies in England are periodic by default, and the Information Sheet you gave is kept on record.", wash: true },
  { icon: ChartIncreaseIcon, title: "Rent rises by the book", text: "A warning if it is under 52 weeks since the last rise or under two months’ notice, and a prompt for the Section 13 notice." },
  { icon: FileValidationIcon, title: "Proof your tenant got it", text: "Tenants confirm they have received the gas safety record, EPC or Information Sheet, and the time is kept as evidence." },
  { icon: Database01Icon, title: "Landlord Database", text: "Registration opens on 15 December 2026. You are reminded well before the 14 November 2027 deadline." },
  { icon: PassportIcon, title: "Right to Rent follow-ups", text: "When a tenant’s right to rent runs out, you are reminded 28 and 7 days before the check is due." },
  { icon: PercentSquareIcon, title: "Mortgage deals watched", text: "Reminders 90, 60 and 30 days before a fixed period ends, so you have time to find the next deal." },
];

export function SectionFeatures() {
  return (
    <section id="features" aria-labelledby="features-title" className="pt-24 sm:pt-32">
      <Column>
        <div className="mx-auto max-w-[60rem] text-center">
          <h2 id="features-title" className="text-[clamp(28px,3.8vw,52px)] leading-[1.06] tracking-[-0.03em] text-ink">
            New rules, handled for you.
          </h2>
          <p className="mx-auto mt-4 max-w-[34rem] text-[17px] text-balance leading-[1.55] text-ink-2">Law changes, deadlines and proof, kept on track so nothing catches you out.</p>
        </div>

        <ul className="mt-10 grid gap-2 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
          {TILES.map((t) => (
            <li key={t.title} className={cn("flex flex-col rounded-[10px] p-7 lg:p-8", t.wash ? "brand-wash" : "bg-white/50")}>
              <Icon icon={t.icon} size={28} strokeWidth={1.4} className="text-ink" />
              <div className="pt-16 sm:pt-24">
                <h3 className="text-[22px] leading-tight tracking-[-0.01em] text-ink">{t.title}</h3>
                <p className="mt-3 max-w-[26rem] text-[16px] leading-[1.55] text-ink-2">{t.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </Column>
    </section>
  );
}
