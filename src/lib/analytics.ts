/**
 * Thin, typed wrapper over GA4's gtag.
 *
 * The measurement ID is public by design (it ships in the HTML of every site
 * that uses it), so it's checked in rather than hidden behind config — the site
 * reports on its own without any deploy-time setup. Set NEXT_PUBLIC_GA_ID to
 * point a build at a different property.
 *
 * Local development is excluded automatically unless you explicitly set the
 * env var, so `npm run dev` never shows up in the real reports.
 */

/** Donald's GA4 property, carried over from the previous site so the history
 *  stays continuous. */
const DEFAULT_GA_ID = "G-EGDELZ6371";

const ENV_GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "";

export const GA_ID = ENV_GA_ID || DEFAULT_GA_ID;

/** An explicitly configured ID means "I meant it" — track localhost too. */
export const ALLOW_LOCALHOST = Boolean(ENV_GA_ID);

/** Events we actually look at, spelled once so a typo can't silently drop data. */
export type AnalyticsEvent =
  /** someone moved to email — the conversion that matters most here */
  | "contact_click"
  /** a primary call-to-action button */
  | "cta_click"
  /** clicked through to a social profile */
  | "social_click"
  /** opened a project, from the carousel or the shelf */
  | "project_click"
  /** expanded a role in the experience accordion */
  | "experience_open"
  /** filtered or paged the "more from the shelf" grid */
  | "shelf_filter"
  | "shelf_page"
  /** how far through the featured carousel they rotated */
  | "carousel_progress"
  /** tapped the Mii to make him wave */
  | "mii_tap"
  /** skipped the intro loading screen */
  | "loader_skip"
  /** a section scrolled into view */
  | "section_view"
  /** 25 / 50 / 75 / 100% page scroll milestones */
  | "scroll_depth"
  /** landed on a /project/<slug> write-up */
  | "writeup_view"
  /** any other outbound link */
  | "outbound_click";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (
      command: "config" | "event" | "js" | "set",
      targetOrName: string | Date,
      params?: Params,
    ) => void;
    dataLayer?: unknown[];
  }
}

/** Honour an explicit Do Not Track signal rather than tracking anyway. */
function optedOut() {
  if (typeof navigator === "undefined") return false;
  const dnt =
    navigator.doNotTrack ??
    (window as unknown as { doNotTrack?: string }).doNotTrack;
  return dnt === "1" || dnt === "yes";
}

/**
 * gtag only exists if the bootstrap script decided this environment should
 * report (see Analytics.tsx), so its presence is the single source of truth.
 */
export const analyticsEnabled = () =>
  typeof window !== "undefined" &&
  typeof window.gtag === "function" &&
  !optedOut();

/** Send a custom event. Safe to call anywhere, including during SSR. */
export function track(event: AnalyticsEvent, params: Params = {}) {
  if (!analyticsEnabled()) return;
  // strip empties so GA doesn't record blank dimensions
  const clean: Params = {};
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== "") clean[k] = v;
  }
  window.gtag?.("event", event, clean);
}

/** Record a page view — used on client-side route changes. */
export function trackPageView(path: string, title?: string) {
  if (!analyticsEnabled()) return;
  window.gtag?.("event", "page_view", {
    page_path: path,
    page_location: window.location.href,
    page_title: title ?? document.title,
  });
}
