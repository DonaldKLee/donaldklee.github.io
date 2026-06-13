"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { currentlyDoing, EMAIL } from "@/data/content";
import { getMiiStatus, type MiiStatus } from "@/lib/miiMode";
import InView from "./InView";

const MiiScene = dynamic(() => import("@/components/mii/MiiScene"), {
  ssr: false,
  loading: () => <MiiPlaceholder />,
});

function MiiPlaceholder() {
  return (
    <div className="grid h-full w-full place-items-center">
      <div className="h-28 w-28 animate-pulse rounded-full bg-surface-2" />
    </div>
  );
}

export default function Hero({ ready }: { ready: boolean }) {
  const reduce = useReducedMotion();
  const [wave, setWave] = useState(0);
  const [idx, setIdx] = useState(0);
  const [status, setStatus] = useState<MiiStatus | null>(null);

  // resolve Donald's live "mode" from Vancouver time, refresh each minute
  useEffect(() => {
    const forced = new URLSearchParams(window.location.search).get("mii");
    if (forced) {
      setStatus(getMiiStatus());
      setStatus((s) => ({
        mode: forced as MiiStatus["mode"],
        emoji: s?.emoji ?? "👋",
        label: forced,
      }));
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
          A self-taught developer at UBC. I build AI tooling, hackathon
          projects, and the occasional 2am side quest.
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
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-3 text-sm font-medium text-bg transition-transform duration-200 hover:-translate-y-0.5"
          >
            See what I&apos;ve built
            <span className="transition-transform duration-200 group-hover:translate-y-0.5">
              ↓
            </span>
          </a>
          <a
            href={`mailto:${EMAIL}`}
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
          onClick={() => setWave((w) => w + 1)}
          role="img"
          aria-label="A 3D Mii of Donald with a black middle-part perm and a black quarter-zip over blue jeans. Tap to make him wave."
        >
          <InView className="h-full w-full" rootMargin="300px">
            <MiiScene waveKey={wave} mode={status?.mode ?? "idle"} />
          </InView>
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
              right now, probably {status.label}
            </span>
          )}
          <span className="pointer-events-none font-mono text-xs text-muted">
            psst — tap him 👋
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
