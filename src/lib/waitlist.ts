import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * Server-side waitlist plumbing (route handlers only; every secret here stays on the server).
 *
 * Supabase keeps the list: the app's project, through the service-role functions in webapp migrations
 * 20261017222757_waitlist.sql and 20261017232344_waitlist_emails.sql, called with the secret key.
 * Resend sends the welcome email and keeps everyone in the "DirectHomes waitlist" segment for the launch email.
 */

const env = (name: string) => process.env[name] || undefined;

export const SITE_URL = (env("SITE_URL") ?? "http://localhost:3005").replace(/\/$/, "");

/** Calls a waitlist function in the app's database. Throws when Supabase refuses. */
export async function rpc<T>(name: "join_waitlist" | "waitlist_welcomed" | "leave_waitlist", args: Record<string, unknown>): Promise<T> {
  const url = env("SUPABASE_URL");
  const key = env("SUPABASE_SECRET_KEY");
  if (!url || !key) throw new Error("SUPABASE_URL and SUPABASE_SECRET_KEY are not set");
  const res = await fetch(`${url}/rest/v1/rpc/${name}`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify(args),
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`Supabase ${name} ${res.status}: ${await res.text().catch(() => "")}`);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

export const hasSupabase = () => Boolean(env("SUPABASE_URL") && env("SUPABASE_SECRET_KEY"));
export const hasResend = () => Boolean(env("RESEND_API_KEY") && env("RESEND_WAITLIST_SEGMENT_ID") && env("WAITLIST_SECRET"));

/* Leave links: the email address signed with WAITLIST_SECRET, so nobody can take someone else off the list. */

function sign(email: string): string {
  const secret = env("WAITLIST_SECRET");
  if (!secret) throw new Error("WAITLIST_SECRET is not set");
  return createHmac("sha256", secret).update(`waitlist-leave:${email}`).digest("base64url");
}

/** The page behind the link in the email: it asks before removing anyone, so link scanners can't. */
export function leaveUrl(email: string): string {
  return `${SITE_URL}/waitlist/leave?e=${encodeURIComponent(email)}&t=${sign(email)}`;
}

/** The one-click address mail apps POST to (List-Unsubscribe-Post, RFC 8058). */
export function leaveApiUrl(email: string): string {
  return `${SITE_URL}/api/waitlist/leave?e=${encodeURIComponent(email)}&t=${sign(email)}`;
}

export function leaveTokenValid(email: string, token: string): boolean {
  if (!email || !token || !env("WAITLIST_SECRET")) return false;
  const expected = Buffer.from(sign(email));
  const given = Buffer.from(token);
  return expected.length === given.length && timingSafeEqual(expected, given);
}

/* Resend */

async function resend(path: string, init: { method: string; body?: unknown; idempotencyKey?: string }) {
  const res = await fetch(`https://api.resend.com${path}`, {
    method: init.method,
    headers: {
      Authorization: `Bearer ${env("RESEND_API_KEY")}`,
      "Content-Type": "application/json",
      ...(init.idempotencyKey ? { "Idempotency-Key": init.idempotencyKey } : {}),
    },
    body: init.body === undefined ? undefined : JSON.stringify(init.body),
    cache: "no-store",
  });
  return res;
}

/** Puts the person in the waitlist segment, creating the contact if Resend does not know them yet. */
export async function addToSegment(email: string): Promise<void> {
  const segment = env("RESEND_WAITLIST_SEGMENT_ID")!;
  const created = await resend("/contacts", {
    method: "POST",
    // No custom properties: Resend refuses any not defined in its dashboard first. The page is kept in Supabase.
    body: { email, unsubscribed: false, segments: [{ id: segment }] },
  });
  if (created.ok) return;
  // Already a contact (from another list or an earlier try): add them to the segment instead.
  const added = await resend(`/contacts/${encodeURIComponent(email)}/segments/${segment}`, { method: "POST" });
  if (!added.ok) throw new Error(`Resend segment ${added.status}: ${await added.text().catch(() => "")} (create said ${created.status}: ${await created.text().catch(() => "")})`);
}

/** Marks the contact unsubscribed, so launch emails to the segment skip them. */
export async function unsubscribe(email: string): Promise<void> {
  const res = await resend(`/contacts/${encodeURIComponent(email)}`, { method: "PATCH", body: { unsubscribed: true } });
  if (!res.ok && res.status !== 404) throw new Error(`Resend unsubscribe ${res.status}: ${await res.text().catch(() => "")}`);
}

const escapeHtml = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** The one email a person gets for joining. Same look as the app's own emails (webapp src/lib/email.ts). */
export async function sendWelcome(email: string): Promise<void> {
  const leave = leaveUrl(email);
  const subject = "You're on the DirectHomes waitlist";
  const lines = [
    "Thanks for joining. We'll email you as soon as DirectHomes opens, so you can be one of the first landlords in.",
    "Until then there's nothing you need to do.",
  ];
  const html = `<!doctype html><html lang="en-GB"><body style="margin:0;background:#ebebeb;font-family:Outfit,system-ui,-apple-system,Segoe UI,sans-serif;color:#141414">
<div style="max-width:560px;margin:0 auto;padding:32px 20px">
<p style="margin:0 8px 16px;font-size:17px;font-weight:600;letter-spacing:-0.01em">DirectHomes</p>
<div style="background:#faf9fb;border-radius:8px;padding:32px">
<h1 style="font-weight:400;font-size:24px;margin:0 0 20px">You're on the list</h1>
${lines.map((l) => `<p style="margin:0 0 16px;line-height:1.55">${escapeHtml(l)}</p>`).join("")}
<p style="margin:24px 0 0"><a href="${escapeHtml(`${SITE_URL}/features`)}" style="background:#141414;color:#fff;padding:12px 22px;border-radius:6px;text-decoration:none;display:inline-block">See what's coming</a></p>
</div>
<p style="font-size:12px;color:#67676b;line-height:1.5;margin:20px 8px">You're getting this because ${escapeHtml(email)} joined the waitlist at direct-homes.co.uk. Didn't mean to? <a href="${escapeHtml(leave)}" style="color:#67676b">Leave the waitlist</a>.</p>
</div></body></html>`;
  const text = [
    "You're on the list",
    "",
    ...lines.flatMap((l) => [l, ""]),
    `See what's coming: ${SITE_URL}/features`,
    "",
    "--",
    `You're getting this because ${email} joined the waitlist at direct-homes.co.uk.`,
    `Didn't mean to? Leave the waitlist: ${leave}`,
  ].join("\n");

  const res = await resend("/emails", {
    method: "POST",
    idempotencyKey: `waitlist-welcome/${email}`,
    body: {
      from: env("WAITLIST_FROM") ?? "DirectHomes <hello@direct-homes.co.uk>",
      to: [email],
      subject,
      html,
      text,
      headers: { "List-Unsubscribe": `<${leaveApiUrl(email)}>`, "List-Unsubscribe-Post": "List-Unsubscribe=One-Click" },
      tags: [{ name: "kind", value: "waitlist_welcome" }],
    },
  });
  if (!res.ok) throw new Error(`Resend email ${res.status}: ${await res.text().catch(() => "")}`);
}
