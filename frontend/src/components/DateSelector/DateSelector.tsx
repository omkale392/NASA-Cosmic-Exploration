import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DateMode } from '../../types/apod';

// ── Constants ─────────────────────────────────────────────────────────────────
const MIN_DATE_STR = '1995-06-16';
const WEEKDAY_ABBR = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_ABBR = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// ── Date Helpers ──────────────────────────────────────────────────────────────
/** Parse 'YYYY-MM-DD' as a local date (no UTC shift). */
function parseLocal(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, m - 1, d);
}

/** Format a local Date to 'YYYY-MM-DD'. */
function toStr(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Today at midnight local. */
function todayLocal(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

const MIN_DATE = parseLocal(MIN_DATE_STR);

function clampDate(d: Date): Date {
  const max = todayLocal();
  if (d > max) return max;
  if (d < MIN_DATE) return new Date(MIN_DATE);
  return d;
}

// ── Shared Styles ─────────────────────────────────────────────────────────────
const GLASS: React.CSSProperties = {
  background: 'rgba(10,22,40,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(0,212,255,0.15)',
  borderRadius: '16px',
  padding: '1.5rem',
};

const SELECTED_CARD: React.CSSProperties = {
  border: '1px solid rgba(0,212,255,0.7)',
  background: 'linear-gradient(135deg, rgba(0,212,255,0.18) 0%, rgba(124,58,237,0.15) 100%)',
  boxShadow: '0 0 14px rgba(0,212,255,0.4), inset 0 0 10px rgba(0,212,255,0.06)',
};

const DEFAULT_CARD: React.CSSProperties = {
  border: '1px solid rgba(255,255,255,0.07)',
  background: 'rgba(255,255,255,0.03)',
  boxShadow: 'none',
};

// ── Tab order for slide direction ─────────────────────────────────────────────
const TAB_ORDER: DateMode[] = ['day', 'month', 'year'];

function slideDir(from: DateMode, to: DateMode): number {
  return TAB_ORDER.indexOf(to) > TAB_ORDER.indexOf(from) ? 1 : -1;
}

// ── Props ─────────────────────────────────────────────────────────────────────
export interface DateSelectorProps {
  selectedDate: string;
  onDateChange: (d: string) => void;
  dateMode: DateMode;
  onModeChange: (m: DateMode) => void;
}

// ━━━ DateSelector ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function DateSelector({
  selectedDate,
  onDateChange,
  dateMode,
  onModeChange,
}: DateSelectorProps) {
  const [prevMode, setPrevMode] = useState<DateMode>(dateMode);
  const selected = parseLocal(selectedDate);

  function handleTabClick(mode: DateMode) {
    if (mode === dateMode) return;
    setPrevMode(dateMode);
    onModeChange(mode);
  }

  const dir = slideDir(prevMode, dateMode);

  return (
    <div style={GLASS}>
      {/* ── Pill Tabs ── */}
      <div
        style={{
          display: 'flex',
          background: 'rgba(0,0,0,0.35)',
          borderRadius: '12px',
          padding: '4px',
          marginBottom: '1.25rem',
          gap: '4px',
        }}
      >
        {TAB_ORDER.map((mode) => (
          <button
            key={mode}
            onClick={() => handleTabClick(mode)}
            style={{
              flex: 1,
              position: 'relative',
              padding: '0.45rem 0',
              borderRadius: '9px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: dateMode === mode ? '#fff' : 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
              fontWeight: 600,
              fontSize: '0.875rem',
              letterSpacing: '0.02em',
              transition: 'color 200ms ease',
              zIndex: 1,
            }}
          >
            {dateMode === mode && (
              <motion.div
                layoutId="date-tab-indicator"
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '9px',
                  background:
                    'linear-gradient(135deg, rgba(0,212,255,0.22) 0%, rgba(124,58,237,0.18) 100%)',
                  border: '1px solid rgba(0,212,255,0.45)',
                  zIndex: -1,
                }}
                transition={{ type: 'spring', stiffness: 380, damping: 32 }}
              />
            )}
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
          </button>
        ))}
      </div>

      {/* ── Mode Panels ── */}
      <AnimatePresence mode="wait" initial={false} custom={dir}>
        <motion.div
          key={dateMode}
          custom={dir}
          initial={{ opacity: 0, y: (dir as number) * 18 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: (dir as number) * -18 }}
          transition={{ duration: 0.22, ease: 'easeInOut' }}
        >
          {dateMode === 'day' && (
            <DayMode selected={selected} onDateChange={onDateChange} />
          )}
          {dateMode === 'month' && (
            <MonthMode selected={selected} onDateChange={onDateChange} />
          )}
          {dateMode === 'year' && (
            <YearMode selected={selected} onDateChange={onDateChange} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// ━━━ Day Mode ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface DayModeProps {
  selected: Date;
  onDateChange: (d: string) => void;
}

function DayMode({ selected, onDateChange }: DayModeProps) {
  // windowCenter tracks which date sits at the center of the visible strip
  const [windowCenter, setWindowCenter] = useState<Date>(selected);
  const scrollRef = useRef<HTMLDivElement>(null);
  const today = todayLocal();

  // Keep windowCenter synced when selected jumps (e.g. mode switch)
  useEffect(() => {
    setWindowCenter(selected);
  }, [toStr(selected)]); // eslint-disable-line react-hooks/exhaustive-deps

  // Build 31-day strip (±15 around center)
  const days: Date[] = [];
  for (let i = -15; i <= 15; i++) {
    days.push(addDays(windowCenter, i));
  }

  // Scroll selected card into the visible center after render
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    // selected sits at index 15 in the strip
    const CARD_W = 60 + 8; // card width + gap
    const target = 15 * CARD_W - el.clientWidth / 2 + CARD_W / 2;
    el.scrollTo({ left: Math.max(0, target), behavior: 'smooth' });
  }, [windowCenter]);

  function isDisabled(d: Date) {
    return d > today || d < MIN_DATE;
  }

  function shiftWindow(delta: number) {
    const next = clampDate(addDays(windowCenter, delta));
    setWindowCenter(next);
  }

  const canShiftRight = addDays(windowCenter, 1) <= today;
  const canShiftLeft = addDays(windowCenter, -1) >= MIN_DATE;

  return (
    <div style={{ position: 'relative' }}>
      {/* Left Arrow */}
      <NavArrow
        direction="left"
        disabled={!canShiftLeft}
        onClick={() => shiftWindow(-7)}
      />

      {/* Scrollable strip */}
      <div
        ref={scrollRef}
        style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          padding: '4px 32px',
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style>{`.ds-strip::-webkit-scrollbar{display:none}`}</style>
        {days.map((d) => {
          const disabled = isDisabled(d);
          const isSelected = toStr(d) === toStr(selected);
          const isToday = toStr(d) === toStr(today);
          return (
            <DayCard
              key={toStr(d)}
              date={d}
              disabled={disabled}
              isSelected={isSelected}
              isToday={isToday}
              onClick={() => !disabled && onDateChange(toStr(d))}
            />
          );
        })}
      </div>

      {/* Right Arrow */}
      <NavArrow
        direction="right"
        disabled={!canShiftRight}
        onClick={() => shiftWindow(7)}
      />
    </div>
  );
}

