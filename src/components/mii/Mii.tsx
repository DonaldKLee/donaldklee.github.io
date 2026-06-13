"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COLORS = {
  skin: "#e7b48f",
  skinDark: "#d9a47e",
  hair: "#221a16",
  hairSheen: "#332620",
  eye: "#241c18",
  brow: "#1d1612",
  mouth: "#b06b5c",
  zip: "#1b1b1f",
  zipPanel: "#252528",
  collar: "#2c2c31",
  zipperTeeth: "#3a3a40",
  zipperPull: "#b9bec7",
  innerTee: "#f3f3f5",
  jeans: "#46699c",
  jeansDark: "#3a567f",
  shoe: "#f1f1f3",
  shoeSole: "#cfd2d8",
};

export type MiiMode = "idle" | "sleep" | "work" | "eat" | "chill" | "commute";

interface MiiProps {
  waveKey?: number;
  follow?: number;
  mode?: MiiMode;
}

/**
 * Procedural Mii of Donald: Korean middle-part perm, black un-zipped
 * quarter-zip, blue jeans. Looks toward the pointer, blinks, waves on tap.
 */
export default function Mii({
  waveKey = 0,
  follow = 1,
  mode = "idle",
}: MiiProps) {
  const root = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const waveArm = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);

  const lastWave = useRef(waveKey);
  const waveStart = useRef(-10);

  const sleeping = mode === "sleep";
  const holding =
    mode === "work" || mode === "eat" || mode === "chill" || mode === "commute";

  // resting / holding targets per arm: [rotZ, rotX]
  const armPose = (side: "l" | "r"): [number, number] => {
    const sign = side === "l" ? 1 : -1;
    if (mode === "eat") {
      // left cups the plate low, right brings chopsticks to the mouth
      return side === "l" ? [0.45, -1.0] : [-0.7, -1.35];
    }
    // bring forearms forward (x) and inward (z) to meet the held prop
    if (holding) return [sign * 0.62, -1.1];
    return [sign * 0.33, 0];
  };

  useFrame((state) => {
    const now = state.clock.elapsedTime;
    const p = state.pointer;

    if (waveKey !== lastWave.current) {
      lastWave.current = waveKey;
      waveStart.current = now;
    }

    if (root.current) {
      root.current.position.y = Math.sin(now * 0.9) * 0.05;
      root.current.rotation.z = Math.sin(now * 0.6) * 0.012;
    }

    if (head.current) {
      const lookDown =
        mode === "chill" ? 0.34 : mode === "work" ? 0.16 : 0;
      const targetY = sleeping
        ? 0
        : p.x * 0.45 * follow + Math.sin(now * 0.5) * 0.04;
      const targetX = sleeping
        ? 0.18
        : lookDown - p.y * 0.28 * follow + Math.sin(now * 0.7) * 0.02;
      head.current.rotation.y += (targetY - head.current.rotation.y) * 0.08;
      head.current.rotation.x += (targetX - head.current.rotation.x) * 0.08;
      head.current.rotation.z = sleeping
        ? 0.12
        : Math.sin(now * 0.8) * 0.02;
    }

    // left arm follows its pose target
    if (leftArm.current) {
      const [z, x] = armPose("l");
      leftArm.current.rotation.z += (z - leftArm.current.rotation.z) * 0.1;
      leftArm.current.rotation.x += (x - leftArm.current.rotation.x) * 0.1;
    }

    if (lid.current) {
      if (sleeping) {
        lid.current.scale.y = 0.08;
      } else {
        const cycle = now % 4.2;
        const blink = cycle > 4.0 ? 1 - Math.abs((cycle - 4.1) / 0.1) : 0;
        lid.current.scale.y = 1 - blink * 0.92;
      }
    }

    // wave — the +x arm swings OUTWARD (positive z) so the hand stays
    // clear of the head. Otherwise it follows its pose target.
    if (waveArm.current) {
      const elapsed = now - waveStart.current;
      const active = elapsed > 0 && elapsed < 2.2 && !sleeping;
      const [restZ, restX] = armPose("r");
      if (active) {
        const lift = Math.min(elapsed / 0.3, 1);
        const swing = Math.sin(elapsed * 11) * 0.32 * lift;
        waveArm.current.rotation.z = restZ + (2.3 - restZ) * lift + swing;
        waveArm.current.rotation.x = restX + (-0.2 - restX) * lift;
      } else {
        waveArm.current.rotation.z +=
          (restZ - waveArm.current.rotation.z) * 0.1;
        waveArm.current.rotation.x +=
          (restX - waveArm.current.rotation.x) * 0.1;
      }
    }
  });

  return (
    <group ref={root} dispose={null}>
      {/* ---------------- LOWER BODY: blue jeans ---------------- */}
      <group position={[0, -2.5, 0]}>
        {/* hips */}
        <mesh position={[0, 0.15, 0]} scale={[1, 0.8, 0.95]} castShadow>
          <sphereGeometry args={[0.78, 40, 40]} />
          <meshStandardMaterial color={COLORS.jeans} roughness={0.9} />
        </mesh>
        {/* legs */}
        {[-0.36, 0.36].map((x) => (
          <group key={x} position={[x, -0.35, 0]}>
            <mesh position={[0, -0.35, 0]} castShadow>
              <capsuleGeometry args={[0.27, 0.7, 10, 24]} />
              <meshStandardMaterial color={COLORS.jeansDark} roughness={0.9} />
            </mesh>
            {/* shoe */}
            <mesh position={[0, -0.92, 0.14]} scale={[1, 0.7, 1.5]}>
              <sphereGeometry args={[0.26, 28, 28]} />
              <meshStandardMaterial color={COLORS.shoe} roughness={0.55} />
            </mesh>
            <mesh position={[0, -1.02, 0.2]} scale={[1, 0.4, 1.5]}>
              <sphereGeometry args={[0.25, 24, 24]} />
              <meshStandardMaterial color={COLORS.shoeSole} roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ---------------- TORSO: black quarter-zip (un-zipped) -------- */}
      <group position={[0, -1.5, 0]}>
        <mesh position={[0, -0.1, 0]} castShadow>
          <sphereGeometry args={[0.95, 48, 48]} />
          <meshStandardMaterial color={COLORS.zip} roughness={0.78} />
        </mesh>
        <mesh position={[0, -0.7, 0]} scale={[1, 0.7, 1]} castShadow>
          <sphereGeometry args={[0.8, 48, 48]} />
          <meshStandardMaterial color={COLORS.zip} roughness={0.78} />
        </mesh>

        {/* inner tee showing through the open zip */}
        <mesh position={[0, 0.18, 0.84]} scale={[0.5, 0.8, 0.3]}>
          <sphereGeometry args={[0.3, 24, 24]} />
          <meshStandardMaterial color={COLORS.innerTee} roughness={0.85} />
        </mesh>

        {/* open collar — two flaps forming a V */}
        <mesh
          position={[-0.2, 0.42, 0.7]}
          rotation={[0.3, 0, 0.5]}
          scale={[0.16, 0.42, 0.5]}
        >
          <sphereGeometry args={[1, 20, 20]} />
          <meshStandardMaterial color={COLORS.collar} roughness={0.72} />
        </mesh>
        <mesh
          position={[0.2, 0.42, 0.7]}
          rotation={[0.3, 0, -0.5]}
          scale={[0.16, 0.42, 0.5]}
        >
          <sphereGeometry args={[1, 20, 20]} />
          <meshStandardMaterial color={COLORS.collar} roughness={0.72} />
        </mesh>
        {/* short zipper pulled down (bottom half) */}
        <mesh position={[0, -0.18, 0.92]}>
          <boxGeometry args={[0.05, 0.55, 0.04]} />
          <meshStandardMaterial
            color={COLORS.zipperTeeth}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
        <mesh position={[0, 0.08, 0.95]}>
          <boxGeometry args={[0.09, 0.13, 0.05]} />
          <meshStandardMaterial
            color={COLORS.zipperPull}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>

        {/* left arm */}
        <group ref={leftArm} position={[-0.92, 0.2, 0.18]} rotation={[0, 0, 0.34]}>
          <mesh position={[0, -0.45, 0]} castShadow>
            <capsuleGeometry args={[0.2, 0.72, 12, 24]} />
            <meshStandardMaterial color={COLORS.zipPanel} roughness={0.78} />
          </mesh>
          <mesh position={[0, -0.92, 0]}>
            <sphereGeometry args={[0.18, 32, 32]} />
            <meshStandardMaterial color={COLORS.skin} roughness={0.6} />
          </mesh>
        </group>

        {/* right arm (waves) — pivot at shoulder, swings outward */}
        <group
          ref={waveArm}
          position={[0.92, 0.34, 0.18]}
          rotation={[0, 0, 0.32]}
        >
          <mesh position={[0, -0.45, 0]} castShadow>
            <capsuleGeometry args={[0.2, 0.72, 12, 24]} />
            <meshStandardMaterial color={COLORS.zipPanel} roughness={0.78} />
          </mesh>
          <mesh position={[0, -0.92, 0]}>
            <sphereGeometry args={[0.19, 32, 32]} />
            <meshStandardMaterial color={COLORS.skin} roughness={0.6} />
          </mesh>
        </group>
      </group>

      {/* ---------------- NECK ---------------- */}
      <mesh position={[0, -0.92, 0]}>
        <cylinderGeometry args={[0.28, 0.33, 0.5, 32]} />
        <meshStandardMaterial color={COLORS.skinDark} roughness={0.62} />
      </mesh>

      {/* ---------------- HEAD ---------------- */}
      <group ref={head} position={[0, 0, 0]}>
        <mesh scale={[1, 1.08, 0.96]} castShadow>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial color={COLORS.skin} roughness={0.58} />
        </mesh>

        {/* ears (visible, tapered hair leaves them out) */}
        <mesh position={[-0.99, -0.06, 0.02]} scale={[0.45, 0.68, 0.5]}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color={COLORS.skin} roughness={0.58} />
        </mesh>
        <mesh position={[0.99, -0.06, 0.02]} scale={[0.45, 0.68, 0.5]}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color={COLORS.skin} roughness={0.58} />
        </mesh>

        {/* ---- HAIR: Korean middle-part perm ---- */}
        {/* voluminous crown, raised for height */}
        <mesh position={[0, 0.28, -0.05]} scale={[1.04, 1.2, 1.08]}>
          <sphereGeometry
            args={[0, 0.5, 0.5, 0.5, Math.PI * 4, 0, Math.PI * 0.5]}
          />
          <meshStandardMaterial color={COLORS.hair} roughness={0.52} />
        </mesh>
        {/* back coverage */}
        <mesh position={[0, 0.08, -0.34]} scale={[1.02, 1.05, 0.92]}>
          <sphereGeometry args={[1, 48, 48]} />
          <meshStandardMaterial color={COLORS.hair} roughness={0.52} />
        </mesh>

        {/* two swept wings rising from the centre part */}
        <mesh
          position={[-0.3, 0.54, 0.3]}
          rotation={[0.15, 0.3, 0.22]}
          scale={[0.56, 0.52, 0.7]}
        >
          <sphereGeometry args={[1, 40, 40]} />
          <meshStandardMaterial color={COLORS.hair} roughness={0.5} />
        </mesh>
        <mesh
          position={[0.3, 0.54, 0.3]}
          rotation={[0.15, -0.3, -0.22]}
          scale={[0.56, 0.52, 0.7]}
        >
          <sphereGeometry args={[1, 40, 40]} />
          <meshStandardMaterial color={COLORS.hair} roughness={0.5} />
        </mesh>
        {/* centre crown filler so the part reads as a part, not a gap */}
        <mesh position={[0, 0.7, 0.04]} scale={[0.64, 0.46, 0.7]}>
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={COLORS.hair} roughness={0.5} />
        </mesh>

        {/* front bangs sweeping down + flipping outward from the part */}
        <mesh
          position={[-0.28, 0.46, 0.74]}
          rotation={[0.5, 0.25, 0.55]}
          scale={[0.4, 0.5, 0.26]}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={COLORS.hair} roughness={0.5} />
        </mesh>
        <mesh
          position={[0.28, 0.46, 0.74]}
          rotation={[0.5, -0.25, -0.55]}
          scale={[0.4, 0.5, 0.26]}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={COLORS.hair} roughness={0.5} />
        </mesh>
        {/* flipped ends near the temples (the perm flick) */}
        <mesh
          position={[-0.7, 0.40, 0.25]}
          rotation={[0, 0.4, -0.4]}
          scale={[0.34, 0.5, 0.54]}
        >
          <sphereGeometry args={[1, 28, 28]} />
          <meshStandardMaterial color={COLORS.hair} roughness={0.5} />
        </mesh>
        <mesh
          position={[0.7, 0.40, 0.25]}
          rotation={[0, -0.4, 0.4]}
          scale={[0.34, 0.5, 0.54]}
        >
          <sphereGeometry args={[1, 28, 28]} />
          <meshStandardMaterial color={COLORS.hair} roughness={0.5} />
        </mesh>
        {/* short tapered sideburns (ears stay visible) */}
        <mesh position={[-0.84, 0.12, 0.28]} scale={[0.18, 0.34, 0.24]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color={COLORS.hair} roughness={0.5} />
        </mesh>
        <mesh position={[0.84, 0.12, 0.28]} scale={[0.18, 0.34, 0.24]}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshStandardMaterial color={COLORS.hair} roughness={0.5} />
        </mesh>

        {/* ---- FACE ---- */}
        <group ref={lid}>
          <mesh position={[-0.33, 0.06, 0.9]} scale={[1.15, 1.0, 0.5]}>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial color={COLORS.eye} roughness={0.3} />
          </mesh>
          <mesh position={[0.33, 0.06, 0.9]} scale={[1.15, 1.0, 0.5]}>
            <sphereGeometry args={[0.12, 32, 32]} />
            <meshStandardMaterial color={COLORS.eye} roughness={0.3} />
          </mesh>
          <mesh position={[-0.29, 0.1, 0.99]}>
            <sphereGeometry args={[0.028, 16, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[0.37, 0.1, 0.99]}>
            <sphereGeometry args={[0.028, 16, 16]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>

        {/* fuller, fairly straight brows */}
        <mesh position={[-0.33, 0.32, 0.92]} rotation={[0, 0, -0.05]}>
          <boxGeometry args={[0.3, 0.06, 0.05]} />
          <meshStandardMaterial color={COLORS.brow} roughness={0.5} />
        </mesh>
        <mesh position={[0.33, 0.32, 0.92]} rotation={[0, 0, 0.05]}>
          <boxGeometry args={[0.3, 0.06, 0.05]} />
          <meshStandardMaterial color={COLORS.brow} roughness={0.5} />
        </mesh>

        {/* nose */}
        <mesh position={[0, -0.08, 1.0]} scale={[0.62, 0.85, 0.7]}>
          <sphereGeometry args={[0.1, 24, 24]} />
          <meshStandardMaterial color={COLORS.skinDark} roughness={0.55} />
        </mesh>

        {/* soft confident smile */}
        <mesh position={[0, -0.4, 0.9]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.17, 0.03, 16, 32, Math.PI * 0.8]} />
          <meshStandardMaterial color={COLORS.mouth} roughness={0.5} />
        </mesh>

        {/* zzz when sleeping */}
        {sleeping && <Zzz />}
      </group>

      {/* ---------------- HELD PROPS ---------------- */}
      {mode === "work" && <Laptop />}
      {mode === "chill" && <Phone />}
      {mode === "eat" && <Sushi />}
      {mode === "commute" && <SteeringWheel />}
    </group>
  );
}

function Laptop() {
  return (
    <group position={[0, -0.62, 1.45]} rotation={[0.1, 0, 0]}>
      {/* base */}
      <mesh rotation={[-0.35, 0, 0]} position={[0, -0.05, 0.18]}>
        <boxGeometry args={[1.25, 0.07, 0.85]} />
        <meshStandardMaterial color="#c7ccd4" roughness={0.4} metalness={0.5} />
      </mesh>
      {/* lid */}
      <group position={[0, 0.05, -0.18]} rotation={[0.32, 0, 0]}>
        <mesh>
          <boxGeometry args={[1.25, 0.82, 0.05]} />
          <meshStandardMaterial
            color="#b9bec7"
            roughness={0.4}
            metalness={0.5}
          />
        </mesh>
        <mesh position={[0, 0, 0.03]}>
          <planeGeometry args={[1.12, 0.7]} />
          <meshStandardMaterial
            color="#11151c"
            emissive="#2a4a86"
            emissiveIntensity={0.55}
            roughness={0.3}
          />
        </mesh>
        {/* glowing apple-ish dot on the lid back */}
        <mesh position={[0, 0, -0.03]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.08, 24]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive="#ffffff"
            emissiveIntensity={0.4}
          />
        </mesh>
      </group>
    </group>
  );
}

function Phone() {
  return (
    <group position={[0, -0.7, 1.5]} rotation={[-0.55, 0, 0.05]}>
      <mesh>
        <boxGeometry args={[0.42, 0.86, 0.05]} />
        <meshStandardMaterial color="#1a1a1d" roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.36, 0.78]} />
        <meshStandardMaterial
          color="#0b1f3a"
          emissive="#3b74d6"
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

function Sushi() {
  return (
    <group position={[0.18, -0.18, 1.25]}>
      {/* rice */}
      <mesh position={[0, 0, 0]} scale={[1, 0.7, 1]}>
        <boxGeometry args={[0.26, 0.2, 0.18]} />
        <meshStandardMaterial color="#f4efe6" roughness={0.8} />
      </mesh>
      {/* salmon */}
      <mesh position={[0, 0.12, 0]} rotation={[0.1, 0, 0]} scale={[1, 0.45, 1]}>
        <boxGeometry args={[0.28, 0.2, 0.2]} />
        <meshStandardMaterial color="#e8855a" roughness={0.55} />
      </mesh>
      {/* chopsticks coming from the right hand */}
      {[-0.04, 0.04].map((o) => (
        <mesh
          key={o}
          position={[0.5 + o, 0.25, 0.1]}
          rotation={[0, 0, -0.7]}
        >
          <cylinderGeometry args={[0.018, 0.012, 0.9, 8]} />
          <meshStandardMaterial color="#b98a52" roughness={0.7} />
        </mesh>
      ))}
    </group>
  );
}

function SteeringWheel() {
  return (
    <group position={[0, -0.78, 1.55]} rotation={[1.15, 0, 0]}>
      <mesh>
        <torusGeometry args={[0.6, 0.08, 20, 40]} />
        <meshStandardMaterial color="#1a1a1d" roughness={0.6} />
      </mesh>
      {/* spokes */}
      {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((a) => (
        <mesh key={a} rotation={[0, 0, a]} position={[0, 0, 0]}>
          <boxGeometry args={[0.55, 0.07, 0.05]} />
          <meshStandardMaterial color="#26262b" roughness={0.6} />
        </mesh>
      ))}
      {/* hub */}
      <mesh>
        <cylinderGeometry args={[0.16, 0.16, 0.08, 24]} />
        <meshStandardMaterial color="#2c2c31" roughness={0.5} />
      </mesh>
    </group>
  );
}

/** A single "Z" built from three thin bars. */
function ZLetter() {
  const bar = (
    args: [number, number, number],
    pos: [number, number, number],
    rot = 0,
  ) => (
    <mesh position={pos} rotation={[0, 0, rot]}>
      <boxGeometry args={args} />
      <meshStandardMaterial
        color="#5b6b8c"
        emissive="#5b6b8c"
        emissiveIntensity={0.3}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
  return (
    <group>
      {bar([0.34, 0.07, 0.06], [0, 0.17, 0])}
      {bar([0.44, 0.07, 0.06], [0, 0, 0], -0.9)}
      {bar([0.34, 0.07, 0.06], [0, -0.17, 0])}
    </group>
  );
}

function Zzz() {
  const g = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (!g.current) return;
    const t = state.clock.elapsedTime;
    g.current.children.forEach((c, i) => {
      const phase = (t * 0.45 + i * 0.33) % 1;
      c.position.y = 1.3 + i * 0.32 + phase * 0.7;
      c.position.x = 1.05 + i * 0.3 + Math.sin(phase * Math.PI) * 0.12;
      c.scale.setScalar(0.7 + i * 0.32);
      c.traverse((obj) => {
        const m = obj as THREE.Mesh;
        if (m.isMesh) {
          (m.material as THREE.MeshStandardMaterial).opacity =
            (1 - phase) * 0.9;
        }
      });
    });
  });
  return (
    <group ref={g}>
      {[0, 1, 2].map((i) => (
        <group key={i} position={[0.9, 1.3 + i * 0.35, 0.5]}>
          <ZLetter />
        </group>
      ))}
    </group>
  );
}
