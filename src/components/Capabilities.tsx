import { useEffect, useState } from 'react';
import { capabilities } from '../data/capabilities';
import { useEnvironment } from '../environment/EnvironmentProvider';

/**
 * The capabilities system's accessible HTML layer — the same four real
 * services, as an expandable list. Hovering, focusing or selecting a
 * capability drives the 3D system: the camera flies to that node and its
 * emblem lights up. The list stays fully usable without the scene.
 */
export default function Capabilities() {
  const [active, setActive] = useState(0);
  const { setFocus } = useEnvironment();

  useEffect(() => () => setFocus(null), [setFocus]);

  return (
    <div className="capability-list" onMouseLeave={() => setFocus(null)}>
      {capabilities.map((capability, index) => (
        <article className={`capability-item ${active === index ? 'is-active' : ''}`} key={capability.number}>
          <button
            className="capability-trigger"
            type="button"
            onClick={() => { setActive(index); setFocus(`cap:${index}`); }}
            onMouseEnter={() => setFocus(`cap:${index}`)}
            onFocus={() => setFocus(`cap:${index}`)}
            aria-expanded={active === index}
            aria-controls={`capability-detail-${index}`}
          >
            <span className="capability-number">{capability.number}<i> / 04</i></span>
            <span className="capability-title-wrap"><strong>{capability.title}</strong><small>{capability.short}</small></span>
            <span className={`capability-symbol capability-symbol--${index + 1}`} aria-hidden="true">{capability.symbol}</span>
            <span className="capability-toggle" aria-hidden="true">{active === index ? '−' : '+'}</span>
          </button>
          <div className="capability-detail" id={`capability-detail-${index}`} aria-hidden={active !== index}>
            <div><p>{capability.detail}</p><span className="capability-tag"><i />{capability.tag}</span></div>
            <div className="capability-motif" aria-hidden="true"><i /><i /><i /><span>{capability.number}</span></div>
          </div>
        </article>
      ))}
    </div>
  );
}
