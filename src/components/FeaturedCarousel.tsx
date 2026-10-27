"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import CardMedia from "./CardMedia";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "framer-motion";
import type { Project } from "@/data/content";
import { track } from "@/lib/analytics";

type TipData = { project: Project; index: number; total: number };
type MetaTipHandle = {
  show: (d: TipData) => void;
  move: (x: number, y: number) => void;
  hide: () => void;
};

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
  const tipRef = useRef<MetaTipHandle>(null);
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });
  const rotate = useTransform(scrollYProgress, [0, 1], [0, -(n - 1) * step]);
  const [current, setCurrent] = useState(0);
  // furthest card reached, reported once each — a drop-off funnel for how far
  // people actually rotate through the featured work
  const furthest = useRef(0);
  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const i = Math.min(n - 1, Math.max(0, Math.round(p * (n - 1))));
    setCurrent(i);
    if (i > furthest.current) {
      furthest.current = i;
      track("carousel_progress", {
        reached: i + 1,
        total: n,
        project: projects[i]?.name,
      });
    }
  });

  // Any gesture over the pinned stage should advance the page: sideways
  // trackpad swipes redirect to vertical, and click-drag scrolls too. This
  // makes "scroll the cylinder" and "scroll the page" the same motion.
  useEffect(() => {
    const el = stageRef.current;
    if (!el || reduce) return;

    // instant, not smooth: the page sets scroll-behavior:smooth for anchor
    // links, but redirecting wheel/drag through a smooth scrollBy queues an
    // animation per event, which stacks up into lag and eats the gesture
    const advance = (by: number) => window.scrollBy({ top: by, behavior: "instant" });

    const onWheel = (e: WheelEvent) => {
      // when the horizontal intent dominates, push it into the page scroll
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        advance(e.deltaX);
        e.preventDefault();
      }
    };

    let pointerId = -1;
    let dragging = false;
    let startX = 0;
    let startY = 0;
    let lastY = 0;
    let lastX = 0;
    const onDown = (e: PointerEvent) => {
      // leave touch alone so phones keep native vertical scrolling
      if (e.button !== 0 || e.pointerType === "touch") return;
      // arm a potential drag, but don't capture yet — capturing on a plain
      // click would steal the click from the card link underneath
      pointerId = e.pointerId;
      dragging = false;
      startX = lastX = e.clientX;
      startY = lastY = e.clientY;
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerId !== pointerId) return;
      if (!dragging) {
        // only become a drag once the pointer clearly moves; below this a
        // click passes straight through to the project link
        if (Math.abs(e.clientX - startX) + Math.abs(e.clientY - startY) < 6)
          return;
        dragging = true;
        el.setPointerCapture(pointerId);
        lastX = e.clientX;
        lastY = e.clientY;
        return;
      }
      // dragging up or left walks the page forward
      const dy = e.clientY - lastY;
      const dx = e.clientX - lastX;
      lastY = e.clientY;
      lastX = e.clientX;
      advance(-(dy + dx));
    };
    const stop = () => {
      if (pointerId !== -1 && el.hasPointerCapture(pointerId)) {
        el.releasePointerCapture(pointerId);
      }
      pointerId = -1;
      dragging = false;
    };

    // touch: a sideways swipe advances the page too, while a vertical swipe is
    // left to native scrolling (which already moves the cylinder)
    let tStartX = 0;
    let tStartY = 0;
    let tLastX = 0;
    let axis: "?" | "x" | "y" = "?";
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      axis = "?";
      tStartX = tLastX = e.touches[0].clientX;
      tStartY = e.touches[0].clientY;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length !== 1) return;
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      if (axis === "?") {
        const dx = Math.abs(x - tStartX);
        const dy = Math.abs(y - tStartY);
        if (dx > 8 || dy > 8) axis = dx > dy ? "x" : "y";
      }
      if (axis === "x") {
        advance(-(x - tLastX) * 1.2);
        e.preventDefault(); // we own this gesture; stop the page from panning
      }
      tLastX = x;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("pointerdown", onDown);
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerup", stop);
    el.addEventListener("pointercancel", stop);
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      el.removeEventListener("wheel", onWheel);
      el.removeEventListener("pointerdown", onDown);
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerup", stop);
      el.removeEventListener("pointercancel", stop);
      el.removeEventListener("touchstart", onTouchStart);
      el.removeEventListener("touchmove", onTouchMove);
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
              className="aspect-[5/6] w-[82vw] shrink-0 snap-center sm:aspect-[16/10] sm:w-[580px]"
            >
              <CarouselCard project={p} index={i} total={n} active tip={tipRef} />
            </div>
          ))}
          <div className="w-1 shrink-0" aria-hidden />
        </div>
        <MetaTooltip ref={tipRef} />
      </div>
    );
  }

  return (
    <div
      ref={trackRef}
      className="relative"
      style={{ height: `${n * 100}svh` }}
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-[100svh] cursor-grab touch-pan-y overflow-hidden active:cursor-grabbing"
      >
        {/* pinned heading — stays in view while the cylinder spins */}
        <div className="absolute inset-x-0 top-0 z-10 pt-[max(4.5rem,7vh)]">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <p className="mb-1 font-mono text-sm text-accent">{marker}</p>
            <h2 className="font-display text-xl font-bold tracking-[-0.03em] text-ink sm:text-3xl">
              {title}
            </h2>
            <p className="mt-1 hidden max-w-[58ch] text-sm leading-relaxed text-muted sm:mt-1.5 sm:line-clamp-2 sm:block sm:text-base">
              {sub}
            </p>
          </div>
        </div>

        {/* perspective stage in the space below the heading; hub centred in it */}
        <div className="cylinder-stage absolute inset-x-0 bottom-[72px] top-[152px] grid place-items-center sm:top-[176px]">
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
                    opacity: active ? 1 : 0.14,
                    pointerEvents: active ? "auto" : "none",
                    transition: "opacity 0.4s ease",
                  }}
                >
                  <CarouselCard
                    project={p}
                    index={i}
                    total={n}
                    active={active}
                    tip={tipRef}
                  />
                </div>
              );
            })}
          </motion.div>
        </div>

        <MetaTooltip ref={tipRef} />

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
            <span className="flex items-center gap-1.5 font-mono text-xs text-ink-soft">
              keep scrolling
              <motion.span
                aria-hidden
                animate={reduce ? {} : { y: [0, 3, 0] }}
                transition={{
                  duration: 1.3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                ↓
              </motion.span>
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
  tip,
}: {
  project: Project;
  index: number;
  total: number;
  active: boolean;
  tip: RefObject<MetaTipHandle | null>;
}) {
  const internal = Boolean(project.slug);
  const linkProps = internal
    ? { href: `/project/${project.slug}/` }
    : { href: project.href, target: "_blank", rel: "noopener noreferrer" };

  // only fine pointers get the cursor-following tooltip; touch keeps the
  // static label below
  const fine = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(hover: hover)").matches;

  return (
    <a
      {...linkProps}
      aria-label={`${project.name}. ${project.tagline}. ${project.description}`}
      tabIndex={active ? 0 : -1}
      onClick={() =>
        track("project_click", {
          project: project.name,
          category: project.category,
          source: "featured_carousel",
          position: index + 1,
          link_type: internal ? "writeup" : "external",
        })
      }
      onMouseEnter={(e) => {
        if (!fine()) return;
        tip.current?.show({ project, index, total });
        tip.current?.move(e.clientX, e.clientY);
      }}
      onMouseMove={(e) => {
        if (!fine()) return;
        // show() is a no-op once this card is already the shown one, so this
        // stays off the render path while the cursor moves
        tip.current?.show({ project, index, total });
        tip.current?.move(e.clientX, e.clientY);
      }}
      onMouseLeave={() => tip.current?.hide()}
      className="group relative flex h-full w-full flex-col overflow-hidden rounded-3xl border border-line bg-bg shadow-[0_34px_80px_-36px_rgba(40,60,100,0.55)]"
    >
      {/* media: fills the whole card on desktop (text block is hidden there),
          sits on top on phones where the text block takes the space below. The
          demo clips are widescreen (~2:1), so a dark frame turns the letterbox
          into an intentional, cinematic border instead of blank space. */}
      <div className="relative min-h-0 grow overflow-hidden bg-ink">
        <CardMedia
          project={project}
          fill
          active={active}
          sizes="(max-width: 640px) 86vw, 720px"
          className="object-cover transition-transform duration-700 ease-out [transform:scale(var(--z))] group-hover:[transform:scale(calc(var(--z)*1.05))]"
        />
      </div>

      {/* metadata, in-flow under the image. Visible on small screens and on
          touch; hidden only on wide, hover-capable pointers, where the cursor
          tooltip takes over and the image grows to fill the whole card. */}
      <div className="shrink-0 border-t border-line p-4 [@media(min-width:640px)_and_(hover:hover)]:hidden">
        <div className="flex flex-wrap items-center gap-2 font-mono text-[0.68rem]">
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
        <h3 className="mt-1.5 font-display text-lg font-bold leading-tight tracking-[-0.02em] text-ink">
          {project.name}
        </h3>
        <p className="mt-0.5 text-sm font-medium text-accent">
          {project.tagline}
        </p>
        <p className="mt-1 line-clamp-2 text-[0.82rem] leading-relaxed text-ink-soft">
          {project.description}
        </p>
      </div>
    </a>
  );
}

