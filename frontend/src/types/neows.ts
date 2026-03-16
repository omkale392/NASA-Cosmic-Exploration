// ── Raw NASA NeoWs API response shapes ────────────────────────────────────────

interface NeoWsEstimatedDiameter {
  estimated_diameter_min: number;
  estimated_diameter_max: number;
}

interface NeoWsEstimatedDiameters {
  kilometers: NeoWsEstimatedDiameter;
  meters:     NeoWsEstimatedDiameter;
  miles:      NeoWsEstimatedDiameter;
  feet:       NeoWsEstimatedDiameter;
}

interface NeoWsRelativeVelocity {
  kilometers_per_second: string;
  kilometers_per_hour:   string;
  miles_per_hour:        string;
}

interface NeoWsMissDistance {
  astronomical: string;
  lunar:        string;
  kilometers:   string;
  miles:        string;
}

export interface NeoWsCloseApproachData {
  close_approach_date:       string;
  close_approach_date_full:  string;
  epoch_date_close_approach: number;
  relative_velocity:         NeoWsRelativeVelocity;
  miss_distance:             NeoWsMissDistance;
  orbiting_body:             string;
}

/** Raw asteroid object as returned by the NeoWs API */
export interface NeoWsRawAsteroid {
  id:                                string;
  neo_reference_id:                  string;
  name:                              string;
  nasa_jpl_url:                      string;
  absolute_magnitude_h:              number;
  estimated_diameter:                NeoWsEstimatedDiameters;
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data:               NeoWsCloseApproachData[];
  is_sentry_object:                  boolean;
}

/** Top-level feed response */
export interface NeoWsFeedResponse {
  element_count:       number;
  near_earth_objects:  Record<string, NeoWsRawAsteroid[]>;
}

/** Top-level browse response */
export interface NeoWsBrowseResponse {
  page: {
    size:           number;
    total_elements: number;
    total_pages:    number;
    number:         number;
  };
  near_earth_objects: NeoWsRawAsteroid[];
}

// ── Cleaned / normalised shapes used by the UI ────────────────────────────────

/** Flat, normalised asteroid record used throughout the app */
export interface NeoWsAsteroid {
  id:                       string;
  name:                     string;
  /** YYYY-MM-DD of the closest approach within the queried window */
  date:                     string;
  isPotentiallyHazardous:   boolean;
  estimatedDiameterMinKm:   number;
  estimatedDiameterMaxKm:   number;
  closestApproachDate:      string;
  missDistanceKm:           number;
  missDistanceLunar:        number;
  relativeVelocityKmh:      number;
  absoluteMagnitude:        number;
}

/** Summary record used in browse listings */
export interface NeoWsAsteroidSummary {
  id:                     string;
  name:                   string;
  isPotentiallyHazardous: boolean;
  absoluteMagnitude:      number;
  estimatedDiameterMinKm: number;
  estimatedDiameterMaxKm: number;
}

/** Return type for fetchNeoBrowse */
export interface NeoWsBrowseResult {
  asteroids:   NeoWsAsteroidSummary[];
  totalPages:  number;
  currentPage: number;
}
