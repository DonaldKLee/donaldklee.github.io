"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { sideQuests, type SideQuest } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const TILTS = [-3, 2, -1.5, 2.5, -2, 1.6, -2.4, 2.2, -1.4, 1.8];

/**
 * Default photo orientations (width / height) used for the stand-in and until
 * a real photo loads, so the rail shows a mix of vertical, square, and
 * horizontal frames. A loaded photo overrides this with its true ratio.
 */
const DEFAULT_RATIOS = [0.78, 1.34, 1, 0.8, 1.33, 0.75, 1.4, 1, 0.82, 1.3];
const clampRatio = (r: number) => Math.max(0.66, Math.min(1.55, r));

export default function SideQuests() {
  const reduce = useReducedMotion();

  return (
    <section id="side-quests" className="relative overflow-hidden pt-24 sm:pt-32">
      {/* a soft cool-to-warm wash; the closing colour matches the footer's
          opening colour so the two read as one continuous scene */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg,#eef4fc 0%,#f6f9fd 38%,#fbf2e8 74%,#fdeee0 100%)",
        }}
      />
      <div className="pointer-events-none absolute -right-24 top-8 -z-10 h-72 w-72 rounded-full bg-amber/15 blur-3xl" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          marker="## side-quests"
          title="Memories throughout the years"
          sub="Some trips, team photos, and moments with friends."
        />
      </div>

      <Reveal>
        <PhotoRail reduce={!!reduce} />
        <p className="mx-auto max-w-6xl px-5 pb-10 pt-2 font-mono text-xs text-muted sm:px-8">
          scroll through the photos, or let them roll by
        </p>
      </Reveal>
    </section>
  );
}

/** Horizontal photo rail that gently auto-scrolls and loops, pausing on touch. */
function PhotoRail({ reduce }: { reduce: boolean }) {
  const railRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);
  // one shared ratio per photo: both copies of the doubled rail must always
  // agree on widths, or the loop's teleport misaligns while a lazily loaded
  // image has only reached one of the copies
  const [ratios, setRatios] = useState<Record<string, number>>({});
  const reportRatio = (slug: string, r: number) =>
    setRatios((m) => (m[slug] === r ? m : { ...m, [slug]: r }));

  useEffect(() => {
    if (reduce) return;
    const el = railRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      // one copy's exact width, measured between the two copies' first items
      // (scrollWidth / 2 is off by the edge padding + seam gap, which made
      // the loop visibly skip at the wrap point)
      const kids = el.children;
      const n = kids.length / 2;
      const period =
        Number.isInteger(n) && n >= 1
          ? (kids[n] as HTMLElement).offsetLeft -
            (kids[0] as HTMLElement).offsetLeft
          : 0;
      // teleporting by one copy is invisible; wrapping both ways (outside
      // the pause check) lets you scroll backwards forever instead of
      // hitting a wall at the start
      if (period > 0) {
        if (el.scrollLeft >= period + 1) el.scrollLeft -= period;
        else if (el.scrollLeft < 1) el.scrollLeft += period;
      }
      if (!paused.current) el.scrollLeft += dt * 0.03; // ~30px/s
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduce]);

  const items = reduce ? sideQuests : [...sideQuests, ...sideQuests];

  return (
    <div
      ref={railRef}
      onPointerEnter={() => (paused.current = true)}
      onPointerLeave={() => (paused.current = false)}
      onPointerDown={() => (paused.current = true)}
      onPointerUp={() => (paused.current = false)}
      // pt makes room for the hover lift, pb for the polaroid drop shadow —
      // a scroll container clips both, so tight padding shows a sheared edge
      className="marquee-fade no-scrollbar flex gap-6 overflow-x-auto overscroll-x-contain px-5 pb-12 pt-7 sm:gap-9 sm:px-8"
    >
      {items.map((q, i) => (
        <Polaroid
          key={`${q.slug}-${i}`}
          quest={q}
          // per-copy index: both copies must style identically (tilt, default
          // ratio), or the loop's teleport stops being invisible
          index={i % sideQuests.length}
          reduce={reduce}
          ratio={ratios[q.slug]}
          onRatio={reportRatio}
        />
      ))}
    </div>
  );
}

function Polaroid({
  quest,
  index,
  reduce,
  ratio,
  onRatio,
}: {
  quest: SideQuest;
  index: number;
  reduce: boolean;
  /** the photo's true ratio once it has loaded anywhere in the rail */
  ratio?: number;
  onRatio: (slug: string, r: number) => void;
}) {
  const tilt = TILTS[index % TILTS.length];
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  // photo shape: a varied default until the real image loads, then its true
  // ratio so vertical, square, and horizontal photos all sit right
  const shape = ratio ?? DEFAULT_RATIOS[index % DEFAULT_RATIOS.length];

  return (
    <figure
      className="group relative shrink-0 rounded-[14px] bg-white p-3 pb-4 shadow-[0_18px_40px_-22px_rgba(30,40,70,0.5)] transition-transform duration-300 ease-out"
      style={{ transform: `rotate(${tilt}deg)`, transformOrigin: "center bottom" }}
      onMouseEnter={(e) => {
        if (!reduce)
          e.currentTarget.style.transform =
            "rotate(0deg) translateY(-8px) scale(1.02)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${tilt}deg)`;
      }}
    >
      {/* constant height, width follows the photo's orientation -> a tidy
          film strip of mixed vertical / square / horizontal frames */}
      <div
        className="relative grid h-[48vw] max-h-[250px] min-h-[190px] place-items-center overflow-hidden rounded-[7px] sm:h-[290px] sm:max-h-none sm:min-h-0"
        style={{ aspectRatio: shape }}
      >
        {/* quiet neutral slot until the real photo is dropped in */}
        {!loaded && (
          <div className="grid h-full w-full place-items-center bg-surface-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.3}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-8 w-8 text-line-strong"
              aria-hidden
            >
              <rect x="3" y="5" width="18" height="14" rx="2" />
              <circle cx="8.5" cy="10" r="1.4" />
              <path d="M21 15.5 16 11l-8 7.5" />
            </svg>
          </div>
        )}
        {/* real photo, if present in /public/images/sidequests/<slug> */}
        {!failed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/images/sidequests/${quest.slug}`}
            alt={quest.title}
            loading="lazy"
            onLoad={(e) => {
              const el = e.currentTarget;
              if (el.naturalWidth && el.naturalHeight)
                onRatio(
                  quest.slug,
                  clampRatio(el.naturalWidth / el.naturalHeight),
                );
              setLoaded(true);
            }}
            onError={() => setFailed(true)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${
              loaded ? "opacity-100" : "opacity-0"
            }`}
          />
        )}
        <span className="absolute bottom-3 left-3 z-10 rounded-full bg-black/35 px-2.5 py-1 font-mono text-[0.7rem] text-white backdrop-blur-sm">
          {quest.tag}
        </span>
      </div>
      {/* w-0 + min-w-full: the photo sets the card's width; long captions
          wrap instead of stretching the polaroid frame */}
      <figcaption className="w-0 min-w-full px-1 pt-3">
        <h3 className="font-display text-base font-semibold text-ink">
          {quest.title}
        </h3>
        <p className="mt-0.5 text-[0.82rem] leading-relaxed text-muted">
          {quest.blurb}
        </p>
      </figcaption>
    </figure>
  );
}
