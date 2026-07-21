"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COLORS = {
  skin: "#ecbd97",
  skinDark: "#ddaa80",
  hair: "#241a14",
  eye: "#211a16",
  brow: "#1d1410",
  mouth: "#b06b5c",
  zip: "#14151a",
  collar: "#17181d",
  innerTee: "#fbfbfd",
  jeans: "#46699c",
  jeansDark: "#3a567f",
  shoe: "#f1f1f3",
  shoeSole: "#cfd2d8",
  // scene props
  sheet: "#eaf0fb",
  sheetDeep: "#d3ddf0",
  pillow: "#fbfdff",
  blanket: "#5b78b4",
  blanketDeep: "#4a649b",
  bowl: "#2b2f3a",
  bowlInner: "#3b414f",
  rice: "#f4efe6",
  salmon: "#e8855a",
  avocado: "#8bbf5a",
  edamame: "#6fae4c",
};

export type MiiMode = "idle" | "sleep" | "work" | "eat" | "chill" | "commute";

interface MiiProps {
  waveKey?: number;
  follow?: number;
  mode?: MiiMode;
}

/**
 * Procedural Mii of Donald: Korean middle-part perm, black un-zipped
 * quarter-zip over a white tee, blue jeans. Looks toward the pointer, blinks,
 * waves on tap, and acts out a little scene per "mode".
 */
