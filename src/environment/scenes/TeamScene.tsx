import { Float, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import SceneCanvas from '../SceneCanvas';
import SceneLighting from '../SceneLighting';
import ZoneCamera, { type CameraZone } from '../CameraRig';
import { useEnvironment } from '../EnvironmentProvider';
import { drawMonogram, useCanvasTexture } from '../textures';
import { FOG, MOTION, PALETTE, prefersReducedMotion, isNarrow } from '../tokens3d';
import { DustField, FloorPool, GlowSprite, GridFloor, useArchitectureMaterials } from './sceneParts';
import { monogramFor, teamMembers } from '../../data/team';

/**
 * OUR TEAM — "The Atelier". The warmest world in the universe: a calm studio
 * hall under a silver arch, where each real team member is a floating
 * portrait installation. No fabricated faces — the canvases carry monograms
 * drawn from the members' actual names until real portraits exist. Hovering
 * or focusing a profile card in the page tilts that installation toward the
 * visitor and brightens its pool of light.
 */

function teamZones(narrow: boolean): Record<string, CameraZone> {
  const spacing = narrow ? 2.3 : 3.6;
  const zones: Record<string, CameraZone> = {
    overview: narrow
      ? { position: [0, 1.55, 9.2], target: [0, 1.3, -3.2], fov: 50 }
      : { position: [0, 1.55, 6.9], target: [0, 1.3, -3.2], fov: 45 },
  };
  [0, 1, 2].forEach((index) => {
    const x = (index - 1) * spacing;
    zones[`team:${index}`] = narrow
      ? { position: [x * 0.46, 1.5, 3.4], target: [x * 0.8, 1.42, index === 1 ? -3.7 : -2.9], fov: 45 }
      : { position: [x * 0.58, 1.5, 2.4], target: [x, 1.42, index === 1 ? -3.7 : -2.9], fov: 40 };
  });
  return zones;
}

function PortraitInstallation({ index, x, z }: { index: number; x: number; z: number }) {
  // Monograms stay in Latin initials so the installations read as one brand
  // motif in both languages; they are derived from the members' real names.
  const initials = monogramFor(teamMembers.en[index], index);
  const monogram = useCanvasTexture(() => drawMonogram(initials), [initials]);
  const materials = useArchitectureMaterials();
  const { focusRef } = useEnvironment();
  const reducedMotion = prefersReducedMotion();
  const group = useRef<THREE.Group>(null);
  const pool = useRef<THREE.MeshBasicMaterial>(null);
  const plate = useRef<THREE.MeshBasicMaterial>(null);

  useFrame((state, delta) => {
    const active = focusRef.current === `team:${index}`;
    if (group.current && !reducedMotion) {
      group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, active ? 0 : (index - 1) * 0.1, MOTION.objectDamp, delta);
      group.current.position.y = THREE.MathUtils.damp(group.current.position.y, active ? 0.12 : 0, MOTION.objectDamp, delta);
    }
    if (pool.current) {
      const target = active ? 0.5 : 0.2 + Math.sin(state.clock.elapsedTime * 0.7 + index * 2.1) * 0.04;
      pool.current.opacity = THREE.MathUtils.damp(pool.current.opacity, target, MOTION.objectDamp, delta);
    }
    if (plate.current) {
      plate.current.opacity = THREE.MathUtils.damp(plate.current.opacity, active ? 0.95 : 0.45, MOTION.objectDamp, delta);
    }
  });

  return (
    <group position={[x, 0, z]}>
      <group ref={group}>
        <Float speed={reducedMotion ? 0 : 0.3} rotationIntensity={reducedMotion ? 0 : 0.012} floatIntensity={reducedMotion ? 0 : 0.05}>
          <group position={[0, 1.42, 0]}>
            <RoundedBox args={[1.9, 2.42, 0.09]} radius={0.05} smoothness={3} material={materials.frame} />
            <mesh position={[0, 0, 0.055]}>
              <planeGeometry args={[1.68, 2.2]} />
              <meshBasicMaterial map={monogram} />
            </mesh>
            {/* Name plate light */}
            <mesh position={[0, -1.36, 0]}>
              <boxGeometry args={[0.9, 0.04, 0.06]} />
              <meshBasicMaterial ref={plate} color={PALETTE.ice} transparent opacity={0.45} />
            </mesh>
          </group>
        </Float>
      </group>
      {/* Pedestal shadow-block */}
      <mesh position={[0, -1.42, 0.1]}>
        <boxGeometry args={[1.3, 0.5, 0.9]} />
        <meshPhysicalMaterial color="#14304F" metalness={0.6} roughness={0.38} clearcoat={0.35} />
      </mesh>
      <FloorPool position={[0, -1.66, 0.5]} radius={1.7} color="#CFE2FB" opacity={0.2} materialRef={pool} />
    </group>
  );
}

