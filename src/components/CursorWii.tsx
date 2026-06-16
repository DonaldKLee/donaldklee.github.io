"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A Wii-remote style hand pointer that follows the mouse with a little lag.
 * Desktop / fine-pointer only; touch and reduced-motion keep the native cursor.
 */
export default function CursorWii() {
  const handRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [pressing, setPressing] = useState(false);
  const [pointing, setPointing] = useState(false);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || reduce) return;
    setEnabled(true);
    document.documentElement.classList.add("wii-cursor");

    const target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const pos = { ...target };
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      target.x = e.clientX;
      target.y = e.clientY;
      const el = e.target as HTMLElement;
      setPointing(!!el.closest('a, button, [role="button"], [data-clickable]'));
    };
    const onDown = () => setPressing(true);
    const onUp = () => setPressing(false);
    const onLeave = () => {
      if (handRef.current) handRef.current.style.opacity = "0";
    };
    const onEnter = () => {
      if (handRef.current) handRef.current.style.opacity = "1";
    };

    const loop = () => {
      pos.x += (target.x - pos.x) * 0.22;
      pos.y += (target.y - pos.y) * 0.22;
      const tilt = Math.max(-12, Math.min(12, (target.x - pos.x) * 0.5));
      if (handRef.current) {
        handRef.current.style.transform = `translate(${pos.x}px, ${pos.y}px) rotate(${tilt - 8}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);
    document.addEventListener("mouseleave", onLeave);
    document.addEventListener("mouseenter", onEnter);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("mouseenter", onEnter);
      document.documentElement.classList.remove("wii-cursor");
    };
  }, []);

  if (!enabled) return null;

  return (
    <div
      ref={handRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0"
      style={{
        zIndex: "var(--z-cursor)" as unknown as number,
        // hotspot near the fingertip
        marginLeft: -7,
        marginTop: -2,
        transition: "opacity 0.2s ease",
        filter: "drop-shadow(0 3px 5px rgba(20,30,60,0.28))",
        willChange: "transform",
      }}
    >
      <WiiHand pressing={pressing} pointing={pointing} />
    </div>
  );
}

function WiiHand({
  pressing,
  pointing,
}: {
  pressing: boolean;
  pointing: boolean;
}) {
  // pointing → index extended; otherwise relaxed open hand
  const scale = pressing ? 0.86 : pointing ? 1.06 : 1;
  return (
    <svg
      width="23"
      height="29"
      viewBox="0 0 46 58"
      fill="none"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "8px 3px",
        transition: "transform 0.12s cubic-bezier(0.16,1,0.3,1)",
      }}
    >
      {/* index finger */}
      <rect
        x="11"
        y="2"
        width="11"
        height="30"
        rx="5.5"
        fill="#fff"
        stroke="#1b1b1f"
        strokeWidth="2.2"
      />
      {/* curled fingers */}
      <rect x="20" y="18" width="9" height="20" rx="4.5" fill="#fff" stroke="#1b1b1f" strokeWidth="2.2" />
      <rect x="27" y="20" width="9" height="18" rx="4.5" fill="#fff" stroke="#1b1b1f" strokeWidth="2.2" />
      <rect x="33" y="23" width="8.5" height="15" rx="4" fill="#fff" stroke="#1b1b1f" strokeWidth="2.2" />
      {/* thumb */}
      <rect
        x="2"
        y="24"
        width="10"
        height="20"
        rx="5"
        fill="#fff"
        stroke="#1b1b1f"
        strokeWidth="2.2"
        transform="rotate(28 7 34)"
      />
      {/* palm */}
      <path
        d="M8 30 H38 a4 4 0 0 1 4 4 v8 a13 13 0 0 1 -13 13 H17 a13 13 0 0 1 -13 -13 v-6 a6 6 0 0 1 4 -6 Z"
        fill="#fff"
        stroke="#1b1b1f"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
