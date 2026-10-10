import { Float, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import SceneCanvas from '../SceneCanvas';
import SceneLighting from '../SceneLighting';
import ZoneCamera, { type CameraZone } from '../CameraRig';
import { useEnvironment } from '../EnvironmentProvider';
import { drawProjectArt, useCanvasTexture } from '../textures';
import { FOG, MOTION, PALETTE, prefersReducedMotion, isNarrow } from '../tokens3d';
import { DustField, FloorPool, GlowSprite, GridFloor, useArchitectureMaterials } from './sceneParts';
import { projects } from '../../data/projects';

/**
 * WORK — "The Exhibition". Each real concept project becomes a spatial
 * installation: a framed artwork floating over a plinth, with its own
 * motif drawn from its subject (editorial drapes for fashion, calm orbits
 * for health, considered shelves for commerce). Hovering or opening a
 * project card in the HTML grid flies the camera to that installation
 * and lifts it into the light — focus keys come from the page UI.
 */

function installationZones(narrow: boolean): Record<string, CameraZone> {
  const spacing = narrow ? 2.7 : 4.9;
  const zones: Record<string, CameraZone> = {
    overview: narrow
      ? { position: [0, 1.55, 11.4], target: [0, 0.95, -2.2], fov: 50 }
      : { position: [0, 1.55, 8.2], target: [0, 0.95, -2.2], fov: 47 },
  };
  projects.forEach((_project, index) => {
    const x = (index - 1) * spacing;
    zones[`work:${index}`] = narrow
      ? { position: [x * 0.5, 1.3, 4.4], target: [x * 0.86, 1.02, -2.2], fov: 46 }
      : { position: [x * 0.66, 1.3, 3.1], target: [x, 1.02, -2.2], fov: 41 };
  });
  return zones;
}

function FashionMotif({ x }: { x: number }) {
  const reducedMotion = prefersReducedMotion();
  const drapes = useRef<Array<THREE.Mesh | null>>([]);
  useFrame((state) => {
    if (reducedMotion) return;
    drapes.current.forEach((drape, index) => {
      if (drape) drape.rotation.z = Math.sin(state.clock.elapsedTime * 0.4 + index * 1.7) * 0.05;
    });
  });
  return (
    <group position={[x, 0, -3.3]}>
      {[0, 1, 2, 3].map((index) => (
        <mesh key={index} ref={(node) => { drapes.current[index] = node; }} position={[-1.35 + index * 0.9, 2.9 - (index % 2) * 0.3, 0]}>
          <planeGeometry args={[0.34, 2.6 - (index % 2) * 0.5]} />
          <meshPhysicalMaterial color="#1C3A63" metalness={0.2} roughness={0.6} transparent opacity={0.75} side={THREE.DoubleSide} />
        </mesh>
      ))}
    </group>
  );
}

function HealthMotif({ x }: { x: number }) {
  const reducedMotion = prefersReducedMotion();
  const rings = useRef<THREE.Group>(null);
  useFrame((state) => {
    if (rings.current && !reducedMotion) {
      rings.current.rotation.y = state.clock.elapsedTime * 0.25;
      rings.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.18) * 0.2 + 0.4;
    }
  });
  return (
    <group ref={rings} position={[x, 2.6, -2.6]}>
      <mesh>
        <torusGeometry args={[0.5, 0.012, 8, 64]} />
        <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.7} />
      </mesh>
      <mesh rotation={[0.9, 0.4, 0]}>
        <torusGeometry args={[0.34, 0.01, 8, 56]} />
        <meshBasicMaterial color={PALETTE.silver} transparent opacity={0.5} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color={PALETTE.white} emissive={PALETTE.ice} emissiveIntensity={1.2} />
      </mesh>
    </group>
  );
}

function CommerceMotif({ x }: { x: number }) {
  return (
    <group position={[x, -1.32, -1.75]}>
      {[-0.42, 0, 0.42].map((offset, index) => (
        <group key={offset}>
          <mesh position={[offset, 0.16 + index * 0.03, 0]}>
            <boxGeometry args={[0.24, 0.24 + (index === 1 ? 0.1 : 0), 0.24]} />
            <meshPhysicalMaterial color="#D5DEEC" metalness={0.25} roughness={0.45} />
          </mesh>
        </group>
      ))}
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[1.5, 0.03, 0.5]} />
        <meshPhysicalMaterial color="#16304F" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  );
}

