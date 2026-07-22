"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { useReducedMotion } from "framer-motion";
import type { Group } from "three";
import Mii, { type MiiMode } from "./Mii";

interface MiiSceneProps {
  waveKey?: number;
  mode?: MiiMode;
  /** smaller guide version trims the framing */
  compact?: boolean;
  className?: string;
  /** fires once the first WebGL frame is on screen */
  onReady?: () => void;
  /** play the scale-up spawn pop on mount (skip when a poster already
   *  showed the figure, so it doesn't vanish and re-spawn) */
  spawn?: boolean;
}

/** Signals the parent when the scene has actually painted, so placeholders
 *  can hand off to the canvas instead of guessing at load time. */
function FirstFrame({ onReady }: { onReady?: () => void }) {
  const fired = useRef(false);
  useFrame(() => {
    if (fired.current || !onReady) return;
    fired.current = true;
    requestAnimationFrame(onReady);
  });
  return null;
}

const SPAWN_DURATION = 0.65;

/** Pops the figure in on mount: scale 0 → 1 with a small overshoot, like a
 *  character spawning into a game world. */
function Spawn({ children, enabled }: { children: ReactNode; enabled: boolean }) {
  const ref = useRef<Group>(null);
  const t = useRef(0);
  useFrame((_, dt) => {
    const g = ref.current;
    if (!g) return;
    if (!enabled) {
      g.scale.setScalar(1);
      return;
    }
    t.current = Math.min(t.current + dt, SPAWN_DURATION);
    const p = t.current / SPAWN_DURATION;
    // ease-out-back: overshoots to ~1.05 around p=0.75, settles at 1
    const c1 = 1.3;
    const s = 1 + (c1 + 1) * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2);
    g.scale.setScalar(Math.max(0.001, s));
  });
  return (
    <group ref={ref} scale={enabled ? 0.001 : 1}>
      {children}
    </group>
  );
}

export default function MiiScene({
  waveKey = 0,
  mode = "idle",
  compact = false,
  className,
  onReady,
  spawn = true,
}: MiiSceneProps) {
  const sleeping = mode === "sleep";
  const reduce = useReducedMotion();

  // pause the render loop entirely while the canvas is offscreen — a WebGL
  // loop running behind other sections costs GPU time the page scroll needs
  const wrapRef = useRef<HTMLDivElement>(null);
  const [onScreen, setOnScreen] = useState(true);
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { rootMargin: "120px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Canvas
        className={className}
        dpr={[1, 1.5]}
        frameloop={onScreen ? "always" : "never"}
        camera={{ position: [0, 0, compact ? 8.4 : 9.4], fov: 34 }}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: true }}
        style={{ background: "transparent" }}
      >
        <ambientLight intensity={0.85} />
        <directionalLight position={[3, 5, 4]} intensity={1.6} />
        <directionalLight position={[-4, 2, 2]} intensity={0.5} color="#cfe0ff" />
        <directionalLight position={[0, 2, -5]} intensity={0.7} color="#ffffff" />

        <Suspense fallback={null}>
          {/* sleep is a wide horizontal scene, so it sits lower, smaller, and
              doesn't float (a sleeping figure shouldn't bob in mid-air) */}
          {sleeping ? (
            <group position={[0, 1.7, 0]} scale={0.82}>
              <Spawn enabled={spawn && !reduce}>
                <Mii waveKey={waveKey} mode={mode} follow={0} />
              </Spawn>
            </group>
          ) : (
            <group
              // compact frames the full figure: the camera at z=8.4 sees ±2.57
              // vertically, and the Mii spans -3.97..+1.16 locally, so 0.92 ×
              // that centred at 1.28 keeps hair and shoes inside the canvas
              position={[0, compact ? 1.28 : 1.15, 0]}
              scale={compact ? 0.92 : 1}
            >
              <Float
                speed={1.1}
                rotationIntensity={0.12}
                floatIntensity={0.35}
                floatingRange={[-0.04, 0.04]}
              >
                <Spawn enabled={spawn && !reduce}>
                  <Mii waveKey={waveKey} mode={mode} follow={compact ? 0.6 : 1} />
                </Spawn>
              </Float>
            </group>
          )}
          <ContactShadows
            position={[0, sleeping ? -1.4 : compact ? -2.42 : -2.75, 0]}
            opacity={0.3}
            scale={11}
            blur={2.8}
            far={5}
            color="#3a4a6b"
            // render the shadow while the spawn settles, then freeze it —
            // re-blurring a static blob every frame is wasted GPU work
            frames={60}
          />
          <FirstFrame onReady={onReady} />
        </Suspense>
      </Canvas>
    </div>
  );
}
