import { useEffect, useState } from 'react';

export function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!isOffline) return null;

  return (
    <div
      role="status"
      aria-live="assertive"
      className="fluid-body fixed left-0 top-0 z-50 w-full animate-fade-in bg-warning px-4 py-2 text-center text-warning-foreground shadow-lg"
    >
      <span role="img" aria-label="Sem conexão" className="mr-2">
        📡
      </span>
      Você está offline. Algumas funcionalidades podem não funcionar.
    </div>
  );
}