// ── Nav Arrow ─────────────────────────────────────────────────────────────────

function NavArrow({
  direction,
  disabled,
  onClick,
}: {
  direction: 'left' | 'right';
  disabled: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileTap={!disabled ? { scale: 0.88 } : {}}
      aria-label={direction === 'left' ? 'Previous days' : 'Next days'}
      style={{
        position: 'absolute',
        [direction]: 0,
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 10,
        width: '28px',
        height: '28px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10,22,40,0.9)',
        border: '1px solid rgba(0,212,255,0.25)',
        color: disabled ? 'var(--text-muted)' : 'var(--accent-blue)',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        padding: 0,
        transition: 'opacity 150ms ease',
      }}
    >
      {direction === 'left' ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
    </motion.button>
  );
}

// ── Day Card ──────────────────────────────────────────────────────────────────

interface DayCardProps {
  date: Date;
  disabled: boolean;
  isSelected: boolean;
  isToday: boolean;
  onClick: () => void;
}

function DayCard({ date, disabled, isSelected, isToday, onClick }: DayCardProps) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={!disabled ? { scale: 1.06 } : {}}
      whileTap={!disabled ? { scale: 0.94 } : {}}
      style={{
        flexShrink: 0,
        width: '60px',
        padding: '10px 0',
        borderRadius: '12px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '5px',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.28 : 1,
        transition: 'box-shadow 200ms ease, border-color 200ms ease, background 200ms ease',
        ...(isSelected ? SELECTED_CARD : DEFAULT_CARD),
      }}
    >
      <span
        style={{
          fontSize: '0.6rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          color: isSelected ? 'var(--accent-blue)' : 'var(--text-muted)',
          fontFamily: 'var(--font-body)',
        }}
      >
        {WEEKDAY_ABBR[date.getDay()]}
      </span>
      <span
        style={{
          fontSize: '1.1rem',
          fontWeight: 700,
          color: isSelected ? '#fff' : isToday ? 'var(--accent-blue)' : 'var(--text-primary)',
          fontFamily: 'var(--font-heading)',
        }}
      >
        {date.getDate()}
      </span>
      {/* Today dot when not selected */}
      {isToday && !isSelected && (
        <span
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'var(--accent-blue)',
          }}
        />
      )}
    </motion.button>
  );
}

