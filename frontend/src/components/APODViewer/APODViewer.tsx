import React, { useState, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import {
  AlertTriangle,
  CalendarDays,
  Sparkles,
  Loader2,
  ExternalLink,
  Clipboard,
  Check,
  ImageOff,
} from 'lucide-react';
import { APODResponse } from '../../types/apod';

// ── Shared glassmorphism style ────────────────────────────────────────────────
const GLASS: React.CSSProperties = {
  background: 'rgba(10,22,40,0.7)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  border: '1px solid rgba(0,212,255,0.15)',
  borderRadius: '16px',
  overflow: 'hidden',
};

// ── Props ─────────────────────────────────────────────────────────────────────
export interface APODViewerProps {
  apod: APODResponse | null;
  loading: boolean;
  error: string | null;
  onGenerateBriefing: () => void;
  briefingLoading: boolean;
}

// ━━━ APODViewer (memo-wrapped) ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const APODViewer = memo(function APODViewer({
  apod,
  loading,
  error,
  onGenerateBriefing,
  briefingLoading,
}: APODViewerProps) {
  if (loading) return <LoadingSkeleton />;
  if (error)   return <ErrorState message={error} />;
  if (!apod)   return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={apod.date}
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.32, ease: 'easeInOut' }}
      >
        <APODContent
          apod={apod}
          onGenerateBriefing={onGenerateBriefing}
          briefingLoading={briefingLoading}
        />
      </motion.div>
    </AnimatePresence>
  );
});

export default APODViewer;

// ━━━ Loading Skeleton ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

const SHIMMER_CSS = `
  @keyframes apod-shimmer {
    0%   { background-position: -900px 0; }
    100% { background-position:  900px 0; }
  }
  @keyframes apod-blink {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.2; }
  }
  .apod-shimmer {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.03) 25%,
      rgba(0,212,255,0.08)   50%,
      rgba(255,255,255,0.03) 75%
    );
    background-size: 900px 100%;
    animation: apod-shimmer 1.7s infinite linear;
    border-radius: 8px;
  }
`;

function LoadingSkeleton() {
  return (
    <div style={GLASS}>
      <style>{SHIMMER_CSS}</style>

      {/* Image skeleton */}
      <div
        className="apod-shimmer"
        style={{ width: '100%', aspectRatio: '16/9', borderRadius: '16px 16px 0 0' }}
      />

      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
        {/* Signal line */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#22c55e',
              flexShrink: 0,
              animation: 'apod-blink 1s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontFamily: 'monospace',
              fontSize: '0.72rem',
              color: '#22c55e',
              letterSpacing: '0.12em',
              fontWeight: 600,
            }}
          >
            ACQUIRING SIGNAL...
          </span>
        </div>

        {/* Title */}
        <div className="apod-shimmer" style={{ height: '2rem',    width: '65%' }} />
        {/* Date badge */}
        <div className="apod-shimmer" style={{ height: '1.5rem',  width: '28%', borderRadius: '20px' }} />
        {/* Explanation lines */}
        {[100, 96, 90, 94, 82, 68].map((w, i) => (
          <div key={i} className="apod-shimmer" style={{ height: '0.85rem', width: `${w}%` }} />
        ))}
        {/* Action bar */}
        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.4rem' }}>
          <div className="apod-shimmer" style={{ height: '2.6rem', flex: 2 }} />
          <div className="apod-shimmer" style={{ height: '2.6rem', flex: 1 }} />
          <div className="apod-shimmer" style={{ height: '2.6rem', width: '2.6rem', flexShrink: 0 }} />
        </div>
      </div>
    </div>
  );
}

// ━━━ Error State ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ErrorState({ message }: { message: string }) {
  return (
    <div
      style={{
        ...GLASS,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3.5rem 2rem',
        gap: '1rem',
        textAlign: 'center',
      }}
    >
      <AlertTriangle size={44} color="#f59e0b" strokeWidth={1.5} />
      <p
        style={{
          color: 'var(--text-primary)',
          fontSize: '1rem',
          fontWeight: 500,
          maxWidth: '38ch',
          lineHeight: 1.5,
        }}
      >
        {message}
      </p>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        Try a different date
      </p>
    </div>
  );
}

// ━━━ APOD Content ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

interface APODContentProps {
  apod: APODResponse;
  onGenerateBriefing: () => void;
  briefingLoading: boolean;
}

