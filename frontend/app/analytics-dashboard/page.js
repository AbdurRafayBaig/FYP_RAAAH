import SiteLayout from '@/components/SiteLayout';
import RequireAuth from '@/components/RequireAuth';
import { DASHBOARD_ROLES } from '@/constants/roles';
import DashboardOverview from './DashboardOverview';

export const metadata = { title: 'Dashboard — RAAAH' };

// FR-10.01 - dashboard only for Administrator and Tourism Authority
export default function AnalyticsDashboardPage() {
  return (
    <SiteLayout>
      <RequireAuth roles={DASHBOARD_ROLES}>
        <DashboardOverview />
      </RequireAuth>
    </SiteLayout>
  );
}
