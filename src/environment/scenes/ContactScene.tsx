import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import SceneCanvas from '../SceneCanvas';
import SceneLighting from '../SceneLighting';
import ZoneCamera, { type CameraZone } from '../CameraRig';
import { FOG, MOTION, PALETTE, prefersReducedMotion, isNarrow } from '../tokens3d';
import { Beam, DustField, FloorPool, GlowSprite, GridFloor, useArchitectureMaterials } from './sceneParts';

/**
 * CONTACT — "The Portal". The destination of the journey and the calmest
 * world in the universe: a luminous architectural gate standing alone on a
 * mirror-dark floor, flanked by two silver monoliths. Scrolling carries the
 * visitor slowly toward the light where the real contact actions live.
 * Minimal on purpose — attention belongs to the invitation, not the scene.
 */

const ZONES: Record<string, CameraZone> = {
  contact: { position: [0, 1.45, 5.9], target: [0, 1.3, -6.2], fov: 42 },
};

function Portal() {
  const reducedMotion = prefersReducedMotion();
  const ringOuter = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.MeshStandardMaterial>(null);
  const rays = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    if (!reducedMotion) {
      if (ringOuter.current) ringOuter.current.rotation.z = t * 0.06;
      if (rays.current) rays.current.rotation.z = -t * 0.03;
    }
    if (halo.current) {
      const breathe = reducedMotion ? 1.3 : 1.25 + Math.sin(t * 0.9) * 0.22;
      halo.current.emissiveIntensity = THREE.MathUtils.damp(halo.current.emissiveIntensity, breathe, MOTION.objectDamp, delta);
    }
  });

  return (
    <group position={[0, 1.35, -6.2]}>
      {/* Main gate */}
      <mesh>
        <torusGeometry args={[2.35, 0.06, 14, 110]} />
        <meshStandardMaterial ref={halo} color={PALETTE.white} emissive={PALETTE.ice} emissiveIntensity={1.3} metalness={0.35} roughness={0.28} />
      </mesh>
      {/* Slow outer ring */}
      <mesh ref={ringOuter}>
        <torusGeometry args={[2.85, 0.012, 8, 120]} />
        <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.42} />
      </mesh>
      {/* Inner threshold */}
      <mesh>
        <torusGeometry args={[1.86, 0.008, 8, 96]} />
        <meshBasicMaterial color={PALETTE.silver} transparent opacity={0.3} />
      </mesh>
      {/* Light rays converging to the gate */}
      <group ref={rays}>
        {[0, 1, 2, 3, 4, 5].map((index) => {
          const angle = (index / 6) * Math.PI * 2;
          return (
            <Beam
              key={index}
              from={[Math.cos(angle) * 2.05, Math.sin(angle) * 2.05, -0.1]}
              to={[Math.cos(angle) * 1.1, Math.sin(angle) * 1.1, -0.5]}
              radius={0.006}
              opacity={0.24}
            />
          );
        })}
      </group>
      <GlowSprite position={[0, 0, -0.6]} scale={9.5} opacity={0.34} />
      <pointLight distance={13} decay={2} intensity={3.2} color="#DCE9FB" />
    </group>
  );
}

function Monoliths() {
  const materials = useArchitectureMaterials();
  return (
    <group>
      {([-4.6, 4.6] as const).map((x) => (
        <group key={x} position={[x, -1.75, -5.4]}>
          <mesh position={[0, 2.35, 0]} material={materials.structure}>
            <boxGeometry args={[0.5, 4.7, 0.5]} />
          </mesh>
          <mesh position={[0, 4.74, 0]}>
            <boxGeometry args={[0.56, 0.03, 0.56]} />
            <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.55} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ApproachLines() {
  return (
    <group>
      {([-1.7, 1.7] as const).map((x) => (
        <Beam key={x} from={[x * 1.9, -1.74, 5]} to={[x, -1.74, -4.4]} radius={0.01} color={PALETTE.ice} opacity={0.3} />
      ))}
    </group>
  );
}

function ContactSceneInner() {
  const narrow = isNarrow();
  return (
    <>
      <fogExp2 attach="fog" args={[FOG.contact.color, FOG.contact.density]} />
      <ZoneCamera zones={ZONES} fallback={ZONES.contact} parallax={{ x: 0.2, y: 0.1 }} scrollDepth={2.3} dampSpeed={1.5} />
      <SceneLighting exposure={1.0} keyPosition={[0, 8, 3]} />
      <GridFloor y={-1.75} width={24} depth={24} z={-4} strips={false} />
      <Portal />
      <Monoliths />
      <ApproachLines />
      {/* Threshold glow on the floor */}
      <FloorPool position={[0, -1.7, -5.4]} radius={4.6} opacity={0.16} />
      <DustField count={narrow ? 20 : 40} bounds={[11, 4, 12]} position={[0, 1.4, -3]} opacity={0.34} />
    </>
  );
}

export default function ContactScene() {
  return (
    <SceneCanvas position={[0, 1.45, 5.9]} fov={42} far={54}>
      <ContactSceneInner />
    </SceneCanvas>
  );
}
