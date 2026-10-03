import { useEffect, useState } from 'react';

interface ProjectConcept {
  number: string;
  title: string;
  summary: string;
  discipline: string;
  art: 'fashion' | 'health' | 'commerce';
  premise: string;
  features: string[];
}

const projects: ProjectConcept[] = [
  {
    number: '01',
    title: 'AI Fashion Experience',
    summary: 'A more personal way to find your point of view.',
    discipline: 'AI COMMERCE · EDITORIAL',
    art: 'fashion',
    premise: 'A considered storefront concept for a new independent label—built around discovery, not endless scrolling.',
    features: ['Editorial collection stories', 'Conversational styling assistant', 'Preference-led product discovery'],
  },
  {
    number: '02',
    title: 'Intelligent Health Platform',
    summary: 'A calmer, clearer first step into care.',
    discipline: 'HEALTH · HUMAN-CENTERED AI',
    art: 'health',
    premise: 'A digital front door concept that turns complicated healthcare information into a clear and reassuring next step.',
    features: ['Plain-language care navigation', 'Accessible appointment journeys', 'Careful assistant with human hand-off'],
  },
  {
    number: '03',
    title: 'Smart Commerce',
    summary: 'A storefront that learns what useful means.',
    discipline: 'COMMERCE · PERSONALIZATION',
    art: 'commerce',
    premise: 'A commerce experiment for considered objects, where context and taste help the right product surface naturally.',
    features: ['Adaptive product selection', 'Contextual recommendation layer', 'Fast, mobile-first checkout journey'],
  },
];

function ProjectArtwork({ art }: { art: ProjectConcept['art'] }) {
  if (art === 'fashion') {
    return (
      <div className="project-art project-art--fashion" aria-hidden="true">
        <div className="fashion-art-top"><span>STUDIO NO. 08</span><span>COLLECTION / 26</span></div>
        <div className="fashion-art-copy"><span>THE NEW</span><strong>FORM<br /><em>& feeling</em></strong><span>OBJECTS FOR YOUR OWN RHYTHM</span></div>
        <div className="fashion-figure"><span className="figure-head" /><span className="figure-neck" /><span className="figure-body" /><span className="figure-arm" /><span className="figure-leg figure-leg--one" /><span className="figure-leg figure-leg--two" /></div>
        <div className="fashion-art-index">01 <i>—</i> 04</div>
        <div className="fashion-art-stamp">AI<br />STYLIST</div>
        <span className="art-cross art-cross--one">+</span><span className="art-cross art-cross--two">+</span>
      </div>
    );
  }
  if (art === 'health') {
    return (
      <div className="project-art project-art--health" aria-hidden="true">
        <div className="health-topline"><span><i /> WELLSPRING / CARE</span><span>YOUR HEALTH, IN CONTEXT</span></div>
        <div className="health-orbit health-orbit--outer"><i /><b /></div>
        <div className="health-orbit health-orbit--inner"><i /></div>
        <div className="health-center"><span>08:42</span><strong>Today,<br />at your pace.</strong><small>YOUR CARE PLAN / 01</small></div>
        <div className="health-side-label"><span>01 / FIND THE RIGHT CARE</span><i>↗</i></div>
        <div className="health-data-pill"><i /> Care guide <span>Ready when you are</span></div>
        <div className="health-footer"><span>CARE THAT MEETS YOU HERE</span><span>W / 0026</span></div>
      </div>
    );
  }
  return (
    <div className="project-art project-art--commerce" aria-hidden="true">
      <div className="commerce-topline"><span>OBJECT / OBJECT</span><span>CURATED GOODS <i>✳</i></span></div>
      <div className="commerce-headline"><span>GOOD THINGS,<br /><em>found slowly.</em></span><i>03 — 08</i></div>
      <div className="commerce-shelf">
        <div className="commerce-product commerce-product--vase"><i /><span>01 / STONE</span></div>
        <div className="commerce-product commerce-product--lamp"><i /><span>02 / LIGHT</span></div>
        <div className="commerce-product commerce-product--fabric"><i /><span>03 / FORM</span></div>
      </div>
      <div className="commerce-assistant"><span>✳</span><span>YOUR EDIT IS READY</span><i>↗</i></div>
    </div>
  );
}

export default function SelectedExperiments() {
  const [activeProject, setActiveProject] = useState<ProjectConcept | null>(null);

  useEffect(() => {
    if (!activeProject) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setActiveProject(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeProject]);

  return (
    <>
      <div className="project-grid">
        {projects.map((project) => (
          <button className="project-card" type="button" key={project.number} onClick={() => setActiveProject(project)} aria-haspopup="dialog" aria-label={`Explore concept: ${project.title}`}>
            <div className="project-card__art"><ProjectArtwork art={project.art} /><span className="project-open-indicator" aria-hidden="true">↗</span></div>
            <div className="project-card__meta"><span>CONCEPT / EXPERIMENT</span><span>{project.number} <i>—</i> 03</span></div>
            <div className="project-card__title"><h3>{project.title}</h3><span aria-hidden="true">↗</span></div>
            <p className="project-card__summary">{project.summary}</p>
            <div className="project-card__discipline">{project.discipline}</div>
          </button>
        ))}
      </div>

      {activeProject && (
        <div className="concept-modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setActiveProject(null); }}>
          <section className="concept-modal" role="dialog" aria-modal="true" aria-labelledby="concept-modal-title">
            <div className="concept-modal__header"><span>CONCEPT / EXPERIMENT <i>·</i> {activeProject.number}</span><button type="button" onClick={() => setActiveProject(null)} aria-label="Close concept details">×</button></div>
            <div className="concept-modal__content">
              <div className="concept-modal__art"><ProjectArtwork art={activeProject.art} /></div>
              <div className="concept-modal__copy"><span className="eyebrow eyebrow--small">{activeProject.discipline}</span><h2 id="concept-modal-title">{activeProject.title}</h2><p>{activeProject.premise}</p><span className="concept-feature-heading">EXPERIENCE PILLARS</span><ul>{activeProject.features.map((feature) => <li key={feature}><i>↗</i>{feature}</li>)}</ul><p className="concept-disclaimer">A self-initiated portfolio experiment. Created to explore how thoughtful design and AI can work together.</p></div>
            </div>
          </section>
        </div>
      )}
    </>
  );
}
