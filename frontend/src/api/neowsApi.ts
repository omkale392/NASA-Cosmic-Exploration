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

const API_KEY  = 'DEMO_KEY';
const BASE_URL = 'https://api.nasa.gov/neo/rest/v1';
const TIMEOUT  = 15000;

// ── Normalisation helpers ─────────────────────────────────────────────────────

/**
 * Convert a raw asteroid + its approach date key into the flat NeoWsAsteroid
 * shape used by the UI.  Uses the first entry in close_approach_data that
 * matches the given date, or falls back to the first entry overall.
 */
function normaliseAsteroid(raw: NeoWsRawAsteroid, date: string): NeoWsAsteroid {
  // Prefer approach data on the queried date; fall back to index 0
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

/**
 * Convert a raw asteroid into the lightweight summary shape used in browse
 * listings.
 */
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

/**
 * Fetch near-Earth objects for a date range from the NeoWs feed endpoint.
 *
 * GET https://api.nasa.gov/neo/rest/v1/feed
 *
 * @param startDate - YYYY-MM-DD start of the window (max 7-day range)
 * @param endDate   - YYYY-MM-DD end of the window
 * @returns Flat array of normalised asteroids sorted by closestApproachDate
 *          ascending. Returns an empty array on failure.
 */
export async function fetchNeoFeed(
  startDate: string,
  endDate:   string
): Promise<NeoWsAsteroid[]> {
  try {
    const { data } = await axios.get<NeoWsFeedResponse>(`${BASE_URL}/feed`, {
      params: { start_date: startDate, end_date: endDate, api_key: API_KEY },
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

/**
 * Fetch full details for a single asteroid by its SPK-ID.
 *
 * GET https://api.nasa.gov/neo/rest/v1/neo/{asteroid_id}
 *
 * @param asteroidId - The SPK-ID of the asteroid
 * @returns Full raw asteroid object, or null on failure.
 */
export async function fetchNeoLookup(
  asteroidId: string
): Promise<NeoWsRawAsteroid | null> {
  try {
    const { data } = await axios.get<NeoWsRawAsteroid>(
      `${BASE_URL}/neo/${asteroidId}`,
      {
        params:  { api_key: API_KEY },
        timeout: TIMEOUT,
      }
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

/**
 * Fetch a paginated list of all tracked near-Earth asteroids.
 *
 * GET https://api.nasa.gov/neo/rest/v1/neo/browse
 *
 * @param page - Zero-based page index (default 0)
 * @returns NeoWsBrowseResult with asteroid summaries and pagination info.
 *          Returns an empty result on failure.
 */
export async function fetchNeoBrowse(page = 0): Promise<NeoWsBrowseResult> {
  try {
    const { data } = await axios.get<NeoWsBrowseResponse>(`${BASE_URL}/neo/browse`, {
      params:  { api_key: API_KEY, page },
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
