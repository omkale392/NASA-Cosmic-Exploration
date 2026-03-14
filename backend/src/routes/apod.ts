import { Router, Request, Response, NextFunction } from 'express';
import axios, { AxiosError } from 'axios';

const router = Router();

const NASA_API_BASE = 'https://api.nasa.gov/planetary/apod';
const APOD_EPOCH = new Date('1995-06-16'); // First APOD date

// ── In-Memory Cache ───────────────────────────────────────────────────────────
interface CacheEntry {
  data: unknown;
  expiresAt: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function getCached(key: string): unknown | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiresAt) {
    cache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache(key: string, data: unknown): void {
  cache.set(key, { data, expiresAt: Date.now() + CACHE_TTL_MS });
}

// ── Validation Helpers ────────────────────────────────────────────────────────
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

function parseAndValidateDate(
  dateStr: string,
  label: string
): { date: Date; error?: never } | { error: string; date?: never } {
  if (!DATE_REGEX.test(dateStr)) {
    return { error: `${label} must be in YYYY-MM-DD format.` };
  }
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { error: `${label} is not a valid calendar date.` };
  }
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  if (date < APOD_EPOCH) {
    return { error: `${label} must be on or after 1995-06-16 (first APOD date).` };
  }
  if (date > today) {
    return { error: `${label} cannot be a future date.` };
  }
  return { date };
}

// ── NASA API Helper ───────────────────────────────────────────────────────────
async function fetchFromNasa(params: Record<string, string>): Promise<unknown> {
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  try {
    const response = await axios.get(NASA_API_BASE, {
      params: { api_key: apiKey, ...params },
    });
    return response.data;
  } catch (err) {
    const axiosErr = err as AxiosError<{ msg?: string; error?: { message?: string } }>;
    if (axiosErr.response) {
      const status = axiosErr.response.status;
      const nasaMsg =
        axiosErr.response.data?.msg ||
        axiosErr.response.data?.error?.message ||
        'NASA API returned an error.';
      throw Object.assign(new Error(nasaMsg), { statusCode: status });
    }
    throw new Error('Failed to reach the NASA API. Please try again later.');
  }
}

// ── GET /api/apod?date=YYYY-MM-DD ─────────────────────────────────────────────
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date } = req.query as { date?: string };
    const params: Record<string, string> = {};

    if (date !== undefined) {
      const validated = parseAndValidateDate(date, 'date');
      if (validated.error) {
        return res.status(400).json({ error: true, message: validated.error });
      }
      params.date = date;
    }

    const cacheKey = `apod:${date ?? 'today'}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const data = await fetchFromNasa(params);
    setCache(cacheKey, data);
    return res.json(data);
  } catch (err) {
    return next(err);
  }
});

// ── GET /api/apod/range?start_date&end_date ────────────────────────────────────
router.get('/range', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { start_date, end_date } = req.query as {
      start_date?: string;
      end_date?: string;
    };

    if (!start_date || !end_date) {
      return res
        .status(400)
        .json({ error: true, message: 'Both start_date and end_date are required.' });
    }

    const startResult = parseAndValidateDate(start_date, 'start_date');
    if (startResult.error) {
      return res.status(400).json({ error: true, message: startResult.error });
    }

    const endResult = parseAndValidateDate(end_date, 'end_date');
    if (endResult.error) {
      return res.status(400).json({ error: true, message: endResult.error });
    }

    const startDate = startResult.date as Date;
    const endDate = endResult.date as Date;

    if (startDate > endDate) {
      return res
        .status(400)
        .json({ error: true, message: 'start_date must be before or equal to end_date.' });
    }

    const diffDays = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    if (diffDays > 90) {
      return res
        .status(400)
        .json({ error: true, message: 'Date range cannot exceed 90 days.' });
    }

    const cacheKey = `apod:range:${start_date}:${end_date}`;
    const cached = getCached(cacheKey);
    if (cached) {
      return res.json(cached);
    }

    const data = await fetchFromNasa({ start_date, end_date });
    setCache(cacheKey, data);
    return res.json(data);
  } catch (err) {
    return next(err);
  }
});

export default router;
