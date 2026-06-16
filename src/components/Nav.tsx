"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { EMAIL } from "@/data/content";

const LINKS = [
  { label: "about", href: "/#about" },
  { label: "experience", href: "/#experience" },
  { label: "projects", href: "/#projects" },
  { label: "side quests", href: "/#side-quests" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
      style={{ zIndex: "var(--z-nav)" as unknown as number }}
      className={`fixed inset-x-0 top-0 transition-all duration-300 ${
        scrolled
          ? "border-b border-line bg-bg/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 sm:px-8">
        <a
          href="/"
          className="group flex items-center gap-2.5"
          aria-label="Donald Lee, back to top"
        >
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-ink font-display text-sm font-bold text-bg transition-transform duration-300 group-hover:-rotate-6">
            DL
          </span>
          <span className="font-mono text-sm text-ink-soft">donaldlee.xyz</span>
        </a>

        <div className="hidden items-center gap-1 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-1.5 font-mono text-sm text-muted transition-colors hover:bg-surface hover:text-ink"
            >
              {l.label}
            </a>
          ))}
          <a
            href={`mailto:${EMAIL}`}
            className="ml-2 rounded-full bg-ink px-4 py-1.5 text-sm font-medium text-bg transition-transform duration-200 hover:-translate-y-0.5"
          >
            Say hi
          </a>
        </div>

        <button
          className="flex h-9 w-9 flex-col items-center justify-center gap-1.5 md:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className={`h-0.5 w-5 bg-ink transition-transform duration-300 ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-ink transition-opacity duration-200 ${
              open ? "opacity-0" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-ink transition-transform duration-300 ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* mobile sheet; inert while closed so its links can't take focus */}
      <motion.div
        initial={false}
        inert={!open}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden border-t border-line bg-bg md:hidden"
      >
        <div className="flex flex-col gap-1 px-5 py-4">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-2.5 font-mono text-base text-ink-soft hover:bg-surface"
            >
              {l.label}
            </a>
          ))}
          <a
            href={`mailto:${EMAIL}`}
            onClick={() => setOpen(false)}
            className="mt-1 rounded-lg bg-ink px-3 py-2.5 text-center font-medium text-bg"
          >
            Say hi
          </a>
        </div>
      </motion.div>
    </motion.header>
  );
}