export default function Mii({
  waveKey = 0,
  follow = 1,
  mode = "idle",
}: MiiProps) {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const waveArm = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);

  const lastWave = useRef(waveKey);
  const waveStart = useRef(-10);

  // the exposed white tee: a generous trapezoid layered on the chest. Its own
  // edges never show — the placket edges and collar band frame the visible
  // strip, so the white reads as a narrow tee gap like a real quarter-zip
  const teeShape = useMemo(() => {
    const s = new THREE.Shape();
    s.moveTo(-0.17, 0.36);
    s.lineTo(0.17, 0.36);
    s.lineTo(0.04, -0.18);
    s.lineTo(-0.04, -0.18);
    s.closePath();
    return s;
  }, []);

  const sleeping = mode === "sleep";
  const walking = mode === "commute";
  const eating = mode === "eat";
  const holding = mode === "work" || eating || mode === "chill" || walking;

  // resting / holding targets per arm: [rotZ, rotX]
  const armPose = (side: "l" | "r"): [number, number] => {
    const sign = side === "l" ? 0.1 : -0.1;
    if (walking) {
      return side === "l" ? [sign * 0.32, -1.16] :  [0.32, 0]; // right hand dangling
    }
    if (eating) {
      // left cups the bowl low, right works the chopsticks
      return side === "l" ? [0.4, -1.05] : [-0.3, -1.2];
    }
    if (holding) {
      return side === "l" ? [0.45, -1.1] : [-0.45, -1.1]; // right hand dangling
    }
    return [sign * 0.33, 0];
  };

  useFrame((state) => {
    const now = state.clock.elapsedTime;
    const p = state.pointer;

    if (waveKey !== lastWave.current) {
      lastWave.current = waveKey;
      waveStart.current = now;
    }

    const stride = now * 5;

    if (root.current) {
      if (sleeping) {
        root.current.position.y = -2;
        root.current.rotation.z = 0;
      } else if (walking) {
        // a light walking bounce + side-to-side sway, in step with the legs
        root.current.position.y = Math.abs(Math.sin(stride)) * 0.06 - 0.02;
        root.current.rotation.z = Math.sin(stride) * 0.03;
      } else {
        root.current.position.y = Math.sin(now * 0.9) * 0.05;
        root.current.rotation.z = Math.sin(now * 0.6) * 0.012;
      }
    }

    // the body tips onto its side and lies down for sleep; the bed stays in
    // root space (world-aligned) so the mattress doesn't rotate with him
    if (body.current) {
      const b = body.current;
      if (sleeping) {
        const slowBreath = Math.sin(now * 1.1) * 0.015;
        b.rotation.z += (-Math.PI / 2 - b.rotation.z) * 0.09;
        b.rotation.y += (-0.12 - b.rotation.y) * 0.09;
        b.position.x += (1.1 - b.position.x) * 0.09;
        b.position.y += (-0.35 + slowBreath - b.position.y) * 0.09;
      } else {
        b.rotation.z += (0 - b.rotation.z) * 0.12;
        b.rotation.y += (0 - b.rotation.y) * 0.12;
        b.position.x += (0 - b.position.x) * 0.12;
        b.position.y += (0 - b.position.y) * 0.12;
      }
    }

    // legs stride while walking, otherwise ease back to standing
    if (walking) {
      if (leftLeg.current) leftLeg.current.rotation.x = Math.sin(stride) * 0.5;
      if (rightLeg.current) rightLeg.current.rotation.x = -Math.sin(stride) * 0.5;
    } else {
      if (leftLeg.current)
        leftLeg.current.rotation.x += (0 - leftLeg.current.rotation.x) * 0.1;
      if (rightLeg.current)
        rightLeg.current.rotation.x += (0 - rightLeg.current.rotation.x) * 0.1;
    }

    if (head.current) {
      const lookDown =
        mode === "chill" ? 0.34 : mode === "work" ? 0.16 : eating ? 0.22 : 0;
      const targetY = sleeping
        ? 0.1
        : walking
          ? Math.sin(now * 2) * 0.05
          : p.x * 0.45 * follow + Math.sin(now * 0.5) * 0.04;
      const targetX = sleeping
        ? -0.05
        : lookDown - p.y * 0.28 * follow + Math.sin(now * 0.7) * 0.02;
      head.current.rotation.y += (targetY - head.current.rotation.y) * 0.08;
      head.current.rotation.x += (targetX - head.current.rotation.x) * 0.08;
      const targetZ = sleeping ? -0.42 : Math.sin(now * 0.8) * 0.02;
      head.current.rotation.z += (targetZ - head.current.rotation.z) * 0.08;
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

    // right arm: wave > eat cycle > pose
    if (waveArm.current) {
      const elapsed = now - waveStart.current;
      const active = elapsed > 0 && elapsed < 2.2 && !sleeping && !eating;
      const [restZ, restX] = armPose("r");
      if (active) {
        const lift = Math.min(elapsed / 0.3, 1);
        const swing = Math.sin(elapsed * 11) * 0.32 * lift;
        waveArm.current.rotation.z = restZ + (2.3 - restZ) * lift + swing;
        waveArm.current.rotation.x = restX + (-0.2 - restX) * lift;
      } else if (eating) {
        // chopsticks travel from bowl up to the mouth, repeating
        const bite = (Math.sin(now * 2.1) - 0.6) / 1.25; // 0..1
        waveArm.current.rotation.x = restX + bite * 0.55;
        waveArm.current.rotation.z += (restZ - waveArm.current.rotation.z) * 0.2;
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
      {/* world-aligned bed + zzz — they must NOT tip with the body */}
      {sleeping && <Bed />}
      {sleeping && (
        <group position={[0, -0.5, 0.7]}>
          <Zzz />
        </group>
      )}

      {/* the whole figure; tips onto its side for the sleep pose */}
      <group ref={body}>
      {/* ---------------- LOWER BODY: blue jeans ---------------- */}
      <group position={[0, -2.5, 0]}>
        <mesh position={[0, 0.15, 0]} scale={[1, 0.8, 0.95]}>
          <sphereGeometry args={[0.78, 28, 24]} />
          <meshStandardMaterial color={COLORS.jeans} roughness={0.9} />
        </mesh>
        {/* legs get refs so they can stride when walking (commute mode) */}
        {([
          [leftLeg, -0.36],
          [rightLeg, 0.36],
        ] as const).map(([legRef, x]) => (
          <group key={x} ref={legRef} position={[x, -0.35, 0]}>
            <mesh position={[0, -0.35, 0]}>
              <capsuleGeometry args={[0.27, 0.7, 6, 16]} />
              <meshStandardMaterial color={COLORS.jeansDark} roughness={0.9} />
            </mesh>
            <mesh position={[0, -0.92, 0.14]} scale={[1, 0.7, 1.5]}>
              <sphereGeometry args={[0.26, 18, 16]} />
              <meshStandardMaterial color={COLORS.shoe} roughness={0.55} />
            </mesh>
            <mesh position={[0, -1.02, 0.2]} scale={[1, 0.4, 1.5]}>
              <sphereGeometry args={[0.25, 16, 12]} />
              <meshStandardMaterial color={COLORS.shoeSole} roughness={0.6} />
            </mesh>
          </group>
        ))}
      </group>

      {/* ---------------- TORSO: white tee + black quarter-zip ---------- */}
      <group position={[0, -1.5, 0]}>
        {/* black quarter-zip sweater body — mostly closed, like the photo */}
        <mesh position={[0, -0.1, 0]}>
          <sphereGeometry args={[0.95, 32, 28]} />
          <meshStandardMaterial color={COLORS.zip} roughness={0.85} />
        </mesh>
        <mesh position={[0, -0.7, 0]} scale={[1, 0.7, 1]}>
          <sphereGeometry args={[0.8, 28, 24]} />
          <meshStandardMaterial color={COLORS.zip} roughness={0.85} />
        </mesh>

        {/* WHITE TEE — the strip visible through the unzipped opening; its
            side edges tuck under the placket edges, its bottom sinks into
            the chest so the V simply closes */}
        <mesh position={[0, 0.275, 0.887]} rotation={[-0.42, 0, 0]}>
          <shapeGeometry args={[teeShape]} />
          <meshStandardMaterial
            color={COLORS.innerTee}
            roughness={0.9}
            side={THREE.DoubleSide}
          />
        </mesh>

        {/* white crew neck of the tee: an upright ring inside the collar so
            the collar gap and the sliver under the chin both show tee */}
        <mesh position={[0, 0.56, 0.32]} rotation={[-0.12, 0, 0]}>
          <cylinderGeometry args={[0.34, 0.4, 0.32, 36]} />
          <meshStandardMaterial color={COLORS.innerTee} roughness={0.9} />
        </mesh>

        {/* rolled stand collar: a near-horizontal torus hugging the base of
            the head, open at centre front where the zip would part it */}
        <mesh position={[0, 0.63, 0.24]} rotation={[1.45, 0, 1.845]}>
          <torusGeometry args={[0.42, 0.085, 14, 48, Math.PI * 2 - 0.55]} />
          <meshStandardMaterial color={COLORS.collar} roughness={0.85} />
        </mesh>

        {/* placket edges: near-vertical fabric edges running down from the
            collar ends, converging into a shallow V on the chest */}
        {([-1, 1] as const).map((s) => (
          <mesh
            key={s}
            position={[s * 0.105, 0.34, 0.86]}
            rotation={[-0.42, 0, s * -0.28]}
          >
            <boxGeometry args={[0.075, 0.62, 0.06]} />
            <meshStandardMaterial color={COLORS.collar} roughness={0.85} />
          </mesh>
        ))}

        {/* left arm */}
        <group ref={leftArm} position={[-0.92, 0.2, 0.18]} rotation={[0, 0, 0.34]}>
          <mesh position={[0, -0.45, 0]}>
            <capsuleGeometry args={[0.2, 0.72, 6, 16]} />
            <meshStandardMaterial color={COLORS.zip} roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.92, 0]}>
            <sphereGeometry args={[0.18, 20, 18]} />
            <meshStandardMaterial color={COLORS.skin} roughness={0.6} />
          </mesh>
          {/* poke bowl cupped in this hand while eating */}
          {eating && <PokeBowl />}
        </group>

        {/* right arm (waves / eats) — swings outward */}
        <group
          ref={waveArm}
          position={[0.92, 0.34, 0.18]}
          rotation={[0, 0, 0.32]}
        >
          <mesh position={[0, -0.45, 0]}>
            <capsuleGeometry args={[0.2, 0.72, 6, 16]} />
            <meshStandardMaterial color={COLORS.zip} roughness={0.85} />
          </mesh>
          <mesh position={[0, -0.92, 0]}>
            <sphereGeometry args={[0.19, 20, 18]} />
            <meshStandardMaterial color={COLORS.skin} roughness={0.6} />
          </mesh>
          {/* chopsticks held in this hand while eating */}
          {eating && <Chopsticks />}
        </group>
      </group>

      {/* ---------------- NECK ---------------- */}
      <mesh position={[0, -0.92, 0]}>
        <cylinderGeometry args={[0.28, 0.33, 0.5, 24]} />
        <meshStandardMaterial color={COLORS.skinDark} roughness={0.62} />
      </mesh>

      {/* ---------------- HEAD ---------------- */}
      <group ref={head} position={[0, 0, 0]}>
        <mesh scale={[1, 1.08, 0.96]} castShadow>
          {/* 44×36 is visually identical to 64×64 on a smooth sphere this size,
              at ~40% of the vertices — trims first-frame build cost */}
          <sphereGeometry args={[1, 44, 36]} />
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
        {/* back coverage */}
        <mesh position={[0, 0.08, -0.34]} scale={[1.02, 1.05, 0.92]}>
          <sphereGeometry args={[1, 36, 32]} />
          <meshStandardMaterial color={COLORS.hair} roughness={0.52} />
        </mesh>

        {/* two swept wings rising from the centre part */}
        <mesh
          position={[-0.3, 0.64, 0.3]}
          rotation={[0.15, 0.3, 0.22]}
          scale={[0.56, 0.52, 0.7]}
        >
          <sphereGeometry args={[1, 40, 40]} />
          <meshStandardMaterial color={COLORS.hair} roughness={0.5} />
        </mesh>
        <mesh
          position={[0.3, 0.64, 0.3]}
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
          position={[-0.28, 0.45, 0.74]}
          rotation={[0.5, 0.25, 0.55]}
          scale={[0.4, 0.5, 0.26]}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={COLORS.hair} roughness={0.5} />
        </mesh>
        <mesh
          position={[0.28, 0.45, 0.74]}
          rotation={[0.5, -0.25, -0.55]}
          scale={[0.4, 0.5, 0.26]}
        >
          <sphereGeometry args={[1, 32, 32]} />
          <meshStandardMaterial color={COLORS.hair} roughness={0.5} />
        </mesh>
        {/* flipped ends near the temples (the perm flick) */}
        <mesh
          position={[-0.67, 0.40, 0.25]}
          rotation={[0, 0.4, -0.4]}
          scale={[0.34, 0.5, 0.54]}
        >
          <sphereGeometry args={[1, 28, 28]} />
          <meshStandardMaterial color={COLORS.hair} roughness={0.5} />
        </mesh>
        <mesh
          position={[0.67, 0.40, 0.25]}
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

        {/* big, warm open smile (the grin from the photo) */}
        <mesh position={[0, -0.4, 0.9]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.19, 0.036, 16, 32, Math.PI * 0.98]} />
          <meshStandardMaterial color={COLORS.mouth} roughness={0.5} />
        </mesh>
      </group>

      {/* ---------------- HELD PROPS ---------------- */}
      {mode === "work" && <Laptop />}
      {mode === "chill" && <Phone />}
      {mode === "commute" && <Matcha />}
      </group>
    </group>
  );
}

