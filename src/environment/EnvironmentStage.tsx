import { Canvas } from '@react-three/fiber';
import EnvironmentScene from './EnvironmentScene';

export default function EnvironmentStage() {
  const mobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 680px)').matches;
  const maxDpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, mobile ? 1 : 1.35) : 1;

  return (
    <div className={`environment-stage ${mobile ? 'environment-stage--mobile' : ''}`} aria-hidden="true">
      <Canvas
        dpr={maxDpr}
        camera={{ position: [0, 1.18, 10], fov: 43, near: 0.1, far: 58 }}
        gl={{ antialias: !mobile, alpha: true, powerPreference: 'high-performance', stencil: false }}
        frameloop="always"
        performance={{ min: 0.55 }}
        fallback={<div className="environment-fallback" />}
      >
        <EnvironmentScene />
      </Canvas>
      <div className="environment-vignette" />
    </div>
  );
}
