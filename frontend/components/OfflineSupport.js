"use client";

import { useEffect, useSyncExternalStore } from 'react';
import { useT } from '@/context/LanguageContext';
import Icon from '@/components/ui/Icon';

const subscribe = (onChange) => {
  window.addEventListener('online', onChange);
  window.addEventListener('offline', onChange);
  return () => {
    window.removeEventListener('online', onChange);
    window.removeEventListener('offline', onChange);
  };
};

// Registers the service worker (public/sw.js) and says so when the device has no connection
export default function OfflineSupport() {
  const t = useT();
  const online = useSyncExternalStore(subscribe, () => navigator.onLine, () => true);

  useEffect(() => {
    if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {});
    }
  }, []);

  if (online) return null;
  return (
    <div role="status" className="fixed inset-x-0 bottom-0 z-50 flex items-center justify-center gap-2 bg-ink px-4 py-3 text-center text-[14px] text-paper">
      <Icon name="offline" size={16} />
      {t('You are offline. Pages you opened before are shown as they were then.')}
    </div>
  );
}
