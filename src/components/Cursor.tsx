"use client";

import { useEffect, useRef } from "react";

const INTERACTIVE =
  "a,button:not(:disabled),[role='button'],label,summary,select,.cursor-pointer,.cursor-grab";
const HIDES_NATIVE = "has-custom-cursor";

/** A dot that follows the mouse and opens into a ring over anything clickable. */
export default function Cursor() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = ref.current;
    if (!root || !window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;

    const html = document.documentElement;
    let x = 0;
    let y = 0;
    let scrollFrame = 0;

    const setRing = (el: Element | null) => {
      root.dataset.ring = String(!!el?.closest(INTERACTIVE));
    };

    const onMove = (e: PointerEvent) => {
      // the native cursor only goes away once ours is proven to be tracking
      if (e.pointerType !== "mouse") {
        root.dataset.visible = "false";
        html.classList.remove(HIDES_NATIVE);
        return;
      }
      x = e.clientX;
      y = e.clientY;
      root.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      root.dataset.visible = "true";
      html.classList.add(HIDES_NATIVE);
    };
    const onOver = (e: PointerEvent) => setRing(e.target as Element);
    const onOut = (e: PointerEvent) => {
      // iframes swallow pointer events and draw their own native cursor
      const next = e.relatedTarget as Element | null;
      if (!next || next.tagName === "IFRAME") root.dataset.visible = "false";
    };
    const onDown = () => (root.dataset.pressed = "true");
    const onUp = () => (root.dataset.pressed = "false");
    // content scrolling under a still mouse doesn't fire pointerover
    const onScroll = () => {
      cancelAnimationFrame(scrollFrame);
      scrollFrame = requestAnimationFrame(() =>
        setRing(document.elementFromPoint(x, y)),
      );
    };

    document.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerover", onOver, { passive: true });
    document.addEventListener("pointerout", onOut, { passive: true });
    document.addEventListener("pointerdown", onDown, { passive: true });
    document.addEventListener("pointerup", onUp, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(scrollFrame);
      html.classList.remove(HIDES_NATIVE);
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerover", onOver);
      document.removeEventListener("pointerout", onOut);
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("pointerup", onUp);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div ref={ref} className="cursor-root" aria-hidden>
      <div className="cursor-shape" />
    </div>
  );
}
