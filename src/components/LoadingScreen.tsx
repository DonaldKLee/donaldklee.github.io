"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const RENDER_STEPS = [
  "parsing donald.md",
  "# home",
  "## about",
  "## experience",
  "## projects",
  "## side-quests",
];

export default function LoadingScreen({
  onComplete,
}: {
  onComplete: () => void;
}) {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState<0 | 1 | 2>(0); // 0 user, 1 bot reply, 2 log
  const [done, setDone] = useState(0); // how many steps rendered
  const finished = useRef(false);

  const finish = () => {
    if (finished.current) return;
    finished.current = true;
    sessionStorage.setItem("dl-rendered", "1");
    setShow(false);
    // let the exit animation play
    window.setTimeout(onComplete, reduce ? 0 : 620);
  };

  useEffect(() => {
    // Already seen this session → skip straight in.
    if (
      typeof window !== "undefined" &&
      sessionStorage.getItem("dl-rendered") === "1"
    ) {
      finished.current = true;
      setShow(false);
      onComplete();
      return;
    }

    if (reduce) {
      const t = window.setTimeout(finish, 500);
      return () => window.clearTimeout(t);
    }

    const timers: number[] = [];
    timers.push(window.setTimeout(() => setPhase(1), 850));
    timers.push(window.setTimeout(() => setPhase(2), 1550));
    RENDER_STEPS.forEach((_, i) => {
      timers.push(window.setTimeout(() => setDone(i + 1), 1850 + i * 230));
    });
    timers.push(
      window.setTimeout(finish, 1850 + RENDER_STEPS.length * 230 + 520),
    );
    return () => timers.forEach(window.clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 grid place-items-center bg-bg px-6"
          style={{ zIndex: "var(--z-loader)" as unknown as number }}
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            filter: "blur(6px)",
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
          }}
        >
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.5]" />

          <div className="relative w-full max-w-[440px]">
            {/* skip */}
            <button
              onClick={finish}
              className="absolute -top-9 right-0 font-mono text-xs text-muted transition-colors hover:text-ink"
            >
              skip →
            </button>

            {/* chat */}
            <div className="flex flex-col gap-3">
              {/* user prompt */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="self-end max-w-[80%] rounded-2xl rounded-br-sm bg-accent px-4 py-2.5 text-[0.95rem] text-accent-ink shadow-sm"
              >
                hey, can you render this markdown file?
                <span className="mt-2 flex items-center gap-1.5 rounded-md bg-white/15 px-2 py-1 font-mono text-xs">
                  <span aria-hidden>📄</span> donald.md
                </span>
              </motion.div>

              {/* bot reply */}
              <AnimatePresence>
                {phase >= 1 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="self-start max-w-[85%] rounded-2xl rounded-bl-sm border border-line bg-surface px-4 py-3 shadow-sm"
                  >
                    <p className="text-[0.95rem] text-ink">
                      On it. Rendering now
                      <span className="text-accent">.</span>
                    </p>

                    {phase >= 2 && (
                      <div className="mt-3 space-y-1 border-t border-line pt-3 font-mono text-[0.78rem]">
                        {RENDER_STEPS.map((step, i) => {
                          const reached = done > i;
                          const active = done === i;
                          return (
                            <motion.div
                              key={step}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: reached || active ? 1 : 0.25 }}
                              className="flex items-center gap-2"
                            >
                              <span
                                className={
                                  reached ? "text-accent" : "text-muted"
                                }
                              >
                                {reached ? "✓" : active ? "▸" : "·"}
                              </span>
                              <span
                                className={
                                  reached ? "text-ink-soft" : "text-muted"
                                }
                              >
                                {step}
                              </span>
                            </motion.div>
                          );
                        })}
                        {done >= RENDER_STEPS.length && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="pt-1 text-accent"
                          >
                            ✓ rendered — opening
                          </motion.p>
                        )}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
