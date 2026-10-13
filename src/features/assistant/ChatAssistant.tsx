import { useEffect, useRef, useState, type FormEvent } from 'react';
import BrandSymbol from '../../components/BrandSymbol';
import { aiService, type ChatMessage } from '../../services/aiService';
import { useEnvironment } from '../../environment/EnvironmentProvider';

const welcomeMessage: ChatMessage = {
  id: 'faratech-lab-welcome',
  role: 'assistant',
  content: 'Hi, I’m faratech_lab. Tell me what you’re building and I’ll help you find a useful place to start.',
};

const suggestedPrompts = [
  'I need a website for my business.',
  'How can AI help my business?',
  'What kind of website should I build?',
];

function createId() {
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export default function ChatAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([welcomeMessage]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const requestIdRef = useRef(0);
  const environmentTimersRef = useRef<number[]>([]);
  const { setAIState } = useEnvironment();

  const clearEnvironmentTimers = () => {
    environmentTimersRef.current.forEach((timer) => window.clearTimeout(timer));
    environmentTimersRef.current = [];
  };

  const showResponseState = () => {
    clearEnvironmentTimers();
    setAIState('responding');
    environmentTimersRef.current.push(window.setTimeout(() => {
      setAIState('success');
      environmentTimersRef.current.push(window.setTimeout(() => setAIState('idle'), 1900));
    }, 420));
  };

  useEffect(() => { return () => environmentTimersRef.current.forEach((timer) => window.clearTimeout(timer)); }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    endRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'end' });
  }, [messages, loading, error]);

  const send = async (rawText: string) => {
    const text = rawText.trim();
    if (!text || loading) return;

    const userMessage: ChatMessage = { id: createId(), role: 'user', content: text };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput('');
    setLoading(true);
    setError('');
    clearEnvironmentTimers();
    setAIState('thinking');
    const requestId = ++requestIdRef.current;

    try {
      const reply = await aiService.sendMessage(nextMessages, text);
      if (requestId === requestIdRef.current) {
        setMessages((current) => [...current, { id: createId(), role: 'assistant', content: reply }]);
        showResponseState();
      }
    } catch (cause) {
      if (requestId === requestIdRef.current) {
        setAIState('idle');
        setError(cause instanceof Error ? cause.message : 'Something went wrong. Please try again.');
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        inputRef.current?.focus();
      }
    }
  };

  const retryLast = async () => {
    const lastUserMessage = [...messages].reverse().find((message) => message.role === 'user');
    if (!lastUserMessage || loading) return;
    setLoading(true);
    setError('');
    clearEnvironmentTimers();
    setAIState('thinking');
    const requestId = ++requestIdRef.current;
    try {
      const reply = await aiService.sendMessage(messages, lastUserMessage.content);
      if (requestId === requestIdRef.current) {
        setMessages((current) => [...current, { id: createId(), role: 'assistant', content: reply }]);
        showResponseState();
      }
    } catch (cause) {
      if (requestId === requestIdRef.current) {
        setAIState('idle');
        setError(cause instanceof Error ? cause.message : 'Something went wrong. Please try again.');
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setLoading(false);
        inputRef.current?.focus();
      }
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void send(input);
  };

  const resetConversation = () => {
    clearEnvironmentTimers();
    setAIState('idle');
    requestIdRef.current += 1;
    setMessages([welcomeMessage]);
    setInput('');
    setError('');
    setLoading(false);
    inputRef.current?.focus();
  };

  return (
    <div className="chat-panel" aria-label="faratech_lab business assistant">
      <div className="chat-panel__header">
        <div className="chat-agent-lockup">
          <span className="chat-avatar"><BrandSymbol small /></span>
          <span className="chat-agent-name"><strong>faratech_lab</strong><small>Business experience guide</small></span>
        </div>
        <div className="chat-header-actions">
          <span className="online-status"><i /> Online</span>
          <button className="chat-reset" type="button" onClick={resetConversation} aria-label="Start a new conversation" title="New conversation">
            <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 8A6.5 6.5 0 1 1 4.7 13.7M3.5 3.8V8h4.2" /><path d="M10 6.5v3.8l2.3 1.3" /></svg>
          </button>
        </div>
      </div>

      <div className="chat-messages" ref={scrollAreaRef} aria-live="polite" aria-relevant="additions text">
        <div className="chat-day-divider"><span>START A CONVERSATION</span></div>
        {messages.map((message) => (
          <div className={`chat-message chat-message--${message.role}`} key={message.id}>
            {message.role === 'assistant' && <span className="message-avatar"><BrandSymbol small /></span>}
            <div className="chat-message__body">
              {message.role === 'assistant' && <span className="message-name">faratech_lab <span>· just now</span></span>}
              <p>{message.content}</p>
            </div>
          </div>
        ))}
        {messages.length === 1 && !loading && (
          <div className="suggested-prompts" aria-label="Suggested questions">
            {suggestedPrompts.map((prompt) => (
              <button key={prompt} type="button" onClick={() => void send(prompt)}>{prompt}<span aria-hidden="true">↗</span></button>
            ))}
          </div>
        )}
        {loading && (
          <div className="chat-message chat-message--assistant chat-typing" role="status" aria-label="faratech_lab is thinking">
            <span className="message-avatar"><BrandSymbol small /></span>
            <div className="chat-message__body"><span className="message-name">faratech_lab <span>thinking</span></span><div className="typing-dots"><i /><i /><i /></div></div>
          </div>
        )}
        {error && <div className="chat-error" role="alert"><span>We couldn’t reach faratech_lab.</span><p>{error}</p><button type="button" onClick={() => void retryLast()}>Try again ↗</button></div>}
        <div ref={endRef} />
      </div>

      <form className="chat-composer" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="faratech-chat-input">Message faratech_lab</label>
        <input
          ref={inputRef}
          id="faratech-chat-input"
          type="text"
          value={input}
          maxLength={500}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Tell us about your business…"
          disabled={loading}
          autoComplete="off"
        />
        <span className="composer-shortcut" aria-hidden="true">↵</span>
        <button className="chat-send" type="submit" disabled={!input.trim() || loading} aria-label="Send message">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M3.5 10h12M10 4.5l5.5 5.5-5.5 5.5" /></svg>
        </button>
      </form>
      <p className="chat-privacy-note"><span aria-hidden="true">✳</span> A concept assistant, built to show what’s possible.</p>
    </div>
  );
}
