import { useState } from 'react';
import { motion } from 'framer-motion';
import { format, subDays } from 'date-fns';
import { useNeoFeed } from '../../hooks/useNeoFeed';
import { NeoWsAsteroid } from '../../types/neows';

// ── Date helpers ──────────────────────────────────────────────────────────────

function today(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

function sevenDaysAgo(): string {
  return format(subDays(new Date(), 7), 'yyyy-MM-dd');
}

function daysBetween(a: string, b: string): number {
  return Math.round(
    (new Date(b).getTime() - new Date(a).getTime()) / (1000 * 60 * 60 * 24)
  );
}

// ── CSS ───────────────────────────────────────────────────────────────────────

const NEOWS_CSS = `
  @keyframes neows-pulse {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 1.0; }
  }
  .neows-skeleton {
    background: #1e2a45;
    border-radius: 6px;
    animation: neows-pulse 1.2s ease-in-out infinite;
  }
  .neows-date-input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(0,212,255,0.2);
    border-radius: 6px;
    color: #ffffff;
    font-family: var(--font-body);
    font-size: 0.85rem;
    padding: 6px 10px;
    outline: none;
    color-scheme: dark;
  }
  .neows-date-input:focus {
    border-color: rgba(0,212,255,0.55);
  }
  .neows-search-btn {
    padding: 6px 18px;
    border-radius: 6px;
    border: 1px solid #00d4ff;
    background: rgba(0,0,0,0.5);
    color: #ffffff;
    font-family: var(--font-body);
    font-weight: 600;
    font-size: 0.85rem;
    cursor: pointer;
    transition: background 150ms ease;
    white-space: nowrap;
  }
  .neows-search-btn:hover {
    background: rgba(0,212,255,0.12);
  }
`;

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string;
  loading: boolean;
}

function StatCard({ label, value, loading }: StatCardProps) {
  return (
    <div style={{
      flex: '1 1 140px',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(0,212,255,0.1)',
      borderRadius: '12px',
      padding: '1rem 1.25rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.35rem',
    }}>
      {loading ? (
        <div className="neows-skeleton" style={{ height: '2rem', width: '60%' }} />
      ) : (
        <div style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '1.75rem',
          fontWeight: 700,
          color: '#ffffff',
          lineHeight: 1,
        }}>
          {value}
        </div>
      )}
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.72rem',
        color: 'rgba(180,200,230,0.55)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        fontWeight: 600,
      }}>
        {label}
      </div>
    </div>
  );
}

// ── Asteroid list ─────────────────────────────────────────────────────────────

interface AsteroidListProps {
  asteroids: NeoWsAsteroid[];
  loading: boolean;
}

// ── Helpers for the list ──────────────────────────────────────────────────────

function formatVelocity(kmh: number): string {
  return kmh.toLocaleString('en-US', { maximumFractionDigits: 0 }) + ' km/h';
}

function formatDiameter(minKm: number, maxKm: number): string {
  return `${minKm.toFixed(2)} - ${maxKm.toFixed(2)} km`;
}

function missDistanceColor(ld: number): string {
  if (ld > 10) return '#4cff91';
  if (ld >= 3)  return '#ffd166';
  return '#ff3b3b';
}

function HazardBadge({ hazardous }: { hazardous: boolean }) {
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '20px',
      background: hazardous ? '#ff3b3b' : '#1a7a4a',
      color: '#ffffff',
      fontFamily: 'var(--font-body)',
      fontSize: '0.6rem',
      fontWeight: 700,
      letterSpacing: '0.06em',
    }}>
      {hazardous ? 'HAZARDOUS' : 'SAFE'}
    </span>
  );
}

// ── Column definitions ────────────────────────────────────────────────────────

type SortKey = 'missDistance' | 'velocity' | 'diameter';
type SortDir = 'asc' | 'desc';

interface SortState {
  column: SortKey | null;
  direction: SortDir;
}

interface ColDef {
  label: string;
  sortKey?: SortKey;
}

