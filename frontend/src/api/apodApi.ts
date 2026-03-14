import axios, { AxiosError } from 'axios';
import { APODResponse } from '../types/apod';

// ── Axios Instance ────────────────────────────────────────────────────────────
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001/api',
  timeout: 15000,
});

// ── Error Normaliser ──────────────────────────────────────────────────────────
function normaliseError(err: unknown, fallback: string): never {
  const axiosErr = err as AxiosError<{ message?: string; error?: boolean }>;
  if (axiosErr.response?.data?.message) {
    throw new Error(axiosErr.response.data.message);
  }
  if (axiosErr.message === 'Network Error' || axiosErr.code === 'ERR_NETWORK') {
    throw new Error('Unable to reach the server. Is the backend running?');
  }
  if (axiosErr.code === 'ECONNABORTED') {
    throw new Error('Request timed out. Please try again.');
  }
  throw new Error(fallback);
}

// ── fetchAPOD ─────────────────────────────────────────────────────────────────
export async function fetchAPOD(date?: string): Promise<APODResponse> {
  try {
    const params = date ? { date } : {};
    const { data } = await api.get<APODResponse>('/apod', { params });
    return data;
  } catch (err) {
    return normaliseError(err, 'Failed to fetch the Astronomy Picture of the Day.');
  }
}

// ── fetchAPODRange ────────────────────────────────────────────────────────────
export async function fetchAPODRange(
  startDate: string,
  endDate: string
): Promise<APODResponse[]> {
  try {
    const { data } = await api.get<APODResponse[]>('/apod/range', {
      params: { start_date: startDate, end_date: endDate },
    });
    return data;
  } catch (err) {
    return normaliseError(err, 'Failed to fetch the APOD date range.');
  }
}

// ── generateBriefing ──────────────────────────────────────────────────────────
export async function generateBriefing(apod: APODResponse): Promise<string> {
  try {
    const { data } = await api.post<{ briefing: string }>('/ai/briefing', {
      title: apod.title,
      date: apod.date,
      explanation: apod.explanation,
      mediaType: apod.media_type,
    });
    return data.briefing;
  } catch (err) {
    return normaliseError(err, 'Failed to generate the AI mission briefing.');
  }
}

export default api;
