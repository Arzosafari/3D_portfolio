import { useState } from 'react';

type LabFeature = 'assistant' | 'recommendations' | 'personalization' | 'search';

const features: Array<{ id: LabFeature; number: string; title: string; description: string; glyph: string }> = [
  { id: 'assistant', number: '01', title: 'AI assistant', description: 'Useful answers, built around your brand.', glyph: '↗' },
  { id: 'recommendations', number: '02', title: 'Smart recommendation', description: 'Help people find their next best choice.', glyph: '✳' },
  { id: 'personalization', number: '03', title: 'Personalization', description: 'A relevant experience for every visitor.', glyph: '◉' },
  { id: 'search', number: '04', title: 'Intelligent search', description: 'Understand the intent behind a question.', glyph: '⌕' },
];

function AssistantDemo() {
  const questions = [
    { prompt: 'Can I change the delivery address?', answer: 'Of course. If your order has not shipped yet, I can update it for you. Want me to check the order?' },
    { prompt: 'Help me find a gift under $80', answer: 'I can help with that. What do they enjoy most: design, cooking, or a little everyday luxury?' },
  ];
  const [active, setActive] = useState(0);
  return (
    <div className="lab-chat-demo">
      <div className="demo-app-header"><span className="mini-brand"><i /> STUDIO & FORM</span><span className="demo-app-link">Support <i>↗</i></span></div>
      <div className="demo-chat-window">
        <div className="demo-chat-head"><span className="demo-assistant-avatar">S<span>✳</span></span><span><strong>Studio guide</strong><small>Here to help · typically replies instantly</small></span><i className="demo-more">···</i></div>
        <div className="demo-chat-messages">
          <div className="demo-bubble demo-bubble--assistant">Hello there. What can I help you find today?</div>
          <div className="demo-bubble demo-bubble--user">{questions[active].prompt}</div>
          <div className="demo-response"><span className="response-spark">✳</span><p>{questions[active].answer}</p></div>
        </div>
        <div className="demo-chat-input"><span>Ask anything about the experience…</span><i>↗</i></div>
        <div className="demo-quick-questions">
          {questions.map((question, index) => <button key={question.prompt} className={active === index ? 'is-active' : ''} onClick={() => setActive(index)} type="button">{question.prompt}</button>)}
        </div>
      </div>
    </div>
  );
}

function RecommendationDemo() {
  const [tailored, setTailored] = useState(false);
  const picks = tailored
    ? [
      { name: 'The Sunday tote', detail: 'Made for everyday', color: 'ochre', tag: 'YOUR KIND OF THING' },
      { name: 'Soft-form vase', detail: 'A little sculptural', color: 'clay', tag: 'ALSO FOR YOU' },
      { name: 'Object no. 08', detail: 'Quietly considered', color: 'sage', tag: 'JUST DISCOVERED' },
    ]
    : [
      { name: 'Form study no. 04', detail: 'Hand-finished ceramic', color: 'sage', tag: 'A GOOD PLACE TO START' },
      { name: 'Studio linen throw', detail: 'Natural, washed texture', color: 'clay', tag: 'MADE TO FEEL RIGHT' },
      { name: 'Soft-form vessel', detail: 'An everyday favourite', color: 'ochre', tag: 'POPULAR WITH YOU' },
    ];
  return (
    <div className="recommendation-demo">
      <div className="demo-store-header"><span>OBJECTS / THOUGHTFULLY MADE</span><span>0 — BAG</span></div>
      <div className="recommendation-demo__intro"><span>CURATED FOR YOUR DAY</span><h4>{tailored ? 'Your edit, refined.' : 'A slower kind of living.'}</h4><p>{tailored ? 'Small details, selected around what you like.' : 'Objects with a little more thought in them.'}</p></div>
      <div className="product-picks">
        {picks.map((pick, index) => (
          <article className="product-pick" key={pick.name}>
            <div className={`product-pick__art product-pick__art--${pick.color}`}><span>{String(index + 1).padStart(2, '0')}</span><i className={`product-shape product-shape--${index + 1}`} /></div>
            <span className="product-pick__tag">{pick.tag}</span><strong>{pick.name}</strong><small>{pick.detail}</small>
          </article>
        ))}
      </div>
      <button className="demo-tailor-button" type="button" onClick={() => setTailored((value) => !value)}><span>✳</span>{tailored ? 'Refresh your edit' : 'Make this more personal'} <i>↗</i></button>
    </div>
  );
}

