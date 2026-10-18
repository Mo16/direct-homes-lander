import type { Metadata } from "next";
import { SectionRoles, SectionStaff } from "@/components/managers-pieces";
import { NextPages } from "@/components/next-pages";
import { PageHero } from "@/components/page-hero";
import { ProductTour } from "@/components/product-tour";
import { SectionHelp } from "@/components/section-help";
import { Column, SectionHead } from "@/components/ui";

export const metadata: Metadata = {
  title: "For property managers",
  description: "Professional for teams: staff with roles and the homes they look after, 25 seats, two-step sign-in, an audit trail and no DirectHomes fee on rent.",
};

const QUESTIONS = [
  { q: "Can a Manager see every property?", a: "Only the ones you assign them. Admins see every property. Managers and Viewers can be given all properties or just a few." },
  { q: "Can my accountant sign in?", a: "Yes, as a Viewer. They can read properties, rent, statements, repairs and documents, but can’t change anything or see messages with tenants." },
  { q: "How many staff can I add?", a: "25 seats come with Professional, and the Owner is one of them. A pending invitation holds a seat. Extra seats are £50 each, paid once." },
  { q: "What happens when someone leaves?", a: "Remove them and it takes effect on their next click. Their open repairs are handed to someone else, and their messages stay, marked as former staff." },
  { q: "Do you hold client money?", a: "No. Rent goes into the workspace’s own Stripe account and on to its bank. DirectHomes is software: it has no client accounts and no owner statements for agencies." },
  { q: "We run more than one company. Can we split them?", a: "Each legal entity gets its own workspace, and one sign-in can belong to several. Staff only see the workspaces they are invited to." },
];

export default function PropertyManagersPage() {
  return (
    <main>
      <PageHero
        photo="terrace"
        title={
          <>
            One portfolio,
            <br />
            the whole team on it.
          </>
        }
        lead="Professional gives everyone on your team their own sign-in, a role and the homes they look after. There’s no DirectHomes fee on rent."
        caption="The DirectHomes Team page: a manager is invited to two properties with a link that works for 7 days, and their seat shows straight away."
      >
        <ProductTour only={["team"]} bare />
      </PageHero>
      <SectionRoles />
      <SectionStaff />
      <section aria-labelledby="board-title" className="pt-24 sm:pt-32">
        <Column>
          <SectionHead
            center
            id="board-title"
            title={
              <>
                One board
                <br />
                for the whole team.
              </>
            }
            text="Rent to chase, repairs to book and certificates to renew land on it by themselves, next to the team’s own to-dos."
          />
          <div className="mt-10 lg:mt-14">
            <ProductTour only={["tasks"]} />
          </div>
        </Column>
      </section>
      <SectionHelp id="manager-questions" title={<>Teams ask.</>} questions={QUESTIONS} />
      <NextPages
        items={[
          { page: "pricing", text: "Professional beside Free and Advanced, and what paying yearly saves." },
          { page: "about", text: "Where your data is kept, how sign-in is protected and what we log." },
          { page: "features", text: "Every part of the app, with a demo of each." },
        ]}
      />
    </main>
  );
}
