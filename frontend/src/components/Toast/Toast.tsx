import { useEffect } from 'react';
import { motion } from 'framer-motion';

// ── Props ─────────────────────────────────────────────────────────────────────
export interface ToastProps {
  message: string | null;
  type: 'success' | 'error';
  onDismiss: () => void;
}

// ━━━ Toast ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
// Wrap in <AnimatePresence> in parent so exit animation fires on unmount.

export default function Toast({ message, type, onDismiss }: ToastProps) {
  // Auto-dismiss after 3 s
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <motion.div
      key={message}
      initial={{ x: 120, opacity: 0 }}
      animate={{ x: 0,   opacity: 1 }}
      exit={{   x: 120, opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      onClick={onDismiss}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999,
        padding: '12px 20px',
        borderRadius: '10px',
        background: isSuccess ? '#14532d' : '#450a0a',
        border: `1px solid ${isSuccess ? '#22c55e' : '#ef4444'}`,
        color: isSuccess ? '#86efac' : '#fca5a5',
        fontFamily: 'var(--font-body)',
        fontSize: '0.875rem',
        fontWeight: 500,
        cursor: 'pointer',
        maxWidth: '320px',
        boxShadow: isSuccess
          ? '0 4px 20px rgba(34,197,94,0.2)'
          : '0 4px 20px rgba(239,68,68,0.2)',
        userSelect: 'none',
      }}
    >
      {message}
    </motion.div>
  );
}
