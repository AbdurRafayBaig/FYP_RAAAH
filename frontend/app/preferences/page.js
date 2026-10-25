import RequireAuth from '@/components/RequireAuth';
import { TOURIST_ROLES } from '@/constants/roles';
import PreferencesForm from './PreferencesForm';

export const metadata = { title: 'Travel Preferences — RAAAH' };

export default async function PreferencesPage({ searchParams }) {
  const { welcome, next } = await searchParams;
  return (
    <RequireAuth roles={TOURIST_ROLES}>
      <PreferencesForm welcome={welcome === '1'} next={next} />
    </RequireAuth>
  );
}
