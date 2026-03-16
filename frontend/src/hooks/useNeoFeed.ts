import { useState, useCallback, useEffect } from 'react';
import { fetchNeoFeed } from '../api/neowsApi';
import { NeoWsAsteroid } from '../types/neows';

interface UseNeoFeedResult {
  asteroids: NeoWsAsteroid[];
  loading: boolean;
  error: string | null;
  fetch: (startDate: string, endDate: string) => void;
}

export function useNeoFeed(
  initialStart: string,
  initialEnd: string
): UseNeoFeedResult {
  const [asteroids, setAsteroids] = useState<NeoWsAsteroid[]>([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState<string | null>(null);

  const load = useCallback(async (startDate: string, endDate: string) => {
    let mounted = true;
    setLoading(true);
    setError(null);
    const result = await fetchNeoFeed(startDate, endDate);
    if (!mounted) return;
    if (result.length === 0) {
      setError('No asteroid data returned for this date range.');
    }
    setAsteroids(result);
    setLoading(false);
    return () => { mounted = false; };
  }, []);

  // Auto-fetch on mount with the initial date range
  useEffect(() => {
    load(initialStart, initialEnd);
  }, [load, initialStart, initialEnd]);

  return { asteroids, loading, error, fetch: load };
}
