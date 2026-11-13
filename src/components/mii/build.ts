// Timing for the Mii's brick-by-brick build. Kept out of Mii.tsx so the
// loading screen can sync its step caption without pulling three.js in.

/** seconds between one piece starting to drop and the next */
export const BUILD_STEP = 0.1;
/** seconds a piece takes to fall into place */
export const BUILD_DROP = 0.3;
/** seconds of the little hop as it clicks in */
export const BUILD_CLICK = 0.12;

export const BUILD_PIECES = [
  "jeans",
  "quarter-zip",
  "left arm",
  "right arm",
  "neck",
  "head",
  "the perm",
] as const;

export const PROP_PIECE: Record<string, string> = {
  work: "laptop",
  chill: "phone",
  commute: "matcha",
};

export const buildPieces = (mode: string) =>
  PROP_PIECE[mode] ? [...BUILD_PIECES, PROP_PIECE[mode]] : [...BUILD_PIECES];

export const buildSeconds = (pieces: number) =>
  (pieces - 1) * BUILD_STEP + BUILD_DROP + BUILD_CLICK;
