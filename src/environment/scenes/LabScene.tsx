import { Instance, Instances } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import SceneCanvas from '../SceneCanvas';
import SceneLighting from '../SceneLighting';
import ZoneCamera, { PointerDrift, type CameraZone } from '../CameraRig';
import { useEnvironment } from '../EnvironmentProvider';
import { drawGrid, useCanvasTexture } from '../textures';
import { FOG, MOTION, PALETTE, clamp01, prefersReducedMotion, isNarrow } from '../tokens3d';
import { DustField, GlowSprite, GridFloor } from './sceneParts';

/**
 * AI LAB — "The Lattice". The darkest, most technical world: a structured
 * field of computational nodes wrapped around a reasoning core, with data
 * pulses travelling real paths through it. The four working lab demos drive
 * the environment: the assistant converges flow into the core, recommendation
 * pushes it outward, personalization sets it orbiting, search sweeps the
 * field. No neon brains, no fake terminals — every behavior maps to a demo
 * that actually runs on the page.
 */

const CORE: [number, number, number] = [0, 1.5, -6.4];

const ZONES: Record<string, CameraZone> = {
  lab: { position: [0, 1.7, 5.6], target: CORE, fov: 44 },
};

type FlowMode = 'assistant' | 'recommendations' | 'personalization' | 'search' | 'idle';

function modeFromFocus(focus: string | null): FlowMode {
  if (!focus || !focus.startsWith('lab:')) return 'idle';
  return focus.slice(4) as FlowMode;
}

function LatticeNodes({ narrow }: { narrow: boolean }) {
  const { grid, edges } = useMemo(() => {
    const [nx, ny, nz] = narrow ? [4, 3, 4] : [6, 4, 5];
    const spacing = 1.55;
    const nodes: THREE.Vector3[] = [];
    const indexAt: Array<number[][]> = [];
    for (let x = 0; x < nx; x += 1) {
      indexAt[x] = [];
      for (let y = 0; y < ny; y += 1) {
        indexAt[x][y] = [];
        for (let z = 0; z < nz; z += 1) {
          indexAt[x][y][z] = nodes.length;
          nodes.push(new THREE.Vector3(
            (x - (nx - 1) / 2) * spacing + (Math.random() - 0.5) * 0.3,
            (y - (ny - 1) / 2) * spacing * 0.82 + 1.5 + (Math.random() - 0.5) * 0.24,
            (z - (nz - 1) / 2) * spacing - 6.2 + (Math.random() - 0.5) * 0.3,
          ));
        }
      }
    }
    const edgePairs: Array<[number, number]> = [];
    for (let x = 0; x < nx; x += 1) {
      for (let y = 0; y < ny; y += 1) {
        for (let z = 0; z < nz; z += 1) {
          const current = indexAt[x][y][z];
          if (x + 1 < nx) edgePairs.push([current, indexAt[x + 1][y][z]]);
          if (y + 1 < ny) edgePairs.push([current, indexAt[x][y + 1][z]]);
          if (z + 1 < nz) edgePairs.push([current, indexAt[x][y][z + 1]]);
        }
      }
    }
    return { grid: nodes, edges: edgePairs };
  }, [narrow]);

  const edgeGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], index) => {
      positions[index * 6] = grid[a].x;
      positions[index * 6 + 1] = grid[a].y;
      positions[index * 6 + 2] = grid[a].z;
      positions[index * 6 + 3] = grid[b].x;
      positions[index * 6 + 4] = grid[b].y;
      positions[index * 6 + 5] = grid[b].z;
    });
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    return geometry;
  }, [edges, grid]);

  useEffect(() => () => edgeGeometry.dispose(), [edgeGeometry]);

  // Instanced nodes keep the lattice to a handful of draw calls.
  const plainNodes = useMemo(() => grid.filter((_, index) => index % 7 !== 0), [grid]);
  const brightNodes = useMemo(() => grid.filter((_, index) => index % 7 === 0), [grid]);

  return (
    <group>
      <Instances limit={plainNodes.length} range={plainNodes.length}>
        <sphereGeometry args={[0.04, 10, 10]} />
        <meshStandardMaterial color="#B9C9E2" emissive={PALETTE.ice} emissiveIntensity={0.18} metalness={0.3} roughness={0.4} />
        {plainNodes.map((node, index) => <Instance key={index} position={node} />)}
      </Instances>
      <Instances limit={brightNodes.length} range={brightNodes.length}>
        <sphereGeometry args={[0.062, 12, 12]} />
        <meshStandardMaterial color={PALETTE.white} emissive={PALETTE.ice} emissiveIntensity={0.85} metalness={0.3} roughness={0.35} />
        {brightNodes.map((node, index) => <Instance key={index} position={node} />)}
      </Instances>
      <lineSegments geometry={edgeGeometry}>
        <lineBasicMaterial color={PALETTE.ice} transparent opacity={0.13} />
      </lineSegments>
    </group>
  );
}



