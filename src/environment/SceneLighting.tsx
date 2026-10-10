import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { useEnvironment } from './EnvironmentProvider';
import { MOTION, PALETTE, prefersReducedMotion } from './tokens3d';

interface SceneLightingProps {
  /** Accent color for the pointer light and fill. */
  accent?: string;
  /** Overall exposure multiplier for the rig. */
  exposure?: number;
  /** Warmer key light for human-centered spaces (Our Team). */
  warm?: boolean;
  /** Position of the key spot. */
  keyPosition?: [number, number, number];
}

/**
 * The studio's standard lighting rig: cool ambient base, white architectural
 * key, navy bounce fill, icy rim, and a soft accent light that follows the
 * pointer. Every page world uses this so lighting language stays consistent.
 */
export default function SceneLighting({ accent = PALETTE.ice, exposure = 1, warm = false, keyPosition = [-5.5, 7.5, 4.5] }: SceneLightingProps) {
  const { pointerRef } = useEnvironment();
  const reducedMotion = prefersReducedMotion();
  const cursorLight = useRef<THREE.PointLight>(null);

  useFrame((_, delta) => {
    if (!cursorLight.current) return;
    const pointer = reducedMotion ? { x: 0, y: 0 } : pointerRef.current;
    cursorLight.current.position.x = THREE.MathUtils.damp(cursorLight.current.position.x, pointer.x * 4.5, MOTION.pointerDamp, delta);
    cursorLight.current.position.y = THREE.MathUtils.damp(cursorLight.current.position.y, 1.6 - pointer.y * 2, MOTION.pointerDamp, delta);
  });

  return (
    <>
      <ambientLight intensity={0.5 * exposure} color="#B9CBE4" />
      <hemisphereLight intensity={0.55 * exposure} color={warm ? '#DCE6F5' : '#C4D6F0'} groundColor={PALETTE.midnight} />
      <spotLight
        position={keyPosition}
        angle={0.62}
        penumbra={0.9}
        distance={46}
        intensity={5.2 * exposure}
        color={warm ? '#F4F1E9' : '#F2F6FC'}
      />
      <directionalLight position={[6, 3.5, -7]} intensity={0.5 * exposure} color={PALETTE.ice} />
      <pointLight ref={cursorLight} position={[0, 1.6, 2]} distance={13} decay={2} intensity={0.5 * exposure} color={accent} />
    </>
  );
}
