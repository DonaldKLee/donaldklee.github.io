"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { experience } from "@/data/content";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

export default function Experience() {
  const [open, setOpen] = useState(0);

  return (
    <section
      id="experience"
      className="mx-auto max-w-5xl px-5 py-24 sm:px-8 sm:py-32"
    >
      <SectionHeading
        marker="## experience"
        title="Where I've worked"
        sub="Internships, exec roles, and a few hackathon trophies along the way."
      />

      <Reveal>
        <div className="overflow-hidden rounded-2xl border border-line">
          {experience.map((group, i) => {
            const isOpen = open === i;
            return (
              <div
                key={group.org}
                className={i > 0 ? "border-t border-line" : ""}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-surface sm:px-7"
                  aria-expanded={isOpen}
                >
                  <span
                    className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface text-xl"
                    aria-hidden
                  >
                    {group.emoji}
                  </span>
                  <span className="flex-1">
                    <span className="block font-display text-lg font-semibold text-ink">
                      {group.org}
                    </span>
                    <span className="font-mono text-xs text-muted">
                      {group.roles[0].title}
                      {group.roles.length > 1 &&
                        ` + ${group.roles.length - 1} more`}
                    </span>
                  </span>
                  <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="text-2xl font-light text-muted"
                  >
                    +
                  </motion.span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="space-y-6 px-5 pb-6 sm:px-7 sm:pl-[5.75rem]">
                        {group.roles.map((role) => (
                          <div key={role.title + role.period}>
                            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                              <p className="font-medium text-ink">
                                {role.title}
                              </p>
                              <p className="font-mono text-xs text-muted">
                                {role.period}
                              </p>
                            </div>
                            <ul className="mt-2 space-y-1.5">
                              {role.points.map((pt) => (
                                <li
                                  key={pt}
                                  className="flex gap-2.5 text-[0.97rem] leading-relaxed text-ink-soft"
                                >
                                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                                  {pt}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
