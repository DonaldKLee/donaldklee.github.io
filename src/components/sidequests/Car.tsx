"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const C = {
  body: "#191920",
  bodyDark: "#101014",
  roof: "#1f1f26",
  glass: "#bcd9f0",
  tyre: "#15151a",
  rim: "#cdd2da",
  hub: "#8b909a",
  chrome: "#c7ccd4",
  head: "#fff4d6",
  tail: "#ff4646",
  skin: "#e7b48f",
  hair: "#221a16",
  zip: "#1b1b1f",
};

/** A low-poly road-trip car (black) with the Mii driving inside. Faces -Z. */
export default function Car({ moving }: { moving: boolean }) {
  const group = useRef<THREE.Group>(null);
  const wheels = useRef<THREE.Mesh[]>([]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (group.current) {
      group.current.position.y = moving ? Math.sin(t * 9) * 0.025 : 0;
      group.current.rotation.z = moving ? Math.sin(t * 1.6) * 0.01 : 0;
      group.current.rotation.y = -0.04 + (moving ? Math.sin(t * 0.8) * 0.02 : 0);
    }
    if (moving) {
      for (const w of wheels.current) if (w) w.rotation.y += 0.5;
    }
  });

  const wheel = (x: number, z: number, i: number) => (
    <group key={i} position={[x, 0.42, z]} rotation={[0, 0, Math.PI / 2]}>
      <mesh ref={(m) => { if (m) wheels.current[i] = m; }} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.32, 24]} />
        <meshStandardMaterial color={C.tyre} roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.17, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.02, 20]} />
        <meshStandardMaterial color={C.rim} metalness={0.6} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.18, 0]}>
        <cylinderGeometry args={[0.07, 0.07, 0.04, 12]} />
        <meshStandardMaterial color={C.hub} metalness={0.5} roughness={0.4} />
      </mesh>
    </group>
  );

  return (
    <group ref={group} position={[0, 0, 1]}>
      {/* lower body */}
      <mesh position={[0, 0.55, 0]} castShadow>
        <boxGeometry args={[2.02, 0.5, 4.3]} />
        <meshStandardMaterial color={C.body} roughness={0.45} metalness={0.25} />
      </mesh>
      {/* rounded shoulders (top of body) */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <boxGeometry args={[1.96, 0.32, 4.0]} />
        <meshStandardMaterial color={C.body} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* skirt */}
      <mesh position={[0, 0.32, 0]}>
        <boxGeometry args={[1.88, 0.3, 4.1]} />
        <meshStandardMaterial color={C.bodyDark} roughness={0.6} />
      </mesh>

      {/* cabin / roof */}
      <mesh position={[0, 1.28, 0.25]} castShadow>
        <boxGeometry args={[1.66, 0.62, 2.0]} />
        <meshStandardMaterial color={C.roof} roughness={0.4} metalness={0.3} />
      </mesh>
      {/* glass: windshield (front -Z), rear (+Z), sides */}
      <mesh position={[0, 1.22, -0.78]} rotation={[-0.28, 0, 0]}>
        <boxGeometry args={[1.45, 0.5, 0.05]} />
        <meshStandardMaterial color={C.glass} roughness={0.1} metalness={0.2} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0, 1.24, 1.26]} rotation={[0.32, 0, 0]}>
        <boxGeometry args={[1.45, 0.46, 0.05]} />
        <meshStandardMaterial color={C.glass} roughness={0.1} metalness={0.2} transparent opacity={0.85} />
      </mesh>
      <mesh position={[0.84, 1.26, 0.25]}>
        <boxGeometry args={[0.05, 0.44, 1.6]} />
        <meshStandardMaterial color={C.glass} roughness={0.1} metalness={0.2} transparent opacity={0.82} />
      </mesh>
      <mesh position={[-0.84, 1.26, 0.25]}>
        <boxGeometry args={[0.05, 0.44, 1.6]} />
        <meshStandardMaterial color={C.glass} roughness={0.1} metalness={0.2} transparent opacity={0.82} />
      </mesh>

      {/* the Mii, driving (left seat = +X here) */}
      <group position={[0.42, 0, 0.3]}>
        {/* shoulders */}
        <mesh position={[0, 0.92, 0]}>
          <boxGeometry args={[0.66, 0.5, 0.5]} />
          <meshStandardMaterial color={C.zip} roughness={0.7} />
        </mesh>
        {/* head */}
        <mesh position={[0, 1.34, 0]}>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color={C.skin} roughness={0.6} />
        </mesh>
        {/* perm hair */}
        <mesh position={[0, 1.46, -0.02]} scale={[1.08, 1.0, 1.1]}>
          <sphereGeometry args={[0.3, 32, 32, 0, Math.PI * 2, 0, Math.PI * 0.6]} />
          <meshStandardMaterial color={C.hair} roughness={0.5} />
        </mesh>
        <mesh position={[-0.12, 1.5, 0.12]} scale={[0.5, 0.5, 0.5]}>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshStandardMaterial color={C.hair} roughness={0.5} />
        </mesh>
        <mesh position={[0.12, 1.5, 0.12]} scale={[0.5, 0.5, 0.5]}>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshStandardMaterial color={C.hair} roughness={0.5} />
        </mesh>
      </group>

      {/* bumpers */}
      <mesh position={[0, 0.45, -2.12]}>
        <boxGeometry args={[1.9, 0.3, 0.16]} />
        <meshStandardMaterial color={C.bodyDark} roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.45, 2.12]}>
        <boxGeometry args={[1.9, 0.3, 0.16]} />
        <meshStandardMaterial color={C.bodyDark} roughness={0.5} />
      </mesh>

      {/* head + tail lights */}
      {[-0.66, 0.66].map((x) => (
        <mesh key={`h${x}`} position={[x, 0.62, -2.16]}>
          <boxGeometry args={[0.34, 0.16, 0.08]} />
          <meshStandardMaterial color={C.head} emissive={C.head} emissiveIntensity={0.7} />
        </mesh>
      ))}
      {[-0.66, 0.66].map((x) => (
        <mesh key={`t${x}`} position={[x, 0.66, 2.16]}>
          <boxGeometry args={[0.36, 0.18, 0.08]} />
          <meshStandardMaterial color={C.tail} emissive={C.tail} emissiveIntensity={0.6} />
        </mesh>
      ))}

      {/* wheels */}
      {wheel(0.98, -1.35, 0)}
      {wheel(-0.98, -1.35, 1)}
      {wheel(0.98, 1.45, 2)}
      {wheel(-0.98, 1.45, 3)}
    </group>
  );
}
