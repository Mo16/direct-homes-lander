import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { after } from "next/server";
import { addToSegment, hasResend, hasSupabase, rpc, sendWelcome } from "@/lib/waitlist";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Takes a waitlist email from the site (hero, footer, or the dialog behind every Join the waitlist) and the page it
 * was sent from, and saves it in the app's Supabase project (staff see it at /admin/waitlist in the app). Joining twice
 * is quietly accepted, so the form never says who is already on it.
 *
 * After the reply goes out, the person is added to the Resend "DirectHomes waitlist" segment and sent one welcome
 * email; the database remembers the send, so it only goes again if an earlier send failed.
 * Without SUPABASE_URL and SUPABASE_SECRET_KEY, development falls back to data/waitlist.jsonl beside the app.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as { email?: unknown; source?: unknown } | null;
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!EMAIL.test(email) || email.length > 254) {
    return Response.json({ error: "That email doesn't look right." }, { status: 400 });
  }
  const source = typeof body?.source === "string" && /^\/[\w\-/]{0,199}$/.test(body.source) ? body.source : null;

  if (!hasSupabase()) {
    if (process.env.NODE_ENV === "production") {
      console.error("waitlist: SUPABASE_URL or SUPABASE_SECRET_KEY is not set");
      return Response.json({ error: "We couldn't add you just now. Try again later." }, { status: 503 });
    }
    const dir = path.join(process.cwd(), "data");
    await mkdir(dir, { recursive: true });
    await appendFile(path.join(dir, "waitlist.jsonl"), JSON.stringify({ email, source, at: new Date().toISOString() }) + "\n");
    return Response.json({ ok: true });
  }

  let needsWelcome: boolean;
  try {
    needsWelcome = await rpc<boolean>("join_waitlist", { p_email: email, p_source: source });
  } catch (err) {
    console.error("waitlist:", err);
    return Response.json({ error: "We couldn't add you just now. Try again in a minute." }, { status: 502 });
  }

  if (needsWelcome && hasResend()) {
    after(async () => {
      try {
        await addToSegment(email);
        await sendWelcome(email);
        await rpc("waitlist_welcomed", { p_email: email });
      } catch (err) {
        // They are saved either way; the welcome is tried again if they join again.
        console.error("waitlist: welcome email failed:", err);
      }
    });
  }
  return Response.json({ ok: true });
}
