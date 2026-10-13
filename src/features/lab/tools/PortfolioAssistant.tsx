import { useEffect, useRef, useState } from 'react';
import { labApi, type ChatTurn } from '../../../services/labService';
import { useAiAction } from '../useAiAction';
import { LabError, LabNote, Loading } from './shared';

const STARTERS = [
  'Explain the architecture of DermaSense AI.',
  'Which of your projects uses reinforcement learning?',
  'How does the Fashion AI system personalize recommendations?',
  'What are your main research interests?',
  'Which projects are relevant to NLP research?',
];

/**
 * TOOL A — grounded on the portfolio knowledge in server/knowledge.mjs.
 * It answers from that information only and says so when something is missing.
 */
export default function PortfolioAssistant() {
  const [messages, setMessages] = useState<ChatTurn[]>([]);
  const [input, setInput] = useState('');
  const { status, error, run, reset } = useAiAction<string>();
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, status]);

  const send = async (question: string) => {
    const text = question.trim();
    if (!text || status === 'loading') return;

    const history = messages;
    setMessages([...history, { role: 'user', content: text }]);
    setInput('');

    const reply = await run(() => labApi.chat(history, text).then((data) => data.reply));
    if (reply) {
      setMessages([...history, { role: 'user', content: text }, { role: 'assistant', content: reply }]);
    }
  };

  const clear = () => {
    setMessages([]);
    setInput('');
    reset();
  };

  return (
    <div className="ailab-tool ailab-chat">
      <div className="ailab-tool-head">
        <div>
          <span className="ailab-tool-kicker">TOOL 01 / PORTFOLIO ASSISTANT</span>
          <h3>Ask about the work on this site</h3>
        </div>
        {messages.length > 0 && (
          <button className="ailab-ghost" type="button" onClick={clear}>Reset conversation</button>
        )}
      </div>

      <div className="ailab-chat-log" ref={logRef}>
        {messages.length === 0 && status !== 'loading' && (
          <div className="ailab-empty">
            <p>I answer using the research, projects and skills published here — and I’ll tell you when something isn’t covered.</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div className={`ailab-turn ailab-turn--${message.role}`} key={index}>
            <span className="ailab-turn-role">{message.role === 'user' ? 'You' : 'Assistant'}</span>
            <p>{message.content}</p>
          </div>
        ))}

        {status === 'loading' && <Loading label="Thinking about your question…" />}
        {status === 'error' && <LabError message={error} />}
      </div>

      <form
        className="ailab-chat-form"
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
      >
        <input
          aria-label="Your question about the portfolio"
          placeholder="Ask about a project, a technology or a research area…"
          value={input}
          maxLength={1500}
          onChange={(event) => setInput(event.target.value)}
        />
        <button className="ailab-send" type="submit" disabled={status === 'loading' || input.trim().length === 0}>
          {status === 'loading' ? 'Sending…' : 'Send'} <span aria-hidden="true">↗</span>
        </button>
      </form>

      <div className="ailab-starters" aria-label="Suggested questions">
        {STARTERS.map((starter) => (
          <button key={starter} type="button" onClick={() => send(starter)} disabled={status === 'loading'}>
            {starter}
          </button>
        ))}
      </div>

      <LabNote>Answers are AI-generated from the portfolio information published on this site. They are not a search of external sources.</LabNote>
    </div>
  );
}
