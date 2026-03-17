import { Router, Request, Response, NextFunction } from 'express';
import axios, { AxiosError } from 'axios';

const router = Router();
const NASA_NEOWS_BASE = 'https://api.nasa.gov/neo/rest/v1';

async function fetchFromNasa(path: string, params: Record<string, unknown>): Promise<unknown> {
  const apiKey = process.env.NASA_API_KEY || 'DEMO_KEY';
  try {
    const response = await axios.get(`${NASA_NEOWS_BASE}${path}`, {
      params: { api_key: apiKey, ...params },
    });
    return response.data;
  } catch (err) {
    const axiosErr = err as AxiosError<{ error?: { message?: string } }>;
    if (axiosErr.response) {
      throw Object.assign(new Error('NASA NeoWs API error'), { statusCode: axiosErr.response.status });
    }
    throw new Error('Failed to reach NASA NeoWs API.');
  }
}

router.get('/feed', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { start_date, end_date } = req.query as { start_date?: string; end_date?: string };
    if (!start_date || !end_date) {
      return res.status(400).json({ error: true, message: 'start_date and end_date are required.' });
    }
    const data = await fetchFromNasa('/feed', { start_date, end_date });
    return res.json(data);
  } catch (err) { return next(err); }
});

router.get('/neo/browse', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 0 } = req.query as { page?: number };
    const data = await fetchFromNasa('/neo/browse', { page });
    return res.json(data);
  } catch (err) { return next(err); }
});

router.get('/neo/:asteroidId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { asteroidId } = req.params;
    const data = await fetchFromNasa(`/neo/${asteroidId}`, {});
    return res.json(data);
  } catch (err) { return next(err); }
});

export default router

