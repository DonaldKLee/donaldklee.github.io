"use client";

import Image from "next/image";
import { useEffect, useRef, type CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";
import type { Project } from "@/data/content";

const isVideo = (src: string) => /\.(mp4|webm)$/i.test(src);

/**
 * A project card's media slot. Renders demo clips as silent looping <video>
 * (an mp4 is ~20-40x smaller than the same clip as a gif) and everything else
 * through next/image. Zoom/focus from the project data apply to both.
 */
export default function CardMedia({
  project,
  className,
  fill = false,
  sizes,
  width,
  height,
  /** when false (e.g. a hidden carousel face), video playback pauses */
  active = true,
}: {
  project: Project;
  className: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  active?: boolean;
}) {
  const style = {
    objectPosition: project.focus ?? "center",
    "--z": project.zoom ?? 1,
  } as CSSProperties;
  const alt = `${project.name} — ${project.tagline}`;

  if (isVideo(project.image)) {
    return (
      <CardVideo
        src={project.image}
        label={alt}
        className={`${fill ? "absolute inset-0 " : ""}h-full w-full ${className}`}
        style={style}
        active={active}
      />
    );
  }

  return fill ? (
    <Image
      src={project.image}
      alt={alt}
      fill
      sizes={sizes}
      style={style}
      className={className}
    />
  ) : (
    <Image
      src={project.image}
      alt={alt}
      width={width ?? 640}
      height={height ?? 440}
      style={style}
      className={`h-full w-full ${className}`}
    />
  );
}

function CardVideo({
  src,
  label,
  className,
  style,
  active,
}: {
  src: string;
  label: string;
  className: string;
  style: CSSProperties;
  active: boolean;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const reduce = useReducedMotion();

  // only the visible card spends decode time; hidden faces sit paused. Also
  // re-kick playback when the tab becomes visible — browsers defer autoplay
  // in background tabs and won't always resume on their own.
  useEffect(() => {
    const sync = () => {
      const v = ref.current;
      if (!v) return;
      if (active && !reduce && !document.hidden) void v.play().catch(() => {});
      else v.pause();
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [active, reduce]);

  return (
    <video
      ref={ref}
      src={src}
      role="img"
      aria-label={label}
      className={className}
      style={style}
      autoPlay={active && !reduce}
      muted
      loop
      playsInline
      preload="metadata"
      disablePictureInPicture
    />
  );
}
