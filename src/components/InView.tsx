"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Mounts its children once they get near the viewport, then keeps them mounted
 * (so a heavy WebGL canvas initialises early and never re-inits on scroll-back).
 * A poster rendered behind a transparent canvas covers the brief init frame, so
 * nothing ever shows blank. Set `once={false}` to unmount when far away.
 */
export default function InView({
  children,
  fallback = null,
  rootMargin = "1200px",
  once = true,
  className,
  style,
}: {
  children: ReactNode;
  fallback?: ReactNode;
  rootMargin?: string;
  once?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          if (once) io.disconnect();
        } else if (!once) {
          setShow(false);
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin, once]);

  return (
    <div ref={ref} className={className} style={style}>
      {show ? children : fallback}
    </div>
  );
}
