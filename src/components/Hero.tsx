"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { currentlyDoing, EMAIL, EMAIL_TEMPLATE } from "@/data/content";
import { getMiiStatus, type MiiStatus } from "@/lib/miiMode";
import { track } from "@/lib/analytics";

const MiiScene = dynamic(() => import("@/components/mii/MiiScene"), {
  ssr: false,
});

const MII_MODES = new Set(["idle", "sleep", "work", "eat", "chill", "commute"]);
const isMiiMode = (v: string): v is MiiStatus["mode"] => MII_MODES.has(v);

// mini render-log shown while the 3D chunk loads; sibling in spirit to the
// loading screen's "render donaldlee.xyz" exchange
const SPAWN_LOG = [
  "> spawning donald…",
  "> combing the middle part…",
  "> zipping the quarter-zip…",
  "> lacing the shoes…",
  "> almost there…",
];

export default function Hero({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  const [wave, setWave] = useState(0);
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState<MiiStatus | null>(null);
  // true once the canvas has painted its first frame; until then a
  // placeholder holds the spot so the hero never looks broken
  const [miiReady, setMiiReady] = useState(false);
  const [logIdx, setLogIdx] = useState(0);

  // walk the spawn log while the Mii loads, resting on the last line
  useEffect(() => {
    if (miiReady) return;
    const t = window.setInterval(
      () => setLogIdx((i) => Math.min(i + 1, SPAWN_LOG.length - 1)),
      700,
    );
    return () => window.clearInterval(t);
  }, [miiReady]);

  // warm the 3D chunk on first paint so the Mii is ready the instant the
  // loading screen lifts, instead of fetching it lazily afterward
  useEffect(() => {
    void import("@/components/mii/MiiScene");
  }, []);

  // resolve Donald's live "mode" from Vancouver time, refresh each minute.
  // ?mii=<mode> pins a specific scene for previewing; unknown values are
  // ignored rather than rendered into the page
  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("mii");
    if (forced && isMiiMode(forced)) {
      setStatus({ ...getMiiStatus(), mode: forced, label: forced });
      return;
    }
    const update = () => setStatus(getMiiStatus());
    update();
    const t = window.setInterval(update, 60_000);
    return () => window.clearInterval(t);
  }, []);

  // auto-wave shortly after the site reveals
  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => setWave((w) => w + 1), 900);
    return () => window.clearTimeout(t);
  }, [ready]);

  // rotate the "currently" line
  useEffect(() => {
    if (reduce) return;
    const t = window.setInterval(
      () => setIdx((i) => (i + 1) % currentlyDoing.length),
      2600,
    );
    return () => window.clearInterval(t);
  }, [reduce]);

  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: reduce ? 0 : 18 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
    },
  };

  return (
    <section
      id="top"
      className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col items-center gap-4 px-5 pt-28 sm:px-8 lg:flex-row lg:gap-6 lg:pt-20"
    >
      {/* soft backdrop */}
      <div className="dot-grid pointer-events-none absolute inset-0 -z-10 opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_72%)]" />

      {/* copy */}
      <motion.div
        className="flex-1 lg:pr-6"
        variants={container}
        initial="hidden"
        animate={ready ? "show" : "hidden"}
      >
        <motion.div
          variants={item}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 font-mono text-xs text-ink-soft"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          open to new opportunities
        </motion.div>

        <motion.h1
          variants={item}
          className="font-display text-[clamp(2.6rem,7vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-ink"
        >
          Hi, I&apos;m Donald.
        </motion.h1>

        <motion.p
          variants={item}
          className="mt-5 max-w-[46ch] text-balance text-lg leading-relaxed text-ink-soft sm:text-xl"
        >
          A self-taught programmer studying at UBC. I build things that help make lives easier!
        </motion.p>

        {/* rotating currently line */}
        <motion.div
          variants={item}
          className="mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[0.82rem] text-muted sm:text-sm"
        >
          <span className="text-accent">currently</span>
          <span className="text-ink-soft">→</span>
          <span className="relative inline-block overflow-hidden">
            <motion.span
              key={idx}
              initial={{ y: reduce ? 0 : "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="inline-block whitespace-nowrap text-ink"
            >
              {currentlyDoing[idx]}
            </motion.span>
          </span>
        </motion.div>

        <motion.div variants={item} className="mt-8 flex flex-wrap gap-3">
          <a
            href="#projects"
            onClick={() => track("cta_click", { cta: "see_what_ive_built" })}
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-bg transition-transform duration-200 hover:-translate-y-0.5"
          >
            See what I&apos;ve built
            <span className="transition-transform duration-200 group-hover:translate-y-0.5">
              ↓
            </span>
          </a>
          <a
            href={`mailto:${EMAIL}${EMAIL_TEMPLATE}`}
            onClick={() => track("contact_click", { location: "hero" })}
            className="inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm font-medium text-ink transition-colors hover:border-ink hover:bg-surface"
          >
            Say hi
          </a>
        </motion.div>
      </motion.div>

      {/* Mii */}
      <div className="relative flex-1">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={ready ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="relative mx-auto aspect-square w-[min(80vw,460px)] cursor-pointer select-none"
          onClick={() => {
            setWave((w) => w + 1);
            // the mode tells us what pose they saw when they poked him
            track("mii_tap", { location: "hero", mode: status?.mode ?? "idle" });
          }}
          role="img"
          aria-label="A 3D Mii of Donald with a black middle-part perm and a black quarter-zip over blue jeans. Tap to make him wave."
        >
          {/* covers both the chunk download and WebGL warm-up, then hands
              off the moment the first real frame is on screen (the scene
              itself plays a spawn pop-in from there) */}
          <div
            aria-hidden
            className={`pointer-events-none absolute inset-0 grid place-items-center transition-opacity duration-300 ${
              miiReady ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="flex flex-col items-center gap-4">
              {/* spawn pad: a soft ring where the Mii will land */}
              <div className="relative grid h-28 w-28 place-items-center">
                <div className="absolute inset-0 animate-ping rounded-full border border-line-strong opacity-40 [animation-duration:1.6s]" />
                <div className="h-20 w-20 animate-pulse rounded-full bg-surface-2" />
              </div>
              <span className="font-mono text-xs text-muted">
                {SPAWN_LOG[logIdx]}
                <span className="animate-pulse">▌</span>
              </span>
            </div>
          </div>
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${
              miiReady ? "opacity-100" : "opacity-0"
            }`}
          >
            <MiiScene
              waveKey={wave}
              mode={status?.mode ?? "idle"}
              onReady={() => setMiiReady(true)}
            />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={ready ? { opacity: 1 } : {}}
          transition={{ delay: 1.6, duration: 0.6 }}
          className="flex flex-col items-center gap-1.5 text-center"
        >
          {status && (
            <span className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3 py-1 font-mono text-xs text-ink-soft">
              <span aria-hidden>{status.emoji}</span>
              probably {status.label} right now
            </span>
          )}
          <span className="pointer-events-none font-mono text-xs text-muted">
            psst — tap me 👋
          </span>
        </motion.div>
      </div>

      {/* scroll cue */}
      <motion.a
        href="#about"
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : {}}
        transition={{ delay: 2, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 font-mono text-[0.7rem] text-muted lg:flex"
      >
        scroll
        <span className="flex h-9 w-5 items-start justify-center rounded-full border border-line-strong p-1">
          <motion.span
            animate={reduce ? {} : { y: [0, 10, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            className="h-1.5 w-1.5 rounded-full bg-muted"
          />
        </span>
      </motion.a>
    </section>
  );
}
