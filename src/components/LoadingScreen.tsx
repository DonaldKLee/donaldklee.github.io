"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { track } from "@/lib/analytics";

type Stage = "enter" | "source" | "render" | "zoom";
type Segment = [text: string, syntax: boolean];

const SOURCE: Segment[][] = [
  [["# ", true], ["Hi, I'm Donald.", false]],
  [],
  [
    ["A self-taught programmer at ", false],
    ["**", true],
    ["UBC", false],
    ["**", true],
    [".", false],
  ],
  [],
  [["## ", true], ["about", false]],
  [["## ", true], ["experience", false]],
  [["## ", true], ["projects", false]],
  [["## ", true], ["side-quests", false]],
];
const SECTIONS = ["about", "experience", "projects", "side-quests"];

// floating markdown syntax, parked at different depths so it parallaxes as the
// sheet turns and flies past the camera on the zoom
const TOKENS = [
  { text: "##", left: "-13%", top: "9%", z: 150, tone: "text-accent" },
  { text: "**", left: "105%", top: "17%", z: 210, tone: "text-accent" },
  { text: "[ ]", left: "-16%", top: "58%", z: 90, tone: "text-line-strong" },
  { text: ">", left: "116%", top: "68%", z: 130, tone: "text-line-strong" },
  { text: "---", left: "76%", top: "-9%", z: 70, tone: "text-line-strong" },
  { text: "`md`", left: "9%", top: "104%", z: 170, tone: "text-accent" },
];

const LINE_MS = 130;
const RENDER_AT = 300 + SOURCE.length * LINE_MS + 260;
const ZOOM_AT = RENDER_AT + 760;
const ZOOM_MS = 760;

const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const SWEEP = { duration: 0.55, ease: [0.65, 0, 0.35, 1] as const };

