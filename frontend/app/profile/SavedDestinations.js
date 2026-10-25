"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { useT } from '@/context/LanguageContext';
import { ROUTES } from '@/constants/routes';
import Notice from '@/components/ui/Notice';
import DestinationTile from '@/components/destinations/DestinationTile';

// UC-05 / FR-02.07 - destinations the tourist saved to plan a visit, with their current conditions
export default function SavedDestinations() {
  const t = useT();
  const [state, setState] = useState({ loading: true, destinations: [], error: '' });

  useEffect(() => {
    api.getSavedDestinations().then(
      ({ destinations }) => setState({ loading: false, destinations, error: '' }),
      (err) => setState({ loading: false, destinations: [], error: err.message }),
    );
  }, []);

  return (
    <section className="border-t border-rule py-10" aria-labelledby="saved-heading">
      <h2 id="saved-heading" className="text-[24px]">{t('Saved destinations')}</h2>
      <p className="meta mt-1">{t('Places you saved to plan a visit. Their conditions are shown as they are now.')}</p>
      {state.error && <Notice tone="error" className="mt-6">{state.error}</Notice>}
      {state.loading ? (
        <p className="meta mt-6">{t('Loading…')}</p>
      ) : state.destinations.length === 0 && !state.error ? (
        <p className="mt-6 text-[15px] text-ink-2">
          {t('Nothing saved yet.')} {t('Use Save on a')}{' '}
          <Link href={ROUTES.DESTINATIONS} className="link">{t('destination page')}</Link>.
        </p>
      ) : (
        <div className="mt-6 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {state.destinations.map((d) => <DestinationTile key={d.destinationId} destination={d} />)}
        </div>
      )}
    </section>
  );
}
