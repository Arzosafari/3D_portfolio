import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import SceneCanvas from '../SceneCanvas';
import SceneLighting from '../SceneLighting';
import ZoneCamera, { type CameraZone } from '../CameraRig';
import { useEnvironment } from '../EnvironmentProvider';
import { drawInterface, useCanvasTexture } from '../textures';
import { FOG, MOTION, PALETTE, prefersReducedMotion, isNarrow } from '../tokens3d';
import { Beam, DustField, GlowSprite, GridFloor, useArchitectureMaterials } from './sceneParts';
import { capabilities } from '../../data/capabilities';

/**
 * CAPABILITIES — "The System". The studio's four real capabilities stand as
 * monoliths on a shared lattice floor, each crowned by an emblem of what it
 * actually is (an interface plane, a dimensional solid, an orbiting dialogue,
 * adaptive arcs) and tied by light beams to one central hub — the message is
 * a coherent system, not four isolated services. Expanding a capability in
 * the HTML list flies the camera to that node and lights it up.
 */

const NODE_SPOTS: Array<[number, number]> = [
  [-4.3, -1.6],
  [-1.45, -3.3],
  [1.45, -3.3],
  [4.3, -1.6],
];
const NODE_HEIGHTS = [2.5, 3.15, 2.85, 3.4];
const HUB: [number, number, number] = [0, 2.55, -6.8];

function nodeZones(narrow: boolean): Record<string, CameraZone> {
  const zones: Record<string, CameraZone> = {
    overview: narrow
      ? { position: [0, 2.7, 10.2], target: [0, 1.4, -3.4], fov: 52 }
      : { position: [0, 2.5, 7.4], target: [0, 1.25, -3.4], fov: 46 },
  };
  NODE_SPOTS.forEach(([x, z], index) => {
    zones[`cap:${index}`] = narrow
      ? { position: [x * 0.42, 2.0, z + 5.8], target: [x * 0.7, NODE_HEIGHTS[index] * 0.6, z], fov: 46 }
      : { position: [x * 0.5, 1.85, z + 4.4], target: [x, NODE_HEIGHTS[index] * 0.62, z], fov: 40 };
  });
  return zones;
}

function WebsiteEmblem() {
  const texture = useCanvasTexture(() => drawInterface('editorial'), []);
  const reducedMotion = prefersReducedMotion();
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current && !reducedMotion) {
      group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.4;
      group.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });
  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[0.72, 0.9]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
      </mesh>
      <mesh position={[0, 0, -0.02]}>
        <planeGeometry args={[0.8, 0.98]} />
        <meshPhysicalMaterial color={PALETTE.offWhite} metalness={0.3} roughness={0.4} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

function DimensionalEmblem() {
  const reducedMotion = prefersReducedMotion();
  const solid = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (solid.current && !reducedMotion) {
      solid.current.rotation.y = state.clock.elapsedTime * 0.35;
      solid.current.rotation.x = state.clock.elapsedTime * 0.18;
    }
  });
  return (
    <group>
      <mesh ref={solid}>
        <icosahedronGeometry args={[0.42, 0]} />
        <meshPhysicalMaterial color="#CFDDF1" metalness={0.85} roughness={0.22} clearcoat={0.6} flatShading />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.56, 0]} />
        <meshBasicMaterial color={PALETTE.ice} wireframe transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function DialogueEmblem() {
  const reducedMotion = prefersReducedMotion();
  const group = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (group.current && !reducedMotion) group.current.rotation.y = state.clock.elapsedTime * 0.5;
  });
  return (
    <group ref={group}>
      <mesh position={[0.34, 0.1, 0]}>
        <sphereGeometry args={[0.12, 20, 20]} />
        <meshStandardMaterial color={PALETTE.white} emissive={PALETTE.ice} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[-0.34, -0.1, 0]}>
        <sphereGeometry args={[0.09, 20, 20]} />
        <meshStandardMaterial color={PALETTE.silver} emissive={PALETTE.ice} emissiveIntensity={0.4} />
      </mesh>
      <Beam from={[0.34, 0.1, 0]} to={[-0.34, -0.1, 0]} radius={0.006} opacity={0.6} />
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.44, 0.008, 8, 56]} />
        <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

