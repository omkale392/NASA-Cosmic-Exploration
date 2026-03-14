import { useState, useEffect, useRef, useCallback } from 'react';
import { APODResponse, AppError } from '../types/apod';
import { generateBriefing } from '../api/apodApi';

interface UseBriefingResult {
  briefing: string | null;
  loading: boolean;
  error: AppError | null;
  generate: () => void;
}

export function useBriefing(apod: APODResponse | null): UseBriefingResult {
  const [briefing, setBriefing] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AppError | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Clean up any in-flight request on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  // Reset briefing when the APOD changes
  useEffect(() => {
    setBriefing(null);
    setError(null);
  }, [apod?.date]);

  const generate = useCallback(async () => {
    if (!apod || loading) return;

    // Abort any previous request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    setLoading(true);
    setError(null);

    try {
      const result = await generateBriefing(apod);
      // Only update state if not aborted
      if (!abortRef.current.signal.aborted) {
        setBriefing(result);
      }
    } catch (err) {
      if (!abortRef.current.signal.aborted) {
        const message =
          err instanceof Error ? err.message : 'Failed to generate briefing.';
        setError({ message });
      }
    } finally {
      if (abortRef.current && !abortRef.current.signal.aborted) {
        setLoading(false);
      }
    }
  }, [apod, loading]);

  return { briefing, loading, error, generate };
}
