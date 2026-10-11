import SiteLayout from '@/components/SiteLayout';
import RequireAuth from '@/components/RequireAuth';
import { TOURIST_ROLES } from '@/constants/roles';
import ProfileForm from './ProfileForm';

export const metadata = { title: 'Profile — RAAAH' };

export default function ProfilePage() {
  return (
    <SiteLayout>
      <RequireAuth roles={TOURIST_ROLES}>
        <ProfileForm />
      </RequireAuth>
    </SiteLayout>
  );
}