function AdaptiveEmblem() {
  const reducedMotion = prefersReducedMotion();
  const arcs = useRef<Array<THREE.Mesh | null>>([]);
  useFrame((state) => {
    if (reducedMotion) return;
    arcs.current.forEach((arc, index) => {
      if (arc) arc.rotation.z = state.clock.elapsedTime * (0.25 + index * 0.18) * (index % 2 === 0 ? 1 : -1);
    });
  });
  return (
    <group>
      {[0.24, 0.38, 0.52].map((radius, index) => (
        <mesh key={radius} ref={(node) => { arcs.current[index] = node; }} rotation={[0.35 - index * 0.2, index * 0.4, 0]}>
          <torusGeometry args={[radius, 0.012, 8, 48, Math.PI * (1.3 + index * 0.15)]} />
          <meshBasicMaterial color={index === 1 ? PALETTE.white : PALETTE.ice} transparent opacity={0.75 - index * 0.14} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={PALETTE.white} emissive={PALETTE.ice} emissiveIntensity={1} />
      </mesh>
    </group>
  );
}

const EMBLEMS = [WebsiteEmblem, DimensionalEmblem, DialogueEmblem, AdaptiveEmblem];

function CapabilityNode({ index }: { index: number }) {
  const [x, z] = NODE_SPOTS[index];
  const height = NODE_HEIGHTS[index];
  const materials = useArchitectureMaterials();
  const { focusRef } = useEnvironment();
  const reducedMotion = prefersReducedMotion();
  const crown = useRef<THREE.MeshBasicMaterial>(null);
  const beam = useRef<THREE.MeshBasicMaterial>(null);
  const emblem = useRef<THREE.Group>(null);
  const Emblem = EMBLEMS[index];

  useFrame((state, delta) => {
    const active = focusRef.current === `cap:${index}`;
    if (crown.current) {
      const target = active ? 0.95 : 0.4 + Math.sin(state.clock.elapsedTime * 0.9 + index * 1.6) * 0.08;
      crown.current.opacity = THREE.MathUtils.damp(crown.current.opacity, target, MOTION.objectDamp, delta);
    }
    if (beam.current) {
      beam.current.opacity = THREE.MathUtils.damp(beam.current.opacity, active ? 0.7 : 0.24, MOTION.objectDamp, delta);
    }
    if (emblem.current) {
      const lift = active ? 0.16 : 0;
      emblem.current.position.y = reducedMotion ? height + 0.85 : THREE.MathUtils.damp(emblem.current.position.y, height + 0.85 + lift, MOTION.objectDamp, delta);
    }
  });

  return (
    <group position={[x, -1.8, z]}>
      {/* Platform */}
      <mesh position={[0, 0.06, 0]}>
        <cylinderGeometry args={[0.95, 1.05, 0.12, 32]} />
        <meshPhysicalMaterial color="#122A4C" metalness={0.7} roughness={0.32} clearcoat={0.4} />
      </mesh>
      <mesh position={[0, 0.13, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.86, 0.9, 48]} />
        <meshBasicMaterial ref={crown} color={PALETTE.ice} transparent opacity={0.4} />
      </mesh>
      {/* Monolith */}
      <mesh position={[0, height / 2 + 0.12, 0]} material={materials.structure}>
        <boxGeometry args={[0.5, height, 0.5]} />
      </mesh>
      <mesh position={[0, height + 0.14, 0]}>
        <boxGeometry args={[0.56, 0.03, 0.56]} />
        <meshBasicMaterial color={PALETTE.silver} transparent opacity={0.4} />
      </mesh>
      {/* Emblem of the actual discipline */}
      <group ref={emblem} position={[0, height + 0.85, 0]}>
        <Emblem />
      </group>
      {/* Beam to the hub */}
      <group>
        <mesh position={[(HUB[0] - x) / 2, (HUB[1] - (height + 0.3)) / 2 + 0.12, (HUB[2] - z) / 2]} quaternion={beamQuaternion([x, height + 0.3, z], HUB)}>
          <cylinderGeometry args={[0.008, 0.008, distanceBetween([x, height + 0.3, z], HUB), 4, 1]} />
          <meshBasicMaterial ref={beam} color={PALETTE.ice} transparent opacity={0.24} />
        </mesh>
      </group>
    </group>
  );
}

function distanceBetween(a: ArrayLike<number>, b: ArrayLike<number>) {
  return new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]).length();
}

function beamQuaternion(a: ArrayLike<number>, b: ArrayLike<number>) {
  const direction = new THREE.Vector3(b[0] - a[0], b[1] - a[1], b[2] - a[2]).normalize();
  return new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
}

function SystemHub() {
  const reducedMotion = prefersReducedMotion();
  const shell = useRef<THREE.Mesh>(null);
  const ring = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (reducedMotion) return;
    if (shell.current) shell.current.rotation.y = state.clock.elapsedTime * 0.16;
    if (ring.current) ring.current.rotation.z = state.clock.elapsedTime * 0.1;
  });
  return (
    <group position={HUB}>
      <mesh ref={shell}>
        <octahedronGeometry args={[0.62, 0]} />
        <meshBasicMaterial color={PALETTE.silver} wireframe transparent opacity={0.5} />
      </mesh>
      <mesh>
        <octahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color={PALETTE.white} emissive={PALETTE.ice} emissiveIntensity={1.1} metalness={0.3} roughness={0.3} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2.2, 0, 0]}>
        <torusGeometry args={[1.05, 0.01, 8, 80]} />
        <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.4} />
      </mesh>
      <GlowSprite position={[0, 0, 0]} scale={4.2} opacity={0.3} />
      <pointLight distance={9} decay={2} intensity={1.6} color={PALETTE.ice} />
    </group>
  );
}

