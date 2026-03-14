import React, { memo, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { RefreshCw, Sparkles } from 'lucide-react';

// ── Props ─────────────────────────────────────────────────────────────────────
export interface MissionBriefingProps {
  briefing: string | null;
  loading: boolean;
  error: string | null;
  onRegenerate: () => void;
}

// ━━━ useTypewriter ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function useTypewriter(text: string, speed = 8): string {
  const [displayed, setDisplayed] = useState('');
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const indexRef = useRef(0);

  useEffect(() => {
    // Reset when text changes
    setDisplayed('');
    indexRef.current = 0;

    if (!text) return;

    intervalRef.current = setInterval(() => {
      indexRef.current += 1;
      setDisplayed(text.slice(0, indexRef.current));
      if (indexRef.current >= text.length) {
        clearInterval(intervalRef.current!);
      }
    }, speed);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [text, speed]);

  return displayed;
}

// ━━━ parseMarkdown ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function parseMarkdown(text: string): React.ReactNode {
  const lines = text.split('\n');
  const nodes: React.ReactNode[] = [];
  let key = 0;

  // Inline bold: **text** → <strong>
  function renderInline(raw: string): React.ReactNode {
    const parts = raw.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={i} style={{ color: '#e2e8f0', fontWeight: 700 }}>
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // ### Heading
    if (line.startsWith('### ')) {
      nodes.push(
        <h3
          key={key++}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#fff',
            borderLeft: '3px solid var(--accent-blue)',
            paddingLeft: '12px',
            marginBottom: '8px',
            marginTop: i === 0 ? 0 : '1.25rem',
          }}
        >
          {renderInline(line.slice(4))}
        </h3>
      );
      continue;
    }

    // ## Heading (fallback)
    if (line.startsWith('## ')) {
      nodes.push(
        <h3
          key={key++}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#fff',
            borderLeft: '3px solid var(--accent-blue)',
            paddingLeft: '12px',
            marginBottom: '8px',
            marginTop: i === 0 ? 0 : '1.25rem',
          }}
        >
          {renderInline(line.slice(3))}
        </h3>
      );
      continue;
    }

    // # Heading (fallback)
    if (line.startsWith('# ')) {
      nodes.push(
        <h3
          key={key++}
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.1rem',
            fontWeight: 700,
            color: '#fff',
            borderLeft: '3px solid var(--accent-blue)',
            paddingLeft: '12px',
            marginBottom: '8px',
            marginTop: i === 0 ? 0 : '1.25rem',
          }}
        >
          {renderInline(line.slice(2))}
        </h3>
      );
      continue;
    }

    // --- HR
    if (line.trim() === '---') {
      nodes.push(
        <hr
          key={key++}
          style={{
            border: 'none',
            borderTop: '1px solid rgba(0,212,255,0.2)',
            margin: '1rem 0',
          }}
        />
      );
      continue;
    }

    // * Bullet
    if (line.startsWith('* ') || line.startsWith('- ')) {
      nodes.push(
        <li
          key={key++}
          style={{
            listStyle: 'none',
            paddingLeft: '16px',
            position: 'relative',
            marginBottom: '6px',
            color: 'var(--text-muted)',
            fontSize: '0.9rem',
            lineHeight: 1.7,
          }}
        >
          {/* Cyan dot */}
          <span
            style={{
              position: 'absolute',
              left: 0,
              top: '0.55em',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: 'var(--accent-blue)',
              display: 'inline-block',
            }}
          />
          {renderInline(line.slice(2))}
        </li>
      );
      continue;
    }

    // Empty line → spacer
    if (line.trim() === '') {
      nodes.push(<div key={key++} style={{ height: '0.4rem' }} />);
      continue;
    }

    // Plain paragraph
    nodes.push(
      <p
        key={key++}
        style={{
          color: 'var(--text-muted)',
          fontSize: '0.9rem',
          lineHeight: 1.8,
          marginBottom: '8px',
        }}
      >
        {renderInline(line)}
      </p>
    );
  }

  return <>{nodes}</>;
}

// ━━━ CSS strings ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const LOADING_CSS = `
  @keyframes mb-scan {
    0%   { top: 0%; opacity: 1; }
    90%  { top: 100%; opacity: 1; }
    100% { top: 100%; opacity: 0; }
  }
  @keyframes mb-scanfade {
    0%   { opacity: 0; }
    5%   { opacity: 1; }
    90%  { opacity: 1; }
    100% { opacity: 0; }
  }