function APODContent({ apod, onGenerateBriefing, briefingLoading }: APODContentProps) {
  const [imgError, setImgError]   = useState(false);
  const [copied,   setCopied]     = useState(false);

  const formattedDate = (() => {
    try { return format(parseISO(apod.date), 'MMMM d, yyyy'); }
    catch { return apod.date; }
  })();

  function handleShare() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      window.dispatchEvent(
        new CustomEvent('show-toast', { detail: { msg: 'Copied!', type: 'success' } })
      );
    });
  }

  return (
    <div style={GLASS}>
      {/* ── Media ── */}
      {apod.media_type === 'image' ? (
        <div
          style={{
            position: 'relative',
            width: '100%',
            aspectRatio: '16/9',
            overflow: 'hidden',
            borderRadius: '16px 16px 0 0',
            background: 'rgba(5,10,20,0.8)',
          }}
        >
          {imgError ? (
            <ImageFallback />
          ) : (
            <motion.img
              src={apod.hdurl || apod.url}
              alt={apod.title}
              loading="lazy"
              decoding="async"
              onError={() => setImgError(true)}
              onClick={() => apod.hdurl && window.open(apod.hdurl, '_blank')}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                cursor: apod.hdurl ? 'pointer' : 'default',
              }}
            />
          )}

          {/* HD badge */}
          {apod.hdurl && !imgError && (
            <span
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                background: 'rgba(0,212,255,0.9)',
                color: '#050a14',
                fontSize: '0.62rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: '6px',
                letterSpacing: '0.08em',
                fontFamily: 'var(--font-body)',
                pointerEvents: 'none',
              }}
            >
              HD
            </span>
          )}

          {/* Bottom gradient fading into --bg-primary */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '55%',
              background: 'linear-gradient(to bottom, transparent 0%, var(--bg-primary) 100%)',
              pointerEvents: 'none',
            }}
          />
        </div>
      ) : (
        /* Video */
        <div
          style={{
            width: '100%',
            aspectRatio: '16/9',
            borderRadius: '16px 16px 0 0',
            overflow: 'hidden',
          }}
        >
          <iframe
            src={apod.url}
            title={apod.title}
            sandbox="allow-scripts allow-same-origin"
            allowFullScreen
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
            }}
          />
        </div>
      )}

      {/* ── Body ── */}
      <div
        style={{
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.9rem',
        }}
      >
        {/* Title */}
        <h2
          style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '2rem',
            fontWeight: 700,
            color: '#fff',
            lineHeight: 1.2,
            borderLeft: '4px solid var(--accent-blue)',
            paddingLeft: '0.75rem',
            margin: 0,
          }}
        >
          {apod.title}
        </h2>

        {/* Date badge + copyright */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.6rem' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              background: 'rgba(0,212,255,0.1)',
              border: '1px solid rgba(0,212,255,0.25)',
              borderRadius: '20px',
              padding: '4px 13px',
              fontSize: '0.8rem',
              color: 'var(--accent-blue)',
              fontWeight: 500,
              fontFamily: 'var(--font-body)',
            }}
          >
            <CalendarDays size={13} />
            {formattedDate}
          </span>

          {apod.copyright && (
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--text-muted)',
                fontFamily: 'var(--font-body)',
              }}
            >
              © {apod.copyright.trim()}
            </span>
          )}
        </div>

        {/* Explanation */}
        <p
          style={{
            color: 'var(--text-muted)',
            lineHeight: 1.8,
            maxWidth: '70ch',
            fontSize: '0.9375rem',
            margin: 0,
          }}
        >
          {apod.explanation}
        </p>

        {/* ── Action bar ── */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginTop: '0.25rem',
            alignItems: 'center',
          }}
        >
          {/* Generate Briefing */}
          <motion.button
            onClick={onGenerateBriefing}
            disabled={briefingLoading}
            whileHover={!briefingLoading ? { boxShadow: '0 0 24px rgba(0,212,255,0.45)' } : {}}
            whileTap={!briefingLoading ? { scale: 0.97 } : {}}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.65rem 1.3rem',
              borderRadius: '10px',
              border: 'none',
              background: briefingLoading
                ? 'rgba(124,58,237,0.35)'
                : 'linear-gradient(135deg, #00d4ff 0%, #7c3aed 100%)',
              color: '#fff',
              fontFamily: 'var(--font-body)',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: briefingLoading ? 'not-allowed' : 'pointer',
              boxShadow: briefingLoading ? 'none' : '0 0 16px rgba(124,58,237,0.3)',
              transition: 'background 200ms ease, box-shadow 200ms ease',
              flex: '1 1 auto',
              justifyContent: 'center',
              whiteSpace: 'nowrap',
              minWidth: 0,
            }}
          >
            {briefingLoading ? (
              <>
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.9, ease: 'linear' }}
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <Loader2 size={15} />
                </motion.span>
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Generate AI Mission Briefing
              </>
            )}
          </motion.button>

          {/* View Full Image — only for images */}
          {apod.media_type === 'image' && apod.hdurl && (
            <a
              href={apod.hdurl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                padding: '0.65rem 1rem',
                borderRadius: '10px',
                border: '1px solid rgba(0,212,255,0.3)',
                background: 'rgba(0,212,255,0.06)',
                color: 'var(--accent-blue)',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                fontSize: '0.875rem',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                transition: 'background 200ms ease',
              }}
            >
              <ExternalLink size={14} />
              View Full Image
            </a>
          )}

          {/* Share */}
          <motion.button
            onClick={handleShare}
            whileTap={{ scale: 0.88 }}
            title="Copy link"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.65rem 0.9rem',
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.04)',
              color: copied ? '#22c55e' : 'var(--text-muted)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.875rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'color 200ms ease, border-color 200ms ease',
              whiteSpace: 'nowrap',
              borderColor: copied ? 'rgba(34,197,94,0.35)' : 'rgba(255,255,255,0.1)',
            }}
          >
            {copied ? <Check size={14} /> : <Clipboard size={14} />}
            {copied ? 'Copied!' : 'Share'}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

// ━━━ Image Fallback ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

function ImageFallback() {
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '0.75rem',
        background: 'rgba(5,10,20,0.7)',
        color: 'var(--text-muted)',
      }}
    >
      <ImageOff size={44} strokeWidth={1.25} />
      <span style={{ fontSize: '0.875rem', fontFamily: 'var(--font-body)' }}>
        Image unavailable
      </span>
    </div>
  );
}
