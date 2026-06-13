import Reveal from "./Reveal";

/**
 * The site is "a rendered markdown file", so section headings carry the
 * literal markdown marker. This is the one deliberate, named kicker system.
 */
export default function SectionHeading({
  marker,
  title,
  sub,
}: {
  marker: string;
  title: string;
  sub?: string;
}) {
  return (
    <Reveal className="mb-10 sm:mb-14">
      <p className="mb-2 font-mono text-sm text-accent">{marker}</p>
      <h2 className="font-display text-[clamp(2rem,4.5vw,3.2rem)] font-bold tracking-[-0.035em] text-ink">
        {title}
      </h2>
      {sub && (
        <p className="mt-3 max-w-[60ch] text-lg leading-relaxed text-muted">
          {sub}
        </p>
      )}
    </Reveal>
  );
}
