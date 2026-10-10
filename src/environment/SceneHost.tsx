import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * SceneHost — the gateway into the connected 3D universe.
 *
 * Exactly one WebGL world is mounted at a time, chosen by route, so pages
 * never stack expensive canvases. Scene modules are code-split and lazy.
 * Navigation paints a brief, non-blocking spatial veil (skipped for reduced
 * motion) so worlds hand over with a shared camera language instead of a cut.
 * When WebGL is unavailable a layered navy CSS environment takes its place —
 * all content stays fully readable either way.
 */

const HomeScene = lazy(() => import('./scenes/HomeScene'));
const WorkScene = lazy(() => import('./scenes/WorkScene'));
const CapabilitiesScene = lazy(() => import('./scenes/CapabilitiesScene'));
const LabScene = lazy(() => import('./scenes/LabScene'));
const TeamScene = lazy(() => import('./scenes/TeamScene'));
const AboutScene = lazy(() => import('./scenes/AboutScene'));
const ContactScene = lazy(() => import('./scenes/ContactScene'));
const CorridorScene = lazy(() => import('./scenes/CorridorScene'));

export type SceneKey = 'home' | 'work' | 'capabilities' | 'lab' | 'team' | 'about' | 'contact' | 'corridor' | 'none';

export function sceneKeyForPath(pathname: string): SceneKey {
  if (pathname === '/') return 'home';
  if (pathname.startsWith('/work')) return 'work';
  if (pathname.startsWith('/capabilities')) return 'capabilities';
  if (pathname.startsWith('/ai-lab')) return 'lab';
  if (pathname.startsWith('/our-team')) return 'team';
  if (pathname.startsWith('/about')) return 'about';
  if (pathname.startsWith('/contact')) return 'contact';
  if (pathname.startsWith('/assistant') || pathname.startsWith('/discovery') || pathname.startsWith('/process')) return 'corridor';
  return 'none'; // /admin and unknown routes stay purely functional
}

function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return Boolean(canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

function SceneFor({ sceneKey }: { sceneKey: SceneKey }) {
  switch (sceneKey) {
    case 'home': return <HomeScene />;
    case 'work': return <WorkScene />;
    case 'capabilities': return <CapabilitiesScene />;
    case 'lab': return <LabScene />;
    case 'team': return <TeamScene />;
    case 'about': return <AboutScene />;
    case 'contact': return <ContactScene />;
    case 'corridor': return <CorridorScene />;
    default: return null;
  }
}

export default function SceneHost() {
  const location = useLocation();
  const sceneKey = useMemo(() => sceneKeyForPath(location.pathname), [location.pathname]);
  const webgl = useMemo(supportsWebGL, []);
  const [veil, setVeil] = useState(false);
  const previousPath = useRef<string | null>(null);
  const veilTimer = useRef<number | null>(null);

  // Spatial hand-over veil + provider section refresh on route change.
  useEffect(() => {
    const previous = previousPath.current;
    previousPath.current = location.pathname;
    if (previous === null || previous === location.pathname) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) {
      setVeil(true);
      if (veilTimer.current) window.clearTimeout(veilTimer.current);
      veilTimer.current = window.setTimeout(() => setVeil(false), 640);
    }
    // Let EnvironmentProvider re-measure sections for the new page.
    window.dispatchEvent(new Event('resize'));
    return () => {
      if (veilTimer.current) window.clearTimeout(veilTimer.current);
    };
  }, [location.pathname]);

  // The veil lives outside the stage so it sweeps over content, never blocking it.
  const veilLayer = <div className={`page-veil ${veil ? 'page-veil--active' : ''}`} aria-hidden="true" />;

  if (!webgl || sceneKey === 'none') {
    return (
      <>
        <div className={`environment-stage environment-fallback-css ${sceneKey === 'none' ? 'environment-stage--admin' : ''}`} aria-hidden="true">
          <div className="environment-fallback-layers"><i /><i /><i /><i /></div>
        </div>
        {veilLayer}
      </>
    );
  }

  return (
    <>
      <div className="environment-stage" aria-hidden="true">
        <Suspense fallback={<div className="environment-loading"><div className="environment-vignette" /></div>}>
          <div className="scene-slot" key={sceneKey}>
            <SceneFor sceneKey={sceneKey} />
          </div>
        </Suspense>
        <div className="environment-vignette" />
      </div>
      {veilLayer}
    </>
  );
}
