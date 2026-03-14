import { useState, useEffect, useCallback } from 'react';
import { APODResponse, AppError } from '../types/apod';
import { fetchAPOD } from '../api/apodApi';

const SESSION_PREFIX = 'apod_cache_';

function getCacheKey(date?: string): string {
  return `${SESSION_PREFIX}${date ?? 'today'}`;
}

function readCache(date?: string): APODResponse | null {
  try {
    const raw = sessionStorage.getItem(getCacheKey(date));
    if (!raw) return null;
    return JSON.parse(raw) as APODResponse;
  } catch {
    return null;
  }
}

function writeCache(data: APODResponse, date?: string): void {
  try {
    sessionStorage.setItem(getCacheKey(date), JSON.stringify(data));
  } catch {
    // sessionStorage might be unavailable (private browsing quota, etc.)
  }
}

interface UseAPODResult {
  data: APODResponse | null;
  loading: boolean;
  error: AppError | null;
  refetch: () => void;
}

export function useAPOD(date?: string): UseAPODResult {
  const [data, setData] = useState<APODResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AppError | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    // Check sessionStorage cache first
    const cached = readCache(date);
    if (cached) {
      setData(cached);
      setLoading(false);
      return;
    }

    try {
      const result = await fetchAPOD(date);
      writeCache(result, date);
      setData(result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'An unexpected error occurred.';
      setError({ message });
    } finally {
      setLoading(false);
    }
  }, [date]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
