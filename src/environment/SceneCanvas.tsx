import { Canvas } from '@react-three/fiber';
import type { ReactNode } from 'react';
import { isNarrow } from './tokens3d';

interface SceneCanvasProps {
  children: ReactNode;
  position?: [number, number, number];
  fov?: number;
  far?: number;
}

/**
 * Shared render surface for every page world.
 * One canvas is mounted at a time (see SceneHost); pixel ratio is capped and
 * antialiasing/quality adapt to the viewport so mobile keeps the concept
 * without paying the desktop fill cost.
 */
export default function SceneCanvas({ children, position = [0, 1.2, 10], fov = 43, far = 64 }: SceneCanvasProps) {
  const narrow = isNarrow();
  const maxDpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1, narrow ? 1.25 : 1.6);

  return (
    <Canvas
      dpr={maxDpr}
      camera={{ position, fov, near: 0.1, far }}
      gl={{ antialias: !narrow, alpha: true, powerPreference: 'high-performance', stencil: false }}
      frameloop="always"
      performance={{ min: 0.5 }}
    >
      {children}
    </Canvas>
  );
}
