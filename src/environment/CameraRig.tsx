import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useEnvironment } from './EnvironmentProvider';
import { MOTION, PARALLAX, prefersReducedMotion } from './tokens3d';

export interface CameraZone {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
}

interface ZoneCameraProps {
  /** Camera zones keyed by the active `data-environment` section (or any string the page drives). */
  zones: Record<string, CameraZone>;
  /** Zone used when the active key has no entry. */
  fallback: CameraZone;
  /** Pointer parallax amplitude. */
  parallax?: { x: number; y: number };
  /** Extra scroll-driven depth travel added to camera z (page journeys). */
  scrollDepth?: number;
  /** Damping lambda for position moves. */
  dampSpeed?: number;
  /** Override the zone key instead of reading activeSection (focus-driven pages). */
  zoneKey?: string;
}

/**
 * Shared cinematic camera: damped travel between spatial zones, subtle
 * pointer parallax, optional scroll depth. Reduced motion holds a single
 * composed frame. Never hijacks the browser scroll — it only reads it.
 */
export default function ZoneCamera({ zones, fallback, parallax = PARALLAX, scrollDepth = 0, dampSpeed = MOTION.cameraDamp, zoneKey }: ZoneCameraProps) {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const { activeSection, progressRef, pointerRef } = useEnvironment();
  const reducedMotion = prefersReducedMotion();
  const gaze = useRef(new THREE.Vector3());
  const pos = useRef(new THREE.Vector3(...fallback.position));
  const look = useRef(new THREE.Vector3(...fallback.target));
  const key = zoneKey ?? activeSection;
  const zone = zones[key] ?? fallback;

  useEffect(() => {
    if (reducedMotion) {
      camera.position.set(...fallback.position);
      camera.fov = fallback.fov ?? camera.fov;
      camera.lookAt(new THREE.Vector3(...fallback.target));
      camera.updateProjectionMatrix();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion]);

  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const targetLook = useMemo(() => new THREE.Vector3(), []);

  useFrame((_, delta) => {
    if (reducedMotion) return;
    const pointer = pointerRef.current;
    targetPos.set(
      zone.position[0] + pointer.x * parallax.x,
      zone.position[1] - pointer.y * parallax.y,
      zone.position[2] - progressRef.current * scrollDepth,
    );
    targetLook.set(zone.target[0] + pointer.x * parallax.x * 0.5, zone.target[1], zone.target[2]);
    pos.current.x = THREE.MathUtils.damp(pos.current.x, targetPos.x, dampSpeed, delta);
    pos.current.y = THREE.MathUtils.damp(pos.current.y, targetPos.y, dampSpeed, delta);
    pos.current.z = THREE.MathUtils.damp(pos.current.z, targetPos.z, dampSpeed * 0.8, delta);
    look.current.x = THREE.MathUtils.damp(look.current.x, targetLook.x, dampSpeed, delta);
    look.current.y = THREE.MathUtils.damp(look.current.y, targetLook.y, dampSpeed, delta);
    look.current.z = THREE.MathUtils.damp(look.current.z, targetLook.z, dampSpeed * 0.8, delta);
    camera.position.copy(pos.current);
    gaze.current.copy(look.current);
    camera.lookAt(gaze.current);
    const targetFov = zone.fov ?? camera.fov;
    if (Math.abs(camera.fov - targetFov) > 0.01) {
      camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, MOTION.cameraFovDamp, delta);
      camera.updateProjectionMatrix();
    }
  });
  return null;
}

interface PointerDriftProps {
  children: React.ReactNode;
  /** Rotation amplitude in radians driven by pointer x/y. */
  amplitude?: [number, number];
  dampSpeed?: number;
}

/** Wrapper group that tilts gently toward the pointer — shared spatial motif. */
export function PointerDrift({ children, amplitude = [0.035, 0.02], dampSpeed = 1.2 }: PointerDriftProps) {
  const group = useRef<THREE.Group>(null);
  const { pointerRef } = useEnvironment();
  const reducedMotion = prefersReducedMotion();
  useFrame((_, delta) => {
    if (!group.current || reducedMotion) return;
    const pointer = pointerRef.current;
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, pointer.x * amplitude[0], dampSpeed, delta);
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -pointer.y * amplitude[1], dampSpeed, delta);
  });
  return <group ref={group}>{children}</group>;
}

/**
 * Boot reveal ref: 0→1 over MOTION.bootDuration seconds after mount.
 * Scenes use it to stagger architecture into place, like the corridor scene.
 */
export function useBoot() {
  const boot = useRef(0);
  const startedAt = useRef<number | null>(null);
  const reducedMotion = prefersReducedMotion();
  const advance = (elapsed: number) => {
    if (reducedMotion) {
      boot.current = 1;
    } else {
      if (startedAt.current === null) startedAt.current = elapsed;
      boot.current = Math.min(1, (elapsed - startedAt.current) / MOTION.bootDuration);
    }
    return boot.current;
  };
  return { boot, advance };
}
