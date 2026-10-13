import { useState } from 'react';
import { labApi, type Explanation } from '../../../services/labService';
import { useAiAction } from '../useAiAction';
import { CopyButton, LabError, LabNote, Loading } from './shared';

type Mode = 'question' | 'title' | 'text';

const MODES: Array<{ id: Mode; label: string; hint: string; placeholder: string }> = [
  { id: 'question', label: 'Research question', hint: 'General explanation — no paper text supplied.', placeholder: 'How do retrieval-augmented models reduce hallucination?' },
  { id: 'title', label: 'Paper title', hint: 'General explanation of the topic — the paper itself is not read.', placeholder: 'Attention Is All You Need' },
  { id: 'text', label: 'Paste abstract or text', hint: 'Grounded in the text you paste.', placeholder: 'Paste the abstract or a section of the paper here…' },
];

const MIN_TEXT = 200;

/**
 * TOOL C — Research & paper explainer. Grounded in pasted text when text is
 * supplied; otherwise it says plainly that the answer is a general explanation.
 */
export default function PaperExplainer() {
  const [mode, setMode] = useState<Mode>('text');
  const [text, setText] = useState('');
  const [validation, setValidation] = useState('');
  const { status, result, error, run } = useAiAction<Explanation>();

  const active = MODES.find((item) => item.id === mode)!;

  const submit = async () => {
    const value = text.trim();
    if (value.length < 3) {
      setValidation('Please enter something to explain.');
      return;
    }
    if (mode === 'text' && value.length < MIN_TEXT) {
      setValidation(`Pasted text needs at least ${MIN_TEXT} characters so the explanation can stay grounded in it.`);
      return;
    }
    setValidation('');
    await run(() => labApi.explain(mode, value).then((data) => data.explanation));
  };

  const asText = (value: Explanation) => [
    value.title,
    `Research problem: ${value.problem}`,
    `Main idea: ${value.mainIdea}`,
    `Method: ${value.method}`,
    value.concepts.length > 0 && `Key concepts: ${value.concepts.map((concept) => `${concept.term} — ${concept.meaning}`).join('; ')}`,
    `How it works: ${value.howItWorks.join(' ')}`,
    value.contributions.length > 0 && `Contributions stated in the text: ${value.contributions.join(' ')}`,
    value.limitations.length > 0 && `Limitations stated in the text: ${value.limitations.join(' ')}`,
    `Prerequisites: ${value.prerequisites.join(' ')}`,
    `Follow-up questions: ${value.followUps.join(' ')}`,
  ].filter(Boolean).join('\n\n');

  return (
    <div className="ailab-tool">
      <div className="ailab-tool-head">
        <div>
          <span className="ailab-tool-kicker">TOOL 03 / RESEARCH &amp; PAPER EXPLAINER</span>
          <h3>Turn a paper into an explanation</h3>
        </div>
      </div>

      <div className="ailab-tabs" role="tablist" aria-label="What you are providing">
        {MODES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={mode === item.id}
            className={mode === item.id ? 'is-active' : ''}
            onClick={() => { setMode(item.id); setValidation(''); }}
          >
            {item.label}
          </button>
        ))}
      </div>

      <form
        className="ailab-form"
        onSubmit={(event) => {
          event.preventDefault();
          submit();
        }}
      >
        <label className="ailab-field">
          <span>{active.label}</span>
          <textarea
            rows={mode === 'text' ? 7 : 3}
            value={text}
            maxLength={20000}
            placeholder={active.placeholder}
            onChange={(event) => { setText(event.target.value); setValidation(''); }}
          />
          <small>{active.hint}</small>
        </label>

        <div className="ailab-actions">
          <button className="ailab-primary" type="submit" disabled={status === 'loading'}>
            {status === 'loading' ? 'Explaining…' : 'Explain this'} <span aria-hidden="true">↗</span>
          </button>
          {text.length > 0 && <span className="ailab-count">{text.length.toLocaleString()} / 20,000 characters</span>}
        </div>
        {validation && <LabError message={validation} />}
      </form>

      {status === 'loading' && <Loading label="Working through the material…" />}
      {status === 'error' && <LabError message={error} />}

      {status === 'success' && result && (
        <article className="ailab-result">
          <header className="ailab-result-head">
            <div>
              <span className="ailab-result-kicker">
                {result.groundedInProvidedText ? 'GROUNDED IN YOUR PASTED TEXT' : 'GENERAL EXPLANATION — NO PAPER TEXT WAS READ'}
              </span>
              <h4>{result.title}</h4>
            </div>
            <CopyButton text={asText(result)} />
          </header>

          {!result.groundedInProvidedText && (
            <LabNote>
              Only a {mode === 'title' ? 'title' : 'question'} was supplied, so this is a general explanation of the topic.
              It is not a summary of any specific paper, and it does not read one.
            </LabNote>
          )}

          <div className="ailab-result-blocks">
            <div><span>RESEARCH PROBLEM</span><p>{result.problem}</p></div>
            <div><span>MAIN IDEA</span><p>{result.mainIdea}</p></div>
            <div><span>PROPOSED METHOD</span><p>{result.method}</p></div>
            {result.concepts.length > 0 && (
              <div>
                <span>KEY CONCEPTS</span>
                <dl className="ailab-concepts">
                  {result.concepts.map((concept) => (
                    <div key={concept.term}><dt>{concept.term}</dt><dd>{concept.meaning}</dd></div>
                  ))}
                </dl>
              </div>
            )}
            {result.howItWorks.length > 0 && (
              <div><span>HOW IT WORKS</span><ol>{result.howItWorks.map((step) => <li key={step}>{step}</li>)}</ol></div>
            )}
            {result.contributions.length > 0 && (
              <div><span>CONTRIBUTIONS STATED IN THE TEXT</span><ul>{result.contributions.map((item) => <li key={item}>{item}</li>)}</ul></div>
            )}
            {result.limitations.length > 0 && (
              <div><span>LIMITATIONS STATED IN THE TEXT</span><ul>{result.limitations.map((item) => <li key={item}>{item}</li>)}</ul></div>
            )}
            {result.prerequisites.length > 0 && (
              <div><span>PREREQUISITES</span><ul>{result.prerequisites.map((item) => <li key={item}>{item}</li>)}</ul></div>
            )}
            {result.followUps.length > 0 && (
              <div><span>FOLLOW-UP QUESTIONS</span><ul>{result.followUps.map((item) => <li key={item}>{item}</li>)}</ul></div>
            )}
          </div>
        </article>
      )}

      <LabNote>
        PDF upload is not available: this tool works with text you paste, and nothing is stored.
        AI output can be wrong — check anything you rely on against the paper itself.
      </LabNote>
    </div>
  );
}
