import { Float, RoundedBox } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import SceneCanvas from '../SceneCanvas';
import SceneLighting from '../SceneLighting';
import ZoneCamera, { useBoot, type CameraZone } from '../CameraRig';
import { drawInterface, drawProjectArt, useCanvasTexture } from '../textures';
import { clamp01, easeOutCubic, FOG, MOTION, PALETTE, prefersReducedMotion, isNarrow } from '../tokens3d';
import { Beam, DustField, GlowSprite, GridFloor, useArchitectureMaterials } from './sceneParts';
import { projects } from '../../data/projects';

/**
 * HOME — "Meridian Atrium", the studio's central world.
 * A silver-ribbed architectural corridor the camera flies through as the
 * page scrolls: entry → selected work wall → capability monoliths →
 * the intelligence core → the contact portal. Floating interface planes
 * abstract the websites the studio builds; no stock hero object.
 */

function homeZones(narrow: boolean): Record<string, CameraZone> {
  // Portrait viewports pull the camera back and widen the fov so the
  // composition keeps its framing instead of cropping the architecture.
  const wide = narrow ? 1.9 : 0;
  return {
    'home-entry': { position: [0, 1.55, 8.6 + wide], target: [0, 1.15, -1.5], fov: narrow ? 50 : 44 },
    'home-work': { position: [-0.9, 1.4, 2.4 + wide], target: [-0.2, 1.2, -6.2], fov: narrow ? 48 : 42 },
    'home-capabilities': { position: [1.5, 1.8, -4.4 + wide], target: [0.2, 1.1, -12], fov: narrow ? 48 : 42 },
    'home-ai': { position: [-0.4, 2.0, -11.6 + wide], target: [0, 1.45, -18], fov: narrow ? 47 : 41 },
    'home-contact': { position: [0, 1.5, -17.8 + wide], target: [0, 1.3, -24.6], fov: narrow ? 48 : 43 },
    // The site footer sits at the end of every page world; on Home it belongs
    // to the contact gate so the camera never flies backwards.
    contact: { position: [0, 1.5, -17.8 + wide], target: [0, 1.3, -24.6], fov: narrow ? 48 : 43 },
  };
}

function makeRibCurve(width = 7, floor = -1.8, crown = 4.2) {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(-width * 0.5, floor, 0),
    new THREE.Vector3(-width * 0.48, 0.8, 0),
    new THREE.Vector3(-width * 0.36, 2.6, 0),
    new THREE.Vector3(-width * 0.16, crown * 0.94, 0),
    new THREE.Vector3(0, crown, 0),
    new THREE.Vector3(width * 0.16, crown * 0.94, 0),
    new THREE.Vector3(width * 0.36, 2.6, 0),
    new THREE.Vector3(width * 0.48, 0.8, 0),
    new THREE.Vector3(width * 0.5, floor, 0),
  ], false, 'centripetal', 0.4);
}

function RibCorridor() {
  const materials = useArchitectureMaterials();
  const reducedMotion = prefersReducedMotion();
  const narrow = isNarrow();
  const ribs = useRef<Array<THREE.Group | null>>([]);
  const { advance } = useBoot();
  const positions = useMemo(() => (narrow
    ? [3, -1, -5, -9, -13, -17, -21, -25]
    : [3, -0.5, -4, -7.5, -11, -14.5, -18, -21.5, -25]), [narrow]);
  const ribGeometry = useMemo(() => new THREE.TubeGeometry(makeRibCurve(), narrow ? 54 : 88, 0.055, narrow ? 5 : 7, false), [narrow]);
  const innerGeometry = useMemo(() => new THREE.TubeGeometry(makeRibCurve(6.5, -1.78, 3.95), narrow ? 44 : 72, 0.012, 4, false), [narrow]);

  useFrame((state, delta) => {
    const raw = advance(state.clock.elapsedTime);
    const ease = easeOutCubic(raw);
    positions.forEach((_, index) => {
      const rib = ribs.current[index];
      if (!rib) return;
      const local = clamp01((ease - index * 0.05) / (1 - index * 0.05 || 1));
      if (reducedMotion) {
        rib.scale.setScalar(1);
      } else {
        rib.scale.y = THREE.MathUtils.damp(rib.scale.y, 0.3 + local * 0.7, MOTION.objectDamp, delta);
        rib.scale.x = THREE.MathUtils.damp(rib.scale.x, 0.86 + local * 0.14, MOTION.objectDamp, delta);
      }
    });
    materials.structure.emissiveIntensity = 0.08 + ease * 0.1;
  });

  return (
    <group>
      {positions.map((z, index) => (
        <group key={z} ref={(node) => { ribs.current[index] = node; }} position={[0, 0, z]} scale={[1, 0.3, 1]}>
          <mesh geometry={ribGeometry} material={materials.structure} />
          {index % 3 === 1 && <mesh geometry={innerGeometry} material={materials.silverLine} />}
        </group>
      ))}
    </group>
  );
}

