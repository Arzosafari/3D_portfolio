import { Edges, Float, Instance, Instances, RoundedBox, Trail } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useEnvironment } from './EnvironmentProvider';

type FlowCurve = THREE.CatmullRomCurve3;
const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

function makeVaultCurve(width = 6.25, floor = -3.05, crown = 3.15) {
  return new THREE.CatmullRomCurve3([
    new THREE.Vector3(-width * .61, floor, 0), new THREE.Vector3(-width * .59, -.65, 0),
    new THREE.Vector3(-width * .49, 1.75, 0), new THREE.Vector3(-width * .27, crown * .9, 0),
    new THREE.Vector3(0, crown, 0), new THREE.Vector3(width * .27, crown * .9, 0),
    new THREE.Vector3(width * .49, 1.75, 0), new THREE.Vector3(width * .59, -.65, 0),
    new THREE.Vector3(width * .61, floor, 0),
  ], false, 'centripetal', .38);
}

function makeFlowCurve(points: Array<[number, number, number]>): FlowCurve {
  return new THREE.CatmullRomCurve3(points.map(([x, y, z]) => new THREE.Vector3(x, y, z)), false, 'centripetal', .28);
}

function EnvironmentCamera() {
  const camera = useThree((state) => state.camera) as THREE.PerspectiveCamera;
  const { progressRef, pointerRef, activeSection, aiState } = useEnvironment();
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const easedProgress = useRef(0);
  const easedX = useRef(0);
  const easedY = useRef(1.18);
  const gaze = useRef(new THREE.Vector3());
  useFrame((_, delta) => {
    if (reducedMotion) {
      camera.position.set(0, 1.18, 10);
      camera.fov = 43;
      camera.lookAt(0, .72, 3.8);
      camera.updateProjectionMatrix();
      return;
    }
    const progress = progressRef.current;
    const pointer = pointerRef.current;
    easedProgress.current = THREE.MathUtils.damp(easedProgress.current, progress, 2.2, delta);
    const sectionOffset = activeSection === 'discovery' ? -.16 : activeSection === 'contact' ? .2 : activeSection === 'ai-lab' ? .08 : 0;
    const desiredX = Math.sin(easedProgress.current * Math.PI * 1.05) * .85 + pointer.x * .34 + sectionOffset;
    const sectionLift = activeSection === 'assistant' ? .1 : activeSection === 'ai-lab' ? .14 : activeSection === 'discovery' ? -.04 : 0;
    const desiredY = 1.18 - pointer.y * .19 + sectionLift;
    const desiredZ = 10 - easedProgress.current * 20.5 - (aiState === 'thinking' ? .42 : 0);
    easedX.current = THREE.MathUtils.damp(easedX.current, desiredX, 2.1, delta);
    easedY.current = THREE.MathUtils.damp(easedY.current, desiredY, 2.1, delta);
    camera.position.x = THREE.MathUtils.damp(camera.position.x, easedX.current, 2.25, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, easedY.current, 2.1, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, desiredZ, 1.45, delta);
    const lookDepth = activeSection === 'contact' ? 5.8 : activeSection === 'ai-lab' ? 6.6 : activeSection === 'assistant' ? 6.45 : 6.2;
    gaze.current.set(Math.sin(easedProgress.current * Math.PI * 1.05) * .35 + pointer.x * .5, .72 - pointer.y * .12, camera.position.z - lookDepth);
    camera.lookAt(gaze.current);
    const targetFov = activeSection === 'contact' ? 47 : activeSection === 'ai-lab' ? 40.5 : activeSection === 'assistant' ? 42.1 : activeSection === 'discovery' ? 42.5 : 43;
    camera.fov = THREE.MathUtils.damp(camera.fov, targetFov, 1.65, delta);
    camera.updateProjectionMatrix();
  });
  return null;
}

