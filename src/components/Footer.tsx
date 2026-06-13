"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { EMAIL, socials } from "@/data/content";
import Reveal from "./Reveal";
import InView from "./InView";

const MiiScene = dynamic(() => import("@/components/mii/MiiScene"), {
  ssr: false,
});

export default function Footer() {
  const [wave, setWave] = useState(0);

  return (
    <footer
      id="contact"
      className="relative overflow-hidden px-5 pb-12 pt-12 sm:px-8 sm:pt-16"
    >
      {/* last warm light of the drive, settling into home */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[60%]"
        style={{
          background:
            "radial-gradient(ellipse 80% 100% at 50% 0%, #fdf1e4 0%, transparent 62%)",
        }}
      />
      <div className="dot-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-full opacity-25 [mask-image:radial-gradient(ellipse_at_top,black,transparent_72%)]" />

      <Reveal className="mx-auto flex max-w-6xl flex-col items-center text-center">
        {/* waving guide Mii — home at the end of the road */}
        <div
          className="relative h-44 w-44 cursor-pointer select-none sm:h-52 sm:w-52"
          onClick={() => setWave((w) => w + 1)}
          onMouseEnter={() => setWave((w) => w + 1)}
          role="img"
          aria-label="The Mii of Donald, waving goodbye"
        >
          <div className="absolute inset-0 grid place-items-center">
            <div className="h-24 w-24 rounded-full bg-surface-2/60" />
          </div>
          <InView className="absolute inset-0">
            <MiiScene waveKey={wave} compact />
          </InView>
        </div>

        <p className="mt-2 font-mono text-sm text-accent">## say-hi</p>
        <h2 className="mt-3 font-display text-[clamp(2.2rem,5vw,4rem)] font-bold tracking-[-0.035em] text-ink">
          Let&apos;s build something.
        </h2>
        <p className="mt-4 max-w-[46ch] text-lg leading-relaxed text-muted">
          I&apos;m always happy to chat, whether it&apos;s a role, an idea, or
          just a hello. Drop me a line and I&apos;ll get back to you.
        </p>

        <a
          href={`mailto:${EMAIL}`}
          className="group mt-8 inline-flex items-center gap-3 rounded-full bg-ink px-6 py-3.5 text-base font-medium text-bg transition-transform duration-200 hover:-translate-y-0.5"
        >
          <span className="font-mono text-sm opacity-70">→</span>
          {EMAIL}
        </a>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
            >
              {s.label}
            </a>
          ))}
        </div>
      </Reveal>

      <div className="mx-auto mt-20 flex max-w-6xl flex-col items-center justify-between gap-3 border-t border-line pt-6 font-mono text-xs text-muted sm:flex-row">
        <span>© {new Date().getFullYear()} Donald Lee</span>
        <span>designed &amp; built by Donald Lee · rendered from donald.md</span>
      </div>
    </footer>
  );
}
