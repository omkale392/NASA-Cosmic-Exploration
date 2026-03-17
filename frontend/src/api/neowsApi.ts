import axios from 'axios';
import {
  NeoWsFeedResponse,
  NeoWsBrowseResponse,
  NeoWsRawAsteroid,
  NeoWsAsteroid,
  NeoWsAsteroidSummary,
  NeoWsBrowseResult,
} from '../types/neows';

// ── Constants ─────────────────────────────────────────────────────────────────

const BASE_URL = '/api/neows';
const TIMEOUT  = 15000;

// ── Normalisation helpers ─────────────────────────────────────────────────────

function normaliseAsteroid(raw: NeoWsRawAsteroid, date: string): NeoWsAsteroid {
  const approach =
    raw.close_approach_data.find((a) => a.close_approach_date === date) ??
    raw.close_approach_data[0];

  return {
    id:                     raw.id,
    name:                   raw.name.replace(/[()]/g, '').trim(),
    date,
    isPotentiallyHazardous: raw.is_potentially_hazardous_asteroid,
    estimatedDiameterMinKm: raw.estimated_diameter.kilometers.estimated_diameter_min,
    estimatedDiameterMaxKm: raw.estimated_diameter.kilometers.estimated_diameter_max,
    closestApproachDate:    approach?.close_approach_date        ?? date,
    missDistanceKm:         parseFloat(approach?.miss_distance.kilometers ?? '0'),
    missDistanceLunar:      parseFloat(approach?.miss_distance.lunar       ?? '0'),
    relativeVelocityKmh:    parseFloat(approach?.relative_velocity.kilometers_per_hour ?? '0'),
    absoluteMagnitude:      raw.absolute_magnitude_h,
  };
}

function normaliseAsteroidSummary(raw: NeoWsRawAsteroid): NeoWsAsteroidSummary {
  return {
    id:                     raw.id,
    name:                   raw.name.replace(/[()]/g, '').trim(),
    isPotentiallyHazardous: raw.is_potentially_hazardous_asteroid,
    absoluteMagnitude:      raw.absolute_magnitude_h,
    estimatedDiameterMinKm: raw.estimated_diameter.kilometers.estimated_diameter_min,
    estimatedDiameterMaxKm: raw.estimated_diameter.kilometers.estimated_diameter_max,
  };
}

// ── 1. fetchNeoFeed ───────────────────────────────────────────────────────────

export async function fetchNeoFeed(
  startDate: string,
  endDate:   string
): Promise<NeoWsAsteroid[]> {
  try {
    const { data } = await axios.get<NeoWsFeedResponse>(`${BASE_URL}/feed`, {
      params: { start_date: startDate, end_date: endDate },
      timeout: TIMEOUT,
    });

    const asteroids: NeoWsAsteroid[] = [];

    for (const [date, raws] of Object.entries(data.near_earth_objects)) {
      for (const raw of raws) {
        asteroids.push(normaliseAsteroid(raw, date));
      }
    }

    asteroids.sort((a, b) =>
      a.closestApproachDate.localeCompare(b.closestApproachDate)
    );

    return asteroids;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.code === 'ECONNABORTED') {
        console.error('[NeoWs] Feed request timed out:', err.message);
      } else if (err.response) {
        console.error(`[NeoWs] Feed API error ${err.response.status}:`, err.response.data);
      } else {
        console.error('[NeoWs] Feed network error:', err.message);
      }
    } else {
      console.error('[NeoWs] Feed unexpected error:', err);
    }
    return [];
  }
}

// ── 2. fetchNeoLookup ─────────────────────────────────────────────────────────

export async function fetchNeoLookup(
  asteroidId: string
): Promise<NeoWsRawAsteroid | null> {
  try {
    const { data } = await axios.get<NeoWsRawAsteroid>(
      `${BASE_URL}/neo/${asteroidId}`,
      { timeout: TIMEOUT }
    );
    return data;
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.code === 'ECONNABORTED') {
        console.error('[NeoWs] Lookup request timed out:', err.message);
      } else if (err.response) {
        console.error(`[NeoWs] Lookup API error ${err.response.status}:`, err.response.data);
      } else {
        console.error('[NeoWs] Lookup network error:', err.message);
      }
    } else {
      console.error('[NeoWs] Lookup unexpected error:', err);
    }
    return null;
  }
}

// ── 3. fetchNeoBrowse ─────────────────────────────────────────────────────────

export async function fetchNeoBrowse(page = 0): Promise<NeoWsBrowseResult> {
  try {
    const { data } = await axios.get<NeoWsBrowseResponse>(`${BASE_URL}/neo/browse`, {
      params:  { page },
      timeout: TIMEOUT,
    });

    return {
      asteroids:   data.near_earth_objects.map(normaliseAsteroidSummary),
      totalPages:  data.page.total_pages,
      currentPage: data.page.number,
    };
  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      if (err.code === 'ECONNABORTED') {
        console.error('[NeoWs] Browse request timed out:', err.message);
      } else if (err.response) {
        console.error(`[NeoWs] Browse API error ${err.response.status}:`, err.response.data);
      } else {
        console.error('[NeoWs] Browse network error:', err.message);
      }
    } else {
      console.error('[NeoWs] Browse unexpected error:', err);
    }
    return { asteroids: [], totalPages: 0, currentPage: page };
  }
}