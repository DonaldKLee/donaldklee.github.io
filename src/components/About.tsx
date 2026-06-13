import Image from "next/image";
import SectionHeading from "./SectionHeading";
import Reveal from "./Reveal";

const STACK: { group: string; items: string[] }[] = [
  {
    group: "Frontend",
    items: ["React", "Next.js", "TypeScript", "Electron", "Three.js"],
  },
  {
    group: "Backend",
    items: ["Python", "Node.js", "Go", "Java", "MongoDB"],
  },
  {
    group: "AI & tooling",
    items: ["AI agents", "MCP", "Web automation", "Data science (R)"],
  },
  {
    group: "Cloud",
    items: ["AWS", "Firebase", "Git"],
  },
];

export default function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
      <SectionHeading
        marker="## about"
        title="A little about me"
      />

      <div className="grid gap-12 lg:grid-cols-[0.85fr_1fr] lg:gap-16">
        {/* portrait + intro */}
        <Reveal>
          <div className="flex flex-col gap-6">
            <div className="relative w-full max-w-[300px] overflow-hidden rounded-2xl border border-line bg-surface">
              <Image
                src="/images/DonaldLee.jpg"
                alt="Donald Lee, smiling"
                width={600}
                height={600}
                className="h-full w-full object-cover"
                priority={false}
              />
            </div>
            <div className="space-y-4 text-lg leading-relaxed text-ink-soft">
              <p>
                I&apos;m Donald, a self-taught programmer studying at the
                University of British Columbia. I&apos;m drawn to startups and
                to building things that make someone&apos;s day a little
                easier.
              </p>
              <p>
                Most of what I make starts as a &quot;wouldn&apos;t it be funny
                if&quot; and ends up shipped. The rest of the time I&apos;m
                organizing hackathons or chasing a good idea past midnight.
              </p>
            </div>
          </div>
        </Reveal>

        {/* stack */}
        <Reveal delay={0.1}>
          <div>
            <p className="mb-6 font-mono text-sm text-muted">
              things I build with
            </p>
            <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2">
              {STACK.map((col) => (
                <div key={col.group} className="bg-bg p-6">
                  <h3 className="mb-4 font-display text-lg font-semibold text-ink">
                    {col.group}
                  </h3>
                  <ul className="flex flex-wrap gap-2">
                    {col.items.map((item) => (
                      <li
                        key={item}
                        className="rounded-full bg-surface px-3 py-1 font-mono text-sm text-ink-soft"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
