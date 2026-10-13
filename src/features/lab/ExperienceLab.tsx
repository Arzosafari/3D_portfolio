import { useEffect, useState, type ComponentType } from 'react';
import { labTools, type LabToolId } from '../../data/labFeatures';
import { useEnvironment } from '../../environment/EnvironmentProvider';
import { labApi, type AiHealth } from '../../services/labService';
import PortfolioAssistant from './tools/PortfolioAssistant';
import FashionStudio from './tools/FashionStudio';
import PaperExplainer from './tools/PaperExplainer';
import ConceptExplorer from './tools/ConceptExplorer';

const TOOL_VIEWS: Record<LabToolId, ComponentType> = {
  'portfolio-assistant': PortfolioAssistant,
  'fashion-studio': FashionStudio,
  'paper-explainer': PaperExplainer,
  'concept-explorer': ConceptExplorer,
};

/**
 * The AI Lab. Each panel is a working tool backed by server/ — the active tool
 * also drives the Lattice scene through the environment focus channel.
 */
export default function ExperienceLab() {
  const [activeTool, setActiveTool] = useState<LabToolId>('portfolio-assistant');
  const [health, setHealth] = useState<AiHealth | null>(null);
  const { setFocus } = useEnvironment();

  const active = labTools.find((tool) => tool.id === activeTool)!;
  const ToolView = TOOL_VIEWS[active.id];

  useEffect(() => {
    labApi.health().then(setHealth);
  }, []);

  useEffect(() => {
    setFocus(`lab:${active.scene}`);
    return () => setFocus(null);
  }, [active.scene, setFocus]);

  const status = health === null
    ? { label: 'CHECKING AI…', tone: 'pending' }
    : health.aiConfigured
      ? { label: 'LIVE AI', tone: 'live' }
      : { label: 'AI NOT CONNECTED', tone: 'offline' };

  return (
    <div className="lab-experience">
      <div className="lab-feature-list" role="tablist" aria-label="AI Lab tools">
        {labTools.map((tool) => (
          <button
            className={`lab-feature ${activeTool === tool.id ? 'is-active' : ''}`}
            key={tool.id}
            type="button"
            role="tab"
            aria-selected={activeTool === tool.id}
            aria-controls="lab-demo-panel"
            onClick={() => setActiveTool(tool.id)}
          >
            <span className="lab-feature__top"><span>{tool.number} / 04</span><i>{tool.glyph}</i></span>
            <strong>{tool.title}</strong>
            <small>{tool.description}</small>
            <span className="lab-feature__line"><i /></span>
          </button>
        ))}
        <div className="lab-feature-footnote"><span>WORKING TOOLS</span><span>NOT DEMO SCREENS</span></div>
      </div>

      <div className="lab-preview-wrap">
        <div className="lab-preview-topbar">
          <div><i /><i /><i /></div>
          <span>ai-lab / {active.id}</span>
          <span className={`preview-live preview-live--${status.tone}`}><i />{status.label}</span>
        </div>
        <div className="lab-preview-content lab-preview-content--tool" id="lab-demo-panel" role="tabpanel" aria-label={`${active.title} tool`} key={active.id}>
          <ToolView />
        </div>
        <div className="lab-preview-caption">
          <span><strong>{active.number}</strong> / WORKING TOOL</span>
          <span>{health?.aiConfigured ? 'POWERED BY A LIVE MODEL' : 'WAITING FOR AN AI PROVIDER KEY'}</span>
        </div>
      </div>
    </div>
  );
}
