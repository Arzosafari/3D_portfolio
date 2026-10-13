import { useCallback, useState } from 'react';

export type AiStatus = 'idle' | 'loading' | 'success' | 'error';

/**
 * Shared request state for every AI Lab tool: one place for loading, success
 * and honest error handling so the tools stay small and behave consistently.
 */
export function useAiAction<T>() {
  const [status, setStatus] = useState<AiStatus>('idle');
  const [result, setResult] = useState<T | null>(null);
  const [error, setError] = useState('');

  const run = useCallback(async (action: () => Promise<T>): Promise<T | null> => {
    setStatus('loading');
    setError('');
    try {
      const value = await action();
      setResult(value);
      setStatus('success');
      return value;
    } catch (cause) {
      setResult(null);
      setError(cause instanceof Error ? cause.message : 'Something went wrong. Please try again.');
      setStatus('error');
      return null;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError('');
  }, []);

  return { status, result, error, run, reset };
}
