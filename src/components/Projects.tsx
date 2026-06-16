"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  featuredProjects,
  moreProjects,
  type Category,
  type Project,
} from "@/data/content";
import Reveal from "./Reveal";
import FeaturedCarousel from "./FeaturedCarousel";
import CardMedia from "./CardMedia";

const FILTERS: (Category | "All")[] = ["All", "Hackathon", "Side-Project"];
const PAGE_SIZE = 6;

export default function Projects() {
  const [filter, setFilter] = useState<Category | "All">("All");
  const [page, setPage] = useState(0);

  const matches =
    filter === "All"
      ? moreProjects
      : moreProjects.filter((p) => p.category === filter);
  const pageCount = Math.ceil(matches.length / PAGE_SIZE);
  const start = page * PAGE_SIZE;
  const shown = matches.slice(start, start + PAGE_SIZE);

  const choose = (f: Category | "All") => {
    setFilter(f);
    setPage(0);
  };

  return (
    <section id="projects" className="pb-24 pt-12 sm:pb-32">
      {/* featured — a 3D cylinder you rotate by scrolling; heading stays pinned */}
      <FeaturedCarousel
        projects={featuredProjects}
        marker="## projects"
        title="Some things I've built"
        sub="a few favourite projects and hackathon wins."
      />

      {/* the rest — a whiteboard of taped-up projects */}
      <div className="mx-auto mt-12 max-w-6xl px-5 sm:px-8">
        <Reveal className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h3 className="font-display text-2xl font-semibold text-ink">
              More from the shelf
            </h3>
            <p className="mt-1 font-mono text-xs text-muted">
              a few experiments and old projects · tap any to open
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => choose(f)}
                className={`rounded-full px-3.5 py-1.5 font-mono text-sm transition-colors ${
                  filter === f
                    ? "bg-ink text-bg"
                    : "bg-surface text-muted hover:text-ink"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </Reveal>

        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-line-strong bg-surface p-5 shadow-[inset_0_2px_12px_rgba(40,60,100,0.06)] sm:p-8">
            {/* whiteboard sheen + faint grid */}
            <div className="dot-grid pointer-events-none absolute inset-0 opacity-50" />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.5),transparent_40%)]" />
            <motion.div
              key={`${filter}-${page}`}
              className="relative grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3"
            >
              {shown.map((p, i) => (
                <PinnedCard key={p.name} project={p} index={i} />
              ))}
            </motion.div>
          </div>

          {pageCount > 1 && (
            <div className="mt-7 flex items-center justify-center gap-2.5 font-mono text-sm">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="rounded-full border border-line bg-bg px-3.5 py-1.5 text-ink transition-colors hover:border-line-strong hover:bg-surface disabled:cursor-not-allowed disabled:border-line disabled:text-line-strong disabled:hover:bg-bg"
                aria-label="Previous page"
              >
                ←
              </button>
              <div className="flex items-center gap-1.5 px-1" aria-hidden>
                {Array.from({ length: pageCount }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      i === page ? "w-6 bg-ink" : "w-1.5 bg-line-strong hover:bg-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="sr-only">
                Page {page + 1} of {pageCount}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
                disabled={page === pageCount - 1}
                className="rounded-full border border-line bg-bg px-3.5 py-1.5 text-ink transition-colors hover:border-line-strong hover:bg-surface disabled:cursor-not-allowed disabled:border-line disabled:text-line-strong disabled:hover:bg-bg"
                aria-label="Next page"
              >
                →
              </button>
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}

const TILTS = [-3, 2.2, -1.6, 2.8, -2.4, 1.4, -2, 2.5, -1.2, 1.8];

function PinnedCard({ project, index }: { project: Project; index: number }) {
  const tilt = TILTS[index % TILTS.length];
  const internal = Boolean(project.slug);
  const linkProps = internal
    ? { href: `/work/${project.slug}/` }
    : { href: project.href, target: "_blank", rel: "noopener noreferrer" };
  return (
    <motion.a
      layout
      {...linkProps}
      initial={{ opacity: 0, y: 18, rotate: tilt }}
      whileInView={{ opacity: 1, y: 0, rotate: tilt }}
      viewport={{ once: true, margin: "-40px" }}
      whileHover={{ rotate: 0, y: -8, scale: 1.03, zIndex: 5 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="group relative flex flex-col rounded-[10px] bg-white p-2.5 pb-3 shadow-[0_12px_26px_-14px_rgba(30,40,70,0.5)]"
      style={{ transformOrigin: "center top" }}
    >
      {/* tape */}
      <span
        aria-hidden
        className="absolute -top-2.5 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-2 rounded-[2px] bg-amber/30 backdrop-blur-[1px]"
        style={{ boxShadow: "0 1px 2px rgba(0,0,0,0.08)" }}
      />
      <div className="aspect-[16/11] overflow-hidden rounded-[5px] bg-surface">
        <CardMedia
          project={project}
          width={640}
          height={440}
          className="object-cover transition-transform duration-500 ease-out [transform:scale(var(--z))] group-hover:[transform:scale(calc(var(--z)*1.06))]"
        />
      </div>
      <div className="px-1 pt-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-display text-base font-semibold text-ink">
            {project.name}
          </h4>
          <span className="font-mono text-[0.65rem] text-muted">
            {project.category}
          </span>
        </div>
        <p className="mt-0.5 text-sm font-medium text-accent">
          {project.tagline}
        </p>
        <p className="mt-1.5 line-clamp-2 text-[0.82rem] leading-relaxed text-muted">
          {project.description}
        </p>
      </div>
    </motion.a>
  );
}
