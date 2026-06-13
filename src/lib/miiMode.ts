import type { MiiMode } from "@/components/mii/Mii";

export interface MiiStatus {
  mode: MiiMode;
  emoji: string;
  label: string;
}

const META: Record<MiiMode, { emoji: string; label: string }> = {
  sleep: { emoji: "💤", label: "asleep (it's late in Vancouver)" },
  commute: { emoji: "🚗", label: "on the road" },
  work: { emoji: "💻", label: "heads-down, building" },
  eat: { emoji: "🍣", label: "grabbing some food" },
  chill: { emoji: "📱", label: "scrolling, probably" },
  idle: { emoji: "👋", label: "around" },
};

/** Get Donald's current hour (0–23) and weekday in America/Vancouver. */
function vancouverNow(date = new Date()): { hour: number; weekend: boolean } {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Vancouver",
    hour: "numeric",
    hour12: false,
    weekday: "short",
  });
  const parts = fmt.formatToParts(date);
  const hourRaw = parts.find((p) => p.type === "hour")?.value ?? "0";
  const wd = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  let hour = parseInt(hourRaw, 10);
  if (hour === 24) hour = 0; // some engines report 24 at midnight
  const weekend = wd === "Sat" || wd === "Sun";
  return { hour, weekend };
}

/** Deterministic pick so a "random" slot stays stable within the hour. */
function pick(options: MiiMode[], hour: number, date: Date): MiiMode {
  const seed = Math.floor(date.getTime() / 3_600_000) + hour;
  return options[seed % options.length];
}

export function getMiiStatus(date = new Date()): MiiStatus {
  const { hour, weekend } = vancouverNow(date);
  let mode: MiiMode;

  if (weekend) {
    if (hour < 8) mode = "work";
    else if (hour < 9) mode = "chill";
    else if (hour < 12) mode = pick(["chill", "work"], hour, date);
    else if (hour < 13) mode = "eat";
    else if (hour < 17) mode = "commute";
    else if (hour < 18) mode = "chill";
    else if (hour < 19) mode = "eat";
    else mode = pick(["chill", "work", "commute"], hour, date);
  } else {
    if (hour < 8) mode = "sleep";
    else if (hour < 9) mode = "commute";
    else if (hour < 12) mode = "work";
    else if (hour < 13) mode = "eat";
    else if (hour < 17) mode = "work";
    else if (hour < 18) mode = "commute";
    else if (hour < 19) mode = "eat";
    else mode = pick(["chill", "work"], hour, date);
  }

  return { mode, ...META[mode] };
}
