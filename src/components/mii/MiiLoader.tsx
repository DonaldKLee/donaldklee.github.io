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
    </div>
  );
}
