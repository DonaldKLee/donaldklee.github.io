"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { Writeup } from "@/data/writeups";
import Reveal from "./Reveal";

/* turn "What's next" into a markdown-style slug marker: "## whats-next" */
function marker(heading: string) {
  const slug = heading
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `## ${slug}`;
}

/* render a paragraph string, resolving inline [label](url) links */
function Prose({ text }: { text: string }) {
  const parts: React.ReactNode[] = [];
  const re = /\[([^\]]+)\]\(([^)]+)\)/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let key = 0;
  while ((m = re.exec(text))) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    parts.push(
      <a
        key={key++}
        href={m[2]}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent"
      >
        {m[1]}
      </a>
    );
    last = m.index + m[0].length;
  }
  if (last < text.length) parts.push(text.slice(last));
  return <>{parts}</>;
}

export default function Writeup({
  writeup,
  next,
}: {
  writeup: Writeup;
  next: Writeup;
}) {
  const reduce = useReducedMotion();
  const {
    title,
    tagline,
    slug,
    category,
    date,
    collaborators,
    role,
    award,
    hero,
    video,
    links,
    summary,
    sections,
    stack,
  } = writeup;

  const people =
    role ??
    (collaborators.length
      ? `Donald Lee, with ${collaborators.join(", ")}`
      : "Donald Lee · solo build");

  return (
    <article className="relative">
      {/* ---- hero ------------------------------------------------------- */}
      <header className="relative overflow-hidden px-5 pb-10 pt-28 sm:px-8 sm:pt-32">
        <div className="dot-grid pointer-events-none absolute inset-x-0 top-0 -z-10 h-full opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />

        <div className="mx-auto max-w-5xl">
          <Reveal>
            <Link
              href="/#projects"
              className="inline-flex items-center gap-2 font-mono text-sm text-muted transition-colors hover:text-ink"
            >
              <span aria-hidden>←</span> all projects
            </Link>
            <p className="mt-6 font-mono text-sm text-accent">
              ~/work/{slug}.md
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-3 font-display text-[clamp(2.6rem,7vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-ink">
              {title}
            </h1>
            <p className="mt-3 text-[clamp(1.15rem,2.6vw,1.55rem)] font-medium text-accent">
              {tagline}
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <dl className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 font-mono text-sm text-muted">
              <div className="flex items-center gap-2">
                <dt className="text-line-strong">date</dt>
                <dd className="text-ink-soft">{date}</dd>
              </div>
              <div className="flex items-center gap-2">
                <dt className="text-line-strong">type</dt>
                <dd className="rounded-full bg-surface px-2.5 py-0.5 text-ink-soft">
                  {category}
                </dd>
              </div>
              {award && (
                <div className="flex items-center gap-2">
                  <dt className="text-line-strong">won</dt>
                  <dd className="text-amber">🏆 {award}</dd>
                </div>
              )}
            </dl>
            <p className="mt-2.5 font-mono text-sm text-muted">{people}</p>
          </Reveal>

          {/* link buttons */}
          <Reveal delay={0.14}>
            <div className="mt-7 flex flex-wrap gap-2.5">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    l.primary
                      ? "group inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-bg transition-transform duration-200 hover:-translate-y-0.5"
                      : "inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-2.5 text-sm font-medium text-ink-soft transition-colors hover:border-ink hover:text-ink"
                  }
                >
                  {l.label}
                  <span
                    aria-hidden
                    className="font-mono text-xs opacity-60 transition-transform duration-200 group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </Reveal>
        </div>

        {/* hero screenshot, framed like a browser window */}
        <Reveal delay={0.18} className="mx-auto mt-12 max-w-5xl">
          <figure className="overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-[0_40px_90px_-50px_rgba(40,60,100,0.6)]">
            <div className="flex items-center gap-1.5 border-b border-line bg-surface-2/70 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="ml-3 truncate font-mono text-xs text-muted">
                {title.toLowerCase().replace(/\s+/g, "")} · preview
              </span>
            </div>
            <div className="relative aspect-[16/10] w-full bg-bg sm:aspect-[16/9]">
              <Image
                src={hero}
                alt={`${title}: ${tagline}`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 1024px"
                className="object-cover object-top"
              />
            </div>
          </figure>
        </Reveal>
      </header>

      {/* ---- body: prose + sticky stack rail --------------------------- */}
      <div className="mx-auto grid max-w-5xl gap-x-14 gap-y-12 px-5 pb-8 sm:px-8 lg:grid-cols-[1fr_15rem]">
        <div className="min-w-0 max-w-[68ch]">
          {/* lead / summary */}
          <Reveal>
            <p className="mb-2 font-mono text-sm text-accent">## overview</p>
            <div className="space-y-4 text-[1.075rem] leading-relaxed text-ink-soft [text-wrap:pretty] sm:text-[1.15rem]">
              {summary.map((p, i) => (
                <p key={i} className={i === 0 ? "text-ink" : undefined}>
                  <Prose text={p} />
                </p>
              ))}
            </div>
          </Reveal>

          {/* demo video */}
          {video && (
            <Reveal className="mt-12">
              <p className="mb-3 font-mono text-sm text-accent">## demo</p>
              <div className="overflow-hidden rounded-xl border border-line-strong bg-black shadow-[0_24px_60px_-40px_rgba(40,60,100,0.6)]">
                <div className="relative aspect-video w-full">
                  <iframe
                    src={video}
                    title={`${title} demo`}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full"
                  />
                </div>
              </div>
            </Reveal>
          )}

          {/* narrative sections */}
          {sections.map((s) => (
            <Reveal key={s.heading} className="mt-12">
              <p className="mb-2 font-mono text-sm text-accent">
                {marker(s.heading)}
              </p>
              <h2 className="font-display text-[clamp(1.5rem,3.5vw,2rem)] font-bold tracking-[-0.03em] text-ink">
                {s.heading}
              </h2>
              <div className="mt-3 space-y-4 text-[1.05rem] leading-relaxed text-ink-soft [text-wrap:pretty]">
                {s.body.map((p, i) => (
                  <p key={i}>
                    <Prose text={p} />
                  </p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>

        {/* sticky stack rail */}
        <aside className="lg:sticky lg:top-24 lg:h-fit">
          <Reveal>
            <p className="mb-3 font-mono text-sm text-accent">## stack</p>
            <div className="space-y-5">
              {stack.map((g) => (
                <div key={g.label}>
                  <p className="mb-2 font-mono text-xs uppercase tracking-wide text-muted">
                    {g.label}
                  </p>
                  <ul className="flex flex-wrap gap-1.5">
                    {g.items.map((it) => (
                      <li
                        key={it}
                        className="rounded-md border border-line bg-surface px-2.5 py-1 text-[0.8rem] text-ink-soft"
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </aside>
      </div>

      {/* ---- next project --------------------------------------------- */}
      <section className="px-5 pb-4 pt-10 sm:px-8">
        <Link
          href={`/work/${next.slug}/`}
          aria-label={`Next project: ${next.title}`}
          className="group relative mx-auto block max-w-5xl overflow-hidden rounded-3xl border border-line-strong bg-surface"
        >
          <div className="dot-grid pointer-events-none absolute inset-0 opacity-40" />
          <div className="relative flex flex-col items-stretch gap-6 p-6 sm:flex-row sm:items-center sm:gap-8 sm:p-8">
            <div className="min-w-0 flex-1">
              <p className="font-mono text-sm text-accent">## next-project</p>
              <h2 className="mt-2 font-display text-[clamp(1.9rem,5vw,3.2rem)] font-extrabold leading-none tracking-[-0.04em] text-ink">
                {next.title}
              </h2>
              <p className="mt-2 text-lg font-medium text-accent">
                {next.tagline}
              </p>
              <span className="mt-5 inline-flex items-center gap-2 font-mono text-sm text-ink">
                read the write-up
                <span
                  aria-hidden
                  className="transition-transform duration-300 ease-out group-hover:translate-x-1.5"
                >
                  →
                </span>
              </span>
            </div>

            <motion.div
              initial={false}
              whileHover={reduce ? undefined : { scale: 1.03 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-2xl border border-line bg-bg shadow-[0_28px_70px_-44px_rgba(40,60,100,0.6)] sm:w-72"
            >
              <Image
                src={next.hero}
                alt=""
                fill
                sizes="(max-width: 640px) 100vw, 288px"
                className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </motion.div>
          </div>
        </Link>
      </section>
    </article>
  );
}
