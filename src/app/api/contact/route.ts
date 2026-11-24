import { appendFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { hasContactEmail, sendContactMessage } from "@/lib/waitlist";

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const WHO = ["landlord", "tenant", "other"] as const;

type Field = "name" | "email" | "who" | "topic" | "message";

const text = (v: unknown) => (typeof v === "string" ? v.trim() : "");

/**
 * Takes a message from the contact page. The same checks as the form, so a message that skips the page is held to
 * the same rules. It is emailed to the team inbox through Resend (sendContactMessage). Without a Resend key (local
 * development) it appends a line to data/contact.jsonl instead; a serverless host cannot write files.
 */
export async function POST(req: Request) {
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const name = text(body?.name);
  const email = text(body?.email).toLowerCase();
  const who = text(body?.who);
  const topic = text(body?.topic);
  const message = text(body?.message);

  const errors: Partial<Record<Field, string>> = {};
  if (name.length < 2 || name.length > 120) errors.name = "Tell us your name.";
  if (!EMAIL.test(email) || email.length > 254) errors.email = "That email doesn't look right.";
  if (!WHO.includes(who as (typeof WHO)[number])) errors.who = "Choose the one that fits best.";
  if (topic.length < 3 || topic.length > 140) errors.topic = "A few words on what it's about.";
  if (message.length < 10 || message.length > 5000) errors.message = message.length > 5000 ? "Keep it under 5,000 characters." : "Tell us a little more, at least a sentence.";
  if (Object.keys(errors).length) {
    return Response.json({ error: "Some details need another look.", errors }, { status: 400 });
  }

  if (hasContactEmail()) {
    try {
      await sendContactMessage({ name, email, who, topic, message });
      return Response.json({ ok: true });
    } catch (error) {
      console.error("[contact] not sent", error instanceof Error ? error.message : error);
      return Response.json({ error: "We couldn't send that just now. Try again in a minute, or email hello@direct-homes.co.uk." }, { status: 502 });
    }
  }

  const dir = path.join(process.cwd(), "data");
  await mkdir(dir, { recursive: true });
  await appendFile(path.join(dir, "contact.jsonl"), JSON.stringify({ name, email, who, topic, message, at: new Date().toISOString() }) + "\n");
  return Response.json({ ok: true });
}
