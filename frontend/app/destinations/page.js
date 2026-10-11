import SiteLayout from '@/components/SiteLayout';
import RequireAuth from '@/components/RequireAuth';
import DestinationExplorer from './DestinationExplorer';

export const metadata = { title: 'Destinations — RAAAH' };

export default async function DestinationsPage({ searchParams }) {
  const { search } = await searchParams;
  return (
    <SiteLayout>
      <RequireAuth>
        <DestinationExplorer initialSearch={typeof search === 'string' ? search : ''} />
      </RequireAuth>
    </SiteLayout>
  );
}