/* ----------------------------------------------------------------------------
   HELD PROPS
---------------------------------------------------------------------------- */
function Laptop() {
  return (
    <group position={[0, -1.4, 2.5]} rotation={[0.1, 3.3, 0]}>
      <mesh rotation={[-0.35, 0, 0]} position={[0, -0.05, 0.18]}>
        <boxGeometry args={[1.25, 0.07, 0.85]} />
        <meshStandardMaterial color="#c7ccd4" roughness={0.4} metalness={0.5} />
      </mesh>
      <group position={[0, 0.2, -0.18]}>
        <mesh>
          <boxGeometry args={[1.25, 0.82, 0.05]} />
          <meshStandardMaterial color="#b9bec7" roughness={0.4} metalness={0.5} />
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
        <mesh position={[0, 0, -0.03]} rotation={[0, Math.PI, 0]}>
          <circleGeometry args={[0.08, 20]} />
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
    <group position={[-0.2, -1.5, 1.5]} rotation={[1, 3, 0]}>
      <mesh>
        <boxGeometry args={[0.42, 0.86, 0.05]} />
        <meshStandardMaterial color="#c0c0c0ff" roughness={0.35} metalness={0.4} />
      </mesh>
      <mesh position={[0, 0, 0.03]}>
        <planeGeometry args={[0.36, 0.78]} />
        <meshStandardMaterial
          color="#c0c0c0ff"
          emissive="#3b74d6"
          emissiveIntensity={0.6}
          roughness={0.3}
        />
      </mesh>
    </group>
  );
}