function InterfacePanel({ position, rotation, variant, delay = 0 }: {
  position: [number, number, number]; rotation: [number, number, number]; variant: 'editorial' | 'dashboard' | 'store' | 'system'; delay?: number;
}) {
  const texture = useCanvasTexture(() => drawInterface(variant), [variant]);
  const materials = useArchitectureMaterials();
  const reducedMotion = prefersReducedMotion();
  const bar = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state) => {
    if (!bar.current) return;
    bar.current.opacity = reducedMotion ? 0.6 : 0.42 + Math.sin(state.clock.elapsedTime * 1.4 + delay * 6) * 0.2;
  });
  return (
    <Float speed={reducedMotion ? 0 : 0.35} rotationIntensity={reducedMotion ? 0 : 0.05} floatIntensity={reducedMotion ? 0 : 0.14}>
      <group position={position} rotation={rotation}>
        <RoundedBox args={[1.86, 2.32, 0.07]} radius={0.04} smoothness={3} material={materials.frame} />
        <mesh position={[0, 0, 0.045]}>
          <planeGeometry args={[1.68, 2.1]} />
          <meshBasicMaterial map={texture} transparent opacity={0.96} />
        </mesh>
        <mesh position={[-0.55, 1.24, 0.05]}>
          <boxGeometry args={[0.5, 0.03, 0.01]} />
          <meshBasicMaterial ref={bar} color={PALETTE.ice} transparent opacity={0.5} />
        </mesh>
      </group>
    </Float>
  );
}

function WorkWall() {
  const materials = useArchitectureMaterials();
  const reducedMotion = prefersReducedMotion();
  const narrow = isNarrow();
  const artTextures = [
    useCanvasTexture(() => drawProjectArt(projects[0].art), []),
    useCanvasTexture(() => drawProjectArt(projects[1].art), []),
    useCanvasTexture(() => drawProjectArt(projects[2].art), []),
  ];
  const spacing = narrow ? 2.1 : 2.85;
  return (
    <group position={[0, 0, -6.3]}>
      {artTextures.map((texture, index) => {
        const x = (index - 1) * spacing;
        const rotY = (index - 1) * -0.16;
        return (
          <Float key={projects[index].number} speed={reducedMotion ? 0 : 0.25} rotationIntensity={reducedMotion ? 0 : 0.02} floatIntensity={reducedMotion ? 0 : 0.06}>
            <group position={[x, 1.35 + (index === 1 ? 0.22 : 0), 0]} rotation={[0, rotY, 0]}>
              <RoundedBox args={[2.3, 1.78, 0.06]} radius={0.035} smoothness={3} material={materials.frame} />
              <mesh position={[0, 0, 0.04]}>
                <planeGeometry args={[2.12, 1.6]} />
                <meshBasicMaterial map={texture} />
              </mesh>
              <mesh position={[0, -1.06, 0]}>
                <boxGeometry args={[0.5, 0.14, 0.5]} />
                <meshPhysicalMaterial color="#16304F" metalness={0.7} roughness={0.35} />
              </mesh>
              <mesh position={[0, -0.98, 0]}>
                <boxGeometry args={[0.52, 0.012, 0.52]} />
                <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.5} />
              </mesh>
            </group>
          </Float>
        );
      })}
    </group>
  );
}

