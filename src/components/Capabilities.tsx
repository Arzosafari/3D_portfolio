import { useState } from 'react';

const capabilities = [
  {
    number: '01',
    title: 'AI-powered websites',
    short: 'Useful intelligence, built into the journey.',
    detail: 'From a first-time visitor’s question to a returning customer’s next step, we add AI where it makes a digital experience more helpful—not more complicated.',
    tag: 'INTELLIGENT BY DESIGN',
    symbol: '✳',
  },
  {
    number: '02',
    title: '3D & interactive experiences',
    short: 'A little depth. A lot more feeling.',
    detail: 'We use interaction, movement, and dimensional visuals to make a brand feel memorable while keeping the experience clear, fast, and accessible.',
    tag: 'BUILT TO BE FELT',
    symbol: '◈',
  },
  {
    number: '03',
    title: 'Intelligent assistants',
    short: 'Conversations with a real job to do.',
    detail: 'Purpose-built assistants can guide discovery, answer product questions, qualify a project, or route a customer to the right person with context intact.',
    tag: 'HUMAN WHEN IT MATTERS',
    symbol: '↗',
  },
  {
    number: '04',
    title: 'Personalized experiences',
    short: 'Relevant journeys, without the noise.',
    detail: 'Thoughtful content and product recommendations adapt to what someone needs, helping each visitor find a better path through your digital world.',
    tag: 'RELEVANT, NOT INTRUSIVE',
    symbol: '◎',
  },
];

export default function Capabilities() {
  const [active, setActive] = useState(0);

  return (
    <div className="capability-list">
      {capabilities.map((capability, index) => (
        <article className={`capability-item ${active === index ? 'is-active' : ''}`} key={capability.number}>
          <button className="capability-trigger" type="button" onClick={() => setActive(index)} aria-expanded={active === index} aria-controls={`capability-detail-${index}`}>
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
