/** Where the web app lives: sign in and sign up go there. Set NEXT_PUBLIC_APP_URL in production. */
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3003";
export const SIGN_IN = `${APP_URL}/login`;
export const SIGN_UP = `${APP_URL}/signup`;

/**
 * The one switch for launch day. While false, every "Start free" on the site reads "Join the waitlist" and opens the
 * waitlist form instead of the app's sign-up, the footer carries the form itself, and Sign in is hidden (there are no
 * accounts yet). Set it to true and everything goes back to sign-up links.
 */
export const LAUNCHED = false;
export const START_LABEL = LAUNCHED ? "Start free" : "Join the waitlist";
/** For the tight nav bar on phones. */
export const START_SHORT = LAUNCHED ? "Start free" : "Join waitlist";
