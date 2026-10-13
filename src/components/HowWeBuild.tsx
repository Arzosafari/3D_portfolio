import { useEffect, useRef, useState } from 'react';

export const steps = [
  { number: '01', title: 'Discover', description: 'We get close to your business, your people, and the moment that matters most.', note: 'LISTEN FIRST / FIND THE SIGNAL' },
  { number: '02', title: 'Design', description: 'We shape a distinctive visual and interaction system around a clear product idea.', note: 'MAKE IT MEAN SOMETHING' },
  { number: '03', title: 'Integrate', description: 'We build in the right AI, data, and product logic—with useful boundaries and human care.', note: 'INTELLIGENCE, WITH INTENTION' },
  { number: '04', title: 'Launch', description: 'We build, test, optimize, and help your new experience find its way into the world.', note: 'SHIP / LEARN / GROW' },
];

export default function HowWeBuild() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver((entries) => {
      const visibleEntries = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
      const current = visibleEntries[0]?.target.getAttribute('data-step-index');
      if (current !== null && current !== undefined) setActive(Number(current));
    }, { threshold: [0.25, 0.5, 0.72], rootMargin: '-18% 0px -24% 0px' });
    stepRefs.current.forEach((step) => { if (step) observer.observe(step); });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="process-layout">
      <div className="process-sticky">
        <div className="process-display">
          <div className="process-display__top"><span>THE faratech_lab METHOD</span><span>0{active + 1} / 04</span></div>
          <div className="process-number" aria-hidden="true">{steps[active].number}<span>.</span></div>
          <div className="process-display__bottom"><span className="process-dash"><i style={{ transform: `scaleX(${(active + 1) / steps.length})` }} /></span><span>{steps[active].note}</span></div>
          <div className="process-cross process-cross--a">+</div><div className="process-cross process-cross--b">+</div>
        </div>
        <p className="process-side-note">No mystery process. Just good questions, clear decisions, and work made with care.</p>
      </div>
      <div className="process-steps">
        {steps.map((step, index) => (
          <button
            ref={(element) => { stepRefs.current[index] = element; }}
            className={`process-step ${active === index ? 'is-active' : ''}`}
            key={step.number}
            data-step-index={index}
            type="button"
            onClick={() => setActive(index)}
            aria-pressed={active === index}
          >
            <span className="process-step__index">{step.number}<i> / 04</i></span>
            <span className="process-step__content"><strong>{step.title}</strong><small>{step.description}</small></span>
            <span className="process-step__arrow" aria-hidden="true">↗</span>
            <span className="process-step__progress"><i /></span>
          </button>
        ))}
      </div>
    </div>
  );
}
