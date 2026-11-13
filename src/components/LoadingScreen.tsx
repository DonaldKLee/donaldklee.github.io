"use client";

import dynamic from "next/dynamic";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { track } from "@/lib/analytics";
import { getMiiStatus, type MiiStatus } from "@/lib/miiMode";
import { BUILD_STEP, buildPieces, buildSeconds } from "@/components/mii/build";

const MiiScene = dynamic(() => import("@/components/mii/MiiScene"), {
  ssr: false,
});

/**
 * Donald gets built like a Lego figure: each piece drops in and clicks into
 * place while a step counter reads off the instructions. Once he's finished,
 * he slides to his spot in the hero as the page fades in around him, and the
 * hero's own Mii takes over underneath without a jump.
 */

type Box = { left: number; top: number; size: number };

const HOLD_MS = 160; // beat on the finished figure before it moves
const LAND_MS = 650;
const STALL_MS = 3500; // the 3D never arrived: give up and show the site
const SEEN_KEY = "dl-intro-seen";
const WEEK_MS = 7 * 24 * 60 * 60 * 1000;
const EASE_OUT = [0.16, 1, 0.3, 1] as const;
const EASE_IN_OUT = [0.65, 0, 0.35, 1] as const;
const MODES = new Set(["idle", "sleep", "work", "eat", "chill", "commute"]);

const seenRecently = () => {
  try {
    return Date.now() - Number(localStorage.getItem(SEEN_KEY)) < WEEK_MS;
  } catch {
    return false;
  }
};

// same pose the hero will show, so the handoff is invisible
const currentMode = (): MiiStatus["mode"] => {
  const forced = new URLSearchParams(window.location.search).get("mii");
  if (forced && MODES.has(forced)) return forced as MiiStatus["mode"];
  return getMiiStatus().mode;
};

// the hero Mii box (same size rule as Hero), centred a little above middle
const startBox = (): Box => {
  const size = Math.min(window.innerWidth * 0.8, 460);
  return {
    size,
    left: (window.innerWidth - size) / 2,
    top: Math.max((window.innerHeight - size) / 2 - 28, 16),
  };
};

// where the hero's Mii box rests. Its entrance scale is centred, so the
// rect's centre plus its layout size gives the untransformed box.
const heroBox = (): Box | null => {
  const el = document.getElementById("hero-mii");
  if (!el) return null;
  const r = el.getBoundingClientRect();
  const size = el.offsetWidth;
  const top = r.top + r.height / 2 - size / 2;
  // mostly off-screen (restored mid-scroll): no landing, just fade
  if (top + size * 0.5 > window.innerHeight || top + size * 0.5 < 0) return null;
  return { size, left: r.left + r.width / 2 - size / 2, top };
};

export default function LoadingScreen({
  onReveal,
  onDone,
}: {
  /** the page content can come in; handoff = the Mii is landing on the hero's */
  onReveal: (handoff: boolean) => void;
  /** the loader's Mii is gone: show the hero's own */
  onDone: () => void;
}) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  const [gone, setGone] = useState(false);
  const [box, setBox] = useState<Box | null>(null);
  const [mode, setMode] = useState<MiiStatus["mode"]>("idle");
  const [step, setStep] = useState(0);
  const [target, setTarget] = useState<Box | null>(null);
  const [landing, setLanding] = useState(false);
  const finished = useRef(false);
  const sceneReady = useRef(false);
  const timers = useRef<number[]>([]);
  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms));
  };

  const pieces = buildPieces(mode);

  // skip, stall, or a visitor who saw it this week: everything at once
  const bail = () => {
    if (finished.current) return;
    finished.current = true;
    try {
      localStorage.setItem(SEEN_KEY, String(Date.now()));
    } catch {}
    onReveal(false);
    onDone();
    setShow(false);
    // never let the overlay block the site, even if the exit never runs
    later(() => setGone(true), 800);
  };

  const land = () => {
    if (finished.current) return;
    finished.current = true;
    try {
      localStorage.setItem(SEEN_KEY, String(Date.now()));
    } catch {}
    const to = heroBox();
    if (!to) {
      finished.current = false;
      bail();
      return;
    }
    setTarget(to);
    setLanding(true);
    onReveal(true);
    later(() => {
      onDone();
      setGone(true);
    }, LAND_MS);
  };

  useLayoutEffect(() => {
    setBox(startBox());
    setMode(currentMode());
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV !== "development" && seenRecently()) {
      finished.current = true;
      setGone(true);
      onReveal(false);
      onDone();
      return;
    }
    if (reduce) {
      later(bail, 350);
    } else {
      later(() => {
        if (!sceneReady.current) bail();
      }, STALL_MS);
    }

    const skip = () => {
      if (finished.current) return;
      track("loader_skip");
      bail();
    };
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    const pending = timers.current;
    return () => {
      pending.forEach(window.clearTimeout);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  // the scene painted: the build is running, tick the instructions with it
  const onSceneReady = () => {
    sceneReady.current = true;
    // backstop if frames stall mid-build (a backgrounded tab)
    later(bail, (buildSeconds(pieces.length) + 1.5) * 1000);
    pieces.forEach((_, i) => later(() => setStep(i + 1), i * BUILD_STEP * 1000));
  };

  if (gone) return null;

  const total = pieces.length;
  const label = step === 0 ? "opening the box" : pieces[step - 1];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          role="status"
          aria-label="Loading Donald Lee's portfolio"
          className="fixed inset-0 cursor-pointer"
          style={{ zIndex: "var(--z-loader)" as unknown as number }}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.35, ease: EASE_OUT } }}
        >
          {/* the page behind fades up as Donald heads to his spot */}
          <motion.div
            className="absolute inset-0 bg-bg"
            initial={false}
            animate={{ opacity: landing ? 0 : 1 }}
            transition={{ duration: LAND_MS / 1000, ease: EASE_OUT }}
          />

          {box && !reduce && (
            <>
              <motion.div
                aria-hidden
                className="absolute"
                style={{ left: box.left, top: box.top, width: box.size, height: box.size }}
                initial={false}
                animate={
                  target
                    ? { x: target.left - box.left, y: target.top - box.top }
                    : { x: 0, y: 0 }
                }
                transition={{ duration: LAND_MS / 1000, ease: EASE_IN_OUT }}
              >
                <MiiScene
                  mode={mode}
                  build
                  onReady={onSceneReady}
                  onBuilt={() => later(land, HOLD_MS)}
                />
              </motion.div>

              <motion.p
                aria-hidden
                className="absolute inset-x-0 flex items-baseline justify-center gap-3 font-mono text-xs text-muted sm:text-sm"
                style={{ top: Math.min(box.top + box.size + 4, window.innerHeight - 40) }}
                initial={{ opacity: 0 }}
                animate={{ opacity: landing ? 0 : 1 }}
                transition={{ duration: 0.25, delay: landing ? 0 : 0.15 }}
              >
                <span className="tabular-nums text-ink">
                  {String(step).padStart(2, "0")}
                  <span className="text-muted">/{String(total).padStart(2, "0")}</span>
                </span>
                <span className="w-[12ch]">{label}</span>
              </motion.p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