function PersonalizationDemo() {
  const [audience, setAudience] = useState<'first' | 'returning'>('returning');
  const returning = audience === 'returning';
  return (
    <div className="personalization-demo">
      <div className="demo-store-header"><span>NORTHLINE / FIELD NOTES</span><span>ACCOUNT&nbsp; ↗</span></div>
      <div className="personalization-preview">
        <span className="personalization-label"><i /> LIVE EXPERIENCE / {returning ? 'RETURNING' : 'FIRST VISIT'}</span>
        <div className="personalization-copy"><span>OBJECTS FOR THE EVERYDAY</span><h4>{returning ? <>Welcome back,<br /><em>Alex.</em></> : <>Find your<br /><em>own rhythm.</em></>}</h4><p>{returning ? 'Your saved pieces are waiting. We found a few things that feel like you.' : 'Thoughtful essentials for the places and moments that matter.'}</p><button type="button" onClick={() => setAudience(returning ? 'first' : 'returning')}>{returning ? 'Your saved edit' : 'Explore the collection'} <i>↗</i></button></div>
        <div className={`personalization-shape ${returning ? 'personalization-shape--returning' : ''}`} aria-hidden="true"><span /><i /><b /></div>
      </div>
      <div className="visitor-controls"><span>PREVIEW AS</span><button type="button" className={audience === 'first' ? 'is-active' : ''} onClick={() => setAudience('first')}>First visit</button><button type="button" className={audience === 'returning' ? 'is-active' : ''} onClick={() => setAudience('returning')}>Returning visitor</button><span className="visitor-check">✓ PERSONALIZED</span></div>
    </div>
  );
}

function SearchDemo() {
  const [query, setQuery] = useState('something thoughtful for a new home');
  const suggestions = query.toLowerCase().includes('light')
    ? ['Sculptural table light', 'Soft glow bedside lamp', 'Portable paper lantern']
    : query.toLowerCase().includes('gift')
      ? ['Small-batch gift set', 'A considered housewarming', 'Studio candle duo']
      : ['The Sunday object set', 'Hand-thrown stoneware', 'A softer place to start'];
  return (
    <div className="search-demo">
      <div className="search-demo__top"><span>STUDIO / OBJECT INDEX</span><span>SEARCH / 01</span></div>
      <div className="search-demo__body"><span className="search-demo__kicker">FIND SOMETHING THAT FITS</span><h4>What are you<br /><em>looking for?</em></h4>
        <label className="smart-search-field"><span>⌕</span><input aria-label="Search the product collection" value={query} onChange={(event) => setQuery(event.target.value)} /><button type="button" aria-label="Search">↗</button></label>
        <div className="search-results-heading"><span>THOUGHTFUL STARTING POINTS</span><span>0{suggestions.length}</span></div>
        <div className="search-suggestions">{suggestions.map((item, index) => <button type="button" key={item}><span>0{index + 1}</span>{item}<i>↗</i></button>)}</div>
      </div>
      <div className="search-demo__footer"><span>RESULTS SHAPED BY INTENT</span><span><i /> SEMANTIC SEARCH</span></div>
    </div>
  );
}

function DemoForFeature({ feature }: { feature: LabFeature }) {
  if (feature === 'assistant') return <AssistantDemo />;
  if (feature === 'recommendations') return <RecommendationDemo />;
  if (feature === 'personalization') return <PersonalizationDemo />;
  return <SearchDemo />;
}

export default function ExperienceLab() {
  const [activeFeature, setActiveFeature] = useState<LabFeature>('assistant');
  const active = features.find((feature) => feature.id === activeFeature)!;

  return (
    <div className="lab-experience">
      <div className="lab-feature-list" role="tablist" aria-label="AI experience concepts">
        {features.map((feature) => (
          <button
            className={`lab-feature ${activeFeature === feature.id ? 'is-active' : ''}`}
            key={feature.id}
            type="button"
            role="tab"
            aria-selected={activeFeature === feature.id}
            aria-controls="lab-demo-panel"
            onClick={() => setActiveFeature(feature.id)}
          >
            <span className="lab-feature__top"><span>{feature.number} / 04</span><i>{feature.glyph}</i></span>
            <strong>{feature.title}</strong>
            <small>{feature.description}</small>
            <span className="lab-feature__line"><i /></span>
          </button>
        ))}
        <div className="lab-feature-footnote"><span>BUILT AROUND PEOPLE</span><span>NOT THE OTHER WAY ROUND</span></div>
      </div>
      <div className="lab-preview-wrap">
        <div className="lab-preview-topbar"><div><i /><i /><i /></div><span>nova.studio / lab / {active.id}</span><span className="preview-live"><i />LIVE CONCEPT</span></div>
        <div className="lab-preview-content" id="lab-demo-panel" role="tabpanel" aria-label={`${active.title} demonstration`} key={active.id}>
          <DemoForFeature feature={activeFeature} />
        </div>
        <div className="lab-preview-caption"><span><strong>{active.number}</strong> / INTERACTIVE PREVIEW</span><span>AN EXAMPLE OF WHAT AI CAN DO <i>↗</i></span></div>
      </div>
    </div>
  );
}