function CapabilityMonoliths() {
  const materials = useArchitectureMaterials();
  const reducedMotion = prefersReducedMotion();
  const rings = useRef<Array<THREE.Mesh | null>>([]);
  const heights = [2.3, 3.1, 2.7, 3.5];
  const spots: Array<[number, number]> = [[-2.3, -10.9], [2.3, -11.4], [-2.3, -13.5], [2.3, -13.1]];
  useFrame((state) => {
    if (reducedMotion) return;
    rings.current.forEach((ring, index) => {
      if (ring) ring.rotation.z = state.clock.elapsedTime * (0.18 + index * 0.05);
    });
  });
  return (
    <group>
      {spots.map(([x, z], index) => (
        <group key={index} position={[x, -1.8, z]}>
          <mesh position={[0, heights[index] / 2, 0]} material={materials.structure}>
            <boxGeometry args={[0.42, heights[index], 0.42]} />
          </mesh>
          <mesh ref={(node) => { rings.current[index] = node; }} position={[0, heights[index] + 0.24, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <torusGeometry args={[0.34, 0.014, 8, 40]} />
            <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.75} />
          </mesh>
          <mesh position={[0, heights[index] + 0.24, 0]}>
            <octahedronGeometry args={[0.1, 0]} />
            <meshStandardMaterial color={PALETTE.silver} emissive={PALETTE.ice} emissiveIntensity={0.9} metalness={0.4} roughness={0.3} />
          </mesh>
        </group>
      ))}
      <Beam from={[-2.3, 0.74, -10.9]} to={[2.3, 1.54, -11.4]} opacity={0.22} />
      <Beam from={[2.3, 1.54, -11.4]} to={[2.3, 1.94, -13.1]} opacity={0.22} />
      <Beam from={[-2.3, 0.74, -10.9]} to={[-2.3, 1.14, -13.5]} opacity={0.22} />
    </group>
  );
}

function IntelligenceCore() {
  const reducedMotion = prefersReducedMotion();
  const shell = useRef<THREE.Mesh>(null);
  const orbit = useRef<THREE.Mesh>(null);
  const coreMaterial = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state, delta) => {
    if (reducedMotion) return;
    const t = state.clock.elapsedTime;
    if (shell.current) {
      shell.current.rotation.y = t * 0.12;
      shell.current.rotation.x = Math.sin(t * 0.08) * 0.15;
    }
    if (orbit.current) orbit.current.rotation.z = t * 0.22;
    if (coreMaterial.current) {
      coreMaterial.current.emissiveIntensity = THREE.MathUtils.damp(coreMaterial.current.emissiveIntensity, 1.1 + Math.sin(t * 1.6) * 0.35, 2, delta);
    }
  });
  return (
    <group position={[0, 1.55, -18]}>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.15, 1]} />
        <meshBasicMaterial color={PALETTE.silver} wireframe transparent opacity={0.34} />
      </mesh>
      <mesh>
        <icosahedronGeometry args={[0.5, 2]} />
        <meshStandardMaterial ref={coreMaterial} color={PALETTE.white} emissive={PALETTE.ice} emissiveIntensity={1.1} metalness={0.2} roughness={0.25} />
      </mesh>
      <mesh ref={orbit} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1.75, 0.012, 8, 90]} />
        <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.55} />
      </mesh>
      <GlowSprite position={[0, 0, 0]} scale={5.4} opacity={0.4} />
      <pointLight distance={9} decay={2} intensity={2.2} color={PALETTE.ice} />
      {([[1.9, 0.8, 0.6], [-2.0, 0.4, -0.5], [0.6, -1.5, 1.4], [-0.8, 1.7, -1.1]] as Array<[number, number, number]>).map((offset, index) => (
        <group key={index} position={offset}>
          <mesh>
            <octahedronGeometry args={[0.07, 0]} />
            <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.8} />
          </mesh>
          <Beam from={[0, 0, 0]} to={[-offset[0] * 0.72, -offset[1] * 0.72, -offset[2] * 0.72]} radius={0.006} opacity={0.2} />
        </group>
      ))}
    </group>
  );
}