function EnvironmentLighting({ accent, bootRef, activityRef }: {
  accent: THREE.Color;
  bootRef: { current: number };
  activityRef: { current: number };
}) {
  const { pointerRef } = useEnvironment();
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const cursorLight = useRef<THREE.PointLight>(null);
  const keyLight = useRef<THREE.SpotLight>(null);
  const fillLight = useRef<THREE.PointLight>(null);
  useFrame((_, delta) => {
    const pointer = reducedMotion ? { x: 0, y: 0 } : pointerRef.current;
    const boot = bootRef.current;
    const activity = activityRef.current;
    if (cursorLight.current) {
      cursorLight.current.position.x = THREE.MathUtils.damp(cursorLight.current.position.x, pointer.x * 4.5, 2.1, delta);
      cursorLight.current.position.y = THREE.MathUtils.damp(cursorLight.current.position.y, 1.5 - pointer.y * 2.2, 2.1, delta);
      cursorLight.current.intensity = .14 + boot * (.38 + activity * .45);
      cursorLight.current.color.copy(accent);
    }
    if (keyLight.current) keyLight.current.intensity = THREE.MathUtils.damp(keyLight.current.intensity, .12 + boot * (5.4 + activity * 2.3), 1.25, delta);
    if (fillLight.current) {
      fillLight.current.intensity = THREE.MathUtils.damp(fillLight.current.intensity, .18 + boot * (.75 + activity * .55), 1.25, delta);
      fillLight.current.color.copy(accent);
    }
  });
  return (
    <>
      <ambientLight intensity={.17} color="#B9CBE4" />
      <hemisphereLight intensity={.3} color="#C4D6F0" groundColor="#07152F" />
      <spotLight ref={keyLight} position={[-5.5, 7, 4]} angle={.55} penumbra={.88} distance={40} intensity={0} color="#F2F6FC" />
      <pointLight ref={fillLight} position={[5.2, 1.4, -8]} distance={24} decay={2} intensity={0} color="#3E6DB5" />
      <pointLight ref={cursorLight} position={[0, 1, 2]} distance={12} decay={2} intensity={0} color={accent} />
      <directionalLight position={[0, 4, -11]} intensity={.42} color="#8CB8F5" />
    </>
  );
}

function InformationPlane({ position, rotation, accent, reverse = false, reducedMotion }: {
  position: [number, number, number]; rotation: [number, number, number]; accent: THREE.Color; reverse?: boolean; reducedMotion: boolean;
}) {
  const accentBar = useRef<THREE.MeshBasicMaterial>(null);
  useFrame((_, delta) => { if (accentBar.current) accentBar.current.color.lerp(accent, 1 - Math.exp(-delta * 1.4)); });
  return (
    <Float speed={reducedMotion ? 0 : .2} rotationIntensity={reducedMotion ? 0 : .009} floatIntensity={reducedMotion ? 0 : .027}>
      <group position={position} rotation={rotation}>
        <RoundedBox args={[1.72, 2.25, .065]} radius={.045} smoothness={3}>
          <meshPhysicalMaterial color="#1C3A63" metalness={.3} roughness={.2} transmission={.32} thickness={.12} transparent opacity={.47} clearcoat={.86} side={THREE.DoubleSide} />
          <Edges color={reverse ? '#8CB8F5' : '#DCE4EF'} threshold={15} />
        </RoundedBox>
        <mesh position={[-.46, .72, .046]}>
          <boxGeometry args={[.48, .024, .008]} />
          <meshBasicMaterial ref={accentBar} color={accent} transparent opacity={.82} />
        </mesh>
        <mesh position={[-.44, .51, .047]}><boxGeometry args={[.58, .012, .008]} /><meshBasicMaterial color="#DCE4EF" transparent opacity={.31} /></mesh>
        {[0, 1, 2].map((line) => (
          <mesh key={line} position={[-.08, .08 - line * .29, .048]}>
            <boxGeometry args={[1.08 - line * .12, .012, .008]} />
            <meshBasicMaterial color="#DCE4EF" transparent opacity={.25 - line * .02} />
          </mesh>
        ))}
        <mesh position={[.45, -.69, .049]}><boxGeometry args={[.4, .017, .009]} /><meshBasicMaterial color="#AFC2DC" transparent opacity={.46} /></mesh>
      </group>
    </Float>
  );
}

