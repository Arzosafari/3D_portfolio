import { useState } from 'react';
import { labApi, type Concept } from '../../../services/labService';
import { useAiAction } from '../useAiAction';
import { CopyButton, LabError, LabNote, Loading } from './shared';

type Level = 'beginner' | 'intermediate' | 'technical';

const LEVELS: Array<{ id: Level; label: string }> = [
  { id: 'beginner', label: 'Beginner' },
  { id: 'intermediate', label: 'Intermediate' },
  { id: 'technical', label: 'Technical' },
];

const SUGGESTED = [
  'Transformers', 'Attention mechanisms', 'Word embeddings', 'Retrieval-augmented generation',
  'LLM agents', 'Reinforcement learning', 'Contextual bandits', 'Multimodal learning',
  'Recommendation systems',
];

/**
 * TOOL D — AI concept explorer. Explains one concept at the chosen depth and
 * takes a follow-up question about the explanation it just produced.
 */
export default function ConceptExplorer() {
  const [topic, setTopic] = useState('');
  const [level, setLevel] = useState<Level>('beginner');
  const [question, setQuestion] = useState('');
  const [validation, setValidation] = useState('');
  const { status, result, error, run } = useAiAction<Concept>();

  const explain = async (nextTopic = topic, followUp = '') => {
    const value = nextTopic.trim();
    if (value.length < 2) {
      setValidation('Please choose or type a concept.');
      return;
    }
    setValidation('');
    await run(() => labApi.concept(value, level, followUp).then((data) => data.concept));
  };

  const asText = (value: Concept) => [
    `${value.title} (${level})`,
    value.intuition,
    `How it works:\n${value.steps.map((step, index) => `${index + 1}. ${step}`).join('\n')}`,
    `Example: ${value.example}`,
    value.limitations.length > 0 && `Limitations:\n${value.limitations.map((item) => `- ${item}`).join('\n')}`,
    value.next.length > 0 && `Learn next: ${value.next.join(', ')}`,
  ].filter(Boolean).join('\n\n');

  return (
    <div className="ailab-tool">
      <div className="ailab-tool-head">
        <div>
          <span className="ailab-tool-kicker">TOOL 04 / AI CONCEPT EXPLORER</span>
          <h3>Learn a concept at your own depth</h3>
        </div>
      </div>

      <form
        className="ailab-form"
        onSubmit={(event) => {
          event.preventDefault();
          explain();
        }}
      >
        <div className="ailab-grid">
          <label className="ailab-grid-wide">
            <span>Concept or topic</span>
            <input
              value={topic}
              maxLength={120}
              placeholder="e.g. attention mechanisms"
              onChange={(event) => { setTopic(event.target.value); setValidation(''); }}
            />
          </label>
          <label>
            <span>Explain it for</span>
            <select value={level} onChange={(event) => setLevel(event.target.value as Level)}>
              {LEVELS.map((item) => <option key={item.id} value={item.id}>{item.label}</option>)}
            </select>
          </label>
        </div>

        <div className="ailab-chips" aria-label="Suggested concepts">
          {SUGGESTED.map((item) => (
            <button
              key={item}
              type="button"
              className={topic === item ? 'is-active' : ''}
              onClick={() => { setTopic(item); setValidation(''); }}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="ailab-actions">
          <button className="ailab-primary" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Explaining…' : 'Explain this concept'} <span aria-hidden="true">↗</span>
          </button>
          {result && <button className="ailab-ghost" type="button" onClick={() => explain(topic, '')}>Start over</button>}
        </div>
        {validation && <LabError message={validation} />}
      </form>

      {status === 'loading' && <Loading label="Building the explanation…" />}
      {status === 'error' && <LabError message={error} />}

      {status === 'success' && result && (
        <article className="ailab-result">
          <header className="ailab-result-head">
            <div>
              <span className="ailab-result-kicker">{level.toUpperCase()} LEVEL</span>
              <h4>{result.title}</h4>
            </div>
            <CopyButton text={asText(result)} />
          </header>

          <div className="ailab-result-blocks">
            <div><span>THE INTUITION</span><p>{result.intuition}</p></div>
            {result.steps.length > 0 && (
              <div><span>STEP BY STEP</span><ol>{result.steps.map((step) => <li key={step}>{step}</li>)}</ol></div>
            )}
            <div><span>PRACTICAL EXAMPLE</span><p>{result.example}</p></div>
            {result.limitations.length > 0 && (
              <div><span>LIMITATIONS</span><ul>{result.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div>
            )}
            {result.next.length > 0 && (
              <div>
                <span>LEARN NEXT</span>
                <div className="ailab-chips">
                  {result.next.map((item) => (
                    <button key={item} type="button" onClick={() => { setTopic(item); explain(item); }}>{item} ↗</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form
            className="ailab-followup"
            onSubmit={(event) => {
              event.preventDefault();
              explain(topic, question.trim());
              setQuestion('');
            }}
          >
            <label className="ailab-field">
              <span>Ask a follow-up about this explanation</span>
              <input
                value={question}
                maxLength={400}
                placeholder="Why does the softmax matter here?"
                onChange={(event) => setQuestion(event.target.value)}
              />
            </label>
            <button className="ailab-primary" type="submit" disabled={question.trim().length === 0}>
              Ask follow-up
            </button>
          </form>
        </article>
      )}

      <LabNote>
        AI-generated explanations. A follow-up rewrites the explanation at the same level rather than continuing a saved conversation.
        Interactive diagrams per concept are not implemented yet.
      </LabNote>
    </div>
  );
}