function PortalGate() {
  const reducedMotion = prefersReducedMotion();
  const ring = useRef<THREE.Mesh>(null);
  const halo = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((state, delta) => {
    if (halo.current) {
      const target = reducedMotion ? 0.4 : 0.34 + Math.sin(state.clock.elapsedTime * 0.9) * 0.09;
      halo.current.opacity = THREE.MathUtils.damp(halo.current.opacity, target, 1.6, delta);
    }
    if (ring.current && !reducedMotion) ring.current.rotation.z = state.clock.elapsedTime * 0.05;
  });
  return (
    <group position={[0, 1.35, -24.6]}>
      <mesh>
        <torusGeometry args={[2.15, 0.055, 12, 96]} />
        <meshStandardMaterial color={PALETTE.white} emissive={PALETTE.ice} emissiveIntensity={1.5} metalness={0.3} roughness={0.3} />
      </mesh>
      <mesh ref={ring}>
        <torusGeometry args={[2.6, 0.012, 8, 96]} />
        <meshBasicMaterial ref={halo} color={PALETTE.ice} transparent opacity={0.4} />
      </mesh>
      <GlowSprite position={[0, 0, -0.4]} scale={8} opacity={0.32} />
      <pointLight distance={10} decay={2} intensity={2.4} color="#CFE2FB" />
    </group>
  );
}

function CeilingBars() {
  const bars = [-6.3, -12.2, -18, -24.4];
  return (
    <group>
      {bars.map((z) => (
        <group key={z} position={[0, 3.86, z]}>
          <mesh>
            <boxGeometry args={[3.4, 0.02, 0.09]} />
            <meshBasicMaterial color={PALETTE.offWhite} transparent opacity={0.75} />
          </mesh>
          <mesh position={[0, -0.05, 0]}>
            <boxGeometry args={[3.4, 0.05, 0.14]} />
            <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.14} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function FloatingForms() {
  const reducedMotion = prefersReducedMotion();
  return (
    <group>
      <Float speed={reducedMotion ? 0 : 0.3} rotationIntensity={reducedMotion ? 0 : 0.25} floatIntensity={reducedMotion ? 0 : 0.4}>
        <mesh position={[-3.3, 2.5, -8.8]}>
          <octahedronGeometry args={[0.42, 0]} />
          <meshBasicMaterial color={PALETTE.silver} wireframe transparent opacity={0.4} />
        </mesh>
      </Float>
      <Float speed={reducedMotion ? 0 : 0.24} rotationIntensity={reducedMotion ? 0 : 0.2} floatIntensity={reducedMotion ? 0 : 0.35}>
        <mesh position={[3.4, 2.2, -15.6]} rotation={[0.4, 0.2, 0]}>
          <torusGeometry args={[0.38, 0.02, 8, 48]} />
          <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.5} />
        </mesh>
      </Float>
      <Float speed={reducedMotion ? 0 : 0.2} rotationIntensity={reducedMotion ? 0 : 0.15} floatIntensity={reducedMotion ? 0 : 0.3}>
        <mesh position={[2.9, 3.0, -21.4]}>
          <tetrahedronGeometry args={[0.34, 0]} />
          <meshBasicMaterial color={PALETTE.silver} wireframe transparent opacity={0.34} />
        </mesh>
      </Float>
    </group>
  );
}

function HomeSceneInner() {
  const narrow = isNarrow();
  const zones = useMemo(() => homeZones(narrow), [narrow]);
  return (
    <>
      <fogExp2 attach="fog" args={[FOG.home.color, FOG.home.density]} />
      <ZoneCamera zones={zones} fallback={zones['home-entry']} />
      <SceneLighting keyPosition={[-4, 7, 6]} />
      <RibCorridor />
      <GridFloor y={-1.82} width={26} depth={44} z={-11} />
      <InterfacePanel position={[-3.1, 1.5, -0.6]} rotation={[0.02, 0.34, -0.02]} variant="editorial" />
      <InterfacePanel position={[3.25, 1.25, -2.7]} rotation={[-0.02, -0.3, 0.03]} variant="system" delay={0.4} />
      <WorkWall />
      <CapabilityMonoliths />
      <IntelligenceCore />
      <PortalGate />
      <CeilingBars />
      <FloatingForms />
      <DustField count={narrow ? 34 : 70} bounds={[15, 6, 34]} position={[0, 1.6, -11]} opacity={0.35} />
    </>
  );
}

export default function HomeScene() {
  return (
    <SceneCanvas position={[0, 1.55, 8.6]} fov={44} far={70}>
      <HomeSceneInner />
    </SceneCanvas>
  );
}
