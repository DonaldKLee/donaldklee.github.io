"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { sideQuests, type SideQuest } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

/** scene gradients used as a stand-in until a real photo is added */
const SCENES = [
  "linear-gradient(160deg,#5d6c8c,#9aa9cf 60%,#cdd7ef)",
  "linear-gradient(160deg,#3a6ea5,#79a7d6 60%,#cfe2f4)",
  "linear-gradient(160deg,#2f7e8c,#73b9c2 60%,#cdebef)",
  "linear-gradient(160deg,#7a5da8,#a98fd0 60%,#e0d4f2)",
  "linear-gradient(160deg,#566f9c,#8aa0cc 60%,#d4def0)",
  "linear-gradient(160deg,#c06a4f,#e0916f 55%,#f4cba0)",
  "linear-gradient(160deg,#5d6c8c,#9aa9cf 60%,#cdd7ef)",
  "linear-gradient(180deg,#10243a,#1f6f6a 55%,#5fd6a8)",
  "linear-gradient(160deg,#b5485e,#e0866f 55%,#f4cba0)",
  "linear-gradient(160deg,#caa24a,#e6c878 55%,#f3e3b8)",
];

const TILTS = [-3, 2, -1.5, 2.5, -2, 1.6, -2.4, 2.2, -1.4, 1.8];

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
          title="Life outside the editor"
          sub="The trips, the teams, and the late nights that don't fit on a résumé. A quick look at the person behind the projects."
        />
      </div>

      <Reveal>
        <PhotoRail reduce={!!reduce} />
        <p className="mx-auto max-w-6xl px-5 pb-10 pt-2 font-mono text-xs text-muted sm:px-8">
          drag the photos, or let them roll by
        </p>
      </Reveal>
    </section>
  );
}

/** Horizontal photo rail that gently auto-scrolls and loops, pausing on touch. */
function PhotoRail({ reduce }: { reduce: boolean }) {
  const railRef = useRef<HTMLDivElement>(null);
  const paused = useRef(false);

  useEffect(() => {
    if (reduce) return;
    const el = railRef.current;
    if (!el) return;
    let raf = 0;
    let last = performance.now();
    const tick = (t: number) => {
      const dt = t - last;
      last = t;
      if (!paused.current) {
        el.scrollLeft += dt * 0.03; // ~30px/s
        const half = el.scrollWidth / 2;
        if (half > 0 && el.scrollLeft >= half) el.scrollLeft -= half;
      }
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
      className="marquee-fade no-scrollbar flex gap-6 overflow-x-auto px-5 pb-6 pt-2 sm:gap-9 sm:px-8"
    >
      {items.map((q, i) => (
        <Polaroid key={`${q.slug}-${i}`} quest={q} index={i} reduce={reduce} />
      ))}
    </div>
  );
}

function Polaroid({
  quest,
  index,
  reduce,
}: {
  quest: SideQuest;
  index: number;
  reduce: boolean;
}) {
  const tilt = TILTS[index % TILTS.length];
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <figure
      className="group relative w-[74vw] shrink-0 rounded-[14px] bg-white p-3 pb-4 shadow-[0_18px_40px_-22px_rgba(30,40,70,0.5)] transition-transform duration-300 ease-out sm:w-[300px]"
      style={{ transform: `rotate(${tilt}deg)`, transformOrigin: "center bottom" }}
      onMouseEnter={(e) => {
        if (!reduce)
          e.currentTarget.style.transform =
            "rotate(0deg) translateY(-10px) scale(1.03)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${tilt}deg)`;
      }}
    >
      <div className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-[7px]">
        {/* stand-in shown until a real photo loads */}
        {!loaded && (
          <div
            className="grid h-full w-full place-items-center"
            style={{ background: SCENES[index % SCENES.length] }}
          >
            <span
              className="text-6xl drop-shadow-sm transition-transform duration-500 group-hover:scale-110"
              aria-hidden
            >
              {quest.emoji}
            </span>
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.35),transparent_55%)]" />
          </div>
        )}
        {/* real photo, if present in /public/images/sidequests/<slug>.jpg */}
        {!failed && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`/images/sidequests/${quest.slug}.jpg`}
            alt={quest.title}
            loading="lazy"
            onLoad={() => setLoaded(true)}
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
      <figcaption className="px-1 pt-3">
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
