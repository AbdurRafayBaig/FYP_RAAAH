import SiteLayout from '@/components/SiteLayout';
import RequireAuth from '@/components/RequireAuth';
import DestinationDetail from './DestinationDetail';

export const metadata = { title: 'Destination — RAAAH' };

export default async function DestinationDetailPage({ params, searchParams }) {
  const { id } = await params;
  const { continue: continued } = await searchParams;
  return (
    <SiteLayout>
      <RequireAuth>
        <DestinationDetail id={id} continuedWithOriginal={continued === '1'} />
      </RequireAuth>
    </SiteLayout>
  );
}
