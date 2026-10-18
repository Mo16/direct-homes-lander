import type { Metadata } from "next";
import Link from "next/link";
import { leaveTokenValid } from "@/lib/waitlist";
import { LeaveButton } from "./leave-button";

export const metadata: Metadata = {
  title: "Leave the waitlist",
  robots: { index: false, follow: false },
};

/** Where the link in the welcome email lands. It asks first, so a mail scanner opening the link can't remove anyone. */
export default async function LeaveWaitlistPage({ searchParams }: PageProps<"/waitlist/leave">) {
  const sp = await searchParams;
  const email = (typeof sp.e === "string" ? sp.e : "").trim().toLowerCase();
  const token = typeof sp.t === "string" ? sp.t : "";
  const valid = leaveTokenValid(email, token);

  return (
    <main className="flex min-h-svh items-center justify-center px-4 pt-28 pb-20">
      <div className="w-full max-w-[480px] rounded-panel bg-surface p-7 sm:p-9">
        {valid ? (
          <>
            <h1 className="text-[28px] leading-tight tracking-[-0.01em] text-ink">Leave the waitlist?</h1>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-2">
              We&apos;ll remove <span className="text-ink">{email}</span> and won&apos;t email you about DirectHomes again.
            </p>
            <LeaveButton email={email} token={token} />
          </>
        ) : (
          <>
            <h1 className="text-[28px] leading-tight tracking-[-0.01em] text-ink">This link isn&apos;t valid</h1>
            <p className="mt-3 text-[16px] leading-relaxed text-ink-2">
              Use the link at the foot of your welcome email, or{" "}
              <Link href="/contact" className="text-ink underline underline-offset-4">
                write to us
              </Link>{" "}
              and we&apos;ll take you off.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
