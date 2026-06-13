"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { sideQuests } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";
import InView from "./InView";

const DriveScene = dynamic(() => import("./sidequests/DriveScene"), {
  ssr: false,
});

/** scene gradients used when a memory has no real photo yet */
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
    <section id="side-quests" className="relative overflow-hidden py-24 sm:py-32">
      {/* daytime sky */}
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "linear-gradient(180deg,#eaf2fc 0%,#f4f8fd 45%,var(--color-bg) 100%)",
        }}
      />
      {/* sun glow */}
      <div className="pointer-events-none absolute -right-20 top-10 -z-10 h-72 w-72 rounded-full bg-amber/20 blur-3xl" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading
          marker="## side-quests"
          title="Life outside the editor"
          sub="The stuff that doesn't fit on a résumé. Take the scenic route, these roll by like roadside billboards."
        />
      </div>

      {/* the drive */}
      <Reveal>
        <div className="relative">
          {/* roadside memories */}
          <div className="no-scrollbar flex snap-x gap-6 overflow-x-auto px-5 pb-6 pt-2 sm:gap-9 sm:px-8">
            {sideQuests.map((q, i) => (
              <motion.figure
                key={q.title}
                initial={{ opacity: 0, y: 28, rotate: TILTS[i % TILTS.length] }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotate: TILTS[i % TILTS.length],
                }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                whileHover={reduce ? {} : { rotate: 0, y: -10, scale: 1.03 }}
                className="group relative w-[74vw] shrink-0 snap-center rounded-[14px] bg-white p-3 pb-4 shadow-[0_18px_40px_-22px_rgba(30,40,70,0.5)] sm:w-[300px]"
                style={{ transformOrigin: "center bottom" }}
              >
                <div className="relative grid aspect-[4/5] place-items-center overflow-hidden rounded-[7px]">
                  {q.image ? (
                    <Image
                      src={q.image}
                      alt={q.title}
                      fill
                      sizes="300px"
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className="grid h-full w-full place-items-center"
                      style={{ background: SCENES[i % SCENES.length] }}
                    >
                      <span
                        className="text-6xl drop-shadow-sm transition-transform duration-500 group-hover:scale-110"
                        aria-hidden
                      >
                        {q.emoji}
                      </span>
                      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.35),transparent_55%)]" />
                    </div>
                  )}
                  <span className="absolute bottom-3 left-3 rounded-full bg-black/30 px-2.5 py-1 font-mono text-[0.7rem] text-white backdrop-blur-sm">
                    {q.tag}
                  </span>
                </div>
                <figcaption className="px-1 pt-3">
                  <h3 className="font-display text-base font-semibold text-ink">
                    {q.title}
                  </h3>
                  <p className="mt-0.5 text-[0.82rem] leading-relaxed text-muted">
                    {q.blurb}
                  </p>
                </figcaption>
              </motion.figure>
            ))}
            <div className="w-2 shrink-0 sm:w-8" aria-hidden />
          </div>

          {/* the 3D drive */}
          <InView
            className="mt-2 h-[300px] w-full sm:h-[400px]"
            rootMargin="400px"
          >
            <DriveScene moving={!reduce} />
          </InView>
        </div>
      </Reveal>

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="mt-5 font-mono text-xs text-muted">
          ← drag along for the ride →
        </p>
      </div>
    </section>
  );
}
