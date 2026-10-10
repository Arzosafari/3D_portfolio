import SceneCanvas from '../SceneCanvas';
import EnvironmentScene from '../EnvironmentScene';

/**
 * The original architectural corridor, kept for the working tools —
 * Assistant, Discovery and Process. It still reacts to the AI request
 * lifecycle (idle / thinking / responding / discovery / success) and to the
 * visitor's discovery profile, now tuned to the white & navy palette.
 */
export default function CorridorScene() {
  return (
    <SceneCanvas position={[0, 1.18, 10]} fov={43} far={58}>
      <EnvironmentScene />
    </SceneCanvas>
  );
}
