import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import SceneCanvas from '../SceneCanvas';
import SceneLighting from '../SceneLighting';
import ZoneCamera, { type CameraZone } from '../CameraRig';
import { useEnvironment } from '../EnvironmentProvider';
import { FOG, MOTION, PALETTE, prefersReducedMotion, isNarrow } from '../tokens3d';
import { Beam, DustField, GridFloor } from './sceneParts';

/**
 * ABOUT — "Strata". The studio's story as geological/architectural layers:
 * four luminous slabs stacked in depth, one per narrative beat (entry, story,
 * method, principles). Scrolling lifts the camera through the strata; the
 * layer being read lights its edge and rises slightly. Calm, restrained,
 * composed for reading — the narrative never waits on the animation.
 */

interface Stratum {
  key: string;
  y: number;
  z: number;
  rotation: number;
  width: number;
}

const STRATA: Stratum[] = [
  { key: 'about-entry', y: -0.35, z: -3.6, rotation: 0.02, width: 9.4 },
  { key: 'about-story', y: 1.85, z: -6.6, rotation: -0.03, width: 8.6 },
  { key: 'about-method', y: 4.05, z: -9.6, rotation: 0.025, width: 9.0 },
  { key: 'about-principles', y: 6.25, z: -12.6, rotation: -0.02, width: 8.2 },
];

const ZONES: Record<string, CameraZone> = {
  'about-entry': { position: [0, 0.95, 5.4], target: [0, 0.1, -3.6], fov: 44 },
  'about-story': { position: [0.7, 2.75, 2.3], target: [0, 2.15, -6.6], fov: 43 },
  'about-method': { position: [-0.7, 4.85, -0.7], target: [0, 4.35, -9.6], fov: 42 },
  'about-principles': { position: [0.4, 6.95, -3.7], target: [0, 6.45, -12.6], fov: 42 },
  'about-contact': { position: [0, 8.1, -6.6], target: [0, 6.6, -13.6], fov: 46 },
  // The shared footer carries data-environment="contact"; keep the camera at
  // the top of the strata instead of dropping back to the entry layer.
  contact: { position: [0, 8.1, -6.6], target: [0, 6.6, -13.6], fov: 46 },
};

function Slab({ stratum, index }: { stratum: Stratum; index: number }) {
  const { activeSection } = useEnvironment();
  const reducedMotion = prefersReducedMotion();
  const group = useRef<THREE.Group>(null);
  const edge = useRef<THREE.MeshBasicMaterial>(null);
  const underside = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    const active = activeSection === stratum.key || (index === STRATA.length - 1 && activeSection === 'about-contact');
    if (group.current && !reducedMotion) {
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, stratum.y + (active ? 0.09 : 0), MOTION.objectDamp, delta);
    }
    if (edge.current) {
      const breathe = reducedMotion ? 0 : Math.sin(state.clock.elapsedTime * 0.8 + index * 1.4) * 0.06;
      edge.current.opacity = THREE.MathUtils.damp(edge.current.opacity, active ? 0.9 : 0.32 + breathe, MOTION.objectDamp, delta);
    }
    if (underside.current) {
      underside.current.opacity = THREE.MathUtils.damp(underside.current.opacity, active ? 0.16 : 0.05, MOTION.objectDamp, delta);
    }
  });

  return (
    <group ref={group} position={[0, stratum.y, stratum.z]} rotation={[0, stratum.rotation, 0]}>
      <mesh>
        <boxGeometry args={[stratum.width, 0.22, 4.6]} />
        <meshPhysicalMaterial color="#16304F" metalness={0.68} roughness={0.32} clearcoat={0.45} />
      </mesh>
      {/* Luminous front edge */}
      <mesh position={[0, 0.02, 2.31]}>
        <boxGeometry args={[stratum.width, 0.035, 0.02]} />
        <meshBasicMaterial ref={edge} color={PALETTE.ice} transparent opacity={0.35} />
      </mesh>
      {/* Soft under-glow */}
      <mesh position={[0, -0.14, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[stratum.width * 0.92, 4.2]} />
        <meshBasicMaterial ref={underside} color={PALETTE.ice} transparent opacity={0.05} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      {/* Corner markers */}
      {([-1, 1] as const).map((side) => (
        <mesh key={side} position={[side * (stratum.width / 2 - 0.18), 0.2, 2.1]}>
          <boxGeometry args={[0.05, 0.18, 0.05]} />
          <meshBasicMaterial color={PALETTE.silver} transparent opacity={0.5} />
        </mesh>
      ))}
    </group>
  );
}

function LightColumns() {
  const columns: Array<[number, number]> = [
    [-3.9, -3.6], [3.9, -3.6],
    [-3.4, -6.6], [3.4, -6.6],
    [-3.7, -9.6], [3.7, -9.6],
    [-3.1, -12.6], [3.1, -12.6],
  ];
  return (
    <group>
      {columns.map(([x, z], index) => {
        const fromY = -1.7 + index * 0.4;
        const toY = 7.4 - (3 - (index % 4)) * 0.5;
        return (
          <Beam key={index} from={[x, fromY, z]} to={[x, toY, z]} radius={0.008} color={PALETTE.silver} opacity={0.12} />
        );
      })}
    </group>
  );
}

function AboutSceneInner() {
  const narrow = isNarrow();
  return (
    <>
      <fogExp2 attach="fog" args={[FOG.about.color, FOG.about.density]} />
      <ZoneCamera zones={ZONES} fallback={ZONES['about-entry']} />
      <SceneLighting exposure={1.05} keyPosition={[-4, 9, 4]} />
      <GridFloor y={-1.7} width={24} depth={30} z={-8} strips={false} />
      {STRATA.map((stratum, index) => <Slab key={stratum.key} stratum={stratum} index={index} />)}
      <LightColumns />
      <DustField count={narrow ? 26 : 54} bounds={[12, 9, 16]} position={[0, 3.4, -8]} opacity={0.32} />
    </>
  );
}

export default function AboutScene() {
  return (
    <SceneCanvas position={[0, 0.95, 5.4]} fov={44} far={64}>
      <AboutSceneInner />
    </SceneCanvas>
  );
}
