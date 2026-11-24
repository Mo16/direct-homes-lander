/** Where the web app lives: sign in, sign up and buying a plan go there. NEXT_PUBLIC_APP_URL is set on Netlify. */
export const APP_URL = (process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3003").replace(/\/$/, "");
export const SIGN_IN = `${APP_URL}/login`;
export const SIGN_UP = `${APP_URL}/signup`;

/**
 * Buying a paid plan: the app's /subscribe sends a signed-out visitor through sign-up first, then on to Stripe
 * Checkout for this plan. Stripe comes back to the app's own success or cancelled page.
 */
export const buyLink = (plan: "advanced" | "professional", interval: "month" | "year") => `${APP_URL}/subscribe?plan=${plan}&interval=${interval}`;

/**
 * The one switch for launch day. While false, every "Start free" on the site reads "Join the waitlist" and opens the
 * waitlist form instead of the app's sign-up, the footer carries the form itself, and Sign in is hidden (there are no
 * accounts yet). True since 24 Nov 2026: sign-up, Sign in and the plan buttons all go to the app.
 */
export const LAUNCHED = true;
export const START_LABEL = LAUNCHED ? "Start free" : "Join the waitlist";
/** For the tight nav bar on phones. */
export const START_SHORT = LAUNCHED ? "Start free" : "Join waitlist";