/**
 * A small metadata card that follows the cursor, portaled to <body> so the
 * cylinder's 3D transform can't skew it. Position is set imperatively to keep
 * mouse-move off React's render path.
 */
const MetaTooltip = forwardRef<MetaTipHandle>(function MetaTooltip(_props, ref) {
  const elRef = useRef<HTMLDivElement>(null);
  const shownRef = useRef<string | null>(null);
  const [data, setData] = useState<TipData | null>(null);
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  useImperativeHandle(
    ref,
    () => ({
      show(d) {
        // only re-render when the hovered card actually changes
        if (shownRef.current !== d.project.name) {
          shownRef.current = d.project.name;
          setData(d);
        }
        setVisible(true);
      },
      move(x, y) {
        const el = elRef.current;
        if (!el) return;
        const w = el.offsetWidth || 300;
        const h = el.offsetHeight || 180;
        const pad = 14;
        const off = 20;
        let left = x + off;
        let top = y + off;
        if (left + w + pad > window.innerWidth) left = x - off - w;
        if (top + h + pad > window.innerHeight) top = y - off - h;
        left = Math.max(pad, Math.min(left, window.innerWidth - w - pad));
        top = Math.max(pad, Math.min(top, window.innerHeight - h - pad));
        el.style.transform = `translate(${left}px, ${top}px)`;
      },
      hide() {
        shownRef.current = null;
        setVisible(false);
      },
    }),
    [],
  );

  if (!mounted) return null;
  const p = data?.project;

  return createPortal(
    <div
      ref={elRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: "var(--z-tooltip)" as unknown as number,
        willChange: "transform",
      }}
      className="pointer-events-none"
      aria-hidden
    >
      <div
        className={`w-[clamp(244px,22vw,300px)] origin-top-left rounded-2xl border border-line bg-bg/95 p-4 shadow-[0_24px_60px_-24px_rgba(30,40,70,0.55)] backdrop-blur-sm transition-[opacity,transform] duration-200 ease-out ${
          visible
            ? "scale-100 opacity-100"
            : "translate-y-1 scale-[0.97] opacity-0"
        }`}
      >
        {p && data && (
          <>
            <div className="flex flex-wrap items-center gap-2 font-mono text-[0.7rem]">
              <span className="text-muted">
                {String(data.index + 1).padStart(2, "0")} /{" "}
                {String(data.total).padStart(2, "0")}
              </span>
              <span className="rounded-full bg-accent-wash px-2 py-0.5 text-accent-strong">
                {p.category}
              </span>
              {p.award && <span className="text-muted">· {p.award}</span>}
            </div>
            <h3 className="mt-2 font-display text-xl font-bold leading-tight tracking-[-0.02em] text-ink">
              {p.name}
            </h3>
            <p className="mt-0.5 text-sm font-medium text-accent">
              {p.tagline}
            </p>
            <p className="mt-1.5 text-[0.85rem] leading-relaxed text-ink-soft">
              {p.description}
            </p>
            <span className="mt-2.5 inline-flex items-center gap-1.5 font-mono text-[0.75rem] text-ink">
              {p.slug ? "Read the story" : "View project"}
              <span aria-hidden>→</span>
            </span>
          </>
        )}
      </div>
    </div>,
    document.body,
  );
});