const rig = {
  enter: { rotateX: 48, rotateY: -40, rotateZ: 10, scale: 0.72 },
  source: {
    rotateX: 26,
    rotateY: -24,
    rotateZ: 5,
    scale: 1,
    transition: { duration: 0.9, ease: EASE_OUT },
  },
  render: {
    rotateX: 13,
    rotateY: -11,
    rotateZ: 2.5,
    scale: 1.04,
    transition: { duration: 0.75, ease: EASE_OUT },
  },
  // scales around blank paper below the content, so the type flies out of frame
  // and the viewport lands on an empty page that matches the site background
  zoom: {
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 12,
    transition: { duration: ZOOM_MS / 1000, ease: [0.7, 0, 0.84, 0] as const },
  },
};

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  const [gone, setGone] = useState(false);
  const [stage, setStage] = useState<Stage>("enter");
  const [lines, setLines] = useState(0);
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    sessionStorage.setItem("dl-rendered", "1");
    setShow(false);
    // start the hero under the fading paper so the two read as one move
    window.setTimeout(onComplete, reduce ? 0 : 140);
    // hard-remove the overlay even if the exit animation never runs (rAF is
    // throttled in background tabs, and AnimatePresence only unmounts after
    // the exit completes) — the loader must never be able to block the site
    window.setTimeout(() => setGone(true), reduce ? 50 : 1300);
  };

  useEffect(() => {
    // Already seen this session → skip straight in. Dev always replays it, or a
    // reload looks like the loader is broken.
    if (
      process.env.NODE_ENV !== "development" &&
      sessionStorage.getItem("dl-rendered") === "1"
    ) {
      finished.current = true;
      setShow(false);
      setGone(true);
      onComplete();
      return;
    }

    if (reduce) {
      const t = window.setTimeout(finish, 500);
      return () => window.clearTimeout(t);
    }

    const timers: number[] = [];
    timers.push(window.setTimeout(() => setStage("source"), 30));
    SOURCE.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => setLines(i + 1), 300 + i * LINE_MS),
      );
    });
    timers.push(window.setTimeout(() => setStage("render"), RENDER_AT));
    timers.push(window.setTimeout(() => setStage("zoom"), ZOOM_AT));
    timers.push(window.setTimeout(finish, ZOOM_AT + ZOOM_MS));
    return () => timers.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  if (gone) return null;

  const rendered = !!reduce || stage === "render" || stage === "zoom";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          aria-label="Loading Donald Lee's portfolio"
          className="fixed inset-0 grid place-items-center overflow-hidden bg-bg px-6"
          style={{ zIndex: "var(--z-loader)" as unknown as number }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: EASE_OUT } }}
        >
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-50 [mask-image:radial-gradient(ellipse_at_center,black,transparent_78%)]" />

          {/* opacity lives here: on the rig it would flatten preserve-3d */}
          <motion.div
            aria-hidden
            className="relative w-[min(82vw,440px)]"
            style={{ perspective: 1400 }}
            initial={{ opacity: reduce ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.45, ease: EASE_OUT }}
          >
            <motion.div
              className="relative aspect-[7/8] w-full"
              style={{
                transformStyle: "preserve-3d",
                originX: 0.5,
                originY: 0.88,
              }}
              variants={reduce ? undefined : rig}
              initial={reduce ? false : "enter"}
              animate={reduce ? undefined : stage}
            >
              {/* the rest of the stack, so the sheet has real thickness */}
              <div className="loader-sheet" style={{ transform: "translateZ(-36px)" }} />
              <div className="loader-sheet" style={{ transform: "translateZ(-18px)" }} />

              <div className="loader-sheet overflow-hidden shadow-[0_2px_6px_rgba(30,40,70,0.08),0_36px_60px_-22px_rgba(30,40,70,0.38)]">
                <div className="flex items-center justify-between border-b border-line px-4 py-2.5 font-mono text-[0.7rem] sm:px-5">
                  <span className="text-ink">donaldlee.md</span>
                  <span className="flex gap-3">
                    <span className={rendered ? "text-muted" : "text-ink"}>raw</span>
                    <span className={rendered ? "text-accent" : "text-muted"}>
                      rendered
                    </span>
                  </span>
                </div>

                <div className="relative h-[calc(100%-2.3rem)]">
                  {!reduce && (
                    <motion.div
                      className="absolute inset-0 p-4 font-mono text-[0.72rem] leading-[1.8] text-ink-soft sm:p-5 sm:text-[0.8rem]"
                      initial={{ clipPath: "inset(0% 0 0 0)" }}
                      animate={{
                        clipPath: rendered ? "inset(100% 0 0 0)" : "inset(0% 0 0 0)",
                      }}
                      transition={SWEEP}
                    >
                      {SOURCE.map((segments, i) => (
                        <div
                          key={i}
                          className={`flex gap-3 ${i < lines ? "" : "invisible"}`}
                        >
                          <span className="w-3 shrink-0 text-right text-line-strong tabular-nums">
                            {i + 1}
                          </span>
                          <span className="min-h-[1.8em] min-w-0">
                            {segments.map(([text, syntax], j) => (
                              <span
                                key={j}
                                className={`whitespace-pre-wrap ${syntax ? "text-accent" : ""}`}
                              >
                                {text}
                              </span>
                            ))}
                            {i === lines - 1 && (
                              <span className="ml-0.5 inline-block h-[1em] w-[0.5em] bg-accent align-[-0.15em] [animation:blink-caret_1s_steps(1)_infinite]" />
                            )}
                          </span>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  <motion.div
                    className="absolute inset-0 p-4 sm:p-5"
                    initial={
                      reduce ? false : { clipPath: "inset(0 0 100% 0)" }
                    }
                    animate={
                      reduce
                        ? undefined
                        : {
                            clipPath: rendered
                              ? "inset(0 0 0% 0)"
                              : "inset(0 0 100% 0)",
                          }
                    }
                    transition={SWEEP}
                  >
                    <p className="font-display text-[clamp(1.75rem,8vw,2.5rem)] font-extrabold leading-[1.02] tracking-[-0.04em] text-ink">
                      Hi, I&apos;m Donald.
                    </p>
                    <p className="mt-2.5 text-sm text-ink-soft">
                      A self-taught programmer at{" "}
                      <strong className="font-semibold text-ink">UBC</strong>.
                    </p>
                    <div className="mt-4">
                      {SECTIONS.map((section) => (
                        <p
                          key={section}
                          className="border-b border-line py-1.5 font-display text-[0.95rem] font-semibold text-ink"
                        >
                          {section}
                        </p>
                      ))}
                    </div>
                  </motion.div>

                  {!reduce && rendered && (
                    <motion.span
                      className="absolute inset-x-0 h-0.5 bg-accent"
                      initial={{ top: "0%", opacity: 0 }}
                      animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
                      transition={SWEEP}
                    />
                  )}
                </div>
              </div>

              {!reduce &&
                TOKENS.map((token) => (
                  <span
                    key={token.text}
                    className={`absolute hidden font-mono text-xl font-medium sm:block ${token.tone}`}
                    style={{
                      left: token.left,
                      top: token.top,
                      transform: `translateZ(${token.z}px)`,
                    }}
                  >
                    {token.text}
                  </span>
                ))}
            </motion.div>
          </motion.div>

          <button
            onClick={() => {
              track("loader_skip");
              finish();
            }}
            className={`absolute bottom-5 right-4 px-2 py-2 font-mono text-xs text-muted transition-opacity hover:text-ink sm:right-6 ${
              stage === "zoom" ? "opacity-0" : "opacity-100"
            }`}
          >
            skip →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
