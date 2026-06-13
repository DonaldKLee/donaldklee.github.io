"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";
import Car from "./Car";

const SKY = "#e9f1fb";
const GRASS = "#7fb86a";
const GRASS_2 = "#6fa95c";
const ROAD = "#34373f";

export default function DriveScene({ moving }: { moving: boolean }) {
  return (
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [2.6, 3.0, 9], fov: 42 }}
      onCreated={({ camera }) => camera.lookAt(0, 1, -14)}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <fog attach="fog" args={[SKY, 32, 115]} />
      <ambientLight intensity={0.82} />
      <directionalLight
        position={[6, 9, 4]}
        intensity={1.5}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <directionalLight position={[-5, 3, -2]} intensity={0.35} color="#cfe0ff" />

      <Suspense fallback={null}>
        <World moving={moving} />
        <Car moving={moving} />
      </Suspense>
    </Canvas>
  );
}

function World({ moving }: { moving: boolean }) {
  const dashRefs = useRef<THREE.Mesh[]>([]);
  const treeRefs = useRef<THREE.Group[]>([]);

  const DASH_N = 16;
  const DASH_GAP = 7;
  const DASH_SPAN = DASH_N * DASH_GAP;

  const trees = useMemo(() => {
    const arr: { x: number; z: number; s: number; h: number }[] = [];
    const N = 14;
    const GAP = 13;
    for (let i = 0; i < N; i++) {
      const side = i % 2 === 0 ? 1 : -1;
      arr.push({
        x: side * (5.4 + ((i * 37) % 30) / 10),
        z: 10 - i * GAP * 0.5,
        s: side,
        h: 2.4 + ((i * 53) % 16) / 10,
      });
    }
    return arr;
  }, []);
  const TREE_SPAN = trees.length * (13 * 0.5);

  useFrame((_, delta) => {
    if (!moving) return;
    const dz = Math.min(delta, 0.05) * 26;
    for (const m of dashRefs.current) {
      if (!m) continue;
      m.position.z += dz;
      if (m.position.z > 12) m.position.z -= DASH_SPAN;
    }
    for (const g of treeRefs.current) {
      if (!g) continue;
      g.position.z += dz;
      if (g.position.z > 14) g.position.z -= TREE_SPAN;
    }
  });

  return (
    <group>
      {/* grass ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, -30]} receiveShadow>
        <planeGeometry args={[300, 300]} />
        <meshStandardMaterial color={GRASS} roughness={1} />
      </mesh>
      {/* darker shoulder strips */}
      {[-4.4, 4.4].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.0, -40]}>
          <planeGeometry args={[2.2, 240]} />
          <meshStandardMaterial color={GRASS_2} roughness={1} />
        </mesh>
      ))}

      {/* road */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, -40]} receiveShadow>
        <planeGeometry args={[7, 240]} />
        <meshStandardMaterial color={ROAD} roughness={0.9} />
      </mesh>
      {/* edge lines */}
      {[-3.15, 3.15].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, -40]}>
          <planeGeometry args={[0.16, 240]} />
          <meshStandardMaterial color="#e7e9ee" roughness={0.8} />
        </mesh>
      ))}
      {/* centre dashes */}
      {Array.from({ length: DASH_N }).map((_, i) => (
        <mesh
          key={i}
          ref={(m) => { if (m) dashRefs.current[i] = m; }}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[0, 0.02, 12 - i * DASH_GAP]}
        >
          <planeGeometry args={[0.2, 2.6]} />
          <meshStandardMaterial color="#e9c46a" roughness={0.7} />
        </mesh>
      ))}

      {/* roadside trees */}
      {trees.map((t, i) => (
        <group
          key={i}
          ref={(g) => { if (g) treeRefs.current[i] = g; }}
          position={[t.x, 0, t.z]}
        >
          <mesh position={[0, 0.5, 0]} castShadow>
            <cylinderGeometry args={[0.14, 0.18, 1, 8]} />
            <meshStandardMaterial color="#7a5a3a" roughness={1} />
          </mesh>
          <mesh position={[0, 1 + t.h / 2, 0]} castShadow>
            <coneGeometry args={[0.9, t.h, 9]} />
            <meshStandardMaterial color="#4f9e57" roughness={1} />
          </mesh>
          <mesh position={[0, 1.3 + t.h / 2, 0]}>
            <coneGeometry args={[0.62, t.h * 0.7, 9]} />
            <meshStandardMaterial color="#5bb066" roughness={1} />
          </mesh>
        </group>
      ))}

      {/* distant hills */}
      {[-16, 0, 14].map((x, i) => (
        <mesh key={i} position={[x, -1, -95 - i * 6]}>
          <sphereGeometry args={[16 + i * 4, 24, 16]} />
          <meshStandardMaterial color="#8fc47e" roughness={1} />
        </mesh>
      ))}

      {/* a couple of soft clouds */}
      {[
        [-12, 11, -70],
        [14, 13, -85],
        [2, 15, -100],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <sphereGeometry args={[3.4, 18, 14]} />
          <meshStandardMaterial color="#ffffff" roughness={1} transparent opacity={0.9} />
        </mesh>
      ))}
    </group>
  );
}
