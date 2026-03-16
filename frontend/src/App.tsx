import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

import SpaceBackground from './components/SpaceBackground/SpaceBackground';
import Header from './components/Header';
import DateSelector from './components/DateSelector';
import APODViewer from './components/APODViewer';
import MissionBriefing from './components/MissionBriefing';
import Toast from './components/Toast';
import NeoWs from './components/NeoWs';

import { useAPOD } from './hooks/useAPOD';
import { useBriefing } from './hooks/useBriefing';
import { DateMode } from './types/apod';

// ── Hash-based routing helpers ────────────────────────────────────────────────
function getRouteFromHash(): string {
  const hash = window.location.hash;
  if (!hash || hash === '#' || hash === '#/') return '/';
  return hash.replace(/^#/, '') || '/';
}

// ── Toast state type ──────────────────────────────────────────────────────────
interface ToastState {
  message: string | null;
  type: 'success' | 'error';
}

// ━━━ App ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

export default function App() {
  const [selectedDate, setSelectedDate] = useState<string>(
    format(new Date(), 'yyyy-MM-dd')
  );
  const [dateMode, setDateMode] = useState<DateMode>('day');
  const [toast, setToast] = useState<ToastState>({ message: null, type: 'success' });
  const [offline, setOffline] = useState<boolean>(false);
  const [currentRoute, setCurrentRoute] = useState<string>(getRouteFromHash);

  // ── Hash routing: listen for back/forward navigation ──
  useEffect(() => {
    const onHashChange = () => setCurrentRoute(getRouteFromHash());
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  // ── Navigate without full reload ──
  const navigate = useCallback((route: string) => {
    const newHash = route === '/' ? '#/' : `#${route}`;
    window.location.hash = newHash;
    setCurrentRoute(route);
  }, []);

  // ── Data hooks ──
  const { data: apod, loading, error } = useAPOD(selectedDate);
  const {
    briefing,
    loading: briefingLoading,
    error: briefingError,
    generate,
  } = useBriefing(apod);

  // ── Toast helper ──
  function showToast(msg: string, type: 'success' | 'error') {
    setToast({ message: msg, type });
  }

  // ── Listen for show-toast CustomEvent (dispatched by APODViewer share btn) ──
  useEffect(() => {
    function handleToastEvent(e: Event) {
      const detail = (e as CustomEvent<{ msg: string; type: 'success' | 'error' }>).detail;
      showToast(detail.msg, detail.type);
    }
    window.addEventListener('show-toast', handleToastEvent);
    return () => window.removeEventListener('show-toast', handleToastEvent);
  }, []);

  // ── Offline detection ──
  useEffect(() => {
    setOffline(!navigator.onLine);
    const onOnline  = () => setOffline(false);
    const onOffline = () => setOffline(true);
    window.addEventListener('online',  onOnline);
    window.addEventListener('offline', onOffline);
    return () => {
      window.removeEventListener('online',  onOnline);
      window.removeEventListener('offline', onOffline);
    };
  }, []);

  // ── Surface briefing errors as toasts ──
  useEffect(() => {
    if (briefingError) {
      showToast(briefingError.message, 'error');
    }
  }, [briefingError]);

  // ── APOD fetch errors as toasts (non-null error change) ──
  useEffect(() => {
    if (error) {
      showToast(error.message, 'error');
    }
  }, [error]);

  return (
    <div className="app-root">
      <SpaceBackground />
      <Header currentRoute={currentRoute} onNavigate={navigate} />

      {offline && (
        <div className="offline-banner">
          No connection — cached data may be shown
        </div>
      )}

      <main className="main-layout">
        {currentRoute === '/neows' ? (
          <section className="content" style={{ width: '100%' }}>
            <NeoWs />
          </section>
        ) : (
          <>
            <aside className="sidebar">
              <DateSelector
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                dateMode={dateMode}
                onModeChange={setDateMode}
              />
            </aside>

            <section className="content">
              <APODViewer
                apod={apod}
                loading={loading}
                error={error?.message ?? null}
                onGenerateBriefing={generate}
                briefingLoading={briefingLoading}
              />

              {(briefing || briefingLoading || !!briefingError) && (
                <MissionBriefing
                  briefing={briefing}
                  loading={briefingLoading}
                  error={briefingError?.message ?? null}
                  onRegenerate={generate}
                />
              )}
            </section>
          </>
        )}
      </main>

      <AnimatePresence>
        {toast.message && (
          <Toast
            key={toast.message}
            message={toast.message}
            type={toast.type}
            onDismiss={() => setToast({ message: null, type: 'success' })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
