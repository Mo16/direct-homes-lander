import { leaveTokenValid, rpc, unsubscribe } from "@/lib/waitlist";

/**
 * Takes someone off the waitlist: removed from the app's database and marked unsubscribed in Resend. Needs the signed
 * link from their welcome email. Mail apps POST here directly (one-click unsubscribe); the /waitlist/leave page posts
 * here after the person confirms.
 */
export async function POST(req: Request) {
  const params = new URL(req.url).searchParams;
  const email = (params.get("e") ?? "").trim().toLowerCase();
  if (!leaveTokenValid(email, params.get("t") ?? "")) {
    return Response.json({ error: "This link isn't valid. Use the one in your email." }, { status: 400 });
  }
  try {
    await rpc("leave_waitlist", { p_email: email });
    await unsubscribe(email);
  } catch (err) {
    console.error("waitlist leave:", err);
    return Response.json({ error: "We couldn't take you off just now. Try again in a minute." }, { status: 502 });
  }
  return Response.json({ ok: true });
}