function DataPulse({ curve, phase, accent, thinking, reducedMotion }: { curve: FlowCurve; phase: number; accent: THREE.Color; thinking: boolean; reducedMotion: boolean }) {
  const pulse = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshStandardMaterial>(null);
  useFrame((state, delta) => {
    if (!pulse.current || !material.current) return;
    const rate = thinking ? .17 : .048;
    pulse.current.position.copy(curve.getPoint(reducedMotion ? phase : (state.clock.elapsedTime * rate + phase) % 1));
    pulse.current.scale.setScalar(reducedMotion ? .9 : thinking ? 1.2 : .85);
    material.current.color.lerp(accent, 1 - Math.exp(-delta * 1.5));
    material.current.emissive.lerp(accent, 1 - Math.exp(-delta * 1.5));
    material.current.emissiveIntensity = THREE.MathUtils.damp(material.current.emissiveIntensity, thinking ? 1 : .45, 1.7, delta);
  });
  return (
    <Trail width={.045} length={4} color={accent} attenuation={(value) => value * value}>
      <mesh ref={pulse}>
        <octahedronGeometry args={[.052, 0]} />
        <meshStandardMaterial ref={material} color={accent} emissive={accent} emissiveIntensity={.42} metalness={.22} roughness={.26} />
      </mesh>
    </Trail>
  );
}

function SystemMarkers({ accent }: { accent: THREE.Color }) {
  const { activeSection, aiState } = useEnvironment();
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const anchors: Array<[number, number, number]> = [
    [-2.48, 1.7, 1.6], [2.55, 2.08, -1.15], [-3.02, -.1, -3.4], [3.02, .52, -4.05],
    [-2.08, 2.48, -7.8], [2.16, 2.55, -8.4], [-3.06, -.62, -11.5], [3.1, -.36, -13.1],
    [-1.05, 2.82, -15.15], [1.1, 2.86, -17.35], [-2.86, .42, -18.1], [2.85, .6, -19.15],
  ];
  useFrame((_, delta) => {
    if (!material.current) return;
    const target = aiState === 'thinking' || aiState === 'discovery' || activeSection === 'discovery' || activeSection === 'ai-lab' ? .72 : .28;
    material.current.opacity = THREE.MathUtils.damp(material.current.opacity, target, 1.8, delta);
    material.current.color.lerp(accent, 1 - Math.exp(-delta * 1.4));
  });
  return (
    <Instances limit={anchors.length} range={anchors.length}>
      <octahedronGeometry args={[.024, 0]} />
      <meshBasicMaterial ref={material} color={accent} transparent opacity={.3} />
      {anchors.map((position, index) => <Instance key={index} position={position} scale={index % 4 === 0 ? 1.3 : 1} />)}
    </Instances>
  );
}

function DataNetwork({ accent, isThinking, section, reducedMotion }: { accent: THREE.Color; isThinking: boolean; section: string; reducedMotion: boolean }) {
  const { aiState } = useEnvironment();
  const paths = useMemo(() => [
    makeFlowCurve([[-2.85, -1.48, 4], [-3.35, -.34, 0], [-2.76, 1.2, -3.7], [-1.1, 1.58, -7.7], [.42, .74, -11.5], [2.38, .16, -17.5]]),
    makeFlowCurve([[2.95, .82, 1.4], [2.7, -.62, -2.5], [1.9, -1.08, -6.5], [.81, -.3, -10.2], [-.36, 1.42, -14.45], [-2.2, 1.08, -19.15]]),
    makeFlowCurve([[-1.9, 2.15, 2.3], [-1.4, 2.54, -2.2], [0, 2.18, -6.3], [1.45, 1.58, -10.2], [1.93, .12, -15.6], [.7, -.65, -20.1]]),
  ], []);
  const geometries = useMemo(() => paths.map((path) => new THREE.TubeGeometry(path, 120, .009, 4, false)), [paths]);
  const materials = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
  const color = accent;
  const opacity = isThinking ? .55 : aiState === 'responding' || aiState === 'success' ? .41 : section === 'ai-lab' ? .35 : section === 'discovery' ? .3 : section === 'assistant' ? .27 : section === 'contact' ? .23 : .18;
  useFrame((_, delta) => materials.current.forEach((material) => {
    if (!material) return;
    material.color.lerp(color, 1 - Math.exp(-delta * 1.35));
    material.opacity = THREE.MathUtils.damp(material.opacity, opacity, 1.7, delta);
  }));
  return (
    <group>
      {geometries.map((geometry, index) => (
        <mesh key={`path-${index}`} geometry={geometry}>
          <meshBasicMaterial ref={(material) => { materials.current[index] = material; }} color={color} transparent opacity={opacity} />
        </mesh>
      ))}
      {paths.map((path, index) => <DataPulse key={`pulse-${index}`} curve={path} phase={index / paths.length} accent={color} thinking={isThinking} reducedMotion={reducedMotion} />)}
      <SystemMarkers accent={color} />
    </group>
  );
}