function Installation({ index, x }: { index: number; x: number }) {
  const project = projects[index];
  const materials = useArchitectureMaterials();
  const texture = useCanvasTexture(() => drawProjectArt(project.art), [project.art]);
  const reducedMotion = prefersReducedMotion();
  const { focusRef } = useEnvironment();
  const group = useRef<THREE.Group>(null);
  const halo = useRef<THREE.MeshBasicMaterial>(null);
  const pool = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    const active = focusRef.current === `work:${index}`;
    if (group.current) {
      const lift = active ? 0.14 : 0;
      group.current.position.y = reducedMotion ? 0 : THREE.MathUtils.damp(group.current.position.y, lift, MOTION.objectDamp, delta);
      group.current.rotation.y = reducedMotion ? 0 : THREE.MathUtils.damp(group.current.rotation.y, active ? 0 : (index - 1) * -0.02, MOTION.objectDamp, delta);
    }
    if (halo.current) {
      const target = active ? 0.85 : 0.28 + Math.sin(state.clock.elapsedTime * 0.8 + index * 2) * 0.05;
      halo.current.opacity = THREE.MathUtils.damp(halo.current.opacity, target, MOTION.objectDamp, delta);
    }
    if (pool.current) {
      pool.current.opacity = THREE.MathUtils.damp(pool.current.opacity, active ? 0.55 : 0.22, MOTION.objectDamp, delta);
    }
  });

  return (
    <group>
      <group ref={group}>
        <Float speed={reducedMotion ? 0 : 0.28} rotationIntensity={reducedMotion ? 0 : 0.015} floatIntensity={reducedMotion ? 0 : 0.05}>
          <group position={[x, 1.15, -2.2]} rotation={[0, (index - 1) * -0.14, 0]}>
            <RoundedBox args={[2.75, 2.1, 0.07]} radius={0.04} smoothness={3} material={materials.frame} />
            <mesh position={[0, 0, 0.045]}>
              <planeGeometry args={[2.55, 1.9]} />
              <meshBasicMaterial map={texture} />
            </mesh>
            {/* Caption bar — the installation's identity plate */}
            <mesh position={[0, -1.22, 0]}>
              <boxGeometry args={[1.2, 0.05, 0.05]} />
              <meshBasicMaterial ref={halo} color={PALETTE.ice} transparent opacity={0.3} />
            </mesh>
          </group>
        </Float>
        {/* Plinth */}
        <mesh position={[x, -1.42, -2.2]}>
          <boxGeometry args={[1.05, 0.72, 0.8]} />
          <meshPhysicalMaterial color="#132C4E" metalness={0.66} roughness={0.34} clearcoat={0.4} />
        </mesh>
        <mesh position={[x, -1.05, -2.2]}>
          <boxGeometry args={[1.12, 0.02, 0.87]} />
          <meshBasicMaterial color={PALETTE.silver} transparent opacity={0.35} />
        </mesh>
      </group>
      {/* Light pool on the floor */}
      <FloorPool position={[x, -1.76, -2.05]} radius={1.9} opacity={0.22} materialRef={pool} />
      {project.art === 'fashion' && <FashionMotif x={x} />}
      {project.art === 'health' && <HealthMotif x={x} />}
      {project.art === 'commerce' && <CommerceMotif x={x} />}
    </group>
  );
}

function GalleryWall() {
  const narrow = isNarrow();
  const pilasters = useMemo(() => {
    const spacing = narrow ? 2.7 : 4.9;
    return projects.map((_, index) => (index - 1) * spacing);
  }, [narrow]);
  return (
    <group position={[0, 0, -4.4]}>
      <mesh position={[0, 1.4, 0]}>
        <planeGeometry args={[narrow ? 12 : 20, 8.5]} />
        <meshPhysicalMaterial color="#0A1C38" metalness={0.3} roughness={0.7} />
      </mesh>
      {pilasters.map((x) => (
        <group key={x}>
          <mesh position={[x, 1.5, 0.06]}>
            <planeGeometry args={[3.3, 6.2]} />
            <meshPhysicalMaterial color="#0E2547" metalness={0.45} roughness={0.55} />
          </mesh>
          <mesh position={[x, 4.62, 0.08]}>
            <boxGeometry args={[3.3, 0.02, 0.03]} />
            <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.35} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function WorkSceneInner() {
  const { focus } = useEnvironment();
  const narrow = isNarrow();
  const zones = useMemo(() => installationZones(narrow), [narrow]);
  const spacing = narrow ? 2.7 : 4.9;
  const zoneKey = focus && focus.startsWith('work:') ? focus : 'overview';

  return (
    <>
      <fogExp2 attach="fog" args={[FOG.work.color, FOG.work.density]} />
      <ZoneCamera zones={zones} fallback={zones.overview} zoneKey={zoneKey} parallax={{ x: 0.24, y: 0.12 }} scrollDepth={0.8} />
      <SceneLighting keyPosition={[0, 8, 6]} exposure={1.05} />
      <GridFloor y={-1.8} width={24} depth={20} z={-3} strips />
      <GalleryWall />
      {projects.map((project, index) => (
        <Installation key={project.number} index={index} x={(index - 1) * spacing} />
      ))}
      <GlowSprite position={[0, 3.9, -3.6]} scale={7} opacity={0.16} />
      <DustField count={narrow ? 26 : 52} bounds={[14, 5, 10]} position={[0, 1.5, -2]} opacity={0.3} />
    </>
  );
}

export default function WorkScene() {
  return (
    <SceneCanvas position={[0, 1.55, 8.2]} fov={47} far={54}>
      <WorkSceneInner />
    </SceneCanvas>
  );
}
