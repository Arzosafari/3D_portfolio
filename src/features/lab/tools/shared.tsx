import { useState } from 'react';

/** Small shared pieces for the AI Lab tools. */

export function CopyButton({ text, label = 'Copy result' }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button className="ailab-copy" type="button" onClick={copy} aria-live="polite">
      {copied ? 'Copied ✓' : label}
    </button>
  );
}

/** Honest labelling: what this output is, and what it is not. */
export function LabNote({ children }: { children: React.ReactNode }) {
  return <p className="ailab-note">{children}</p>;
}

export function LabError({ message }: { message: string }) {
  return (
    <p className="ailab-error" role="alert">
      <span aria-hidden="true">!</span> {message}
    </p>
  );
}

export function Loading({ label }: { label: string }) {
  return (
    <p className="ailab-loading" role="status">
      <span className="ailab-spinner" aria-hidden="true" />
      {label}
    </p>
  );
}