const COLUMNS: ColDef[] = [
  { label: 'Name' },
  { label: 'Closest Approach' },
  { label: 'Miss Distance (LD)', sortKey: 'missDistance' },
  { label: 'Velocity',           sortKey: 'velocity'     },
  { label: 'Diameter (km)',      sortKey: 'diameter'     },
  { label: 'Status' },
];

const GRID = '2fr 1fr 1fr 1.4fr 1.4fr 1fr';

function sortAsteroids(
  asteroids: NeoWsAsteroid[],
  sort: SortState
): NeoWsAsteroid[] {
  if (!sort.column) {
    // Default: approach date ascending
    return [...asteroids].sort((a, b) =>
      a.closestApproachDate.localeCompare(b.closestApproachDate)
    );
  }
  return [...asteroids].sort((a, b) => {
    let av = 0, bv = 0;
    if (sort.column === 'missDistance') {
      av = a.missDistanceLunar; bv = b.missDistanceLunar;
    } else if (sort.column === 'velocity') {
      av = a.relativeVelocityKmh; bv = b.relativeVelocityKmh;
    } else if (sort.column === 'diameter') {
      av = a.estimatedDiameterMinKm; bv = b.estimatedDiameterMinKm;
    }
    return sort.direction === 'asc' ? av - bv : bv - av;
  });
}

function nextSort(current: SortState, clicked: SortKey): SortState {
  if (current.column !== clicked) {
    return { column: clicked, direction: 'asc' };
  }
  if (current.direction === 'asc') {
    return { column: clicked, direction: 'desc' };
  }
  // Third click: reset
  return { column: null, direction: 'asc' };
}

function sortIndicator(sort: SortState, key: SortKey): string {
  if (sort.column !== key) return '';
  return sort.direction === 'asc' ? ' (^)' : ' (v)';
}