function ReasoningCore() {
  const { focusRef } = useEnvironment();
  const reducedMotion = prefersReducedMotion();
  const shell = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.MeshStandardMaterial>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);

  useFrame((state, delta) => {
    const mode = modeFromFocus(focusRef.current);
    const t = state.clock.elapsedTime;
    if (!reducedMotion) {
      const spin = mode === 'search' ? 0.5 : mode === 'idle' ? 0.14 : 0.3;
      if (shell.current) {
        shell.current.rotation.y += delta * spin;
        shell.current.rotation.x = Math.sin(t * 0.1) * 0.2;
      }
      if (ringA.current) ringA.current.rotation.z = t * (mode === 'personalization' ? 0.65 : 0.22);
      if (ringB.current) ringB.current.rotation.x = t * (mode === 'personalization' ? 0.5 : 0.16);
    }
    if (inner) {
      const target = mode === 'assistant' ? 1.9 : mode === 'search' ? 1.35 : mode === 'idle' ? 0.85 : 1.15;
      if (inner.current) inner.current.emissiveIntensity = THREE.MathUtils.damp(inner.current.emissiveIntensity, target + (reducedMotion ? 0 : Math.sin(t * 2.2) * 0.12), 2.2, delta);
    }
  });

  return (
    <group position={CORE}>
      <mesh ref={shell}>
        <icosahedronGeometry args={[0.95, 1]} />
        <meshBasicMaterial color={PALETTE.silver} wireframe transparent opacity={0.3} />
      </mesh>
      <mesh>
        <sphereGeometry args={[0.42, 28, 28]} />
        <meshStandardMaterial ref={inner} color={PALETTE.white} emissive={PALETTE.ice} emissiveIntensity={0.9} metalness={0.15} roughness={0.3} />
      </mesh>
      <mesh ref={ringA} rotation={[Math.PI / 2.3, 0, 0]}>
        <torusGeometry args={[1.35, 0.01, 8, 90]} />
        <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.5} />
      </mesh>
      <mesh ref={ringB} rotation={[Math.PI / 1.7, 0.5, 0]}>
        <torusGeometry args={[1.6, 0.008, 8, 90]} />
        <meshBasicMaterial color={PALETTE.silver} transparent opacity={0.3} />
      </mesh>
      <GlowSprite position={[0, 0, 0]} scale={5} opacity={0.34} />
      <pointLight distance={11} decay={2} intensity={2.6} color={PALETTE.ice} />
    </group>
  );
}