function ScenePlatforms({ accent, reducedMotion }: { accent: THREE.Color; reducedMotion: boolean }) {
  const guideLines = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
  useFrame((_, delta) => guideLines.current.forEach((material) => {
    if (material) material.color.lerp(accent, 1 - Math.exp(-delta * 1.4));
  }));
  return (
    <group>
      <Float speed={reducedMotion ? 0 : .09} rotationIntensity={reducedMotion ? 0 : .005} floatIntensity={reducedMotion ? 0 : .015}>
        <group position={[-3.25, -2.55, -4.1]} rotation={[0, .06, 0]}>
          <RoundedBox args={[2.55, .19, 2.85]} radius={.05} smoothness={3}><meshPhysicalMaterial color="#122C4E" metalness={.67} roughness={.36} clearcoat={.3} /></RoundedBox>
          <mesh position={[0, .105, -.7]}><boxGeometry args={[1.4, .012, .015]} /><meshBasicMaterial ref={(material) => { guideLines.current[0] = material; }} color={accent} transparent opacity={.34} /></mesh>
        </group>
      </Float>
      <Float speed={reducedMotion ? 0 : .09} rotationIntensity={reducedMotion ? 0 : .005} floatIntensity={reducedMotion ? 0 : .014}>
        <group position={[3.24, -2.47, -10.6]} rotation={[0, -.07, 0]}>
          <RoundedBox args={[2.3, .19, 2.45]} radius={.05} smoothness={3}><meshPhysicalMaterial color="#122C4E" metalness={.67} roughness={.36} clearcoat={.3} /></RoundedBox>
          <mesh position={[0, .105, .52]}><boxGeometry args={[1.2, .012, .015]} /><meshBasicMaterial ref={(material) => { guideLines.current[1] = material; }} color={accent} transparent opacity={.31} /></mesh>
        </group>
      </Float>
    </group>
  );
}

function GroundAperture({ accent, reducedMotion }: { accent: THREE.Color; reducedMotion: boolean }) {
  const ring = useRef<THREE.Mesh>(null);
  const material = useRef<THREE.MeshBasicMaterial>(null);
  const { activeSection, aiState } = useEnvironment();
  useFrame((state, delta) => {
    if (ring.current && !reducedMotion) ring.current.rotation.z = Math.sin(state.clock.elapsedTime * .095) * .012;
    if (material.current) {
      const target = activeSection === 'contact' ? .08 : aiState === 'success' ? .27 : .14;
      material.current.opacity = THREE.MathUtils.damp(material.current.opacity, target, 1.4, delta);
      material.current.color.copy(accent);
    }
  });
  return <group position={[0, -3.095, -12]} rotation={[-Math.PI / 2, 0, 0]}>
    <mesh ref={ring}><ringGeometry args={[1.8, 1.816, 112]} /><meshBasicMaterial ref={material} color={accent} transparent opacity={.13} side={THREE.DoubleSide} /></mesh>
  </group>;
}