function AsteroidList({ asteroids, loading }: AsteroidListProps) {
  const [sort, setSort] = useState<SortState>({ column: null, direction: 'asc' });

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="neows-skeleton"
            style={{ height: '44px', borderRadius: '4px' }}
          />
        ))}
      </div>
    );
  }

  if (asteroids.length === 0) {
    return (
      <div style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.875rem',
        color: 'rgba(180,200,230,0.5)',
        textAlign: 'center',
        padding: '2rem 0',
      }}>
        No asteroids found for this range.
      </div>
    );
  }

  const sorted = sortAsteroids(asteroids, sort);

  return (
    <div style={{ width: '100%' }}>
      {/* Header row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: GRID,
        padding: '8px 16px',
        borderBottom: '1px solid #1e2a45',
      }}>
        {COLUMNS.map(({ label, sortKey }) => (
          <span
            key={label}
            onClick={sortKey ? () => setSort((s) => nextSort(s, sortKey)) : undefined}
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.65rem',
              color: sortKey && sort.column === sortKey
                ? '#00d4ff'
                : 'rgba(0,212,255,0.6)',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              fontWeight: 600,
              cursor: sortKey ? 'pointer' : 'default',
              userSelect: 'none',
            }}
          >
            {label}{sortKey ? sortIndicator(sort, sortKey) : ''}
          </span>
        ))}
      </div>

      {/* Data rows */}
      {sorted.map((a, i) => (
        <div
          key={a.id}
          style={{
            display: 'grid',
            gridTemplateColumns: GRID,
            padding: '10px 16px',
            background: i % 2 === 0 ? '#0f1320' : '#141828',
            borderBottom: '1px solid #1e2a45',
            alignItems: 'center',
          }}
        >
          {/* Name */}
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: '#ffffff',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            paddingRight: '0.5rem',
          }}>
            {a.name}
          </span>

          {/* Closest Approach */}
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'rgba(200,215,240,0.8)',
          }}>
            {a.closestApproachDate}
          </span>

          {/* Miss Distance — color coded */}
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            fontWeight: 600,
            color: missDistanceColor(a.missDistanceLunar),
          }}>
            {a.missDistanceLunar.toFixed(2)}
          </span>

          {/* Relative Velocity */}
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'rgba(200,215,240,0.8)',
          }}>
            {formatVelocity(a.relativeVelocityKmh)}
          </span>

          {/* Estimated Diameter */}
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.85rem',
            color: 'rgba(200,215,240,0.8)',
          }}>
            {formatDiameter(a.estimatedDiameterMinKm, a.estimatedDiameterMaxKm)}
          </span>

          {/* Hazard badge */}
          <span>
            <HazardBadge hazardous={a.isPotentiallyHazardous} />
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export default function NeoWs() {
  const defaultStart = sevenDaysAgo();
  const defaultEnd   = today();

  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate,   setEndDate]   = useState(defaultEnd);
  const [rangeError, setRangeError] = useState<string | null>(null);

  const { asteroids, loading, fetch } = useNeoFeed(defaultStart, defaultEnd);

  // ── Derived stats ──
  const totalCount     = asteroids.length;
  const hazardousCount = asteroids.filter((a) => a.isPotentiallyHazardous).length;
  const closestLD      = asteroids.length > 0
    ? Math.min(...asteroids.map((a) => a.missDistanceLunar)).toFixed(2)
    : '--';

  // ── Search handler ──
  function handleSearch() {
    if (daysBetween(startDate, endDate) > 7) {
      setRangeError('Max range is 7 days');
      return;
    }
    setRangeError(null);
    fetch(startDate, endDate);
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}
    >
      <style>{NEOWS_CSS}</style>

      {/* ── Hero ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <h1 style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
          color: '#ffffff',
          margin: 0,
          lineHeight: 1.15,
        }}>
          Near-Earth Objects
        </h1>
        <div style={{
          fontFamily: 'var(--font-body)',
          fontWeight: 400,
          fontSize: '1.2rem',
          color: '#00d4ff',
          lineHeight: 1,
        }}>
          Asteroid Tracker
        </div>
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: '0.875rem',
          color: 'rgba(180,200,230,0.65)',
          lineHeight: 1.7,
          margin: '0.5rem 0 0',
          maxWidth: '60ch',
        }}>
          Tracking asteroids and comets that pass within 1.3 AU of the Sun.
          Data sourced from NASA JPL Small Body Database.
        </p>
      </div>

      {/* ── Date range selector ── */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '0.75rem',
        }}>
          {/* From */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <label style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              color: 'rgba(180,200,230,0.7)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              From:
            </label>
            <input
              type="date"
              className="neows-date-input"
              value={startDate}
              max={endDate}
              onChange={(e) => { setStartDate(e.target.value); setRangeError(null); }}
            />
          </div>

          {/* To */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <label style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.8rem',
              color: 'rgba(180,200,230,0.7)',
              fontWeight: 600,
              whiteSpace: 'nowrap',
            }}>
              To:
            </label>
            <input
              type="date"
              className="neows-date-input"
              value={endDate}
              min={startDate}
              max={today()}
              onChange={(e) => { setEndDate(e.target.value); setRangeError(null); }}
            />
          </div>

          <button className="neows-search-btn" onClick={handleSearch}>
            Search
          </button>
        </div>

        {/* Inline range error */}
        {rangeError && (
          <div style={{
            fontFamily: 'var(--font-body)',
            fontSize: '0.78rem',
            color: '#ff6b6b',
            marginLeft: '2px',
          }}>
            {rangeError}
          </div>
        )}
      </div>

      {/* ── Stats bar ── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
        <StatCard
          label="Total Asteroids"
          value={String(totalCount)}
          loading={loading}
        />
        <StatCard
          label="Potentially Hazardous"
          value={String(hazardousCount)}
          loading={loading}
        />
        <StatCard
          label="Closest Approach"
          value={closestLD === '--' ? '--' : `${closestLD} LD`}
          loading={loading}
        />
      </div>

      {/* ── Asteroid list ── */}
      <AsteroidList asteroids={asteroids} loading={loading} />
    </motion.div>
  );
}