function DataPulses({ narrow }: { narrow: boolean }) {
  const { focusRef } = useEnvironment();
  const reducedMotion = prefersReducedMotion();
  const pulses = useRef<Array<THREE.Mesh | null>>([]);
  const count = narrow ? 8 : 14;

  const curves = useMemo(() => {
    const core = new THREE.Vector3(...CORE);
    const anchors: Array<[number, number, number]> = [
      [-4.4, 2.6, -2.6], [4.5, 0.7, -3.0], [-3.6, 0.4, -9.6], [4.2, 2.9, -9.4],
      [0.4, 3.6, -1.8], [-0.6, -0.3, -10.6],
    ];
    return anchors.map((anchor) => new THREE.CatmullRomCurve3([
      new THREE.Vector3(...anchor),
      new THREE.Vector3(anchor[0] * 0.55 + (Math.random() - 0.5), anchor[1] * 0.6 + core.y * 0.5, anchor[2] * 0.55 + core.z * 0.45),
      core.clone(),
    ], false, 'centripetal', 0.4));
  }, []);

  const orbit = useMemo(() => {
    const points: THREE.Vector3[] = [];
    for (let i = 0; i <= 48; i += 1) {
      const angle = (i / 48) * Math.PI * 2;
      points.push(new THREE.Vector3(Math.cos(angle) * 2.1, Math.sin(angle * 2) * 0.35, Math.sin(angle) * 2.1).add(new THREE.Vector3(...CORE)));
    }
    return new THREE.CatmullRomCurve3(points, true, 'centripetal', 0.5);
  }, []);

  const phases = useMemo(() => Array.from({ length: count }, (_, index) => ({
    curve: index % curves.length,
    phase: (index / count) % 1,
    speed: 0.05 + (index % 4) * 0.014,
  })), [count, curves.length]);

  useFrame((state, delta) => {
    const mode = modeFromFocus(focusRef.current);
    const t = state.clock.elapsedTime;
    const speedScale = reducedMotion ? 0 : mode === 'search' ? 2.6 : mode === 'assistant' ? 1.7 : mode === 'recommendations' ? 1.2 : 1;
    pulses.current.forEach((pulse, index) => {
      if (!pulse) return;
      const config = phases[index];
      if (reducedMotion) {
        const point = mode === 'personalization' ? orbit.getPoint(config.phase) : curves[config.curve].getPoint(config.phase);
        pulse.position.copy(point);
        return;
      }
      const travel = ((t * config.speed * speedScale + config.phase) % 1);
      let point: THREE.Vector3;
      if (mode === 'personalization') {
        point = orbit.getPoint(travel);
      } else if (mode === 'recommendations') {
        point = curves[config.curve].getPoint(1 - travel);
      } else {
        point = curves[config.curve].getPoint(travel);
      }
      pulse.position.lerp(point, clamp01(delta * 6));
      const scale = mode === 'assistant' ? 1.25 : mode === 'search' ? 0.85 : 1;
      pulse.scale.setScalar(THREE.MathUtils.damp(pulse.scale.x, scale, MOTION.objectDamp, delta));
    });
  });

  return (
    <group>
      {phases.map((config, index) => (
        <mesh key={index} ref={(node) => { pulses.current[index] = node; }} position={curves[config.curve].getPoint(config.phase)}>
          <octahedronGeometry args={[0.055, 0]} />
          <meshStandardMaterial color={PALETTE.white} emissive={PALETTE.ice} emissiveIntensity={1.4} />
        </mesh>
      ))}
    </group>
  );
}

function ComputationalSurfaces() {
  const gridTexture = useCanvasTexture(() => drawGrid({ size: 512, divisions: 12, line: 'rgba(220, 228, 239, .2)', glowLine: 'rgba(140, 184, 245, .34)' }), []);
  gridTexture.wrapS = THREE.RepeatWrapping;
  gridTexture.wrapT = THREE.RepeatWrapping;
  gridTexture.repeat.set(3, 3);
  const reducedMotion = prefersReducedMotion();
  const surface = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (surface.current && !reducedMotion) {
      surface.current.position.y = 4.6 + Math.sin(state.clock.elapsedTime * 0.15) * 0.12;
    }
  });
  return (
    <group>
      <mesh ref={surface} position={[0, 4.6, -6.4]} rotation={[-Math.PI / 2.6, 0, 0]}>
        <planeGeometry args={[15, 15]} />
        <meshBasicMaterial map={gridTexture} transparent opacity={0.12} side={THREE.DoubleSide} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.4, -11.5]} rotation={[0.18, 0, 0]}>
        <planeGeometry args={[18, 7]} />
        <meshBasicMaterial map={gridTexture} transparent opacity={0.07} depthWrite={false} />
      </mesh>
    </group>
  );
}

function LabSceneInner() {
  const narrow = isNarrow();
  return (
    <>
      <fogExp2 attach="fog" args={[FOG.lab.color, FOG.lab.density]} />
      <ZoneCamera zones={ZONES} fallback={ZONES.lab} parallax={{ x: 0.3, y: 0.16 }} scrollDepth={2.6} />
      <SceneLighting exposure={0.82} keyPosition={[4, 7, 3]} />
      <PointerDrift amplitude={[0.02, 0.012]}>
        <LatticeNodes narrow={narrow} />
      </PointerDrift>
      <ReasoningCore />
      <DataPulses narrow={narrow} />
      <ComputationalSurfaces />
      <GridFloor y={-1.9} width={26} depth={24} z={-6} strips />
      <DustField count={narrow ? 22 : 44} bounds={[14, 6, 12]} position={[0, 1.6, -6]} opacity={0.28} />
    </>
  );
}

export default function LabScene() {
  return (
    <SceneCanvas position={[0, 1.7, 5.6]} fov={44} far={56}>
      <LabSceneInner />
    </SceneCanvas>
  );
}
