"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COLORS = {
  skin: "#e7b48f",
  skinDark: "#d9a47e",
  hair: "#1d1714",
  hairSheen: "#2e231d",
  eye: "#241c18",
  brow: "#1d1612",
  mouth: "#b06b5c",
  zip: "#191920",
  zipPanel: "#23232b",
  collar: "#2a2a33",
  zipperTeeth: "#3a3a40",
  zipperPull: "#c2c7d0",
  innerTee: "#f4f4f6",
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
  car: "#222530",
  carTrim: "#15171f",
  dash: "#2b2f3a",
  glass: "#bcd2ec",
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
  const head = useRef<THREE.Group>(null);
  const waveArm = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const lid = useRef<THREE.Group>(null);

  const lastWave = useRef(waveKey);
  const waveStart = useRef(-10);

  const sleeping = mode === "sleep";
  const driving = mode === "commute";
  const eating = mode === "eat";
  const holding = mode === "work" || eating || mode === "chill" || driving;

  // resting / holding targets per arm: [rotZ, rotX]
  const armPose = (side: "l" | "r"): [number, number] => {
    const sign = side === "l" ? 1 : -1;
    if (driving) return [sign * 0.5, -1.2]; // both hands up on the wheel
    if (eating) {
      // left cups the bowl low, right works the chopsticks
      return side === "l" ? [0.5, -1.05] : [-0.6, -1.2];
    }
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
      if (sleeping) {
        // settle low and still, gentle breathing
        root.current.position.y += (-0.55 - root.current.position.y) * 0.08;
        root.current.rotation.z += (0 - root.current.rotation.z) * 0.08;
      } else if (driving) {
        // road buzz
        root.current.position.y = Math.sin(now * 9) * 0.012;
        root.current.rotation.z = Math.sin(now * 0.6) * 0.01;
      } else {
        root.current.position.y = Math.sin(now * 0.9) * 0.05;
        root.current.rotation.z = Math.sin(now * 0.6) * 0.012;
      }
    }

    if (head.current) {
      const lookDown =
        mode === "chill" ? 0.34 : mode === "work" ? 0.16 : eating ? 0.22 : 0;
      const targetY = sleeping
        ? 0.12
        : driving
          ? Math.sin(now * 0.5) * 0.12
          : p.x * 0.45 * follow + Math.sin(now * 0.5) * 0.04;
      const targetX = sleeping
        ? 0.32
        : lookDown - p.y * 0.28 * follow + Math.sin(now * 0.7) * 0.02;
      head.current.rotation.y += (targetY - head.current.rotation.y) * 0.08;
      head.current.rotation.x += (targetX - head.current.rotation.x) * 0.08;
      const targetZ = sleeping ? 0.22 : Math.sin(now * 0.8) * 0.02;
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
        const bite = (Math.sin(now * 2.1) + 1) / 2; // 0..1
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
      {/* ---------------- SCENE PROPS (behind the body) ---------------- */}
      {sleeping && <Bed />}
      {driving && <Car />}

      {/* ---------------- LOWER BODY: blue jeans ---------------- */}
      <group position={[0, -2.5, 0]}>
        <mesh position={[0, 0.15, 0]} scale={[1, 0.8, 0.95]}>
          <sphereGeometry args={[0.78, 28, 24]} />
          <meshStandardMaterial color={COLORS.jeans} roughness={0.9} />
        </mesh>
        {[-0.36, 0.36].map((x) => (
          <group key={x} position={[x, -0.35, 0]}>
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

      {/* blanket draped over the lap when in bed */}
      {sleeping && (
        <mesh position={[0, -2.55, 0.18]} scale={[1.5, 0.9, 1.25]}>
          <sphereGeometry args={[0.86, 24, 20]} />
          <meshStandardMaterial color={COLORS.blanket} roughness={0.95} />
        </mesh>
      )}

      {/* ---------------- TORSO: black quarter-zip ---------------- */}
      <group position={[0, -1.5, 0]}>
        <mesh position={[0, -0.1, 0]}>
          <sphereGeometry args={[0.95, 32, 28]} />
          <meshStandardMaterial color={COLORS.zip} roughness={0.82} />
        </mesh>
        <mesh position={[0, -0.7, 0]} scale={[1, 0.7, 1]}>
          <sphereGeometry args={[0.8, 28, 24]} />
          <meshStandardMaterial color={COLORS.zip} roughness={0.82} />
        </mesh>

        {/* white crew tee filling the open V */}
        <mesh position={[0, 0.16, 0.82]} scale={[0.46, 0.66, 0.34]}>
          <sphereGeometry args={[0.34, 20, 18]} />
          <meshStandardMaterial color={COLORS.innerTee} roughness={0.9} />
        </mesh>

        {/* raised funnel collar — a soft ring around the neck */}
        <mesh position={[0, 0.46, 0.06]} rotation={[0.18, 0, 0]} scale={[1, 1, 0.92]}>
          <cylinderGeometry args={[0.46, 0.52, 0.42, 28, 1, true]} />
          <meshStandardMaterial
            color={COLORS.collar}
            roughness={0.7}
            side={THREE.DoubleSide}
          />
        </mesh>
        {/* the open notch at the front of the collar (the unzipped V) */}
        <mesh position={[0, 0.34, 0.52]} rotation={[0.5, 0, 0]} scale={[0.42, 0.5, 0.3]}>
          <sphereGeometry args={[0.34, 18, 16]} />
          <meshStandardMaterial color={COLORS.innerTee} roughness={0.9} />
        </mesh>

        {/* zipper placket running up the chest */}
        <mesh position={[0, -0.05, 0.9]} rotation={[0.08, 0, 0]}>
          <boxGeometry args={[0.06, 0.95, 0.04]} />
          <meshStandardMaterial
            color={COLORS.zipperTeeth}
            roughness={0.5}
            metalness={0.3}
          />
        </mesh>
        {/* zipper pull, sitting low (quarter-zip is open) */}
        <mesh position={[0, -0.12, 0.94]}>
          <boxGeometry args={[0.09, 0.14, 0.05]} />
          <meshStandardMaterial
            color={COLORS.zipperPull}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>

        {/* left arm */}
        <group ref={leftArm} position={[-0.92, 0.2, 0.18]} rotation={[0, 0, 0.34]}>
          <mesh position={[0, -0.45, 0]}>
            <capsuleGeometry args={[0.2, 0.72, 6, 16]} />
            <meshStandardMaterial color={COLORS.zipPanel} roughness={0.82} />
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
            <meshStandardMaterial color={COLORS.zipPanel} roughness={0.82} />
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
        <mesh scale={[1, 1.08, 0.96]}>
          <sphereGeometry args={[1, 40, 36]} />
          <meshStandardMaterial color={COLORS.skin} roughness={0.58} />
        </mesh>

        {/* ears */}
        <mesh position={[-0.99, -0.06, 0.02]} scale={[0.45, 0.68, 0.5]}>
          <sphereGeometry args={[0.2, 16, 14]} />
          <meshStandardMaterial color={COLORS.skin} roughness={0.58} />
        </mesh>
        <mesh position={[0.99, -0.06, 0.02]} scale={[0.45, 0.68, 0.5]}>
          <sphereGeometry args={[0.2, 16, 14]} />
          <meshStandardMaterial color={COLORS.skin} roughness={0.58} />
        </mesh>

        <Hair />

        {/* ---- FACE ---- */}
        <group ref={lid}>
          <mesh position={[-0.33, 0.06, 0.9]} scale={[1.15, 1.0, 0.5]}>
            <sphereGeometry args={[0.12, 20, 18]} />
            <meshStandardMaterial color={COLORS.eye} roughness={0.3} />
          </mesh>
          <mesh position={[0.33, 0.06, 0.9]} scale={[1.15, 1.0, 0.5]}>
            <sphereGeometry args={[0.12, 20, 18]} />
            <meshStandardMaterial color={COLORS.eye} roughness={0.3} />
          </mesh>
          <mesh position={[-0.29, 0.1, 0.99]}>
            <sphereGeometry args={[0.028, 10, 10]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.5}
            />
          </mesh>
          <mesh position={[0.37, 0.1, 0.99]}>
            <sphereGeometry args={[0.028, 10, 10]} />
            <meshStandardMaterial
              color="#ffffff"
              emissive="#ffffff"
              emissiveIntensity={0.5}
            />
          </mesh>
        </group>

        {/* brows */}
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
          <sphereGeometry args={[0.1, 16, 14]} />
          <meshStandardMaterial color={COLORS.skinDark} roughness={0.55} />
        </mesh>

        {/* smile */}
        <mesh position={[0, -0.4, 0.9]} rotation={[0, 0, Math.PI]}>
          <torusGeometry args={[0.17, 0.03, 10, 24, Math.PI * 0.8]} />
          <meshStandardMaterial color={COLORS.mouth} roughness={0.5} />
        </mesh>

        {sleeping && <Zzz />}
      </group>

      {/* ---------------- HELD PROPS ---------------- */}
      {mode === "work" && <Laptop />}
      {mode === "chill" && <Phone />}
    </group>
  );
}

/* ----------------------------------------------------------------------------
   HAIR — Korean middle-part perm: volume up top, a clear centre part, fringe
   sweeping down at the temples, ears left visible.
---------------------------------------------------------------------------- */
function Hair() {
  const hair = COLORS.hair;
  // one consistent matte material so the pieces read as a single mass, not
  // a cluster of shiny beads
  const mat = (
    <meshStandardMaterial color={hair} roughness={0.62} metalness={0} />
  );
  return (
    <group>
      {/* main shell: covers crown + back, front hairline kept high so the
          forehead stays open for the part */}
      <mesh position={[0, 0.36, -0.12]} scale={[1.05, 1.02, 1.04]}>
        <sphereGeometry args={[0.99, 36, 32]} />
        {mat}
      </mesh>
      {/* back/nape coverage */}
      <mesh position={[0, 0.0, -0.34]} scale={[1.0, 1.05, 0.92]}>
        <sphereGeometry args={[0.96, 28, 24]} />
        {mat}
      </mesh>

      {/* left side-swept mass, from the centre part down to the temple */}
      <mesh
        position={[-0.4, 0.5, 0.42]}
        rotation={[0.35, 0.2, 0.34]}
        scale={[0.52, 0.46, 0.62]}
      >
        <sphereGeometry args={[1, 28, 26]} />
        {mat}
      </mesh>
      {/* right side-swept mass */}
      <mesh
        position={[0.4, 0.5, 0.42]}
        rotation={[0.35, -0.2, -0.34]}
        scale={[0.52, 0.46, 0.62]}
      >
        <sphereGeometry args={[1, 28, 26]} />
        {mat}
      </mesh>

      {/* a small peak at the very top where the part begins */}
      <mesh position={[0, 0.74, 0.04]} scale={[0.5, 0.34, 0.5]}>
        <sphereGeometry args={[1, 24, 20]} />
        {mat}
      </mesh>

      {/* the centre part: a thin skin-toned sliver dividing the two masses */}
      <mesh position={[0, 0.66, 0.56]} rotation={[0.5, 0, 0]} scale={[0.05, 0.34, 0.18]}>
        <sphereGeometry args={[1, 12, 12]} />
        <meshStandardMaterial color={COLORS.skin} roughness={0.6} />
      </mesh>

      {/* short tapered sideburns, ears stay clear */}
      <mesh position={[-0.84, 0.08, 0.3]} scale={[0.15, 0.3, 0.2]}>
        <sphereGeometry args={[1, 16, 14]} />
        {mat}
      </mesh>
      <mesh position={[0.84, 0.08, 0.3]} scale={[0.15, 0.3, 0.2]}>
        <sphereGeometry args={[1, 16, 14]} />
        {mat}
      </mesh>
    </group>
  );
}

/* ----------------------------------------------------------------------------
   HELD PROPS
---------------------------------------------------------------------------- */
function Laptop() {
  return (
    <group position={[0, -1.4, 1.45]} rotation={[0.1, 3.3, 0]}>
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

/** A bowl of poke, cupped in the left hand. Sits in the leftArm group space. */
function PokeBowl() {
  return (
    <group position={[0, -1.05, 0.22]}>
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
    <group position={[0, -0.92, 0.18]} rotation={[0, 0, -0.5]}>
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

/** A simple bed: a headboard and mattress the figure sits propped against. */
function Bed() {
  return (
    <group position={[0, 0, 0]}>
      {/* headboard behind the back */}
      <mesh position={[0, -1.5, -1.05]}>
        <boxGeometry args={[3.4, 2.6, 0.3]} />
        <meshStandardMaterial color={COLORS.sheetDeep} roughness={0.9} />
      </mesh>
      {/* big pillow propping him up */}
      <mesh position={[0, -0.6, -0.75]} rotation={[0.3, 0, 0]} scale={[1.5, 0.9, 0.6]}>
        <sphereGeometry args={[1, 24, 20]} />
        <meshStandardMaterial color={COLORS.pillow} roughness={0.95} />
      </mesh>
      {/* mattress slab under the lap */}
      <mesh position={[0, -3.5, 0.2]}>
        <boxGeometry args={[3.4, 0.8, 2.6]} />
        <meshStandardMaterial color={COLORS.sheet} roughness={0.92} />
      </mesh>
    </group>
  );
}

/** A little car cockpit: dashboard, windshield frame, wheel, mirror. */
function Car() {
  return (
    <group position={[0, 0, 0]}>
      {/* seat back behind him */}
      <mesh position={[0, -1.6, -1.0]} scale={[1.5, 1.5, 0.6]}>
        <sphereGeometry args={[1, 22, 18]} />
        <meshStandardMaterial color={COLORS.carTrim} roughness={0.85} />
      </mesh>
      {/* dashboard lip across the front, low so it frames without crowding */}
      <mesh position={[0, -3.05, 1.5]} rotation={[0.26, 0, 0]}>
        <boxGeometry args={[3.5, 0.45, 0.8]} />
        <meshStandardMaterial color={COLORS.dash} roughness={0.7} />
      </mesh>
      {/* steering wheel in his hands */}
      <group position={[0, -1.55, 1.4]} rotation={[1.12, 0, 0]}>
        <mesh>
          <torusGeometry args={[0.62, 0.08, 16, 36]} />
          <meshStandardMaterial color={COLORS.carTrim} roughness={0.6} />
        </mesh>
        {[0, (2 * Math.PI) / 3, (4 * Math.PI) / 3].map((a) => (
          <mesh key={a} rotation={[0, 0, a]}>
            <boxGeometry args={[0.56, 0.07, 0.05]} />
            <meshStandardMaterial color={COLORS.dash} roughness={0.6} />
          </mesh>
        ))}
        <mesh>
          <cylinderGeometry args={[0.16, 0.16, 0.09, 20]} />
          <meshStandardMaterial color={COLORS.dash} roughness={0.5} />
        </mesh>
      </group>
      {/* windshield A-pillars */}
      {[-1.7, 1.7].map((x) => (
        <mesh key={x} position={[x, -0.2, 1.5]} rotation={[0, 0, x > 0 ? 0.22 : -0.22]}>
          <boxGeometry args={[0.18, 3.2, 0.18]} />
          <meshStandardMaterial color={COLORS.carTrim} roughness={0.7} />
        </mesh>
      ))}
      {/* windshield header */}
      <mesh position={[0, 1.4, 1.55]}>
        <boxGeometry args={[3.6, 0.22, 0.2]} />
        <meshStandardMaterial color={COLORS.carTrim} roughness={0.7} />
      </mesh>
      {/* rear-view mirror */}
      <mesh position={[0, 1.15, 1.2]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.6, 0.16, 0.08]} />
        <meshStandardMaterial
          color={COLORS.glass}
          roughness={0.2}
          metalness={0.3}
        />
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
