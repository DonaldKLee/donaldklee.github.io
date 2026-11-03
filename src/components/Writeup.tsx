"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";
import type { Writeup, WriteupMedia } from "@/data/writeups";
import { track } from "@/lib/analytics";
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
    const internal = m[2].startsWith("/");
    parts.push(
      <a
        key={key++}
        href={m[2]}
        {...(internal
          ? {}
          : { target: "_blank", rel: "noopener noreferrer" })}
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

/* the small mono label that sits above every block: "## the-problem" */
function Marker({ children }: { children: string }) {
  return <p className="font-mono text-sm text-accent">{marker(children)}</p>;
}

/* silent demo loop for the hero frame; holds on the poster for reduced motion */
function HeroVideo({
  src,
  poster,
  label,
}: {
  src: string;
  poster: string;
  label: string;
}) {
  const reduce = useReducedMotion();
  return (
    <video
      src={src}
      poster={poster}
      role="img"
      aria-label={label}
      className="absolute inset-0 h-full w-full object-cover"
      autoPlay={!reduce}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
    />
  );
}

/* an in-story screenshot: a soft panel, the image, a centred caption */
function Figure({ media, wide }: { media: WriteupMedia; wide: boolean }) {
  return (
    <figure>
      <div className="overflow-hidden rounded-2xl border border-line bg-surface p-1.5 sm:p-2">
        <Image
          src={media.src}
          alt={media.alt ?? media.caption ?? ""}
          width={media.width}
          height={media.height}
          sizes={wide ? "(max-width: 1024px) 100vw, 1024px" : "(max-width: 640px) 100vw, 512px"}
          className="h-auto w-full rounded-xl border border-line/70"
        />
      </div>
      {media.caption && (
        <figcaption className="mt-3 text-center text-sm text-muted [text-wrap:balance]">
          {media.caption}
        </figcaption>
      )}
    </figure>
  );
}

const PROSE =
  "space-y-4 text-[1.05rem] leading-[1.75] text-ink-soft [text-wrap:pretty]";

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
    heroVideo,
    video,
    links,
    summary,
    stats,
    sections,
    learnings,
    stack,
  } = writeup;

  // which project stories people actually open, beyond the raw page view
  useEffect(() => {
    track("writeup_view", { slug, project: title, category });
  }, [slug, title, category]);

  const team =
    role ??
    (collaborators.length
      ? `Donald Lee, with ${collaborators.join(", ")}`
      : "Donald Lee · solo build");

  const meta: { label: string; value: string }[] = [
    { label: "Timeline", value: date },
    { label: "Type", value: category },
    { label: "Team", value: team },
  ];
  if (award) meta.push({ label: "Recognition", value: `🏆 ${award}` });

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
              ~/project/{slug}.md
            </p>
          </Reveal>

          <Reveal delay={0.05}>
            <h1 className="mt-3 font-display text-[clamp(2.6rem,7vw,5rem)] font-extrabold leading-[0.98] tracking-[-0.04em] text-ink">
              {title}
            </h1>
            <p className="mt-3 max-w-[32ch] text-[clamp(1.15rem,2.6vw,1.55rem)] font-medium leading-snug text-accent">
              {tagline}
            </p>
          </Reveal>

          {/* the at-a-glance strip: when, what, who */}
          <Reveal delay={0.1}>
            <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-line pt-6 sm:flex sm:flex-wrap sm:gap-x-14">
              {meta.map((m) => (
                <div
                  key={m.label}
                  className={
                    m.label === "Team" || m.label === "Recognition"
                      ? "col-span-2 sm:max-w-sm"
                      : undefined
                  }
                >
                  <dt className="font-mono text-xs uppercase tracking-[0.08em] text-muted">
                    {m.label}
                  </dt>
                  <dd className="mt-1.5 text-[0.95rem] leading-snug text-ink">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          {/* link buttons */}
          <Reveal delay={0.14}>
            <div className="mt-8 flex flex-wrap gap-2.5">
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() =>
                    track("outbound_click", {
                      label: l.label,
                      url: l.href,
                      from: `writeup:${slug}`,
                    })
                  }
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

        {/* hero media, framed like a browser window */}
        <Reveal delay={0.18} className="mx-auto mt-12 max-w-5xl">
          <figure className="overflow-hidden rounded-2xl border border-line-strong bg-surface shadow-[0_40px_90px_-50px_rgba(40,60,100,0.6)]">
            <div className="flex items-center gap-1.5 border-b border-line bg-surface-2/70 px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
              <span className="ml-3 truncate font-mono text-xs text-muted">
                {title.toLowerCase().replace(/[^a-z0-9.]+/g, "")} · preview
              </span>
            </div>
            <div className="relative aspect-[16/10] w-full bg-bg sm:aspect-[16/9]">
              {heroVideo ? (
                <HeroVideo
                  src={heroVideo}
                  poster={hero}
                  label={`${title}: ${tagline}`}
                />
              ) : (
                <Image
                  src={hero}
                  alt={`${title}: ${tagline}`}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 1024px"
                  className="object-cover object-top"
                />
              )}
            </div>
          </figure>
        </Reveal>
      </header>

      {/* ---- the story -------------------------------------------------- */}
      <div className="px-5 pb-8 sm:px-8">
        <div className="mx-auto max-w-5xl">
          {/* lead / summary */}
          <Reveal className="max-w-[44rem]">
            <Marker>overview</Marker>
            <div className="mt-3 space-y-4 leading-relaxed text-ink-soft [text-wrap:pretty]">
              {summary.map((p, i) => (
                <p
                  key={i}
                  className={
                    i === 0
                      ? "text-[1.15rem] text-ink sm:text-[1.3rem]"
                      : "text-[1.05rem] sm:text-[1.1rem]"
                  }
                >
                  <Prose text={p} />
                </p>
              ))}
            </div>
          </Reveal>

          {/* headline numbers */}
          {stats && stats.length > 0 && (
            <Reveal className="mt-14">
              <dl className="grid divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
                {stats.map((s) => (
                  <div key={s.label} className="py-6 sm:px-7 sm:first:pl-0">
                    <dt className="sr-only">{s.label}</dt>
                    <dd>
                      <span className="block font-display text-[clamp(2.1rem,4.6vw,3rem)] font-extrabold leading-none tracking-[-0.04em] text-ink">
                        {s.value}
                      </span>
                      <span className="mt-2.5 block max-w-[28ch] text-sm leading-snug text-muted">
                        {s.label}
                      </span>
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}

          {/* demo video */}
          {video && (
            <Reveal className="mt-20">
              <Marker>demo</Marker>
              <div className="mt-4 overflow-hidden rounded-2xl border border-line-strong bg-black shadow-[0_24px_60px_-40px_rgba(40,60,100,0.6)]">
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

          {/* narrative sections: label → claim → evidence → picture */}
          {sections.map((s) => (
            <section key={s.heading} className="mt-20 sm:mt-24">
              <Reveal className="max-w-[44rem]">
                <Marker>{s.label ?? s.heading}</Marker>
                <h2 className="mt-3 font-display text-[clamp(1.55rem,3.3vw,2.15rem)] font-bold leading-[1.15] tracking-[-0.03em] text-ink">
                  {s.heading}
                </h2>
                <div className={`mt-4 ${PROSE}`}>
                  {s.body.map((p, i) => (
                    <p key={i}>
                      <Prose text={p} />
                    </p>
                  ))}
                </div>
                {s.points && (
                  <ul className="mt-5 space-y-3">
                    {s.points.map((pt, i) => (
                      <li
                        key={i}
                        className="grid grid-cols-[1.25rem_1fr] text-[1.05rem] leading-[1.7] text-ink-soft"
                      >
                        <span aria-hidden className="font-mono text-accent">
                          –
                        </span>
                        <span>
                          <Prose text={pt} />
                        </span>
                      </li>
                    ))}
                  </ul>
                )}
              </Reveal>

              {s.media && s.media.length > 0 && (
                <Reveal className="mt-10">
                  <div
                    className={
                      s.media.length > 1
                        ? "grid gap-6 sm:grid-cols-2 sm:gap-5"
                        : undefined
                    }
                  >
                    {s.media.map((m) => (
                      <Figure key={m.src} media={m} wide={s.media!.length === 1} />
                    ))}
                  </div>
                </Reveal>
              )}
            </section>
          ))}

          {/* takeaways */}
          {learnings && learnings.length > 0 && (
            <Reveal className="mt-20 sm:mt-24">
              <div className="rounded-3xl border border-line bg-surface px-6 py-8 sm:px-10 sm:py-10">
                <Marker>key learnings</Marker>
                <h2 className="mt-3 font-display text-[clamp(1.55rem,3.3vw,2.15rem)] font-bold tracking-[-0.03em] text-ink">
                  What I&apos;m taking with me
                </h2>
                <ol className="mt-7 grid gap-6 sm:gap-7">
                  {learnings.map((l, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-[2.25rem_1fr] gap-2 sm:grid-cols-[3rem_1fr]"
                    >
                      <span className="pt-0.5 font-mono text-sm text-accent">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <p className="max-w-[62ch] text-[1.05rem] leading-[1.7] text-ink-soft [text-wrap:pretty]">
                        <Prose text={l} />
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          )}

          {/* built with */}
          <Reveal className="mt-20 border-t border-line pt-10">
            <Marker>built with</Marker>
            <div className="mt-6 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stack.map((g) => (
                <div key={g.label}>
                  <p className="mb-2.5 font-mono text-xs uppercase tracking-[0.08em] text-muted">
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
        </div>
      </div>

      {/* ---- next project --------------------------------------------- */}
      <section className="px-5 pb-4 pt-14 sm:px-8">
        <Link
          href={`/project/${next.slug}/`}
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