function FloorWayfinding({ accent }: { accent: THREE.Color }) {
  const paths = useMemo(() => [
    makeFlowCurve([[-2.6, -3.08, 8], [-2.65, -3.08, 3], [-2.3, -3.08, -1], [-1.15, -3.08, -6], [-.65, -3.08, -12], [-.42, -3.08, -19]]),
    makeFlowCurve([[2.6, -3.08, 4], [2.45, -3.08, -1], [1.85, -3.08, -5], [1.05, -3.08, -9], [.48, -3.08, -14], [.45, -3.08, -21]]),
  ], []);
  const geometries = useMemo(() => paths.map((path) => new THREE.TubeGeometry(path, 96, .012, 4, false)), [paths]);
  const materials = useRef<Array<THREE.MeshBasicMaterial | null>>([]);
  const { activeSection, aiState } = useEnvironment();
  useFrame((_, delta) => {
    const target = aiState === 'thinking' ? .44 : aiState === 'success' ? .36 : activeSection === 'ai-lab' ? .34 : activeSection === 'discovery' ? .28 : activeSection === 'assistant' ? .24 : .15;
    materials.current.forEach((material) => {
      if (!material) return;
      material.color.copy(accent);
      material.opacity = THREE.MathUtils.damp(material.opacity, target, 1.55, delta);
    });
  });
  return <group>{geometries.map((geometry, index) => <mesh key={index} geometry={geometry}>
    <meshBasicMaterial ref={(material) => { materials.current[index] = material; }} color={accent} transparent opacity={.15} />
  </mesh>)}</group>;
}

