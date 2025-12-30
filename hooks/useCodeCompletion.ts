
import { useCallback, useState, useRef } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import type { CodeCompletionRequest, CodeCompletionResponse } from '@/types/codeCompletion';

type State =
  | { status: 'idle'; data: null; error: null }
  | { status: 'loading'; data: null; error: null }
  | { status: 'success'; data: CodeCompletionResponse; error: null }
  | { status: 'error'; data: null; error: string };

export function useCodeCompletion() {
  const [state, setState] = useState<State>({ status: 'idle', data: null, error: null });
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    setState({ status: 'idle', data: null, error: null });
  }, []);

  const abort = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const complete = useCallback(async (params: CodeCompletionRequest): Promise<CodeCompletionResponse | null> => {
    const code = (params.code ?? '').trim();
    if (!code) {
      setState({ status: 'error', data: null, error: 'Code is required' });
      return null;
    }

    setState({ status: 'loading', data: null, error: null });

    try {
      const controller = new AbortController();
      abortRef.current = controller;

      const { data, error } = await supabase.functions.invoke('code-completion', {
        body: {
          code,
          language: params.language || 'javascript',
          cursorPosition: params.cursorPosition,
          model: params.model,
          temperature: params.temperature ?? 0.2,
          maxTokens: params.maxTokens ?? 500,
        },
      });

      if (error) {
        throw new Error(error.message || 'Function error');
      }

      const result = data as CodeCompletionResponse;
      setState({ status: 'success', data: result, error: null });
      return result;
    } catch (e: any) {
      if (e?.name === 'AbortError') {
        return null;
      }
      const errorMessage = e?.message ?? 'Unknown error';
      setState({ status: 'error', data: null, error: errorMessage });
      return null;
    } finally {
      abortRef.current = null;
    }
  }, []);

  const loading = state.status === 'loading';
  const error = state.status === 'error' ? state.error : null;
  const data = state.status === 'success' ? state.data : null;

  return {
    complete,
    loading,
    error,
    data,
    reset,
    abort,
  };
}