function LatticeRings() {
  return (
    <group position={[0, -1.77, -3.6]} rotation={[-Math.PI / 2, 0, 0]}>
      {[2.4, 4.2, 6.0].map((radius, index) => (
        <mesh key={radius}>
          <ringGeometry args={[radius - 0.008, radius + 0.008, 96]} />
          <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.14 - index * 0.03} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function CapabilitiesSceneInner() {
  const { focus } = useEnvironment();
  const narrow = isNarrow();
  const zones = useMemo(() => nodeZones(narrow), [narrow]);
  const zoneKey = focus && focus.startsWith('cap:') ? focus : 'overview';

  return (
    <>
      <fogExp2 attach="fog" args={[FOG.capabilities.color, FOG.capabilities.density]} />
      <ZoneCamera zones={zones} fallback={zones.overview} zoneKey={zoneKey} parallax={{ x: 0.26, y: 0.14 }} scrollDepth={0.9} />
      <SceneLighting keyPosition={[3, 8, 5]} />
      <GridFloor y={-1.8} width={26} depth={26} z={-4} strips={false} />
      <LatticeRings />
      {capabilities.map((capability, index) => <CapabilityNode key={capability.number} index={index} />)}
      <SystemHub />
      <DustField count={narrow ? 24 : 48} bounds={[15, 6, 12]} position={[0, 1.6, -3.5]} opacity={0.3} />
    </>
  );
}

export default function CapabilitiesScene() {
  return (
    <SceneCanvas position={[0, 2.5, 7.4]} fov={46} far={56}>
      <CapabilitiesSceneInner />
    </SceneCanvas>
  );
}