/** A bowl of poke, cupped in the left hand. Sits in the leftArm group space. */
function PokeBowl() {
  return (
    <group position={[0, -1.25, 0.22]} rotation={[8, 0, 0]}>
      {/* bowl */}
      <mesh scale={[1, 0.6, 1]}>
        <sphereGeometry args={[0.34, 22, 18, 0, Math.PI * 2, Math.PI * 0.5, Math.PI * 0.5]} />
        <meshStandardMaterial color={COLORS.bowl} roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.02, 0]} scale={[1, 0.4, 1]}>
        <cylinderGeometry args={[0.32, 0.3, 0.12, 22]} />
        <meshStandardMaterial color={COLORS.bowlInner} roughness={0.5} />
      </mesh>
      {/* rice base */}
      <mesh position={[0, 0.06, 0]} scale={[1, 0.4, 1]}>
        <sphereGeometry args={[0.27, 18, 14]} />
        <meshStandardMaterial color={COLORS.rice} roughness={0.85} />
      </mesh>
      {/* toppings */}
      {[
        [0.1, 0.16, 0.08, COLORS.salmon],
        [-0.12, 0.15, 0.05, COLORS.salmon],
        [0.02, 0.17, -0.1, COLORS.avocado],
        [0.14, 0.15, -0.08, COLORS.edamame],
        [-0.08, 0.16, -0.12, COLORS.avocado],
      ].map(([x, y, z, c], i) => (
        <mesh key={i} position={[x as number, y as number, z as number]} scale={[1, 0.7, 1]}>
          <boxGeometry args={[0.1, 0.08, 0.1]} />
          <meshStandardMaterial color={c as string} roughness={0.55} />
        </mesh>
      ))}
    </group>
  );
}