export default function EnvironmentScene() {
  const { activeSection, aiState, profile, progressRef, pointerRef } = useEnvironment();
  const world = useRef<THREE.Group>(null);
  const architecture = useRef<THREE.Group>(null);
  const panels = useRef<THREE.Group>(null);
  const backlight = useRef<THREE.PointLight>(null);
  const vaults = useRef<Array<THREE.Group | null>>([]);
  const activity = useRef(0);
  const bootStartedAt = useRef<number | null>(null);
  const boot = useRef(0);
  const accent = useRef(new THREE.Color('#8CB8F5'));
  const architectureMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#274369', metalness: .76, roughness: .32, clearcoat: .54, clearcoatRoughness: .3, emissive: '#0C2140', emissiveIntensity: .1 }), []);
  const detailMaterial = useMemo(() => new THREE.MeshBasicMaterial({ color: '#8CB8F5', transparent: true, opacity: .14 }), []);
  const floorMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({ color: '#0A1E3C', metalness: .28, roughness: .59, clearcoat: .18 }), []);
  const family = profile.industry?.toLowerCase() ?? '';
  const architectureTint = useMemo(() => new THREE.Color(family.includes('fashion') ? '#2C4A72' : family.includes('health') ? '#1F4257' : '#274369'), [family]);
  const goal = profile.goal?.toLowerCase() ?? '';
  const style = profile.style?.toLowerCase() ?? '';
  const industryAccent = family.includes('fashion') ? '#A7C4EA' : family.includes('health') ? '#8FC7E8' : family.includes('restaurant') ? '#D9C4A9' : family.includes('technology') ? '#8CB8F5' : family.includes('professional') ? '#B9C6DA' : '#8CB8F5';
  const goalAccent = goal.includes('sales') ? '#8CB8F5' : goal.includes('lead') ? '#9FB6D8' : goal.includes('brand') ? '#A9BEE4' : goal.includes('customer') ? '#93C4DE' : '#A6BEE8';
  const styleAccent = style.includes('premium') ? '#D8C9B4' : style.includes('minimal') ? '#B9C6DA' : style.includes('interactive') ? '#8CB8F5' : style.includes('immersive') ? '#9CC0F2' : '#8CB8F5';
  const targetAccent = useMemo(() => {
    const blended = new THREE.Color(industryAccent);
    if (goal) blended.lerp(new THREE.Color(goalAccent), .12);
    if (style) blended.lerp(new THREE.Color(styleAccent), .2);
    return blended;
  }, [industryAccent, goal, goalAccent, style, styleAccent]);
  const narrow = typeof window !== 'undefined' && window.innerWidth < 680;
  const vaultPositions = useMemo(() => narrow ? [4.1, -.2, -4.5, -8.8, -13.1, -17.4] : [4.1, .65, -2.9, -6.45, -10, -13.55, -17.1, -20.65], [narrow]);
  const outerCurve = useMemo(() => makeVaultCurve(), []);
  const innerCurve = useMemo(() => makeVaultCurve(5.95, -3.04, 3.08), []);
  const outerGeometry = useMemo(() => new THREE.TubeGeometry(outerCurve, narrow ? 56 : 96, .045, narrow ? 5 : 7, false), [outerCurve, narrow]);
  const innerGeometry = useMemo(() => new THREE.TubeGeometry(innerCurve, narrow ? 56 : 96, .009, 4, false), [innerCurve, narrow]);
  const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useFrame((state, delta) => {
    if (reducedMotion) boot.current = 1;
    else {
      if (bootStartedAt.current === null) bootStartedAt.current = state.clock.elapsedTime;
      boot.current = clamp01((state.clock.elapsedTime - bootStartedAt.current) / 3.4);
    }
    const bootEase = 1 - Math.pow(1 - boot.current, 3);
    accent.current.lerp(targetAccent, 1 - Math.exp(-delta * 1.4));
    const thinking = aiState === 'thinking';
    const responding = aiState === 'responding' || aiState === 'success';
    const sectionActivity = activeSection === 'assistant' ? .42 : activeSection === 'capabilities' ? .3 : activeSection === 'process' ? .34 : activeSection === 'work' ? .27 : activeSection === 'about' ? .22 : activeSection === 'contact' ? .46 : activeSection === 'ai-lab' ? .67 : .19;
    const targetActivity = thinking ? 1 : responding ? .77 : aiState === 'discovery' || activeSection === 'discovery' ? .54 : sectionActivity;
    activity.current = THREE.MathUtils.damp(activity.current, targetActivity, 1.75, delta);

    if (world.current) {
      if (reducedMotion) {
        world.current.rotation.y = 0;
        world.current.position.y = 0;
      } else {
        const sectionYaw = activeSection === 'ai-lab' ? .024 : activeSection === 'discovery' ? -.02 : activeSection === 'assistant' ? .014 : activeSection === 'contact' ? .026 : 0;
        const yaw = Math.sin(progressRef.current * Math.PI * 1.05) * .12 + pointerRef.current.x * .014 + sectionYaw;
        world.current.rotation.y = THREE.MathUtils.damp(world.current.rotation.y, yaw, 1.3, delta);
        world.current.position.y = THREE.MathUtils.damp(world.current.position.y, Math.sin(state.clock.elapsedTime * .09) * .01, 1.2, delta);
      }
    }
    if (architecture.current) {
      const sectorWidth = family.includes('fashion') ? 1.035 : family.includes('health') ? .978 : family.includes('commerce') ? 1.022 : 1;
      const width = sectorWidth * (style.includes('immersive') ? 1.025 : style.includes('minimal') ? .985 : 1);
      const height = style.includes('immersive') ? 1.025 : style.includes('minimal') ? .985 : goal.includes('automate') ? .99 : 1;
      architecture.current.scale.x = reducedMotion ? width : THREE.MathUtils.damp(architecture.current.scale.x, width, 1.4, delta);
      architecture.current.scale.y = reducedMotion ? height : THREE.MathUtils.damp(architecture.current.scale.y, height, 1.4, delta);
      const styleRotation = style.includes('interactive') ? .026 : style.includes('minimal') ? -.014 : 0;
      const goalRotation = goal.includes('sales') ? -.008 : goal.includes('brand') ? .012 : 0;
      const sectionRotation = activeSection === 'ai-lab' ? .02 : activeSection === 'contact' ? -.018 : activeSection === 'assistant' ? -.012 : 0;
      const architectureRotation = (reducedMotion ? 0 : sectionRotation) + styleRotation + goalRotation + (reducedMotion ? 0 : responding ? -.016 : 0);
      architecture.current.rotation.y = reducedMotion ? architectureRotation : THREE.MathUtils.damp(architecture.current.rotation.y, architectureRotation, 1.25, delta);
    }
    if (panels.current) {
      const industryShift = family.includes('fashion') ? .12 : family.includes('health') ? -.07 : family.includes('restaurant') ? .06 : 0;
      const goalShift = goal.includes('sales') ? .11 : goal.includes('lead') ? -.09 : goal.includes('customer') ? .16 : 0;
      const styleShift = style.includes('immersive') ? .09 : style.includes('minimal') ? -.07 : 0;
      const discoveryEmphasis = !reducedMotion && activeSection === 'discovery' ? .08 : 0;
      const panelX = industryShift + goalShift + styleShift + discoveryEmphasis + (aiState === 'success' ? -.08 : 0);
      const panelRotation = style.includes('premium') ? .025 : style.includes('interactive') ? -.026 : 0;
      panels.current.position.x = reducedMotion ? panelX : THREE.MathUtils.damp(panels.current.position.x, panelX, 1.35, delta);
      panels.current.rotation.y = reducedMotion ? panelRotation : THREE.MathUtils.damp(panels.current.rotation.y, panelRotation, 1.25, delta);
    }
    if (backlight.current) {
      backlight.current.color.copy(accent.current);
      backlight.current.intensity = THREE.MathUtils.damp(backlight.current.intensity, .2 + bootEase * (.72 + activity.current * 1.25), 1.45, delta);
    }
    architectureMaterial.color.lerp(architectureTint, 1 - Math.exp(-delta * 1.2));
    architectureMaterial.emissiveIntensity = .035 + bootEase * (.1 + activity.current * .18);
    detailMaterial.color.copy(accent.current);
    detailMaterial.opacity = THREE.MathUtils.damp(detailMaterial.opacity, .08 + bootEase * (.15 + activity.current * .2), 1.6, delta);
    vaults.current.forEach((vault, index) => {
      if (!vault) return;
      const localBoot = clamp01((boot.current - index * .055) / (1 - index * .055));
      const scaleY = .94 + localBoot * .06 + Math.sin(state.clock.elapsedTime * .09 + index * .5) * .0016;
          vault.scale.y = reducedMotion ? 1 : THREE.MathUtils.damp(vault.scale.y, scaleY, 1.4, delta);
          vault.position.x = reducedMotion ? 0 : THREE.MathUtils.damp(vault.position.x, Math.sin(state.clock.elapsedTime * .075 + index) * (thinking ? .03 : .008), 1.1, delta);
    });
  });

  return (
    <>
      <fogExp2 attach="fog" args={['#07152F', .018]} />
      <EnvironmentCamera />
      <EnvironmentLighting accent={accent.current} bootRef={boot} activityRef={activity} />
      <pointLight ref={backlight} position={[0, 2.2, -12]} distance={22} decay={2} intensity={.18} color={accent.current} />
      <group ref={world}>
        <group ref={architecture}>
          {vaultPositions.map((z, index) => <group key={z} ref={(node) => { vaults.current[index] = node; }} position={[0, 0, z]} scale={[1 + (index % 2) * .018, .94, 1]}>
            <mesh geometry={outerGeometry} material={architectureMaterial} />
            {(index === 1 || index === 4 || index === 7) && <mesh geometry={innerGeometry} material={detailMaterial} />}
          </group>)}
        </group>
        <group ref={panels}>
          <InformationPlane position={[-3.72, .12, -2.45]} rotation={[.015, .22, -.03]} accent={accent.current} reducedMotion={reducedMotion} />
          <InformationPlane position={[3.62, .64, -8.55]} rotation={[-.02, -.2, .04]} accent={accent.current} reverse reducedMotion={reducedMotion} />
        </group>
        <ScenePlatforms accent={accent.current} reducedMotion={reducedMotion} />
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.13, -8]} material={floorMaterial}><planeGeometry args={[18, 40]} /></mesh>
        <FloorWayfinding accent={accent.current} />
        <DataNetwork accent={accent.current} isThinking={aiState === 'thinking'} section={activeSection} reducedMotion={reducedMotion} />
        <GroundAperture accent={accent.current} reducedMotion={reducedMotion} />
      </group>
    </>
  );
}