// ━━━ Month Mode ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface MonthModeProps {
  selected: Date;
  onDateChange: (d: string) => void;
}

function MonthMode({ selected, onDateChange }: MonthModeProps) {
  const today = todayLocal();
  const [viewYear, setViewYear] = useState(selected.getFullYear());

  const currentYear = today.getFullYear();
  const currentMonth = today.getMonth();

  function isMonthDisabled(monthIdx: number): boolean {
    if (viewYear < 1995) return true;
    if (viewYear === 1995 && monthIdx < 5) return true; // before June 1995
    if (viewYear > currentYear) return true;
    if (viewYear === currentYear && monthIdx > currentMonth) return true;
    return false;
  }

  function selectMonth(monthIdx: number) {
    if (isMonthDisabled(monthIdx)) return;
    if (viewYear === currentYear && monthIdx === currentMonth) {
      onDateChange(toStr(today));
    } else {
      onDateChange(toStr(new Date(viewYear, monthIdx, 1)));
    }
  }

  return (
    <div>
      {/* Year selector */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          marginBottom: '1rem',
        }}
      >
        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => setViewYear((y) => Math.max(1995, y - 1))}
          disabled={viewYear <= 1995}
          style={{
            background: 'none',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '8px',
            padding: '4px 10px',
            color: viewYear <= 1995 ? 'var(--text-muted)' : 'var(--accent-blue)',
            cursor: viewYear <= 1995 ? 'not-allowed' : 'pointer',
            opacity: viewYear <= 1995 ? 0.35 : 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronLeft size={16} />
        </motion.button>

        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.2rem',
            fontWeight: 700,
            color: '#fff',
            minWidth: '56px',
            textAlign: 'center',
          }}
        >
          {viewYear}
        </span>

        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => setViewYear((y) => Math.min(currentYear, y + 1))}
          disabled={viewYear >= currentYear}
          style={{
            background: 'none',
            border: '1px solid rgba(0,212,255,0.2)',
            borderRadius: '8px',
            padding: '4px 10px',
            color: viewYear >= currentYear ? 'var(--text-muted)' : 'var(--accent-blue)',
            cursor: viewYear >= currentYear ? 'not-allowed' : 'pointer',
            opacity: viewYear >= currentYear ? 0.35 : 1,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <ChevronRight size={16} />
        </motion.button>
      </div>

      {/* 4×3 month grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '8px',
        }}
      >
        {MONTH_ABBR.map((name, i) => {
          const disabled = isMonthDisabled(i);
          const isSelected =
            selected.getFullYear() === viewYear && selected.getMonth() === i;
          return (
            <motion.button
              key={name}
              onClick={() => selectMonth(i)}
              whileHover={!disabled ? { scale: 1.06 } : {}}
              whileTap={!disabled ? { scale: 0.94 } : {}}
              style={{
                padding: '0.55rem 0',
                borderRadius: '10px',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.28 : 1,
                color: isSelected ? 'var(--accent-blue)' : disabled ? 'var(--text-muted)' : 'var(--text-primary)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.875rem',
                fontWeight: 600,
                transition: 'box-shadow 200ms ease, border-color 200ms ease, background 200ms ease',
                ...(isSelected ? SELECTED_CARD : DEFAULT_CARD),
              }}
            >
              {name}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

// ━━━ Year Mode ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface YearModeProps {
  selected: Date;
  onDateChange: (d: string) => void;
}

function YearMode({ selected, onDateChange }: YearModeProps) {
  const today = todayLocal();
  const currentYear = today.getFullYear();

  const years: number[] = [];
  for (let y = 1995; y <= currentYear; y++) years.push(y);

  // Chunk into rows of 5
  const rows: number[][] = [];
  for (let i = 0; i < years.length; i += 5) rows.push(years.slice(i, i + 5));

  function selectYear(y: number) {
    if (y === currentYear) {
      onDateChange(toStr(today));
    } else {
      onDateChange(`${y}-01-01`);
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: 'flex', gap: '8px' }}>
          {row.map((y, ci) => {
            const isSelected = selected.getFullYear() === y;
            const itemIndex = ri * 5 + ci;
            return (
              <motion.button
                key={y}
                onClick={() => selectYear(y)}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: itemIndex * 0.022,
                  duration: 0.2,
                  ease: 'easeOut',
                }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                style={{
                  flex: 1,
                  padding: '0.5rem 0',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  color: isSelected ? 'var(--accent-blue)' : 'var(--text-primary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  transition: 'box-shadow 200ms ease, border-color 200ms ease, background 200ms ease',
                  ...(isSelected ? SELECTED_CARD : DEFAULT_CARD),
                }}
              >
                {y}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}
