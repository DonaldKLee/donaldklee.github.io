"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import {
  ALLOW_LOCALHOST,
  GA_ID,
  analyticsEnabled,
  track,
  trackPageView,
} from "@/lib/analytics";

/** Sections worth knowing people actually reached. */
const SECTIONS = ["about", "experience", "projects", "side-quests", "contact"];
const DEPTHS = [25, 50, 75, 100];

/**
 * Loads GA4 and records the ambient signals that aren't tied to one component:
 * page views (including client-side route changes), scroll depth, and which
 * sections came into view. Renders nothing.
 */
export default function Analytics() {
  const pathname = usePathname();
  const firstLoad = useRef(true);

  // page views on client-side navigation (the first one comes from gtag config)
  useEffect(() => {
    if (firstLoad.current) {
      firstLoad.current = false;
      return;
    }
    trackPageView(pathname);
  }, [pathname]);

  // scroll depth — each milestone fires once per page
  useEffect(() => {
    if (!analyticsEnabled()) return;
    const hit = new Set<number>();
    let queued = false;

    const measure = () => {
      queued = false;
      const doc = document.documentElement;
      const scrollable = doc.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      const pct = ((window.scrollY / scrollable) * 100) | 0;
      for (const d of DEPTHS) {
        if (pct >= d && !hit.has(d)) {
          hit.add(d);
          track("scroll_depth", { percent: d, path: pathname });
        }
      }
    };
    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(measure);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // section views — fire the first time each one is meaningfully on screen
  useEffect(() => {
    if (!analyticsEnabled()) return;
    const seen = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const id = e.target.id;
          if (!e.isIntersecting || seen.has(id)) continue;
          seen.add(id);
          track("section_view", { section: id });
          io.unobserve(e.target);
        }
      },
      { threshold: 0.35 },
    );
    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) io.observe(el);
    });
    return () => io.disconnect();
  }, [pathname]);

  if (!GA_ID) return null;

  /*
    One plain inline script that bootstraps everything, rather than next/script.
    Two reasons:

    1. It runs while the HTML is parsed, so window.gtag exists before any React
       effect fires. With next/script's afterInteractive the shim landed *after*
       mount effects and early events (a write-up view) were dropped.
    2. The markup is identical on server and client, so gating on hostname here
       can't cause a hydration mismatch the way a conditional render would.

    Local dev bails out before defining gtag, which makes every track() call a
    no-op automatically — no separate "is this prod" check scattered around.
  */
  const bootstrap = `
    (function () {
      var local = /^(localhost|127\\.0\\.0\\.1|\\[?::1\\]?)$/.test(location.hostname);
      if (local && !${ALLOW_LOCALHOST}) return;
      window.dataLayer = window.dataLayer || [];
      function gtag(){ dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag('js', new Date());
      gtag('config', '${GA_ID}', { anonymize_ip: true });
      var s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=${GA_ID}';
      document.head.appendChild(s);
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: bootstrap }} />;
}
