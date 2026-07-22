"use client";

import { useEffect } from "react";

/**
 * Smooth-scrolls in-page anchor clicks (the nav, the hero CTA, the scroll cue)
 * while the rest of the page keeps snappy native scrolling. This replaces a
 * global `scroll-behavior: smooth`, which made every wheel/keyboard scroll feel
 * floaty. Only same-page hashes whose target exists here are intercepted;
 * cross-page links (e.g. `/#about` from a write-up) fall through to the browser.
 */
export default function SmoothScrollLinks() {
  useEffect(() => {
    // clears the fixed nav so a jumped-to heading isn't tucked underneath it
    const NAV_OFFSET = 72;

    const onClick = (e: MouseEvent) => {
      if (
        e.defaultPrevented ||
        e.button !== 0 ||
        e.metaKey ||
        e.ctrlKey ||
        e.shiftKey ||
        e.altKey
      )
        return;

      const link = (e.target as HTMLElement).closest("a");
      const href = link?.getAttribute("href");
      if (!href) return;

      const id = href.startsWith("#")
        ? href.slice(1)
        : href.startsWith("/#")
          ? href.slice(2)
          : null;
      if (!id) return;

      const target = document.getElementById(id);
      if (!target) return; // not on this page → let the browser navigate

      e.preventDefault();
      const reduce = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const top =
        target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
      window.scrollTo({ top, behavior: reduce ? "auto" : "smooth" });
      history.pushState(null, "", `#${id}`);
    };

    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  return null;
}
