"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Mounts its children only while near the viewport, and unmounts when far.
 * Used to keep at most one or two WebGL canvases alive at a time (avoids
 * context-loss and the cost of several render loops running off-screen).
 */
export default function InView({
  children,
  fallback = null,
  rootMargin = "300px",
  className,
  style,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return (
    <div ref={ref} className={className} style={style}>
      {visible ? children : fallback}
    </div>
  );
}
