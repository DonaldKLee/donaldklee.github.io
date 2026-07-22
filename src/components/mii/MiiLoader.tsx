/**
 * The "waking up" state for the hero Mii: tilted accent orbits circling a soft
 * core, shown over the instant poster while the live WebGL scene boots. Pure
 * CSS (see globals.css) so it stays smooth even while the 3D chunk parses.
 */
export default function MiiLoader() {
  // diameter %, animation duration (s), spin direction
  const rings: [number, number, 1 | -1][] = [
    [58, 2.6, 1],
    [78, 3.8, -1],
    [98, 5.4, 1],
  ];
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 grid place-items-center"
    >
      <div className="mii-orbits relative h-[70%] w-[70%]">
        {/* soft core where the figure coalesces */}
        <div className="mii-core absolute inset-[34%]" />
        <div className="mii-orbits-tilt absolute inset-0">
          {rings.map(([size, dur, dir], i) => (
            <div
              key={i}
              className="mii-orbit"
              style={{
                width: `${size}%`,
                height: `${size}%`,
                animationDuration: `${dur}s`,
                animationDirection: dir === 1 ? "normal" : "reverse",
              }}
            />
          ))}
        </div>
      </div>

      {/* spells out what the orbits are doing, in the site's render-log voice,
          with live dots so it reads as in-progress at a glance */}
      <div className="absolute inset-x-0 bottom-[7%] flex justify-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-line bg-bg/85 px-3 py-1 font-mono text-xs text-ink-soft shadow-sm backdrop-blur-sm">
          <span className="text-accent-strong">rendering</span> donald
          <span className="ml-0.5 inline-flex gap-1">
            <span className="mii-loading-dot h-[3px] w-[3px] rounded-full bg-accent" />
            <span className="mii-loading-dot h-[3px] w-[3px] rounded-full bg-accent [animation-delay:0.2s]" />
            <span className="mii-loading-dot h-[3px] w-[3px] rounded-full bg-accent [animation-delay:0.4s]" />
          </span>
        </span>
      </div>
    </div>
  );
}
