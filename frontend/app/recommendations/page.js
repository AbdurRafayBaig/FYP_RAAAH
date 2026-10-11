import SiteLayout from '@/components/SiteLayout';
import RequireAuth from '@/components/RequireAuth';
import { TOURIST_ROLES } from '@/constants/roles';
import RecommendationResults from './RecommendationResults';

export const metadata = { title: 'Alternatives — RAAAH' };

export default async function RecommendationsPage({ searchParams }) {
  const { from } = await searchParams;
  return (
    <SiteLayout>
      <RequireAuth roles={TOURIST_ROLES}>
        <RecommendationResults sourceId={typeof from === 'string' ? from : ''} />
      </RequireAuth>
    </SiteLayout>
  );
}
