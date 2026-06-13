"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import type { Project } from "@/data/content";

const RADIUS = 460; // px from the cylinder axis to each card face

export default function FeaturedCarousel({
  projects,
}: {
  projects: Project[];
}) {
  const n = projects.length;
  const step = 360 / n;
  const reduce = useReducedMotion();

  const trackRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  // vertical scroll → cylinder rotation
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -(n - 1) * step]);
  const [current, setCurrent] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setCurrent(Math.min(n - 1, Math.max(0, Math.round(p * (n - 1)))));
  });

  return (
    <>
      {/* ----- desktop: scroll-driven 3D cylinder ----- */}
      <div
        ref={trackRef}
        className="relative hidden lg:block"
        style={{ height: `${n * 78}vh` }}
      >
        <div className="sticky top-0 flex h-screen flex-col items-center justify-center gap-6 overflow-hidden">
          <div
            className="relative h-[500px] w-full"
            style={{ perspective: "2100px" }}
          >
            <motion.div
              className="absolute left-1/2 top-1/2"
              style={{
                rotateY: reduce ? 0 : rotate,
                transformStyle: "preserve-3d",
              }}
            >
              {projects.map((p, i) => {
                const active = i === current;
                return (
                  <div
                    key={p.name}
                    className="absolute -translate-x-1/2 -translate-y-1/2"
                    style={{
                      transform: `translate(-50%,-50%) rotateY(${i * step}deg) translateZ(${RADIUS}px)`,
                      transformStyle: "preserve-3d",
                      backfaceVisibility: "hidden",
                      width: 440,
                      pointerEvents: active ? "auto" : "none",
                      opacity: active ? 1 : 0.28,
                      filter: active ? "none" : "blur(3px)",
                      transition:
                        "opacity 0.5s ease, filter 0.5s ease, transform 0.1s linear",
                    }}
                  >
                    <CarouselCard
                      project={p}
                      index={i}
                      total={n}
                      active={active}
                    />
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* progress */}
          <div className="mt-4 flex items-center gap-4">
            <span className="font-mono text-sm text-muted">
              {String(current + 1).padStart(2, "0")}
              <span className="text-line-strong"> / {String(n).padStart(2, "0")}</span>
            </span>
            <div className="flex gap-1.5">
              {projects.map((p, i) => (
                <span
                  key={p.name}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === current ? "w-6 bg-ink" : "w-1.5 bg-line-strong"
                  }`}
                />
              ))}
            </div>
            <span className="font-mono text-xs text-muted">scroll to spin ↓</span>
          </div>
        </div>
      </div>

      {/* ----- mobile / reduced-motion: horizontal snap rail ----- */}
      <div className="lg:hidden">
        <div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:px-8">
          {projects.map((p, i) => (
            <div
              key={p.name}
              className="w-[82vw] shrink-0 snap-center sm:w-[420px]"
            >
              <CarouselCard project={p} index={i} total={n} active />
            </div>
          ))}
          <div className="w-1 shrink-0" aria-hidden />
        </div>
        <p className="px-5 pt-1 font-mono text-xs text-muted sm:px-8">
          ← swipe through →
        </p>
      </div>
    </>
  );
}

function CarouselCard({
  project,
  index,
  total,
  active,
}: {
  project: Project;
  index: number;
  total: number;
  active: boolean;
}) {
  return (
    <a
      href={project.href}
      target="_blank"
      rel="noopener noreferrer"
      tabIndex={active ? 0 : -1}
      className="group block overflow-hidden rounded-3xl border border-line bg-bg shadow-[0_30px_70px_-34px_rgba(40,60,100,0.5)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <Image
          src={project.image}
          alt={`${project.name} — ${project.tagline}`}
          fill
          sizes="440px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex flex-col gap-2.5 p-6">
        <div className="flex items-center gap-3 font-mono text-xs">
          <span className="text-muted">
            {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
          <span className="rounded-full bg-accent-wash px-2.5 py-0.5 text-accent-strong">
            {project.category}
          </span>
          {project.award && <span className="text-muted">· {project.award}</span>}
        </div>
        <h3 className="font-display text-[1.7rem] font-bold leading-tight tracking-[-0.03em] text-ink">
          {project.name}
        </h3>
        <p className="text-lg font-medium text-accent">{project.tagline}</p>
        <p className="line-clamp-3 text-[0.97rem] leading-relaxed text-ink-soft">
          {project.description}
        </p>
        <span className="mt-1 inline-flex items-center gap-2 font-mono text-sm text-ink">
          View project
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </a>
  );
}