`;

// ━━━ MissionBriefing ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const MissionBriefing = memo(function MissionBriefing({
  briefing,
  loading,
  error,
  onRegenerate,
}: MissionBriefingProps) {
  if (loading) return <LoadingState />;
  if (error)   return <ErrorState message={error} onRetry={onRegenerate} />;
  if (!briefing) return null;

  return <BriefingPanel briefing={briefing} onRegenerate={onRegenerate} />;
});

export default MissionBriefing;

// ━━━ Loading State ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function LoadingState() {
  return (
    <div
      style={{
        background: 'rgba(10,22,40,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 0 0 1px #7c3aed',
        borderRadius: '16px',
        padding: '1.5rem',
        marginTop: '1.5rem',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '160px',
        // Dot-grid background
        backgroundImage: `
          radial-gradient(rgba(0,212,255,0.18) 1px, transparent 1px)
        `,
        backgroundSize: '24px 24px',
        backgroundBlendMode: 'overlay',
      }}
    >
      <style>{LOADING_CSS}</style>

      {/* Scanning line */}
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, rgba(0,212,255,0.9), transparent)',
          boxShadow: '0 0 12px rgba(0,212,255,0.6)',
          animation: 'mb-scan 2s ease-in-out infinite',
          animationFillMode: 'forwards',
        }}
      />

      {/* Label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          minHeight: '120px',
        }}
      >
        <span
          style={{
            fontFamily: 'monospace',
            fontSize: '0.78rem',
            color: 'var(--accent-blue)',
            letterSpacing: '0.14em',
            fontWeight: 600,
          }}
        >
          AI ANALYSIS IN PROGRESS...
        </span>
      </div>
    </div>
  );
}

// ━━━ Error State ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div
      style={{
        background: 'rgba(10,22,40,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 0 0 1px rgba(239,68,68,0.4)',
        borderRadius: '16px',
        padding: '1.5rem',
        marginTop: '1.5rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '0.875rem',
        textAlign: 'center',
      }}
    >
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '42ch' }}>
        {message}
      </p>
      <button
        onClick={onRetry}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.5rem 1.1rem',
          borderRadius: '8px',
          border: '1px solid rgba(124,58,237,0.5)',
          background: 'rgba(124,58,237,0.15)',
          color: '#c4b5fd',
          fontFamily: 'var(--font-body)',
          fontWeight: 600,
          fontSize: '0.85rem',
          cursor: 'pointer',
          transition: 'background 200ms ease',
        }}
      >
        <RefreshCw size={13} />
        Retry
      </button>
    </div>
  );
}

// ━━━ Briefing Panel ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface BriefingPanelProps {
  briefing: string;
  onRegenerate: () => void;
}

function BriefingPanel({ briefing, onRegenerate }: BriefingPanelProps) {
  const revealed = useTypewriter(briefing, 8);
  // Capture generation time once on mount
  const generatedAt = useRef(format(new Date(), 'HH:mm'));

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      style={{
        background: 'rgba(10,22,40,0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 0 0 1px #7c3aed',
        borderRadius: '16px',
        padding: '1.5rem',
        marginTop: '1.5rem',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          marginBottom: '1.25rem',
          flexWrap: 'wrap',
        }}
      >
        <Sparkles size={16} color="var(--accent-blue)" />

        <span
          style={{
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '1rem',
            color: '#fff',
          }}
        >
          AI Mission Briefing
        </span>

        {/* Llama 3 · Groq pill */}
        <span
          style={{
            background: '#7c3aed',
            color: '#fff',
            fontSize: '0.7rem',
            fontWeight: 600,
            padding: '2px 9px',
            borderRadius: '20px',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.02em',
            whiteSpace: 'nowrap',
          }}
        >
          Llama 3 · Groq
        </span>

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Regenerate */}
        <button
          onClick={onRegenerate}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.4rem 0.85rem',
            borderRadius: '8px',
            border: '1px solid rgba(124,58,237,0.4)',
            background: 'rgba(124,58,237,0.12)',
            color: '#c4b5fd',
            fontFamily: 'var(--font-body)',
            fontWeight: 600,
            fontSize: '0.8rem',
            cursor: 'pointer',
            transition: 'background 200ms ease',
            whiteSpace: 'nowrap',
          }}
        >
          <RefreshCw size={12} />
          Regenerate
        </button>
      </div>

      {/* ── Markdown content ── */}
      <div style={{ minHeight: '2rem' }}>
        {parseMarkdown(revealed)}
      </div>

      {/* ── Footer ── */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          marginTop: '1rem',
          paddingTop: '0.75rem',
          borderTop: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        <span
          style={{
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-body)',
          }}
        >
          Generated at {generatedAt.current}
        </span>
      </div>
    </motion.div>
  );
}
