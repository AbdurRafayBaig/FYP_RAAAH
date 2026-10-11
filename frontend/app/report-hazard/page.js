import SiteLayout from '@/components/SiteLayout';
import RequireAuth from '@/components/RequireAuth';
import { ROLES } from '@/constants/roles';
import HazardReportForm from './HazardReportForm';

export const metadata = { title: 'Report a hazard — RAAAH' };

// UC-10 actor: verified Community Safety Observer (FR-07.01)
export default function ReportHazardPage() {
  return (
    <SiteLayout>
      <RequireAuth roles={[ROLES.OBSERVER]}>
        <HazardReportForm />
      </RequireAuth>
    </SiteLayout>
  );
}
