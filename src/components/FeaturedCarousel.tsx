"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import type { Project } from "@/data/content";

/**
 * Projects sit on the faces of a vertical cylinder. Scrolling the pinned
 * section rotates the cylinder so each project swings to the front. Width and
 * radius are driven by CSS variables so it scales from phone to desktop.
 */
export default function FeaturedCarousel({
  projects,
  marker,
  title,
  sub,
}: {
  projects: Project[];
  marker: string;
  title: string;
  sub: string;
}) {
  const n = projects.length;
  const step = 360 / n;
  const reduce = useReducedMotion();

  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -(n - 1) * step]);
  const [current, setCurrent] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    setCurrent(Math.min(n - 1, Math.max(0, Math.round(p * (n - 1)))));
  });

  // Any gesture over the pinned stage should advance the page: sideways
  // trackpad swipes redirect to vertical, and click-drag scrolls too. This
  // makes "scroll the cylinder" and "scroll the page" the same motion.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || reduce) return;

    const onWheel = (e: WheelEvent) => {
      // when the horizontal intent dominates, push it into the page scroll
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        window.scrollBy({ top: e.deltaX });
        e.preventDefault();
      }
    };

    let dragging = false;
    let lastY = 0;
    let lastX = 0;
    const onDown = (e: PointerEvent) => {
      // leave touch alone so phones keep native vertical scrolling
      if (e.button !== 0 || e.pointerType === "touch") return;
      dragging = true;
      lastY = e.clientY;
      lastX = e.clientX;
      el.setPointerCapture(e.pointerId);
    };
    const onMove = (e: PointerEvent) => {
      if (!dragging) return;
      // dragging up or left walks the page forward
      const dy = e.clientY - lastY;
      const dx = e.clientX - lastX;
      lastY = e.clientY;
      lastX = e.clientX;
      window.scrollBy({ top: -(dy + dx) * 1.4 });
    };
    const stop = () => {
      dragging = false;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", stop);
    el.addEventListener("pointercancel", stop);
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", stop);
      el.removeEventListener("pointercancel", stop);
    };
  }, [reduce]);

  // reduced motion / no scroll-jacking: heading + a simple swipe rail
  if (reduce) {
    return (
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <p className="mb-2 font-mono text-sm text-accent">{marker}</p>
        <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-bold tracking-[-0.035em] text-ink">
          {title}
        </h2>
        <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-muted">
          {sub}
        </p>
        <div className="no-scrollbar -mx-5 mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-4 sm:-mx-8 sm:px-8">
          {projects.map((p, i) => (
            <div
              key={p.name}
              className="aspect-[16/10] w-[88vw] shrink-0 snap-center sm:w-[580px]"
            >
              <CarouselCard project={p} index={i} total={n} active />
            </div>
          ))}
          <div className="w-1 shrink-0" aria-hidden />
        </div>
      </div>
    );
  }

  const stageVars = {
    // landscape cards: a wide rectangle (~half the screen on desktop) with the
    // image on the left and the copy on the right
    "--card-w": "min(92vw, 720px)",
    "--card-h": "max(calc(var(--card-w) * 0.58), 232px)",
    "--radius": "calc(var(--card-w) / 1.04)",
    "--persp": "calc(var(--radius) * 10)",
  } as CSSProperties;

  return (
    <div
      ref={trackRef}
      className="relative"
      style={{ height: `${n * 72}svh` }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] cursor-grab touch-pan-y overflow-hidden active:cursor-grabbing"
      >
        {/* pinned heading — stays in view while the cylinder spins */}
        <div className="absolute inset-x-0 top-0 z-10 pt-[max(4.5rem,7vh)]">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="mb-1 font-mono text-sm text-accent">{marker}</p>
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-ink sm:text-3xl">
              {title}
            </h2>
            <p className="mt-1.5 line-clamp-2 max-w-[58ch] text-sm leading-relaxed text-muted sm:text-base">
              {sub}
            </p>
          </div>
        </div>

        {/* perspective stage in the space below the heading; hub centred in it */}
        <div
          className="absolute inset-x-0 bottom-[72px] top-[152px] grid place-items-center sm:top-[176px]"
          style={{ ...stageVars, perspective: "var(--persp)" }}
        >
          {/* hub: sized to one card; every card fills it and rotates around its shared centre (the cylinder axis) */}
          <motion.div
            className="relative"
            style={{
              width: "var(--card-w)",
              height: "var(--card-h)",
              rotateY: rotate,
              transformStyle: "preserve-3d",
            }}
          >
            {projects.map((p, i) => {
              const active = i === current;
              return (
                <div
                  key={p.name}
                  className="absolute inset-0"
                  style={{
                    transform: `rotateY(${i * step}deg) translateZ(var(--radius))`,
                    transformOrigin: "center center",
                    backfaceVisibility: "hidden",
                    opacity: active ? 1 : 0.22,
                    filter: active ? "none" : "blur(3px)",
                    pointerEvents: active ? "auto" : "none",
                    transition: "opacity 0.5s ease, filter 0.5s ease",
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

        {/* progress overlay — sits over the scene, doesn't shift the cards */}
        <div className="pointer-events-none absolute inset-x-0 bottom-[max(1.5rem,env(safe-area-inset-bottom))] flex justify-center">
          <div className="flex items-center gap-3 rounded-full border border-line bg-bg/70 px-4 py-2 backdrop-blur-sm sm:gap-4">
            <span className="font-mono text-sm text-muted">
              {String(current + 1).padStart(2, "0")}
              <span className="text-line-strong">
                {" "}
                / {String(n).padStart(2, "0")}
              </span>
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
            <span className="hidden font-mono text-xs text-muted sm:inline">
              scroll to spin ↓
            </span>
          </div>
        </div>
      </div>
    </div>
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
  const internal = Boolean(project.slug);
  const linkProps = internal
    ? { href: `/work/${project.slug}/` }
    : { href: project.href, target: "_blank", rel: "noopener noreferrer" };
  return (
    <a
      {...linkProps}
      tabIndex={active ? 0 : -1}
      className="group grid h-full grid-cols-2 overflow-hidden rounded-3xl border border-line bg-bg shadow-[0_34px_80px_-36px_rgba(40,60,100,0.55)]"
    >
      <div className="relative h-full overflow-hidden bg-surface">
        <Image
          src={project.image}
          alt={`${project.name} — ${project.tagline}`}
          fill
          sizes="(max-width: 640px) 46vw, 360px"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
        />
      </div>
      <div className="flex h-full flex-col justify-center gap-2 p-5 sm:p-7">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[0.7rem]">
          <span className="text-muted">
            {String(index + 1).padStart(2, "0")} /{" "}
            {String(total).padStart(2, "0")}
          </span>
          <span className="rounded-full bg-accent-wash px-2 py-0.5 text-accent-strong">
            {project.category}
          </span>
          {project.award && (
            <span className="text-muted">· {project.award}</span>
          )}
        </div>
        <h3 className="font-display text-[clamp(1.3rem,2.7vw,2rem)] font-bold leading-tight tracking-[-0.03em] text-ink">
          {project.name}
        </h3>
        <p className="line-clamp-1 text-base font-medium text-accent">
          {project.tagline}
        </p>
        <p className="line-clamp-3 text-[0.9rem] leading-relaxed text-ink-soft">
          {project.description}
        </p>
        <span className="mt-1 inline-flex items-center gap-2 font-mono text-[0.8rem] text-ink">
          {internal ? "Read the story" : "View project"}
          <span className="transition-transform duration-200 group-hover:translate-x-1">
            →
          </span>
        </span>
      </div>
    </a>
  );
}