function StudioArch() {
  const materials = useArchitectureMaterials();
  const archGeometry = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 28; i += 1) {
      const angle = (i / 28) * Math.PI;
      points.push(new THREE.Vector3(Math.cos(angle) * 6.4, Math.sin(angle) * 4.4 - 1.8, 0));
    }
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(points, false, 'centripetal', 0.4), 64, 0.07, 7, false);
  }, []);
  useEffect(() => () => archGeometry.dispose(), [archGeometry]);
  return (
    <group position={[0, 0, -5.8]}>
      <mesh geometry={archGeometry} material={materials.structure} />
      {/* Fluted studio wall */}
      {Array.from({ length: 13 }, (_, index) => index - 6).map((column) => (
        <mesh key={column} position={[column * 1.25, -0.4 + Math.abs(column) * -0.08, -0.6]}>
          <boxGeometry args={[0.16, 3.4 - Math.abs(column) * 0.16, 0.16]} />
          <meshPhysicalMaterial color="#122C4E" metalness={0.55} roughness={0.45} />
        </mesh>
      ))}
      <mesh position={[0, 2.9, -0.6]}>
        <boxGeometry args={[15.5, 0.03, 0.2]} />
        <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.3} />
      </mesh>
    </group>
  );
}

function SharedTable() {
  return (
    <group position={[0, -1.55, 0.4]}>
      <mesh>
        <cylinderGeometry args={[1.5, 1.5, 0.07, 40]} />
        <meshPhysicalMaterial color="#1A3A63" metalness={0.72} roughness={0.28} clearcoat={0.5} />
      </mesh>
      <mesh position={[0, -0.14, 0]}>
        <cylinderGeometry args={[0.16, 0.3, 0.5, 16]} />
        <meshPhysicalMaterial color="#122A4C" metalness={0.7} roughness={0.35} />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.36, 1.4, 48]} />
        <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.35} />
      </mesh>
    </group>
  );
}

function TeamSceneInner() {
  const { focus } = useEnvironment();
  const narrow = isNarrow();
  const zones = useMemo(() => teamZones(narrow), [narrow]);
  const spacing = narrow ? 2.3 : 3.6;
  const zoneKey = focus && focus.startsWith('team:') ? focus : 'overview';

  return (
    <>
      <fogExp2 attach="fog" args={[FOG.team.color, FOG.team.density]} />
      <ZoneCamera zones={zones} fallback={zones.overview} zoneKey={zoneKey} parallax={{ x: 0.24, y: 0.12 }} scrollDepth={0.7} />
      <SceneLighting warm exposure={1.12} keyPosition={[0, 7, 5]} />
      <StudioArch />
      {[0, 1, 2].map((index) => (
        <PortraitInstallation key={index} index={index} x={(index - 1) * spacing} z={index === 1 ? -3.7 : -2.9} />
      ))}
      <SharedTable />
      <GridFloor y={-1.72} width={22} depth={18} z={-2.5} strips={false} />
      <GlowSprite position={[0, 3.2, -5.6]} scale={8} opacity={0.14} />
      <DustField count={narrow ? 26 : 56} bounds={[13, 5, 10]} position={[0, 1.5, -2.5]} opacity={0.4} />
    </>
  );
}

export default function TeamScene() {
  return (
    <SceneCanvas position={[0, 1.55, 6.9]} fov={45} far={52}>
      <TeamSceneInner />
    </SceneCanvas>
  );
}