/** Chopsticks held in the right hand, angled toward the mouth. */
function Chopsticks() {
  return (
    <group position={[0.1, -1, 0.1]} rotation={[0, 0, 90]}>
      {[-0.04, 0.04].map((o) => (
        <mesh key={o} position={[o, 0.32, 0.06]} rotation={[0, 0, 0.12]}>
          <cylinderGeometry args={[0.016, 0.011, 0.78, 8]} />
          <meshStandardMaterial color="#b98a52" roughness={0.7} />
        </mesh>
      ))}
      {/* a morsel pinched at the tips */}
      <mesh position={[0, 0.7, 0.06]} scale={[1, 0.7, 1]}>
        <boxGeometry args={[0.08, 0.07, 0.08]} />
        <meshStandardMaterial color={COLORS.salmon} roughness={0.55} />
      </mesh>
    </group>
  );
}

/**
 * A horizontal bed seen from the side: a mattress slab below, a pillow at the
 * head end (right), a blanket over the lower body, and a headboard at the far
 * right. The body lies on its side on top of it (rotated in the parent).
 */
function Bed() {
  return (
    <group>
      {/* headboard at the head (right) end */}
      <mesh position={[2.95, -0.95, -0.15]}>
        <boxGeometry args={[0.34, 1.9, 2.5]} />
        <meshStandardMaterial color={COLORS.sheetDeep} roughness={0.9} />
      </mesh>
      {/* mattress slab */}
      <mesh position={[-0.1, -1.7, -0.1]}>
        <boxGeometry args={[6.1, 0.8, 2.5]} />
        <meshStandardMaterial color={COLORS.sheet} roughness={0.92} />
      </mesh>
      {/* mattress top sheet, a touch brighter */}
      <mesh position={[-0.1, -1.28, 0]} scale={[1, 1, 1]}>
        <boxGeometry args={[6.0, 0.12, 2.3]} />
        <meshStandardMaterial color={COLORS.pillow} roughness={0.95} />
      </mesh>
      {/* pillow under the head */}
      <mesh position={[1.95, -1.0, 0.05]} rotation={[0, 0, 0.06]} scale={[1.05, 0.62, 1.35]}>
        <sphereGeometry args={[0.66, 22, 18]} />
        <meshStandardMaterial color={COLORS.pillow} roughness={0.96} />
      </mesh>
    </group>
  );
}

/** A little car cockpit: dashboard, windshield frame, wheel, mirror. */
/** A matcha latte cradled in both hands while walking (commute mode). */
function Matcha() {
  return (
    <group position={[-1, -1.5, 1.18]} rotation={[0.12, 0, 0]}>
      {/* cup */}
      <mesh>
        <cylinderGeometry args={[0.2, 0.16, 0.4, 28]} />
        <meshStandardMaterial color="#f5f1ea" roughness={0.5} />
      </mesh>
      {/* kraft sleeve */}
      <mesh position={[0, -0.02, 0]}>
        <cylinderGeometry args={[0.212, 0.188, 0.18, 28]} />
        <meshStandardMaterial color="#c39a6b" roughness={0.8} />
      </mesh>
      {/* matcha surface */}
      <mesh position={[0, 0.205, 0]}>
        <cylinderGeometry args={[0.188, 0.188, 0.03, 28]} />
        <meshStandardMaterial color="#84a83f" roughness={0.6} />
      </mesh>
      {/* domed lid rim */}
      <mesh position={[0, 0.23, 0]}>
        <torusGeometry args={[0.19, 0.025, 12, 28]} />
        <meshStandardMaterial color="#e9e5dd" roughness={0.45} />
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
