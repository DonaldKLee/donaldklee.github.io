"use client";

import { Canvas } from "@react-three/fiber";
import { ContactShadows, Float } from "@react-three/drei";
import { Suspense } from "react";
import Mii, { type MiiMode } from "./Mii";

interface MiiSceneProps {
  waveKey?: number;
  mode?: MiiMode;
  /** smaller guide version trims the framing */
  compact?: boolean;
  className?: string;
}

export default function MiiScene({
  waveKey = 0,
  mode = "idle",
  compact = false,
  className,
}: MiiSceneProps) {
  return (
    <Canvas
      className={className}
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 0, compact ? 8.4 : 9.4], fov: 34 }}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <ambientLight intensity={0.85} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.6}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-4, 2, 2]} intensity={0.5} color="#cfe0ff" />
      <directionalLight position={[0, 2, -5]} intensity={0.7} color="#ffffff" />

      <Suspense fallback={null}>
        {/* lift the figure so it sits centred in frame */}
        <group position={[0, compact ? 1.6 : 1.15, 0]} scale={compact ? 1.05 : 1}>
          <Float
            speed={1.1}
            rotationIntensity={0.12}
            floatIntensity={0.35}
            floatingRange={[-0.04, 0.04]}
          >
            <Mii waveKey={waveKey} mode={mode} follow={compact ? 0.6 : 1} />
          </Float>
        </group>
        <ContactShadows
          position={[0, compact ? -2.4 : -2.75, 0]}
          opacity={0.3}
          scale={11}
          blur={2.8}
          far={5}
          color="#3a4a6b"
        />
      </Suspense>
    </Canvas>
  );
}
