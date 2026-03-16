import { motion } from 'framer-motion';
import { Rocket } from 'lucide-react';

// ── CSS for pulsing dot ────────────────────────────────────────────────────────
const PULSE_CSS = `
  @keyframes header-pulse {
    0%, 100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.7); opacity: 1; }
    50%       { box-shadow: 0 0 0 5px rgba(34,197,94,0);  opacity: 0.85; }
  }
  .header-pulse-dot {
    animation: header-pulse 2s ease-in-out infinite;
  }
`;

const NAV_ITEMS = [
  { label: 'APOD',  sub: 'Picture of the Day',  hash: '#/'       },
  { label: 'NeoWs', sub: 'Near-Earth Objects',  hash: '#/neows'  },
];

interface HeaderProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
}

export default function Header({ currentRoute, onNavigate }: HeaderProps) {
  return (
    <>
      <style>{PULSE_CSS}</style>
      <motion.header
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '64px',
          background: 'rgba(5,10,20,0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(0,212,255,0.1)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        {/* ── Left: Brand ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', flexShrink: 0 }}>
          <Rocket size={20} color="var(--accent-blue)" strokeWidth={1.75} />

          {/* Live pulse dot */}
          <span
            className="header-pulse-dot"
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block',
              flexShrink: 0,
            }}
          />

          {/* Brand text */}
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '1rem',
                color: '#fff',
                letterSpacing: '0.04em',
              }}
            >
              NASA MISSION CONTROL
            </span>
            <span
              style={{
                fontSize: '0.7rem',
                color: 'var(--text-muted)',
                letterSpacing: '0.06em',
                fontFamily: 'var(--font-body)',
              }}
            >
              LIVE DATA FEED
            </span>
          </div>
        </div>

        {/* ── Right: Nav ── */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          {NAV_ITEMS.map(({ label, sub, hash }) => {
            const route = hash.replace('#', '') || '/';
            const active = currentRoute === route;
            return (
              <div
                key={label}
                onClick={() => onNavigate(route)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  opacity: 1,
                  transition: 'background 150ms ease',
                  lineHeight: 1.25,
                  background: active ? 'rgba(0,212,255,0.08)' : 'transparent',
                }}
                onMouseEnter={e => {
                  if (!active) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.background = active ? 'rgba(0,212,255,0.08)' : 'transparent';
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    color: active ? 'var(--accent-blue)' : 'var(--text-muted)',
                    textDecoration: active ? 'underline' : 'none',
                    textDecorationColor: 'rgba(0,212,255,0.4)',
                    textUnderlineOffset: '3px',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '0.65rem',
                    color: 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {sub}
                </span>
              </div>
            );
          })}
        </nav>
      </motion.header>
    </>
  );
}
