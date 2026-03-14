import request from 'supertest';
import axios from 'axios';
import app from '../index';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Valid APOD shape returned by NASA API
const MOCK_APOD = {
  date: '2024-01-10',
  title: 'A Starry Night',
  explanation: 'Stars fill the sky.',
  url: 'https://apod.nasa.gov/apod/image/test.jpg',
  hdurl: 'https://apod.nasa.gov/apod/image/test_hd.jpg',
  media_type: 'image',
  service_version: 'v1',
};

const MOCK_RANGE = [MOCK_APOD, { ...MOCK_APOD, date: '2024-01-11' }];

beforeEach(() => {
  jest.clearAllMocks();
});

// ── GET /api/apod ─────────────────────────────────────────────────────────────

describe('GET /api/apod', () => {
  it('returns 200 with valid APOD shape when no date provided', async () => {
    mockedAxios.get = jest.fn().mockResolvedValueOnce({ data: MOCK_APOD });

    const res = await request(app).get('/api/apod');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('title');
    expect(res.body).toHaveProperty('date');
    expect(res.body).toHaveProperty('url');
  });

  it('returns 200 with valid APOD shape for a specific date', async () => {
    mockedAxios.get = jest.fn().mockResolvedValueOnce({ data: MOCK_APOD });

    const res = await request(app).get('/api/apod?date=2024-01-10');
    expect(res.status).toBe(200);
    expect(res.body.title).toBe('A Starry Night');
    expect(res.body.date).toBe('2024-01-10');
  });

  it('returns 400 when date is not in YYYY-MM-DD format', async () => {
    const res = await request(app).get('/api/apod?date=not-a-date');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
  });

  it('returns 400 for a future date', async () => {
    const res = await request(app).get('/api/apod?date=2099-01-01');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
  });

  it('returns 400 for a date before the APOD epoch (1995-06-16)', async () => {
    const res = await request(app).get('/api/apod?date=1990-01-01');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
  });
});

// ── GET /api/apod/range ───────────────────────────────────────────────────────

describe('GET /api/apod/range', () => {
  it('returns 200 with array for a valid range', async () => {
    mockedAxios.get = jest.fn().mockResolvedValueOnce({ data: MOCK_RANGE });

    const res = await request(app).get(
      '/api/apod/range?start_date=2024-01-01&end_date=2024-01-15'
    );
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('returns 400 when range exceeds 90 days', async () => {
    const res = await request(app).get(
      '/api/apod/range?start_date=2024-01-01&end_date=2024-04-30'
    );
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
  });

  it('returns 400 when start_date is missing', async () => {
    const res = await request(app).get('/api/apod/range?end_date=2024-01-15');
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
  });

  it('returns 400 when start_date is after end_date', async () => {
    const res = await request(app).get(
      '/api/apod/range?start_date=2024-01-15&end_date=2024-01-01'
    );
    expect(res.status).toBe(400);
    expect(res.body.error).toBe(true);
  });
});
