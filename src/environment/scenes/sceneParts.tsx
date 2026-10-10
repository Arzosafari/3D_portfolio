import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { drawGlow, drawGrid, useCanvasTexture } from '../textures';
import { PALETTE, prefersReducedMotion } from '../tokens3d';

/** Rebuilding blocks shared by every page world — one visual universe. */

export function GlowSprite({ position, scale = 4, color = PALETTE.ice, opacity = 0.5 }: {
  position: [number, number, number]; scale?: number; color?: string; opacity?: number;
}) {
  const texture = useCanvasTexture(() => drawGlow(color === PALETTE.ice ? undefined : hexToRgba(color, 0.85)), [color]);
  return (
    <sprite position={position} scale={[scale, scale, 1]}>
      <spriteMaterial map={texture} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </sprite>
  );
}

function hexToRgba(hex: string, alpha: number) {
  const value = hex.replace('#', '');
  const r = parseInt(value.slice(0, 2), 16);
  const g = parseInt(value.slice(2, 4), 16);
  const b = parseInt(value.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** A soft pool of light lying flat on the floor (real mesh, not a billboard). */
export function FloorPool({ position, radius = 1.7, color = PALETTE.ice, opacity = 0.25, materialRef }: {
  position: [number, number, number]; radius?: number; color?: string; opacity?: number;
  materialRef?: { current: THREE.MeshBasicMaterial | null };
}) {
  const texture = useCanvasTexture(() => drawGlow('rgba(255, 255, 255, .95)', 'rgba(255, 255, 255, 0)'), []);
  return (
    <mesh position={position} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[radius, 44]} />
      <meshBasicMaterial ref={materialRef} map={texture} color={color} transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

/** A thin luminous structural beam between two points. */
export function Beam({ from, to, radius = 0.012, color = PALETTE.ice, opacity = 0.35 }: {
  from: [number, number, number]; to: [number, number, number]; radius?: number; color?: string; opacity?: number;
}) {
  const { position, quaternion, length } = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const direction = new THREE.Vector3().subVectors(end, start);
    const len = direction.length();
    const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
    const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize());
    return { position: mid, quaternion: quat, length: len };
  }, [from, to]);
  return (
    <mesh position={position} quaternion={quaternion}>
      <cylinderGeometry args={[radius, radius, length, 5, 1]} />
      <meshBasicMaterial color={color} transparent opacity={opacity} />
    </mesh>
  );
}

/** Navy floor with an architectural grid overlay and two running light strips. */
export function GridFloor({ y = -1.8, width = 30, depth = 60, z = -12, strips = true }: {
  y?: number; width?: number; depth?: number; z?: number; strips?: boolean;
}) {
  const gridTexture = useCanvasTexture(() => drawGrid({ size: 512, divisions: 16 }), []);
  gridTexture.wrapS = THREE.RepeatWrapping;
  gridTexture.wrapT = THREE.RepeatWrapping;
  gridTexture.repeat.set(width / 6, depth / 6);
  return (
    <group position={[0, y, z]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshPhysicalMaterial color="#0A1E3C" metalness={0.35} roughness={0.5} clearcoat={0.2} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.012, 0]}>
        <planeGeometry args={[width, depth]} />
        <meshBasicMaterial map={gridTexture} transparent opacity={0.5} depthWrite={false} />
      </mesh>
      {strips && [-2.4, 2.4].map((x) => (
        <mesh key={x} rotation={[-Math.PI / 2, 0, 0]} position={[x, 0.02, 0]}>
          <planeGeometry args={[0.03, depth * 0.92]} />
          <meshBasicMaterial color={PALETTE.ice} transparent opacity={0.4} />
        </mesh>
      ))}
    </group>
  );
}

/** Slow-drifting dust motes — depth cue and atmosphere, cheap Points cloud. */
export function DustField({ count = 60, bounds = [14, 7, 26], position = [0, 1.4, -8], opacity = 0.45 }: {
  count?: number; bounds?: [number, number, number]; position?: [number, number, number]; opacity?: number;
}) {
  const points = useRef<THREE.Points>(null);
  const reducedMotion = prefersReducedMotion();
  const [bx, by, bz] = bounds;
  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      positions[i * 3] = (Math.random() - 0.5) * bx;
      positions[i * 3 + 1] = (Math.random() - 0.5) * by;
      positions[i * 3 + 2] = (Math.random() - 0.5) * bz;
      seeds[i] = Math.random() * Math.PI * 2;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.userData.seeds = seeds;
    return geo;
    // Primitive deps keep the memo stable across re-renders with inline arrays.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, bx, by, bz]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((state) => {
    if (!points.current || reducedMotion) return;
    const attribute = points.current.geometry.getAttribute('position') as THREE.BufferAttribute;
    const seeds = points.current.geometry.userData.seeds as Float32Array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < attribute.count; i += 1) {
      attribute.setY(i, attribute.getY(i) + Math.sin(t * 0.22 + seeds[i]) * 0.0009);
    }
    attribute.needsUpdate = true;
  });
  return (
    <points ref={points} geometry={geometry} position={position}>
      <pointsMaterial size={0.03} color={PALETTE.silver} transparent opacity={opacity} sizeAttenuation depthWrite={false} />
    </points>
  );
}

/** Shared silver-navy architectural material language. */
export function useArchitectureMaterials() {
  return useMemo(() => ({
    structure: new THREE.MeshPhysicalMaterial({
      color: '#274369', metalness: 0.82, roughness: 0.3, clearcoat: 0.55, clearcoatRoughness: 0.3,
      emissive: new THREE.Color('#0C2140'), emissiveIntensity: 0.14,
    }),
    frame: new THREE.MeshPhysicalMaterial({
      color: PALETTE.offWhite, metalness: 0.35, roughness: 0.38, clearcoat: 0.4,
      emissive: new THREE.Color('#1B3A63'), emissiveIntensity: 0.06,
    }),
    glowLine: new THREE.MeshBasicMaterial({ color: PALETTE.ice, transparent: true, opacity: 0.5 }),
    silverLine: new THREE.MeshBasicMaterial({ color: PALETTE.silver, transparent: true, opacity: 0.22 }),
  }), []);
}
